import { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import {
  Scissors,
  Video,
  Volume2,
  VolumeX,
  Sparkles,
  Play,
  Pause,
  Download,
  RotateCcw,
  CheckCircle2,
  Clock,
  Layers,
  Sliders,
  FileText,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Upload,
  Sparkle,
  BookMarked,
  Zap,
  FileVideo,
  ShieldAlert,
  Flame,
  Split,
  Check,
  Copy,
} from 'lucide-react';
import {
  TakeItem,
  TakeGroup,
  DetectionResult,
  EditSettings,
  SampleClipMetadata,
} from '../../../shared/videoEditorTypes';
import { DEFAULT_EDIT_SETTINGS, formatSecondsToTimestamp } from '../../../server/lib/takeDetector';

const STORAGE_KEY = 'rx_last_take_video_editor_session_v1';

function loadStoredSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function VideoEditor() {
  // Data queries & mutations
  const sampleClipsQuery = trpc.videoEditor.getSampleClips.useQuery();
  const detectTakesMutation = trpc.videoEditor.detectTakes.useMutation();
  const renderVideoMutation = trpc.videoEditor.renderVideo.useMutation();
  const getUploadUrlMutation = trpc.videoEditor.getUploadUrl.useMutation();

  // Session persistence loader
  const storedSession = useMemo(() => loadStoredSession(), []);

  // State
  const [selectedClipId, setSelectedClipId] = useState<string>(
    storedSession?.selectedClipId || 'IMG_7546'
  );
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | undefined>(
    storedSession?.selectedVideoUrl || undefined
  );
  const [customTranscript, setCustomTranscript] = useState<string>(
    storedSession?.customTranscript || ''
  );
  const [inputMode, setInputMode] = useState<'sample' | 'custom' | 'upload'>(
    storedSession?.inputMode || (storedSession?.uploadedClips?.length > 0 ? 'upload' : 'sample')
  );
  const [settings, setSettings] = useState<EditSettings>(
    storedSession?.settings || DEFAULT_EDIT_SETTINGS
  );
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(
    storedSession?.detectionResult || null
  );
  const [selectedTakeMap, setSelectedTakeMap] = useState<Record<string, string>>(
    storedSession?.selectedTakeMap || {}
  );
  const [activePreviewTake, setActivePreviewTake] = useState<TakeItem | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [renderedOutput, setRenderedOutput] = useState<{
    outputUrl: string;
    outputFilename: string;
    durationSeconds: number;
    fileSizeBytes: number;
    takeCount: number;
    audioBleedApplied?: boolean;
    bleedDurationMs?: number;
    resolution?: string;
    fps?: number;
  } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Multi-clip upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedClips, setUploadedClips] = useState<Array<{
    id: string;
    originalName: string;
    savedFilename: string;
    savedPath: string;
    fileSizeBytes: number;
    mimeType: string;
    isTranscript: boolean;
    url?: string;
  }>>(storedSession?.uploadedClips || []);

  // Automatically persist session changes to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const payload = {
        selectedClipId,
        selectedVideoUrl,
        customTranscript,
        inputMode,
        settings,
        detectionResult,
        selectedTakeMap,
        uploadedClips,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to persist session to localStorage:', e);
    }
  }, [
    selectedClipId,
    selectedVideoUrl,
    customTranscript,
    inputMode,
    settings,
    detectionResult,
    selectedTakeMap,
    uploadedClips,
  ]);

  // Clear / Reset session handler
  const handleResetSession = () => {
    if (window.confirm('Clear all uploaded clips and detected takes to start a fresh project?')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      setUploadedClips([]);
      setSelectedClipId('IMG_7546');
      setSelectedVideoUrl(undefined);
      setDetectionResult(null);
      setSelectedTakeMap({});
      setCustomTranscript('');
      setInputMode('sample');
      setSettings(DEFAULT_EDIT_SETTINGS);
      setRenderedOutput(null);
      toast.success('Session cleared. Ready for fresh upload.');
    }
  };

  // Auto-analyze selected sample clip on initial load if available
  useEffect(() => {
    if (sampleClipsQuery.data && sampleClipsQuery.data.length > 0 && !detectionResult && !detectTakesMutation.isPending) {
      handleRunDetection('IMG_7546');
    }
  }, [sampleClipsQuery.data]);

  const handleRunDetection = async (clipId?: string, overrideTranscript?: string, videoUrl?: string) => {
    const targetClipId = clipId || selectedClipId;
    const matchingUploaded = uploadedClips.find(c => c.savedFilename === targetClipId || c.url === targetClipId || c.id === targetClipId);
    const targetVideoUrl = videoUrl || matchingUploaded?.url;

    try {
      const res = await detectTakesMutation.mutateAsync({
        clipId: targetClipId,
        videoUrl: targetVideoUrl,
        transcriptText: overrideTranscript || (inputMode === 'custom' ? customTranscript : undefined),
        leadInPaddingMs: settings.leadInPaddingMs,
        leadOutPaddingMs: settings.leadOutPaddingMs,
        audioBleedEnabled: settings.audioBleedEnabled,
        audioBleedDurationMs: settings.audioBleedDurationMs,
      });

      setDetectionResult(res);
      // Initialize selection map with default chosen takes
      const map: Record<string, string> = {};
      for (const group of res.takeGroups) {
        if (group.selectedTakeId) {
          map[group.id] = group.selectedTakeId;
        }
      }
      setSelectedTakeMap(map);
      setRenderedOutput(null);
      toast.success(`Detected ${res.takeGroups.length} take groups with ${res.savingsPercent}% dead air cut!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to detect takes');
    }
  };

  // Toggle take selection in a group
  const handleSelectTake = (groupId: string, takeId: string) => {
    setSelectedTakeMap(prev => ({
      ...prev,
      [groupId]: takeId,
    }));
  };

  // Upload directly to Forge S3 storage bypassing Cloud Run proxy payload and memory limits
  const uploadFileDirectToStorage = async (file: File) => {
    const creds = await getUploadUrlMutation.mutateAsync({
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
    });

    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', creds.uploadUrl);
      xhr.setRequestHeader('Authorization', `Bearer ${creds.authToken}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(pct);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            const isTranscript = ext === '.txt' || ext === '.srt' || ext === '.vtt';
            resolve({
              id: creds.fileId,
              originalName: file.name,
              savedFilename: creds.key,
              savedPath: data.url,
              fileSizeBytes: file.size,
              isTranscript,
              url: data.url,
            });
          } catch {
            reject(new Error('Failed to parse storage response'));
          }
        } else {
          reject(new Error(`Cloud storage upload failed (${xhr.status}): ${xhr.responseText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during cloud upload'));

      const formData = new FormData();
      formData.append('file', file, file.name);
      xhr.send(formData);
    });
  };

  // Multi-file selection and direct cloud storage upload handler
  const handleFileSelect = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    // Check for companion transcript files (.txt)
    let companionTranscript = '';
    const textFiles = files.filter(f => f.name.endsWith('.txt') || f.type.startsWith('text/'));
    if (textFiles.length > 0) {
      try {
        companionTranscript = await textFiles[0].text();
        setCustomTranscript(companionTranscript);
      } catch {}
    }

    const validFiles = files.filter(f => {
      const ext = f.name.toLowerCase();
      return (
        f.type.startsWith('video/') ||
        f.type.startsWith('text/') ||
        ext.endsWith('.mp4') ||
        ext.endsWith('.mov') ||
        ext.endsWith('.webm') ||
        ext.endsWith('.m4v') ||
        ext.endsWith('.txt') ||
        ext.endsWith('.srt') ||
        ext.endsWith('.vtt')
      );
    });

    if (validFiles.length === 0) {
      toast.error('Please upload valid video files (MP4, MOV, WebM, M4V) or transcripts (TXT)');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newFiles: any[] = [];
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        toast.info(`Uploading ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);
        const uploadedFile = await uploadFileDirectToStorage(file);
        if (uploadedFile) {
          newFiles.push(uploadedFile);
        }
      }

      setIsUploading(false);

      if (newFiles.length > 0) {
        setUploadedClips(prev => [...prev, ...newFiles]);
        const videoFile = newFiles.find(f => !f.isTranscript);
        if (videoFile) {
          setSelectedClipId(videoFile.savedFilename);
          setSelectedVideoUrl(videoFile.url);
          toast.success(`Uploaded ${newFiles.length} file(s) to cloud! Extracting speech & analyzing takes...`);
          handleRunDetection(videoFile.savedFilename, companionTranscript || undefined, videoFile.url);
        } else {
          toast.success(`Uploaded ${newFiles.length} file(s)`);
        }
      }
    } catch (err: any) {
      setIsUploading(false);
      console.error('Upload error:', err);
      toast.error(err.message || 'Error during file upload');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Compute currently selected takes across all groups
  const currentSelectedTakes: TakeItem[] = [];
  if (detectionResult) {
    for (const group of detectionResult.takeGroups) {
      const chosenTakeId = selectedTakeMap[group.id];
      const chosen = group.takes.find(t => t.id === chosenTakeId) || group.takes.find(t => t.isSelected);
      if (chosen) {
        currentSelectedTakes.push(chosen);
      }
    }
  }

  // Calculate real-time edited duration based on user overrides
  const currentEditedDuration = currentSelectedTakes.reduce((acc, t) => acc + t.duration, 0);
  const currentDeadAirCut = detectionResult
    ? Math.max(0, detectionResult.totalRawDuration - currentEditedDuration)
    : 0;
  const currentSavingsPercent = detectionResult && detectionResult.totalRawDuration > 0
    ? ((currentDeadAirCut / detectionResult.totalRawDuration) * 100).toFixed(1)
    : '0';

  // Trigger video render
  const handleRender = async () => {
    if (currentSelectedTakes.length === 0) {
      toast.error('Please select at least one take to export');
      return;
    }

    const matchingUploaded = uploadedClips.find(
      c => c.savedFilename === selectedClipId || c.url === selectedClipId || c.id === selectedClipId
    );
    const targetUrl = selectedVideoUrl || matchingUploaded?.url;

    setIsExportModalOpen(true);

    try {
      const result = await renderVideoMutation.mutateAsync({
        clipId: selectedClipId,
        videoUrl: targetUrl,
        selectedTakes: currentSelectedTakes.map(t => ({
          id: t.id,
          startTime: t.startTime,
          endTime: t.endTime,
          paddedStart: t.paddedStart,
          paddedEnd: t.paddedEnd,
          duration: t.duration,
          text: t.text,
        })),
        settings,
      });

      setRenderedOutput(result);
    } catch (err: any) {
      setIsExportModalOpen(false);
      toast.error(err.message || 'Failed to render video');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col font-sans">
      {/* ── Top Header Navigation ──────────────────────────────────────────── */}
      <header className="border-b border-white/10 bg-[#0d1424]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 sm:px-6 h-14">
          <div className="flex items-center gap-3">
            <Link href="/">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5 cursor-pointer">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block animate-pulse" />
                Rx<span className="text-teal-400">Content</span>
              </span>
            </Link>
            <span className="text-white/20">/</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white/90">Last-Take Video Editor</span>
              <Badge variant="outline" className="text-[10px] bg-teal-500/10 text-teal-300 border-teal-500/30 px-1.5 py-0">
                CutAI Style
              </Badge>
              <Badge variant="outline" className="text-[10px] bg-white/5 text-white/40 border-white/10 hidden sm:inline-flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-teal-400" />
                Auto-Saved
              </Badge>
            </div>
          </div>

          {/* Global navigation tabs */}
          <div className="flex items-center gap-1">
            <Link href="/">
              <button className="px-2.5 py-1 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
                Home
              </button>
            </Link>
            <Link href="/bof">
              <button className="px-2.5 py-1 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
                BOF
              </button>
            </Link>
            <Link href="/vet">
              <button className="px-2.5 py-1 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
                VetProduct
              </button>
            </Link>
            <Link href="/videolab">
              <button className="px-2.5 py-1 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
                VideoLab
              </button>
            </Link>
            <button className="px-2.5 py-1 rounded-md text-xs font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
              <Scissors className="w-3 h-3 text-teal-400" />
              Last-Take Editor
            </button>
            <Link href="/command">
              <button className="px-2.5 py-1 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
                CommandCenter
              </button>
            </Link>
            <Link href="/radar">
              <button className="px-2.5 py-1 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                Radar
              </button>
            </Link>
            <Link href="/saved">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white gap-1 text-xs h-7 px-2">
                <BookMarked className="w-3 h-3" />
                Saved
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Workspace ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
        {/* ── Left Sidebar: Inputs & Controls ─────────────────────────────── */}
        <div className="w-full xl:w-[380px] border-r border-white/10 bg-[#0a0f1d] flex flex-col overflow-y-auto">
          <div className="p-4 space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                  <Video className="w-4 h-4 text-teal-400" />
                  Source Footage
                </h2>
                {uploadedClips.length > 0 ? (
                  <button
                    onClick={handleResetSession}
                    className="text-[11px] text-white/40 hover:text-red-400 transition-colors flex items-center gap-1"
                    title="Clear saved session and upload a new video"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    New Video
                  </button>
                ) : (
                  <span className="text-[11px] text-white/40">No script upload required</span>
                )}
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Select creator raw recordings or paste transcripts. The AI identifies repeated attempts and selects the final clean take.
              </p>
            </div>

            {/* Mode selection tabs */}
            <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setInputMode('sample')}
                className={`text-xs py-1.5 px-2 rounded-md font-medium transition-all ${
                  inputMode === 'sample'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                Sample Clips (2)
              </button>
              <button
                onClick={() => setInputMode('upload')}
                className={`text-xs py-1.5 px-2 rounded-md font-medium transition-all ${
                  inputMode === 'upload'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                Multi-Clip Upload
              </button>
              <button
                onClick={() => setInputMode('custom')}
                className={`text-xs py-1.5 px-2 rounded-md font-medium transition-all ${
                  inputMode === 'custom'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                Custom Text
              </button>
            </div>

            {/* Sample Footage Cards */}
            {inputMode === 'sample' && (
              <div className="space-y-2.5">
                <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider block">
                  Creator Test Footage
                </label>
                {(sampleClipsQuery.data || []).map(clip => {
                  const isSelected = selectedClipId === clip.id;
                  return (
                    <div
                      key={clip.id}
                      onClick={() => {
                        setSelectedClipId(clip.id);
                        handleRunDetection(clip.id);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-teal-500/10 border-teal-500/40 shadow-sm shadow-teal-500/10'
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <FileVideo className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-teal-400' : 'text-white/40'}`} />
                            <h4 className="text-xs font-semibold text-white/90 truncate">{clip.name}</h4>
                          </div>
                          <p className="text-[11px] text-white/50 mt-1 line-clamp-2 leading-relaxed">
                            {clip.description}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-white/5 text-[10px] text-white/40">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-white/30" />
                          {formatSecondsToTimestamp(clip.durationSeconds)} raw
                        </span>
                        <span>·</span>
                        <span>{clip.width}x{clip.height} (9:16)</span>
                        <span>·</span>
                        <span>{(clip.sizeBytes / (1024 * 1024)).toFixed(0)} MB</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upload Zone */}
            {inputMode === 'upload' && (
              <div className="space-y-3">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="video/mp4,video/quicktime,video/webm,video/x-m4v,.mp4,.mov,.webm,.m4v,.txt,.srt"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files) handleFileSelect(e.target.files);
                    e.target.value = '';
                  }}
                />

                {/* Drag and Drop Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-teal-400 bg-teal-500/10 scale-[1.01]'
                      : 'border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
                  }`}
                >
                  <Upload className={`w-7 h-7 mx-auto mb-2 transition-colors ${isDragging ? 'text-teal-400 animate-bounce' : 'text-white/40'}`} />
                  <h4 className="text-xs font-semibold text-white/90">
                    {isDragging ? 'Drop video files here' : 'Drop Raw TikTok Clips Here'}
                  </h4>
                  <p className="text-[11px] text-white/40 mt-1">
                    Select multiple MOV, MP4, WebM clips or transcripts
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 text-xs border-teal-500/30 text-teal-300 hover:bg-teal-500/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Upload className="w-3 h-3 mr-1.5" />
                    Choose Files
                  </Button>
                </div>

                {/* Upload Progress Bar */}
                {isUploading && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70">Uploading footage...</span>
                      <span className="font-mono text-teal-400 font-semibold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${uploadProgress}%` }}
                        className="h-full bg-teal-400 transition-all duration-150"
                      />
                    </div>
                  </div>
                )}

                {/* Uploaded Clips List */}
                {uploadedClips.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider block">
                      Uploaded Footage ({uploadedClips.length})
                    </label>
                    {uploadedClips.map((clip) => {
                      const isSelected = selectedClipId === clip.savedFilename;
                      return (
                        <div
                          key={clip.id}
                          onClick={() => {
                            setSelectedClipId(clip.savedFilename);
                            setSelectedVideoUrl(clip.url);
                            handleRunDetection(clip.savedFilename, undefined, clip.url);
                          }}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-teal-500/10 border-teal-500/40 text-white'
                              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/[0.08]'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileVideo className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-teal-400' : 'text-white/40'}`} />
                            <div className="min-w-0">
                              <p className="font-medium truncate text-[11px] text-white/90">{clip.originalName}</p>
                              <p className="text-[10px] text-white/40 font-mono">
                                {(clip.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                              </p>
                            </div>
                          </div>
                          {isSelected ? (
                            <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 text-[9px]">
                              Active
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-[10px] text-white/50 hover:text-white"
                            >
                              Select
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Custom Transcript Input */}
            {inputMode === 'custom' && (
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider block">
                  Paste Timestamped or Plain Transcript
                </label>
                <textarea
                  value={customTranscript}
                  onChange={e => setCustomTranscript(e.target.value)}
                  placeholder="[00:00.0 - 00:04.0] Stop taking magnesium until you know this...&#10;[00:05.0 - 00:09.0] Stop taking magnesium until you check the form on the bottle..."
                  rows={8}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white/80 font-mono focus:outline-none focus:border-teal-500/50"
                />
                <Button
                  onClick={() => handleRunDetection()}
                  size="sm"
                  className="w-full text-xs bg-teal-500 hover:bg-teal-600 text-black font-semibold"
                >
                  Analyze & Detect Takes
                </Button>
              </div>
            )}

            {/* ── CutAI Audio Bleed & Tuning Controls ───────────────────────── */}
            <div className="border border-white/10 rounded-xl bg-white/[0.03] p-3.5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${settings.audioBleedEnabled ? 'bg-teal-500/20 text-teal-300' : 'bg-white/10 text-white/40'}`}>
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white/90">Overlap Audio (Audio Bleed)</h4>
                    <p className="text-[10px] text-white/50">Carries previous tail into new clip</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSettings(s => ({ ...s, audioBleedEnabled: !s.audioBleedEnabled }))}
                  className={`w-9 h-5 rounded-full transition-colors relative ${settings.audioBleedEnabled ? 'bg-teal-500' : 'bg-white/20'}`}
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.75 ${settings.audioBleedEnabled ? 'left-5' : 'left-1'}`}
                  />
                </button>
              </div>

              {settings.audioBleedEnabled && (
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60 text-[11px]">Bleed Duration:</span>
                    <span className="font-mono text-teal-300 text-xs font-semibold">{settings.audioBleedDurationMs} ms</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    step="25"
                    value={settings.audioBleedDurationMs}
                    onChange={e => setSettings(s => ({ ...s, audioBleedDurationMs: Number(e.target.value) }))}
                    className="w-full accent-teal-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] text-white/30 font-mono">
                    <span>50ms (Tight)</span>
                    <span>150ms (CutAI Default)</span>
                    <span>300ms (Smooth)</span>
                  </div>
                </div>
              )}

              {/* Advanced Padding Drawer Toggle */}
              <div className="pt-2 border-t border-white/5">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="w-full flex items-center justify-between text-[11px] text-white/50 hover:text-white/80"
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3 h-3" />
                    Fine Tuning & Output Settings
                  </span>
                  {isSettingsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>

                {isSettingsOpen && (
                  <div className="mt-2.5 space-y-2.5 pt-2 border-t border-white/5 text-[11px]">
                    <div>
                      <div className="flex justify-between text-white/60 mb-1">
                        <span>Lead-In Breath Padding:</span>
                        <span className="font-mono text-white/80">{settings.leadInPaddingMs}ms</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        step="20"
                        value={settings.leadInPaddingMs}
                        onChange={e => setSettings(s => ({ ...s, leadInPaddingMs: Number(e.target.value) }))}
                        className="w-full accent-teal-400 h-1 bg-white/10 rounded"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-white/60 mb-1">
                        <span>Lead-Out Tail Padding:</span>
                        <span className="font-mono text-white/80">{settings.leadOutPaddingMs}ms</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="250"
                        step="25"
                        value={settings.leadOutPaddingMs}
                        onChange={e => setSettings(s => ({ ...s, leadOutPaddingMs: Number(e.target.value) }))}
                        className="w-full accent-teal-400 h-1 bg-white/10 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-white/60">Target Ratio:</span>
                      <Badge variant="outline" className="text-[10px] border-teal-500/30 text-teal-300">
                        9:16 Vertical (TikTok)
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Re-analyze button */}
            <Button
              onClick={() => handleRunDetection()}
              disabled={detectTakesMutation.isPending}
              className="w-full bg-teal-500 hover:bg-teal-400 text-black font-semibold text-xs h-9 shadow-md shadow-teal-500/20"
            >
              {detectTakesMutation.isPending ? (
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  Detecting Retakes & Dead Air...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5" />
                  Re-Detect Takes
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* ── Right Area: Interactive Review & Cut Workspace ────────────────── */}
        <div className="flex-1 flex flex-col bg-[#070b14] overflow-y-auto">
          {/* ── Top Metrics Banner ─────────────────────────────────────────── */}
          {detectionResult && (
            <div className="border-b border-white/10 bg-[#0c1222] p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      CutAI Last-Take Assembly
                    </h3>
                    <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-[10px]">
                      {currentSavingsPercent}% Dead Air Cut
                    </Badge>
                  </div>
                  <p className="text-xs text-white/50 mt-1">
                    {detectionResult.takeGroups.length} semantic lines identified · Only the final clean take is kept by default.
                  </p>
                </div>

                {/* Metric stats */}
                <div className="flex items-center gap-3 text-center sm:text-right">
                  <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">Raw Length</div>
                    <div className="text-xs font-mono font-bold text-white/70">
                      {formatSecondsToTimestamp(detectionResult.totalRawDuration)}
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-white/30" />

                  <div className="bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/30">
                    <div className="text-[10px] text-teal-400 uppercase tracking-wider">Edited Length</div>
                    <div className="text-sm font-mono font-bold text-teal-300">
                      {formatSecondsToTimestamp(currentEditedDuration)}
                    </div>
                  </div>

                  <div className="bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20 hidden md:block">
                    <div className="text-[10px] text-orange-400 uppercase tracking-wider">Time Saved</div>
                    <div className="text-xs font-mono font-bold text-orange-300">
                      -{formatSecondsToTimestamp(currentDeadAirCut)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline visual representation */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px] text-white/40 mb-1 font-mono">
                  <span>0:00 (Start)</span>
                  <span className="text-teal-400 font-medium">Timeline of Selected Cuts</span>
                  <span>{formatSecondsToTimestamp(detectionResult.totalRawDuration)} (End)</span>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-md overflow-hidden flex relative border border-white/10">
                  {/* Dead air background */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03)_6px,transparent_6px,transparent_12px)] opacity-60" />
                  {/* Kept slices */}
                  {currentSelectedTakes.map(take => {
                    const leftPct = (take.startTime / detectionResult.totalRawDuration) * 100;
                    const widthPct = Math.max(1.5, (take.duration / detectionResult.totalRawDuration) * 100);
                    return (
                      <div
                        key={take.id}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                        className="absolute top-0 bottom-0 bg-teal-400 hover:bg-teal-300 transition-colors cursor-pointer rounded-sm shadow-sm"
                        title={`${take.text} (${formatSecondsToTimestamp(take.startTime)} - ${formatSecondsToTimestamp(take.endTime)})`}
                        onClick={() => setActivePreviewTake(take)}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-2 text-[10px] text-white/50">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-teal-400 inline-block" />
                    <span>Selected Last Takes ({currentSelectedTakes.length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-white/10 inline-block border border-white/20" />
                    <span>Removed Dead Air & Hesitations</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-teal-300 ml-auto font-mono text-[10px]">
                    <span>Audio Bleed: {settings.audioBleedEnabled ? `${settings.audioBleedDurationMs}ms overlap` : 'Off'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Render Output Modal / Hero Banner if ready ─────────────────── */}
          {renderedOutput && (
            <div className="m-4 p-4 rounded-xl border border-teal-500/40 bg-teal-500/10 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">TikTok 9:16 Video Ready!</h4>
                    <p className="text-xs text-white/60">
                      Duration: {renderedOutput.durationSeconds}s · Size: {(renderedOutput.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB · With 150ms Audio Bleed
                    </p>
                  </div>
                </div>
                <a
                  href={renderedOutput.outputUrl}
                  download={renderedOutput.outputFilename}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-black font-semibold rounded-lg text-xs transition-all shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download MP4
                </a>
              </div>

              {/* Embedded Video Player */}
              <div className="max-w-xs mx-auto rounded-lg overflow-hidden border border-white/20 bg-black aspect-[9/16] max-h-96">
                <video
                  src={renderedOutput.outputUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* ── Take Groups Review List ────────────────────────────────────── */}
          <div className="p-4 sm:p-6 space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-400" />
                  Review & Override Detected Takes
                </h3>
                <p className="text-xs text-white/40">
                  The editor has automatically picked the best final take for each line. Click any alternative take if you want to switch.
                </p>
              </div>

              {/* Render action button */}
              <Button
                onClick={handleRender}
                disabled={renderVideoMutation.isPending || currentSelectedTakes.length === 0}
                className="bg-teal-500 hover:bg-teal-400 text-black font-semibold text-xs h-9 px-4 shadow-lg shadow-teal-500/20"
              >
                {renderVideoMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    Rendering TikTok MP4...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Export TikTok 9:16 Video
                  </span>
                )}
              </Button>
            </div>

            {detectionResult?.takeGroups.map(group => {
              const chosenTakeId = selectedTakeMap[group.id];
              return (
                <div
                  key={group.id}
                  className="border border-white/10 rounded-xl bg-[#0c1222] p-4 transition-all hover:border-white/20 space-y-3"
                >
                  {/* Group header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge variant="outline" className="text-[10px] font-mono border-white/20 text-white/60">
                        Line {group.groupIndex}
                      </Badge>
                      <h4 className="text-xs font-semibold text-white/90 truncate">
                        {group.topic}
                      </h4>
                    </div>
                    {group.hasMultipleTakes ? (
                      <Badge className="bg-orange-500/10 text-orange-300 border-orange-500/20 text-[10px]">
                        {group.takes.length} Attempts
                      </Badge>
                    ) : (
                      <Badge className="bg-white/5 text-white/40 border-white/10 text-[10px]">
                        Single Take
                      </Badge>
                    )}
                  </div>

                  {/* Takes list */}
                  <div className="space-y-2">
                    {group.takes.map(take => {
                      const isChosen = take.id === chosenTakeId;
                      return (
                        <div
                          key={take.id}
                          onClick={() => handleSelectTake(group.id, take.id)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                            isChosen
                              ? 'bg-teal-500/10 border-teal-500/40 text-white shadow-sm'
                              : 'bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/5 hover:border-white/15'
                          }`}
                        >
                          {/* Radio / Selection Indicator */}
                          <div className="pt-0.5 flex-shrink-0">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                isChosen
                                  ? 'border-teal-400 bg-teal-400 text-black'
                                  : 'border-white/30 bg-transparent'
                              }`}
                            >
                              {isChosen && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>

                          {/* Take Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-[11px] text-white/90">
                                Take {take.takeNumber}
                              </span>
                              {take.isLastTake && (
                                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[9px] py-0 px-1.5 font-medium">
                                  Last Take
                                </Badge>
                              )}
                              <span className="font-mono text-[10px] text-white/40">
                                [{formatSecondsToTimestamp(take.startTime)} - {formatSecondsToTimestamp(take.endTime)}]
                              </span>
                              <span className="font-mono text-[10px] text-teal-400/80">
                                ({take.duration}s)
                              </span>
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed font-sans">
                              "{take.text}"
                            </p>
                            <p className="text-[10px] text-white/40 mt-1 italic">
                              {take.notes}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Export & Preview Modal ─────────────────────────────────────────── */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent className="bg-[#0c1222] border-white/10 text-white max-w-xl max-h-[90vh] overflow-y-auto">
          {renderVideoMutation.isPending ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-teal-500/20 border-t-teal-400 animate-spin" />
                <Sparkles className="w-6 h-6 text-teal-400 absolute inset-0 m-auto" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Assembling TikTok 9:16 Video
                </h3>
                <p className="text-xs text-white/50">
                  Single-pass FFmpeg trim & audio bleed in progress...
                </p>
              </div>

              <div className="w-full max-w-sm bg-white/5 rounded-lg p-3 text-left space-y-2 border border-white/5 text-xs text-white/70">
                <div className="flex items-center gap-2 text-teal-300">
                  <Check className="w-3.5 h-3.5" />
                  <span>{currentSelectedTakes.length} clean takes selected</span>
                </div>
                <div className="flex items-center gap-2 text-teal-300">
                  <Check className="w-3.5 h-3.5" />
                  <span>{currentSavingsPercent}% dead air and retakes cut</span>
                </div>
                <div className="flex items-center gap-2 text-teal-300">
                  <Check className="w-3.5 h-3.5" />
                  <span>{settings.audioBleedEnabled ? `${settings.audioBleedDurationMs}ms audio bleed enabled` : 'Zero-gap jump cuts'}</span>
                </div>
                <div className="flex items-center gap-2 text-teal-400 animate-pulse">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Encoding vertical 9:16 MP4 on cloud...</span>
                </div>
              </div>
            </div>
          ) : renderedOutput ? (
            <div className="space-y-4 py-2">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold text-white">
                      TikTok 9:16 Video Ready!
                    </DialogTitle>
                    <DialogDescription className="text-xs text-white/50">
                      Assembled {renderedOutput.takeCount} clean takes · {renderedOutput.audioBleedApplied ? `${renderedOutput.bleedDurationMs}ms Audio Bleed` : 'Jump Cuts'}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Video Player Preview */}
              <div className="relative aspect-[9/16] max-h-[380px] mx-auto bg-black rounded-xl overflow-hidden border border-white/20 shadow-2xl">
                <video
                  src={renderedOutput.outputUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                  <div className="text-[10px] text-white/40">Duration</div>
                  <div className="font-bold text-teal-300 font-mono">
                    {formatSecondsToTimestamp(renderedOutput.durationSeconds)}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                  <div className="text-[10px] text-white/40">Takes Kept</div>
                  <div className="font-bold text-white/90">
                    {renderedOutput.takeCount} / {detectionResult?.takeGroups.length || 0}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                  <div className="text-[10px] text-white/40">File Size</div>
                  <div className="font-bold text-white/90 font-mono">
                    {(renderedOutput.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                  </div>
                </div>
              </div>

              {/* Download & Copy Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href={renderedOutput.outputUrl}
                  download={renderedOutput.outputFilename}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs h-10 shadow-lg shadow-emerald-500/20">
                    <Download className="w-4 h-4 mr-1.5" />
                    Download 9:16 MP4
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(renderedOutput.outputUrl);
                    toast.success('Video link copied to clipboard!');
                  }}
                  className="border-white/10 text-white/70 hover:text-white text-xs h-10 px-3"
                >
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy Link
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
