import { TRPCError } from "@trpc/server";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { publicProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";
import { storagePut } from "../storage";
import { UPLOAD_DIR, EXPORT_DIR } from "../lib/editorPaths";
import {
  parseTranscriptText,
  detectTakesAndGroups,
  DEFAULT_EDIT_SETTINGS,
} from "../lib/takeDetector";
import {
  SampleClipMetadata,
  DetectionResult,
  EditSettings,
  TakeItem,
} from "../../shared/videoEditorTypes";

const execAsync = promisify(exec);

const SAMPLE_CLIPS: Record<string, SampleClipMetadata> = {
  IMG_7546: {
    id: "IMG_7546",
    name: "IMG_7546.MOV (Medicube Body Bumps Bundle)",
    path: path.join(UPLOAD_DIR, "IMG_7546.MOV"),
    transcriptPath: path.join(UPLOAD_DIR, "IMG_7546_converted_20260908_171807_transcription_20260908_171817.txt"),
    hasTranscript: true,
    durationSeconds: 360.25,
    width: 2160,
    height: 3840,
    aspectRatio: "9:16",
    fps: 30,
    sizeBytes: 1022943949,
    description: "Continuous raw filming with repeated lines for problem statement, bundle price, launch bonus, and CTA retakes.",
  },
  IMG_7502: {
    id: "IMG_7502",
    name: "IMG_7502.MOV (Medicube Routine & Sensitivity Warning)",
    path: path.join(UPLOAD_DIR, "IMG_7502.MOV"),
    transcriptPath: path.join(UPLOAD_DIR, "IMG_7502_converted_20260908_170157_transcription_20260908_170205.txt"),
    hasTranscript: true,
    durationSeconds: 210.45,
    width: 2160,
    height: 3840,
    aspectRatio: "9:16",
    fps: 30,
    sizeBytes: 598049885,
    description: "Continuous raw filming covering daily routine steps, skin-sensitivity warning retakes, and urgency CTA.",
  },
};

export const videoEditorRouter = router({
  /**
   * Get direct Forge S3 storage upload URL and credentials.
   * Allows the browser to upload large 4K video files directly to Cloud S3,
   * bypassing Cloud Run container memory and payload size limits.
   */
  getUploadUrl: publicProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const fileId = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const safeName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const key = `video-editor/${fileId}_${safeName}`;
      const baseUrl = ENV.forgeApiUrl.endsWith("/") ? ENV.forgeApiUrl : `${ENV.forgeApiUrl}/`;
      const uploadUrl = new URL("v1/storage/upload", baseUrl);
      uploadUrl.searchParams.set("path", key);
      return {
        uploadUrl: uploadUrl.toString(),
        key,
        fileId,
        authToken: ENV.forgeApiKey,
      };
    }),

  /**
   * List available sample raw footage clips
   */
  getSampleClips: publicProcedure.query(async () => {
    const clips: SampleClipMetadata[] = [];
    for (const key of Object.keys(SAMPLE_CLIPS)) {
      const item = SAMPLE_CLIPS[key];
      const fileExists = fs.existsSync(item.path);
      if (fileExists) {
        clips.push(item);
      }
    }
    return clips;
  }),

  /**
   * Detect takes and retake groups from a sample clip or uploaded transcript
   */
  detectTakes: publicProcedure
    .input(
      z.object({
        clipId: z.string().optional(),
        videoUrl: z.string().optional(),
        filePath: z.string().optional(),
        transcriptText: z.string().optional(),
        leadInPaddingMs: z.number().optional().default(80),
        leadOutPaddingMs: z.number().optional().default(120),
        audioBleedEnabled: z.boolean().optional().default(true),
        audioBleedDurationMs: z.number().optional().default(150),
      })
    )
    .mutation(async ({ input }): Promise<DetectionResult> => {
      let text = input.transcriptText || "";
      let totalDuration = 0;
      let clipName = "custom_clip";
      let resolvedPath = "";
      let extractionError = "";

      if (input.videoUrl) {
        resolvedPath = input.videoUrl;
        clipName = input.clipId || "cloud_video";
        try {
          const { stdout } = await execAsync(`ffprobe -v error -show_entries format=duration -of json "${input.videoUrl}"`);
          const probeData = JSON.parse(stdout);
          totalDuration = parseFloat(probeData.format?.duration || "0");
        } catch {
          // Ignore probe failure
        }
      } else if (input.clipId && SAMPLE_CLIPS[input.clipId]) {
        const clip = SAMPLE_CLIPS[input.clipId];
        clipName = clip.id;
        totalDuration = clip.durationSeconds;
        resolvedPath = clip.path;
        if (!text && clip.transcriptPath && fs.existsSync(clip.transcriptPath)) {
          text = fs.readFileSync(clip.transcriptPath, "utf-8");
        }
      } else if (input.filePath || input.clipId) {
        const candidate = input.filePath || input.clipId || "";
        const fullPath = path.isAbsolute(candidate) ? candidate : path.join(UPLOAD_DIR, path.basename(candidate));
        if (fs.existsSync(fullPath)) {
          resolvedPath = fullPath;
          clipName = path.basename(fullPath);
          // Probe duration
          try {
            const { stdout } = await execAsync(`ffprobe -v error -show_entries format=duration -of json "${fullPath}"`);
            const probeData = JSON.parse(stdout);
            totalDuration = parseFloat(probeData.format?.duration || "0");
          } catch {
            // Ignore probe failure
          }
        }
      }

      // If text is still empty, look for matching transcript file or run transcription
      if (!text.trim() && resolvedPath) {
        let isLocalTranscriptFound = false;
        const isRemoteUrl = resolvedPath.startsWith("http://") || resolvedPath.startsWith("https://");

        if (!isRemoteUrl) {
          try {
            const dir = path.dirname(resolvedPath);
            const base = path.basename(resolvedPath, path.extname(resolvedPath));
            if (fs.existsSync(dir)) {
              const files = fs.readdirSync(dir);
              const matchTxt = files.find(f => f.startsWith(base) && f.endsWith(".txt") && f.includes("transcription"));
              if (matchTxt) {
                text = fs.readFileSync(path.join(dir, matchTxt), "utf-8");
                isLocalTranscriptFound = true;
              }
            }
          } catch {
            // Ignore directory scan errors
          }
        }

        if (!isLocalTranscriptFound) {
          // Extract lightweight audio track and transcribe via Whisper API
          const tempAudio = `/tmp/extract_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.mp3`;
          try {
            console.log(`[DetectTakes] Extracting audio track with ffmpeg from: ${resolvedPath.slice(0, 100)}...`);
            await execAsync(`ffmpeg -y -i "${resolvedPath}" -vn -acodec libmp3lame -ac 1 -ar 16000 -q:a 4 "${tempAudio}"`);

            if (fs.existsSync(tempAudio) && ENV.forgeApiUrl && ENV.forgeApiKey) {
              console.log(`[DetectTakes] Audio extracted (${fs.statSync(tempAudio).size} bytes). Calling Whisper API...`);
              const audioBuffer = fs.readFileSync(tempAudio);
              const formData = new FormData();
              formData.append("file", new Blob([audioBuffer], { type: "audio/mpeg" }), "audio.mp3");
              formData.append("model", "whisper-1");
              formData.append("response_format", "verbose_json");

              const whisperUrl = `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/audio/transcriptions`;
              const whisperRes = await fetch(whisperUrl, {
                method: "POST",
                headers: { authorization: `Bearer ${ENV.forgeApiKey}` },
                body: formData,
              });

              if (whisperRes.ok) {
                const whisperData = (await whisperRes.json()) as any;
                if (whisperData.segments && whisperData.segments.length > 0) {
                  text = whisperData.segments
                    .map((s: any) => {
                      const startMin = Math.floor(s.start / 60);
                      const startSec = (s.start % 60).toFixed(1).padStart(4, "0");
                      const endMin = Math.floor(s.end / 60);
                      const endSec = (s.end % 60).toFixed(1).padStart(4, "0");
                      return `[${startMin.toString().padStart(2, "0")}:${startSec} - ${endMin.toString().padStart(2, "0")}:${endSec}] ${s.text.trim()}`;
                    })
                    .join("\n");

                  console.log(`[DetectTakes] Whisper returned ${whisperData.segments.length} segments.`);
                  // Cache the generated transcription locally if on a filesystem path
                  if (!isRemoteUrl) {
                    try {
                      const dir = path.dirname(resolvedPath);
                      const base = path.basename(resolvedPath, path.extname(resolvedPath));
                      const cachePath = path.join(dir, `${base}_transcription.txt`);
                      fs.writeFileSync(cachePath, text, "utf-8");
                    } catch {}
                  }
                }
              } else {
                const errText = await whisperRes.text().catch(() => "");
                extractionError = `Whisper API HTTP ${whisperRes.status}: ${errText.slice(0, 100)}`;
                console.error("[DetectTakes] Whisper error:", whisperRes.status, errText);
              }
            }
          } catch (audioErr: any) {
            extractionError = audioErr.message || String(audioErr);
            console.error("[DetectTakes] Audio extraction / Whisper failed:", audioErr);
          } finally {
            try {
              if (fs.existsSync(tempAudio)) fs.unlinkSync(tempAudio);
            } catch {}
          }

          // Fallback to manus-speech-to-text if still empty and tool is present on a local file
          if (!text.trim() && !isRemoteUrl) {
            try {
              const { stdout } = await execAsync(`manus-speech-to-text "${resolvedPath}"`);
              const txtMatch = stdout.match(/Plain text transcription saved to (.*\.txt)/);
              if (txtMatch && fs.existsSync(txtMatch[1])) {
                text = fs.readFileSync(txtMatch[1], "utf-8");
              }
            } catch {
              // Ignore fallback failure
            }
          }
        }
      }

      if (!text.trim()) {
        const detail = extractionError ? ` (${extractionError})` : "";
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `No speech or transcript detected for this clip${detail}. Please ensure the video has audible speech, or paste/upload a transcript.`,
        });
      }

      const segments = parseTranscriptText(text, clipName, 0);
      const result = detectTakesAndGroups(segments, {
        totalDuration: totalDuration || undefined,
        leadInPaddingMs: input.leadInPaddingMs,
        leadOutPaddingMs: input.leadOutPaddingMs,
      });

      return result;
    }),

  /**
   * Render edited video using FFmpeg with optional Audio Bleed and 9:16 export
   */
  renderVideo: publicProcedure
    .input(
      z.object({
        clipId: z.string(),
        videoUrl: z.string().optional(),
        selectedTakes: z.array(
          z.object({
            id: z.string(),
            startTime: z.number(),
            endTime: z.number(),
            paddedStart: z.number(),
            paddedEnd: z.number(),
            duration: z.number(),
            text: z.string(),
          })
        ),
        settings: z.object({
          audioBleedEnabled: z.boolean().default(true),
          audioBleedDurationMs: z.number().default(150),
          leadInPaddingMs: z.number().default(80),
          leadOutPaddingMs: z.number().default(120),
          aspectRatio: z.enum(["9:16", "source"]).default("9:16"),
          resolution: z.enum(["1080p", "720p"]).default("720p"),
          fps: z.number().default(30),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { clipId, selectedTakes, settings } = input;

      let sourcePath = "";
      if (input.videoUrl) {
        sourcePath = input.videoUrl;
      } else if (SAMPLE_CLIPS[clipId]) {
        sourcePath = SAMPLE_CLIPS[clipId].path;
      } else {
        const candidate = path.isAbsolute(clipId) ? clipId : path.join(UPLOAD_DIR, path.basename(clipId));
        if (fs.existsSync(candidate)) {
          sourcePath = candidate;
        }
      }

      if (!sourcePath || (!sourcePath.startsWith("http") && !fs.existsSync(sourcePath))) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Source video file ${clipId} not found.`,
        });
      }

      if (selectedTakes.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please select at least one take to export.",
        });
      }

      const timestamp = Date.now();
      const workDir = `/tmp/render_${clipId}_${timestamp}`;
      fs.mkdirSync(workDir, { recursive: true });

      const targetWidth = settings.resolution === "1080p" ? 1080 : 720;
      const targetHeight = settings.resolution === "1080p" ? 1920 : 1280;

      try {
        // Step 1: Extract and standardize each individual take
        const takeFiles: string[] = [];
        for (let i = 0; i < selectedTakes.length; i++) {
          const take = selectedTakes[i];
          const takeFile = path.join(workDir, `take_${i.toString().padStart(2, "0")}.mp4`);
          const startSec = Math.max(0, take.paddedStart || take.startTime);
          const durSec = Math.max(0.5, take.duration || (take.paddedEnd - take.paddedStart));

          const cutCmd = `ffmpeg -y -ss ${startSec.toFixed(3)} -t ${durSec.toFixed(3)} -i "${sourcePath}" -vf "scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2,fps=${settings.fps}" -c:v libx264 -preset veryfast -crf 22 -c:a aac -ar 48000 -ac 1 -b:a 128k "${takeFile}"`;
          await execAsync(cutCmd);
          takeFiles.push(takeFile);
        }

        // Step 2: Combine takes with optional Audio Bleed
        const outputFilename = `tiktok_cut_${clipId}_${timestamp}.mp4`;
        const outputPath = path.join(EXPORT_DIR, outputFilename);
        const publicUrl = `/api/exports/${outputFilename}`;

        if (takeFiles.length === 1) {
          // Only one take: copy directly
          fs.copyFileSync(takeFiles[0], outputPath);
        } else if (!settings.audioBleedEnabled || settings.audioBleedDurationMs <= 0) {
          // Simple clean jump cut concatenation without audio bleed
          const concatListFile = path.join(workDir, "concat_list.txt");
          const listContent = takeFiles.map(f => `file '${f}'`).join("\n");
          fs.writeFileSync(concatListFile, listContent);

          const concatCmd = `ffmpeg -y -f concat -safe 0 -i "${concatListFile}" -c copy "${outputPath}"`;
          await execAsync(concatCmd);
        } else {
          // Audio Bleed concatenation using acrossfade
          // For N files, we build an acrossfade filter chain
          const bleedSec = (settings.audioBleedDurationMs / 1000).toFixed(2);
          const inputArgs = takeFiles.map(f => `-i "${f}"`).join(" ");
          const n = takeFiles.length;

          // Video concat filter
          const vInputs = takeFiles.map((_, idx) => `[${idx}:v]`).join("");
          let filterComplex = `${vInputs}concat=n=${n}:v=1:a=0[outv]; `;

          // Audio acrossfade chain
          // e.g. [0:a][1:a]acrossfade=d=0.15:c1=tri:c2=tri[a1]; [a1][2:a]acrossfade=d=0.15:c1=tri:c2=tri[a2]...
          let lastAudioLabel = "[0:a]";
          for (let i = 1; i < n; i++) {
            const nextAudioLabel = i === n - 1 ? "[outa]" : `[a${i}]`;
            filterComplex += `${lastAudioLabel}[${i}:a]acrossfade=d=${bleedSec}:c1=tri:c2=tri${nextAudioLabel}`;
            if (i < n - 1) filterComplex += "; ";
            lastAudioLabel = nextAudioLabel;
          }

          const bleedCmd = `ffmpeg -y ${inputArgs} -filter_complex "${filterComplex}" -map "[outv]" -map "[outa]" -c:v libx264 -preset veryfast -crf 22 -c:a aac -b:a 128k -movflags +faststart "${outputPath}"`;
          await execAsync(bleedCmd);
        }

        const stat = fs.statSync(outputPath);
        const probeCmd = `ffprobe -v error -show_entries format=duration -of json "${outputPath}"`;
        const { stdout: probeStdout } = await execAsync(probeCmd);
        const probeJson = JSON.parse(probeStdout);
        const finalDuration = parseFloat(probeJson.format?.duration || "0");

        // Upload rendered MP4 to Forge Storage for reliable CloudFront streaming & download
        let finalVideoUrl = publicUrl;
        try {
          const mp4Buffer = fs.readFileSync(outputPath);
          const uploadRes = await storagePut(`video-editor/exports/${outputFilename}`, mp4Buffer, "video/mp4");
          finalVideoUrl = uploadRes.url;
        } catch (s3Err) {
          console.warn("Storage upload failed for export, falling back to local static URL:", s3Err);
        }

        return {
          success: true,
          outputUrl: finalVideoUrl,
          outputFilename,
          fileSizeBytes: stat.size,
          durationSeconds: Number(finalDuration.toFixed(2)),
          takeCount: selectedTakes.length,
          audioBleedApplied: settings.audioBleedEnabled,
          bleedDurationMs: settings.audioBleedDurationMs,
          resolution: `${targetWidth}x${targetHeight}`,
          fps: settings.fps,
        };
      } catch (error) {
        console.error("FFmpeg render error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to render video",
        });
      } finally {
        // Cleanup temporary workDir
        try {
          fs.rmSync(workDir, { recursive: true, force: true });
        } catch {
          // Ignore cleanup errors
        }
      }
    }),
});
