import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = "/home/ubuntu/upload";
const CHUNK_DIR = "/tmp/video_chunks";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(CHUNK_DIR)) {
  fs.mkdirSync(CHUNK_DIR, { recursive: true });
}

// Stream directly to disk to handle large 4K iPhone video files (up to 2GB) without blowing server RAM
const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${timestamp}_${safeName}`);
  },
});

const uploadMiddleware = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit for raw 4K videos
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const validExts = [".mp4", ".mov", ".webm", ".m4v", ".txt", ".srt", ".vtt"];
    if (validExts.includes(ext) || file.mimetype.startsWith("video/") || file.mimetype.startsWith("text/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid format. Please upload video (MP4, MOV, WebM, M4V) or transcript (TXT) files."));
    }
  },
});

// Chunked upload middleware (individual chunks are 10MB, well below Cloud Run 32MB limit)
const chunkUpload = multer({
  dest: CHUNK_DIR,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max per chunk
});

export function registerVideoEditorUploadRoute(app: Router) {
  // Chunked upload endpoint to safely bypass edge proxy 32MB payload limit
  app.post(
    "/api/editor/upload-chunk",
    chunkUpload.single("chunk"),
    async (req, res) => {
      try {
        if (!req.file) {
          res.status(400).json({ error: "No chunk file provided" });
          return;
        }

        const { fileId, chunkIndex, totalChunks, filename, totalSize } = req.body;
        const cIndex = parseInt(chunkIndex, 10);
        const tChunks = parseInt(totalChunks, 10);

        if (!fileId || isNaN(cIndex) || isNaN(tChunks) || !filename) {
          try { fs.unlinkSync(req.file.path); } catch {}
          res.status(400).json({ error: "Missing required chunk metadata (fileId, chunkIndex, totalChunks, filename)" });
          return;
        }

        // Save this chunk part with predictable name
        const targetPartPath = path.join(CHUNK_DIR, `${fileId}_part_${cIndex}`);
        fs.renameSync(req.file.path, targetPartPath);

        // If this is the final chunk, assemble all parts
        if (cIndex === tChunks - 1) {
          const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
          const targetFilename = `${fileId}_${safeName}`;
          const targetPath = path.join(UPLOAD_DIR, targetFilename);

          const writeStream = fs.createWriteStream(targetPath);
          for (let i = 0; i < tChunks; i++) {
            const partPath = path.join(CHUNK_DIR, `${fileId}_part_${i}`);
            if (fs.existsSync(partPath)) {
              const partBuffer = fs.readFileSync(partPath);
              writeStream.write(partBuffer);
              try {
                fs.unlinkSync(partPath);
              } catch {
                // Ignore cleanup error
              }
            }
          }
          writeStream.end();

          // Wait for writeStream finish
          await new Promise<void>((resolve, reject) => {
            writeStream.on("finish", () => resolve());
            writeStream.on("error", err => reject(err));
          });

          const ext = path.extname(filename).toLowerCase();
          const isTranscript = ext === ".txt" || ext === ".srt" || ext === ".vtt";
          const stat = fs.statSync(targetPath);

          res.json({
            success: true,
            completed: true,
            file: {
              id: fileId,
              originalName: filename,
              savedFilename: targetFilename,
              savedPath: targetPath,
              fileSizeBytes: stat.size,
              isTranscript,
              url: `/api/editor/video/${encodeURIComponent(targetFilename)}`,
            },
          });
        } else {
          // Intermediate chunk received successfully
          res.json({
            success: true,
            completed: false,
            chunkIndex: cIndex,
            totalChunks: tChunks,
          });
        }
      } catch (err: unknown) {
        console.error("[Chunk Upload] Error:", err);
        const message = err instanceof Error ? err.message : "Chunk upload failed";
        res.status(500).json({ error: message });
      }
    }
  );

  app.post(
    "/api/editor/upload",
    uploadMiddleware.array("files", 10),
    async (req, res) => {
      try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
          res.status(400).json({ error: "No files uploaded" });
          return;
        }

        const uploadedItems = files.map((f, idx) => {
          const ext = path.extname(f.originalname).toLowerCase();
          const isTranscript = ext === ".txt" || ext === ".srt" || ext === ".vtt";
          return {
            id: `clip_${Date.now()}_${idx}`,
            originalName: f.originalname,
            savedFilename: f.filename,
            savedPath: f.path,
            fileSizeBytes: f.size,
            mimeType: f.mimetype,
            isTranscript,
            url: `/api/editor/video/${encodeURIComponent(f.filename)}`,
          };
        });

        res.json({
          success: true,
          files: uploadedItems,
        });
      } catch (err: unknown) {
        console.error("[VideoEditor Upload] Error:", err);
        const message = err instanceof Error ? err.message : "Upload failed";
        res.status(500).json({ error: message });
      }
    }
  );

  // Endpoint to serve uploaded video files for local browser preview
  app.get("/api/editor/video/:filename", (req, res) => {
    const safeFilename = path.basename(req.params.filename);
    const filePath = path.join(UPLOAD_DIR, safeFilename);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    res.sendFile(filePath);
  });
}
