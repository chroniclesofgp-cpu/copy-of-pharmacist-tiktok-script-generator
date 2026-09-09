/**
 * VIDEO LAB
 * Design: Clinical Command Center (matches RxContent / BOF aesthetic)
 * Two sub-tabs: Content Analyzer | Metrics Analyzer
 *
 * Content Analyzer: Upload video → transcribe → compare against hook reference → 7-section delivery analysis
 * Metrics Analyzer: Paste TikTok metrics → interpret against framework rules → actionable recommendations
 */
import { useState, useCallback, useRef } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { HOOKS } from '@/lib/scriptData';
import {
  Video,
  Upload,
  BarChart2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Mic,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  FlaskConical,
  BookMarked,
} from 'lucide-react';
import type { VideoAnalysisOutput, VideoAnalysisSection, MetricsInterpretation } from '../../../server/routers/videolab';

// ─── Types ────────────────────────────────────────────────────────────────────
type LabTab = 'content' | 'metrics';

// ─── Score Badge ──────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: VideoAnalysisSection['score'] }) {
  const config = {
    strong: { label: 'Strong', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30', icon: CheckCircle2 },
    good: { label: 'Good', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: CheckCircle2 },
    'needs-work': { label: 'Needs Work', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: AlertTriangle },
    critical: { label: 'Critical', color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: AlertTriangle },
  };
  const c = config[score];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${c.color}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

// ─── Analysis Section Card ────────────────────────────────────────────────────
function AnalysisSectionCard({
  title,
  icon: Icon,
  section,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  section: VideoAnalysisSection;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/8 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-white/50" />
          <span className="text-sm font-medium text-white">{title}</span>
          <ScoreBadge score={section.score} />
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
      </button>
      {open && (
        <div className="px-4 py-3 space-y-3 bg-[#0d1117]">
          <p className="text-sm text-white/80 font-medium">{section.summary}</p>
          {section.details.length > 0 && (
            <ul className="space-y-1.5">
              {section.details.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          )}
          {section.timestamps && section.timestamps.length > 0 && (
            <div className="space-y-1 pt-1">
              {section.timestamps.map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/50 font-mono bg-white/5 rounded px-2 py-1">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Verdict Badge (for metrics) ─────────────────────────────────────────────
function VerdictBadge({ verdict }: { verdict: string }) {
  const config: Record<string, string> = {
    strong: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    good: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    average: 'bg-white/10 text-white/60 border-white/20',
    weak: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    failed: 'bg-red-500/20 text-red-300 border-red-500/30',
    limited: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  };
  const color = config[verdict] || config.average;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${color}`}>
      {verdict}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VideoLab() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<LabTab>('content');

  // ── Content Analyzer State ──────────────────────────────────────────────────
  const [selectedHookId, setSelectedHookId] = useState('after-1-month');
  const [productName, setProductName] = useState('');
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    hookId: string;
    hookName: string;
    productName?: string;
    transcription: string;
    analysis: VideoAnalysisOutput;
    referenceVideo: { url: string; creator: string; views: string; name: string } | null;
    createdAt: Date;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Metrics Analyzer State ──────────────────────────────────────────────────
  const [metricsHookId, setMetricsHookId] = useState('after-1-month');
  const [metricsProductName, setMetricsProductName] = useState('');
  const [metricsAdditionalContext, setMetricsAdditionalContext] = useState('');
  const [metricsResult, setMetricsResult] = useState<{
    hookId?: string;
    hookName?: string;
    productName?: string;
    metrics: Record<string, number | undefined>;
    rates: Record<string, string> | null;
    interpretation: MetricsInterpretation;
    createdAt: Date;
  } | null>(null);
  const [isAnalyzingMetrics, setIsAnalyzingMetrics] = useState(false);

  // Metric fields
  const [mViews, setMViews] = useState('');
  const [mWatchTimeSec, setMWatchTimeSec] = useState('');
  const [mWatchTimePct, setMWatchTimePct] = useState('');
  const [mLikes, setMLikes] = useState('');
  const [mComments, setMComments] = useState('');
  const [mShares, setMShares] = useState('');
  const [mSaves, setMSaves] = useState('');
  const [mFollows, setMFollows] = useState('');
  const [trackerVideoNumber, setTrackerVideoNumber] = useState('');
  const [trackerPostDate, setTrackerPostDate] = useState('');
  const [trackerTikTokUrl, setTrackerTikTokUrl] = useState('');
  const [trackerScriptFile, setTrackerScriptFile] = useState('');
  const [trackerCtaId, setTrackerCtaId] = useState('');
  const [trackerUrgencyTrigger, setTrackerUrgencyTrigger] = useState('');
  const [trackerFilmingDayCheck, setTrackerFilmingDayCheck] = useState('');

  // ── Screenshot upload state ─────────────────────────────────────────────────
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [isExtractingMetrics, setIsExtractingMetrics] = useState(false);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  // ── tRPC ────────────────────────────────────────────────────────────────────
  const analyzeVideoMutation = trpc.videolab.analyzeVideo.useMutation();
  const analyzeMetricsMutation = trpc.videolab.analyzeMetrics.useMutation();
  const extractMetricsMutation = trpc.videolab.extractMetricsFromScreenshot.useMutation();
  const syncReviewedMetricsMutation = trpc.commandCenter.syncReviewedMetrics.useMutation();
  const trpcUtils = trpc.useUtils();
  const { data: pastVideoAnalyses } = trpc.videolab.getVideoAnalyses.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: pastMetricsAnalyses } = trpc.videolab.getMetricsAnalyses.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // ── Hooks data ──────────────────────────────────────────────────────────────
  const allHooks = HOOKS;
  const selectedHook = allHooks.find(h => h.id === selectedHookId);
  const metricsHook = allHooks.find(h => h.id === metricsHookId);

  // ── Upload handler ──────────────────────────────────────────────────────────
  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/mov'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|m4v)$/i)) {
      toast.error('Please upload an MP4, WebM, or MOV video file');
      return;
    }

    // Validate size (16MB limit for transcription)
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > 16) {
      toast.error(`File is ${sizeMB.toFixed(1)}MB — maximum is 16MB. Try trimming the video first.`);
      return;
    }

    setIsUploading(true);
    setUploadedFileName(file.name);

    try {
      // Upload to S3 via the server upload endpoint
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', `video-lab/${Date.now()}-${file.name}`);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();
      setUploadedVideoUrl(url);
      toast.success('Video uploaded — ready to analyze');
    } catch {
      toast.error('Upload failed. Please try again.');
      setUploadedFileName('');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // ── Analyze video ───────────────────────────────────────────────────────────
  const handleAnalyze = useCallback(async () => {
    if (!uploadedVideoUrl) {
      toast.error('Please upload a video first');
      return;
    }
    if (!selectedHookId) {
      toast.error('Please select the hook type you used');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeVideoMutation.mutateAsync({
        videoUrl: uploadedVideoUrl,
        hookId: selectedHookId,
        hookName: selectedHook?.name,
        productName: productName || undefined,
      });
      setAnalysisResult(result as typeof analysisResult);
      toast.success('Analysis complete');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [uploadedVideoUrl, selectedHookId, selectedHook, productName, analyzeVideoMutation]);

  // ── Analyze metrics ─────────────────────────────────────────────────────────
  const handleAnalyzeMetrics = useCallback(async () => {
    const hasAnyMetric = mViews || mWatchTimeSec || mWatchTimePct || mLikes || mComments || mShares || mSaves || mFollows;
    if (!hasAnyMetric) {
      toast.error('Please enter at least one metric');
      return;
    }

    setIsAnalyzingMetrics(true);
    setMetricsResult(null);

    try {
      const result = await analyzeMetricsMutation.mutateAsync({
        hookId: metricsHookId || undefined,
        hookName: metricsHook?.name || undefined,
        productName: metricsProductName || undefined,
        additionalContext: metricsAdditionalContext || undefined,
        metrics: {
          views: mViews ? Number(mViews) : undefined,
          avgWatchTimeSeconds: mWatchTimeSec ? Number(mWatchTimeSec) : undefined,
          avgWatchTimePct: mWatchTimePct ? Number(mWatchTimePct) : undefined,
          likes: mLikes ? Number(mLikes) : undefined,
          comments: mComments ? Number(mComments) : undefined,
          shares: mShares ? Number(mShares) : undefined,
          saves: mSaves ? Number(mSaves) : undefined,
          follows: mFollows ? Number(mFollows) : undefined,
        },
      });
      setMetricsResult(result as typeof metricsResult);
      toast.success('Metrics analysis complete');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      toast.error(message);
    } finally {
      setIsAnalyzingMetrics(false);
    }
  }, [
    metricsHookId, metricsHook, metricsProductName, metricsAdditionalContext,
    mViews, mWatchTimeSec, mWatchTimePct, mLikes, mComments, mShares, mSaves, mFollows,
    analyzeMetricsMutation,
  ]);

  // ── Screenshot upload handler ─────────────────────────────────────────────────
  const handleScreenshotSelect = useCallback(async (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|heic|heif)$/i)) {
      toast.error('Please upload a JPG, PNG, or WebP image');
      return;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > 16) {
      toast.error(`File is ${sizeMB.toFixed(1)}MB — maximum is 16MB`);
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = e => setScreenshotPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setIsUploadingScreenshot(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData, credentials: 'include' });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed');
      setScreenshotUrl(data.url);
      toast.success('Screenshot uploaded — click "Extract Metrics" to auto-fill');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      toast.error(message);
      setScreenshotPreview(null);
    } finally {
      setIsUploadingScreenshot(false);
    }
  }, []);

  const handleExtractFromScreenshot = useCallback(async () => {
    if (!screenshotUrl) return;
    setIsExtractingMetrics(true);
    try {
      const result = await extractMetricsMutation.mutateAsync({ imageUrl: screenshotUrl });
      const m = result.metrics;
      // Auto-populate fields with extracted values
      if (m.views != null) setMViews(String(m.views));
      if (m.avgWatchTimeSec != null) setMWatchTimeSec(String(m.avgWatchTimeSec));
      if (m.retentionPct != null) setMWatchTimePct(String(m.retentionPct));
      if (m.likes != null) setMLikes(String(m.likes));
      if (m.comments != null) setMComments(String(m.comments));
      if (m.shares != null) setMShares(String(m.shares));
      if (m.saves != null) setMSaves(String(m.saves));
      if (m.follows != null || m.newFollowers != null) setMFollows(String(m.follows ?? m.newFollowers));
      toast.success('Metrics extracted — review the fields below and click Interpret Metrics');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Extraction failed';
      toast.error(message);
    } finally {
      setIsExtractingMetrics(false);
    }
  }, [screenshotUrl, extractMetricsMutation]);

  const handleSyncToPerformanceTracker = useCallback(async () => {
    if (!metricsResult) {
      toast.error('Interpret the metrics before saving them to the Performance Tracker');
      return;
    }
    if (!trackerVideoNumber || Number(trackerVideoNumber) <= 0) {
      toast.error('Enter the TikTok video number to update or create its performance record');
      return;
    }
    if (!metricsHook?.name || !metricsProductName.trim()) {
      toast.error('Select the hook type and enter the product or topic before saving');
      return;
    }

    try {
      const result = await syncReviewedMetricsMutation.mutateAsync({
        videoNumber: Number(trackerVideoNumber),
        postDate: trackerPostDate || undefined,
        tiktokUrl: trackerTikTokUrl || undefined,
        scriptFile: trackerScriptFile || undefined,
        hookType: metricsHook.name,
        product: metricsProductName.trim(),
        ctaId: trackerCtaId || undefined,
        urgencyTrigger: trackerUrgencyTrigger || undefined,
        filmingDayCheck: trackerFilmingDayCheck
          ? trackerFilmingDayCheck as "conditional_cart" | "live_sale_or_bundle" | "historical_sellout_or_restock" | "not_applicable"
          : undefined,
        screenshotUrl: screenshotUrl || undefined,
        metrics: {
          views: mViews ? Number(mViews) : undefined,
          avgWatchTimeSec: mWatchTimeSec ? Number(mWatchTimeSec) : undefined,
          avgWatchTimePct: mWatchTimePct ? Number(mWatchTimePct) : undefined,
          likes: mLikes ? Number(mLikes) : undefined,
          comments: mComments ? Number(mComments) : undefined,
          shares: mShares ? Number(mShares) : undefined,
          saves: mSaves ? Number(mSaves) : undefined,
          follows: mFollows ? Number(mFollows) : undefined,
        },
        diagnosis: metricsResult.interpretation.overallDiagnosis,
        action: metricsResult.interpretation.nextScriptRecommendation,
      });
      await Promise.all([
        trpcUtils.commandCenter.getVideos.invalidate(),
        trpcUtils.commandCenter.getVideoStats.invalidate(),
      ]);
      toast.success(result.mode === 'created' ? 'Performance record created and logged' : 'Performance record updated and logged');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not save the performance record';
      toast.error(message);
    }
  }, [metricsResult, trackerVideoNumber, metricsHook, metricsProductName, trackerPostDate, trackerTikTokUrl, trackerScriptFile, trackerCtaId, trackerUrgencyTrigger, trackerFilmingDayCheck, screenshotUrl, mViews, mWatchTimeSec, mWatchTimePct, mLikes, mComments, mShares, mSaves, mFollows, syncReviewedMetricsMutation, trpcUtils]);

  // ── Auth gate ────────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Video className="w-12 h-12 text-white/20 mx-auto" />
          <p className="text-white/60">Sign in to use Video Lab</p>
          <a href={getLoginUrl()}>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">Sign In</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#0a0f1a]/95 backdrop-blur border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white font-mono">VideoLab</h1>
            <p className="text-[10px] text-white/40 tracking-widest uppercase hidden sm:block">Delivery Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Tool switcher */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
            <Link href="/">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
                <span className="hidden sm:inline">Rx</span>Content
              </button>
            </Link>
            <Link href="/bof">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                <span className="hidden sm:inline">Shop</span>Script
              </button>
            </Link>
            <Link href="/vet">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
                <span className="hidden sm:inline">Vet</span>Product
              </button>
            </Link>
            <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              <span className="hidden sm:inline">Video</span>Lab
            </button>
            <Link href="/command">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-300 inline-block" />
                <span className="hidden sm:inline">Command</span>Center
              </button>
            </Link>
            <Link href="/autoreports">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
                <span className="hidden sm:inline">Auto</span>Reports
              </button>
            </Link>
            <Link href="/radar">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                <span className="hidden sm:inline">Product </span>Radar
              </button>
            </Link>
          </div>
          <Link href="/saved">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white gap-1.5 text-xs">
              <BookMarked className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saved Scripts</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* ── Sub-tab bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 px-4 pt-4 pb-0">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all border-b-2 ${
            activeTab === 'content'
              ? 'text-blue-300 border-blue-400 bg-blue-500/10'
              : 'text-white/40 border-transparent hover:text-white/60'
          }`}
        >
          <Video className="w-4 h-4" />
          Content Analyzer
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all border-b-2 ${
            activeTab === 'metrics'
              ? 'text-teal-300 border-teal-400 bg-teal-500/10'
              : 'text-white/40 border-transparent hover:text-white/60'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          Metrics Analyzer
        </button>
      </div>
      <div className="border-b border-white/10 mx-4" />

      {/* ── Content Analyzer Tab ────────────────────────────────────────────── */}
      {activeTab === 'content' && (
        <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
          {/* Left panel — inputs */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 border-r border-white/10 overflow-y-auto">
            <div className="p-4 space-y-5">
              <div>
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Upload Your Video</h2>
                {/* Drop zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    uploadedVideoUrl
                      ? 'border-teal-500/50 bg-teal-500/5'
                      : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/8'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                  {isUploading ? (
                    <div className="space-y-2">
                      <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                      <p className="text-sm text-white/60">Uploading...</p>
                    </div>
                  ) : uploadedVideoUrl ? (
                    <div className="space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
                      <p className="text-sm text-teal-300 font-medium">Video ready</p>
                      <p className="text-xs text-white/40 truncate">{uploadedFileName}</p>
                      <p className="text-xs text-white/30">Click to replace</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-white/30 mx-auto" />
                      <p className="text-sm text-white/60">Drop your video here</p>
                      <p className="text-xs text-white/30">MP4, WebM, MOV · max 16MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Hook selector */}
              <div>
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Hook Type Used</h2>
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {allHooks.filter(h => h.exampleVideo).map(hook => (
                    <button
                      key={hook.id}
                      onClick={() => setSelectedHookId(hook.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                        selectedHookId === hook.id
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{hook.name}</span>
                        {hook.exampleVideo && (
                          <span className="text-white/30 text-[10px]">{hook.exampleVideo.views}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product name */}
              <div>
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Product (optional)</h2>
                <Input
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="e.g. NeoCell Super Collagen"
                  className="bg-white/5 border-white/10 text-white text-sm placeholder:text-white/20"
                />
              </div>

              {/* Reference video info */}
              {selectedHook?.exampleVideo && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
                  <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Reference Video</p>
                  <p className="text-sm text-white/80 font-medium">{selectedHook.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50">{selectedHook.exampleVideo.creator}</span>
                    <span className="text-xs text-teal-400 font-semibold">{selectedHook.exampleVideo.views} views</span>
                  </div>
                  <a
                    href={selectedHook.exampleVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Watch reference video
                  </a>
                </div>
              )}

              {/* Analyze button */}
              <Button
                onClick={handleAnalyze}
                disabled={!uploadedVideoUrl || isAnalyzing}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:opacity-40"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing... (30-60s)
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Analyze Delivery
                  </>
                )}
              </Button>

              {/* Past analyses */}
              {pastVideoAnalyses && pastVideoAnalyses.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Past Analyses</h2>
                  <div className="space-y-1">
                    {pastVideoAnalyses.slice(0, 5).map(a => (
                      <button
                        key={a.id}
                        onClick={() => setAnalysisResult({
                          hookId: a.hookId,
                          hookName: a.hookName || a.hookId,
                          productName: a.productName || undefined,
                          transcription: a.transcription || '',
                          analysis: a.analysis,
                          referenceVideo: a.referenceVideoUrl ? {
                            url: a.referenceVideoUrl,
                            creator: a.referenceCreator || '',
                            views: a.referenceViews || '',
                            name: a.hookName || '',
                          } : null,
                          createdAt: new Date(a.createdAt),
                        })}
                        className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/8 transition-all border border-white/10"
                      >
                        <p className="text-xs text-white/70 font-medium truncate">{a.hookName || a.hookId}</p>
                        {a.productName && <p className="text-[10px] text-white/40 truncate">{a.productName}</p>}
                        <p className="text-[10px] text-white/30">{new Date(a.createdAt).toLocaleDateString()}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right panel — analysis output */}
          <div className="flex-1 overflow-y-auto p-4">
            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-blue-500/30 border-t-blue-400 animate-spin" />
                  <Mic className="w-6 h-6 text-blue-400 absolute inset-0 m-auto" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-white/80 font-medium">Transcribing and analyzing...</p>
                  <p className="text-white/40 text-sm">This takes 30–60 seconds</p>
                  <p className="text-white/30 text-xs">Comparing against {selectedHook?.exampleVideo?.views} reference video</p>
                </div>
              </div>
            )}

            {!isAnalyzing && !analysisResult && (
              <div className="flex flex-col items-center justify-center h-64 space-y-3 text-center">
                <Video className="w-12 h-12 text-white/10" />
                <p className="text-white/40 text-sm">Upload a video and click Analyze Delivery</p>
                <p className="text-white/25 text-xs max-w-sm">
                  The analyzer will transcribe your video, compare it against the reference video for your hook type,
                  and give you a 7-section delivery breakdown.
                </p>
              </div>
            )}

            {!isAnalyzing && analysisResult && (
              <div className="space-y-4 max-w-3xl">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">{analysisResult.hookName}</h2>
                    {analysisResult.productName && (
                      <p className="text-sm text-white/50">{analysisResult.productName}</p>
                    )}
                    <p className="text-xs text-white/30">{new Date(analysisResult.createdAt).toLocaleString()}</p>
                  </div>
                  <ScoreBadge score={analysisResult.analysis.overallScore} />
                </div>

                {/* Overall summary */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-white/80 leading-relaxed">{analysisResult.analysis.overallSummary}</p>
                </div>

                {/* Top 3 Iteration Notes */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-semibold text-blue-300">Top 3 Changes for Your Next Video</h3>
                  </div>
                  <ol className="space-y-2">
                    {analysisResult.analysis.top3IterationNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 text-xs font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        {note}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* 7 Analysis Sections */}
                <div className="space-y-2">
                  <AnalysisSectionCard
                    title="Hook Delivery"
                    icon={Zap}
                    section={analysisResult.analysis.hookDelivery}
                    defaultOpen={true}
                  />
                  <AnalysisSectionCard
                    title="Pacing"
                    icon={Clock}
                    section={analysisResult.analysis.pacing}
                  />
                  <AnalysisSectionCard
                    title="Tonality Shifts"
                    icon={TrendingUp}
                    section={analysisResult.analysis.tonalityShifts}
                  />
                  <AnalysisSectionCard
                    title="Mechanism Reveal"
                    icon={FlaskConical}
                    section={analysisResult.analysis.mechanismReveal}
                  />
                  <AnalysisSectionCard
                    title="CTA Delivery"
                    icon={TrendingUp}
                    section={analysisResult.analysis.ctaDelivery}
                  />
                  <AnalysisSectionCard
                    title="Reference Comparison"
                    icon={Video}
                    section={analysisResult.analysis.referenceComparison}
                  />
                </div>

                {/* Reference video link */}
                {analysisResult.referenceVideo && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest">Reference Video</p>
                      <p className="text-sm text-white/70">{analysisResult.referenceVideo.creator} · {analysisResult.referenceVideo.views} views</p>
                    </div>
                    <a
                      href={analysisResult.referenceVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Watch
                    </a>
                  </div>
                )}

                {/* Transcription (collapsible) */}
                {analysisResult.transcription && analysisResult.transcription !== '[Transcription unavailable]' && (
                  <details className="border border-white/10 rounded-xl overflow-hidden">
                    <summary className="px-4 py-3 bg-white/5 cursor-pointer text-sm text-white/50 hover:text-white/70 transition-colors">
                      View Transcription
                    </summary>
                    <div className="px-4 py-3 bg-[#0d1117]">
                      <p className="text-xs text-white/50 font-mono leading-relaxed whitespace-pre-wrap">
                        {analysisResult.transcription}
                      </p>
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Metrics Analyzer Tab ────────────────────────────────────────────── */}
      {activeTab === 'metrics' && (
        <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
          {/* Left panel — metric inputs */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 border-r border-white/10 overflow-y-auto">
            <div className="p-4 space-y-5">
              <div>
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">TikTok Analytics</h2>
                <p className="text-xs text-white/30 mb-3">Upload a screenshot from TikTok Studio to auto-fill, or enter metrics manually below.</p>
              </div>

              {/* Screenshot upload zone */}
              <div>
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Upload Screenshot (optional)</h2>
                <input
                  ref={screenshotInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp,.heic,.heif"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleScreenshotSelect(f); e.target.value = ''; }}
                />
                {!screenshotPreview ? (
                  <button
                    onClick={() => screenshotInputRef.current?.click()}
                    disabled={isUploadingScreenshot}
                    className="w-full border-2 border-dashed border-white/15 hover:border-teal-500/40 rounded-xl p-4 text-center transition-colors group disabled:opacity-40"
                  >
                    {isUploadingScreenshot ? (
                      <div className="flex items-center justify-center gap-2 text-white/40">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-xs">Uploading...</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-5 h-5 text-white/20 group-hover:text-teal-400 mx-auto transition-colors" />
                        <p className="text-xs text-white/30 group-hover:text-white/50">Click to upload analytics screenshot</p>
                        <p className="text-[10px] text-white/20">JPG, PNG, WebP — TikTok Studio or Creator Center</p>
                      </div>
                    )}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden border border-white/10">
                      <img src={screenshotPreview} alt="Analytics screenshot" className="w-full max-h-48 object-contain bg-black/40" />
                      <button
                        onClick={() => { setScreenshotPreview(null); setScreenshotUrl(null); }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white/60 hover:text-white flex items-center justify-center text-xs"
                      >×</button>
                    </div>
                    <Button
                      onClick={handleExtractFromScreenshot}
                      disabled={!screenshotUrl || isExtractingMetrics}
                      className="w-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-semibold disabled:opacity-40"
                    >
                      {isExtractingMetrics ? (
                        <><RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />Extracting metrics...</>
                      ) : (
                        <><Zap className="w-3 h-3 mr-1.5" />Extract Metrics from Screenshot</>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4">
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Manual Input</h2>
                <p className="text-xs text-white/20 mb-3">Review extracted values or enter manually. Leave blank fields empty.</p>
              </div>

              {/* Metric fields */}
              <div className="space-y-3">
                {[
                  { label: 'Views', value: mViews, setter: setMViews, placeholder: 'e.g. 12400' },
                  { label: 'Avg Watch Time (seconds)', value: mWatchTimeSec, setter: setMWatchTimeSec, placeholder: 'e.g. 8.3' },
                  { label: 'Avg Watch Time (%)', value: mWatchTimePct, setter: setMWatchTimePct, placeholder: 'e.g. 42' },
                  { label: 'Likes', value: mLikes, setter: setMLikes, placeholder: 'e.g. 340' },
                  { label: 'Comments', value: mComments, setter: setMComments, placeholder: 'e.g. 28' },
                  { label: 'Shares', value: mShares, setter: setMShares, placeholder: 'e.g. 15' },
                  { label: 'Saves', value: mSaves, setter: setMSaves, placeholder: 'e.g. 89' },
                  { label: 'New Follows', value: mFollows, setter: setMFollows, placeholder: 'e.g. 12' },
                ].map(({ label, value, setter, placeholder }) => (
                  <div key={label}>
                    <label className="text-xs text-white/50 mb-1 block">{label}</label>
                    <Input
                      type="number"
                      value={value}
                      onChange={e => setter(e.target.value)}
                      placeholder={placeholder}
                      className="bg-white/5 border-white/10 text-white text-sm placeholder:text-white/20"
                    />
                  </div>
                ))}
              </div>

              {/* Hook selector */}
              <div>
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Hook Type (optional)</h2>
                <select
                  value={metricsHookId}
                  onChange={e => setMetricsHookId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500/50"
                >
                  <option value="">Not specified</option>
                  {allHooks.map(h => (
                    <option key={h.id} value={h.id} className="bg-[#0a0f1a]">{h.name}</option>
                  ))}
                </select>
              </div>

              {/* Product name */}
              <div>
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Product (optional)</h2>
                <Input
                  value={metricsProductName}
                  onChange={e => setMetricsProductName(e.target.value)}
                  placeholder="e.g. NeoCell Super Collagen"
                  className="bg-white/5 border-white/10 text-white text-sm placeholder:text-white/20"
                />
              </div>

              {/* Additional context */}
              <div>
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Additional Context (optional)</h2>
                <Textarea
                  value={metricsAdditionalContext}
                  onChange={e => setMetricsAdditionalContext(e.target.value)}
                  placeholder="e.g. Posted at 7pm, used ring light, first video on this product"
                  className="bg-white/5 border-white/10 text-white text-sm placeholder:text-white/20 resize-none"
                  rows={3}
                />
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div>
                  <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Performance Tracker Sync</h2>
                  <p className="text-xs text-white/25">After review, this updates Command Center and the canonical performance log.</p>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">TikTok Video #</label>
                  <Input type="number" min="1" value={trackerVideoNumber} onChange={e => setTrackerVideoNumber(e.target.value)} placeholder="e.g. 23" className="bg-white/5 border-white/10 text-white text-sm placeholder:text-white/20" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Post Date (optional)</label>
                  <Input type="date" value={trackerPostDate} onChange={e => setTrackerPostDate(e.target.value)} className="bg-white/5 border-white/10 text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">TikTok URL (optional)</label>
                  <Input value={trackerTikTokUrl} onChange={e => setTrackerTikTokUrl(e.target.value)} placeholder="https://www.tiktok.com/..." className="bg-white/5 border-white/10 text-white text-sm placeholder:text-white/20" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Script File (optional)</label>
                  <Input value={trackerScriptFile} onChange={e => setTrackerScriptFile(e.target.value)} placeholder="e.g. BACKUP_LAUNCH_01" className="bg-white/5 border-white/10 text-white text-sm placeholder:text-white/20" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">CTA ID (optional)</label>
                  <Input value={trackerCtaId} onChange={e => setTrackerCtaId(e.target.value)} placeholder="e.g. U-02, P-01, S-02, C-01" className="bg-white/5 border-white/10 text-white text-sm placeholder:text-white/20" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Urgency Trigger (optional)</label>
                  <Input value={trackerUrgencyTrigger} onChange={e => setTrackerUrgencyTrigger(e.target.value)} placeholder="e.g. conditional cart, live sale" className="bg-white/5 border-white/10 text-white text-sm placeholder:text-white/20" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Filming-Day Check (optional)</label>
                  <select value={trackerFilmingDayCheck} onChange={e => setTrackerFilmingDayCheck(e.target.value)} className="w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white">
                    <option value="" className="bg-slate-900">Select verification</option>
                    <option value="conditional_cart" className="bg-slate-900">Conditional cart visible</option>
                    <option value="live_sale_or_bundle" className="bg-slate-900">Live sale or bundle confirmed</option>
                    <option value="historical_sellout_or_restock" className="bg-slate-900">Historical sellout/restock documented</option>
                    <option value="not_applicable" className="bg-slate-900">Not applicable</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={handleAnalyzeMetrics}
                disabled={isAnalyzingMetrics}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold disabled:opacity-40"
              >
                {isAnalyzingMetrics ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Interpret Metrics
                  </>
                )}
              </Button>

              <Button
                onClick={handleSyncToPerformanceTracker}
                disabled={!metricsResult || syncReviewedMetricsMutation.isPending}
                variant="outline"
                className="w-full border-blue-500/30 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20 hover:text-blue-100 disabled:opacity-40"
              >
                {syncReviewedMetricsMutation.isPending ? (
                  <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Saving to Tracker...</>
                ) : (
                  <><BookMarked className="w-4 h-4 mr-2" />Save Reviewed Metrics to Tracker</>
                )}
              </Button>

              {/* Past metrics analyses */}
              {pastMetricsAnalyses && pastMetricsAnalyses.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Past Analyses</h2>
                  <div className="space-y-1">
                    {pastMetricsAnalyses.slice(0, 5).map(a => (
                      <button
                        key={a.id}
                        onClick={() => setMetricsResult({
                          hookId: a.hookId || undefined,
                          hookName: a.hookName || undefined,
                          productName: undefined,
                          metrics: a.metrics,
                          rates: null,
                          interpretation: a.interpretation,
                          createdAt: new Date(a.createdAt),
                        })}
                        className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/8 transition-all border border-white/10"
                      >
                        <p className="text-xs text-white/70 font-medium truncate">{a.hookName || 'Metrics Analysis'}</p>
                        <p className="text-[10px] text-white/30">{new Date(a.createdAt).toLocaleDateString()}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right panel — metrics output */}
          <div className="flex-1 overflow-y-auto p-4">
            {isAnalyzingMetrics && (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-teal-500/30 border-t-teal-400 animate-spin" />
                  <BarChart2 className="w-6 h-6 text-teal-400 absolute inset-0 m-auto" />
                </div>
                <p className="text-white/60">Interpreting your metrics...</p>
              </div>
            )}

            {!isAnalyzingMetrics && !metricsResult && (
              <div className="flex flex-col items-center justify-center h-64 space-y-3 text-center">
                <BarChart2 className="w-12 h-12 text-white/10" />
                <p className="text-white/40 text-sm">Enter your TikTok metrics and click Interpret</p>
                <p className="text-white/25 text-xs max-w-sm">
                  The analyzer will tell you exactly what your numbers mean — what failed, why, and what to change in your next script.
                </p>
              </div>
            )}

            {!isAnalyzingMetrics && metricsResult && (
              <div className="space-y-4 max-w-3xl">
                {/* Header */}
                <div>
                  <h2 className="text-lg font-bold text-white">{metricsResult.hookName || 'Metrics Analysis'}</h2>
                  {metricsResult.productName && <p className="text-sm text-white/50">{metricsResult.productName}</p>}
                  <p className="text-xs text-white/30">{new Date(metricsResult.createdAt).toLocaleString()}</p>
                </div>

                {/* Overall diagnosis */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-white/80 leading-relaxed">{metricsResult.interpretation.overallDiagnosis}</p>
                </div>

                {/* Top 3 Changes */}
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-teal-400" />
                    <h3 className="text-sm font-semibold text-teal-300">Top 3 Changes for Your Next Video</h3>
                  </div>
                  <ol className="space-y-2">
                    {metricsResult.interpretation.top3Changes.map((change, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500/30 text-teal-300 text-xs font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        {change}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* 4 Assessment Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Hook', data: metricsResult.interpretation.hookAssessment, icon: Zap },
                    { label: 'Content', data: metricsResult.interpretation.contentAssessment, icon: Video },
                    { label: 'CTA', data: metricsResult.interpretation.ctaAssessment, icon: TrendingUp },
                    { label: 'Distribution', data: metricsResult.interpretation.distributionAssessment, icon: BarChart2 },
                  ].map(({ label, data, icon: Icon }) => (
                    <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-white/40" />
                          <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">{label}</span>
                        </div>
                        <VerdictBadge verdict={data.verdict} />
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">{data.explanation}</p>
                    </div>
                  ))}
                </div>

                {/* Next script recommendation */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-amber-300">Next Script Recommendation</h3>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">{metricsResult.interpretation.nextScriptRecommendation}</p>
                </div>

                {/* Raw metrics summary */}
                {metricsResult.rates && (
                  <details className="border border-white/10 rounded-xl overflow-hidden">
                    <summary className="px-4 py-3 bg-white/5 cursor-pointer text-sm text-white/50 hover:text-white/70 transition-colors">
                      View Calculated Rates
                    </summary>
                    <div className="px-4 py-3 bg-[#0d1117] grid grid-cols-2 gap-2">
                      {Object.entries(metricsResult.rates).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between text-xs">
                          <span className="text-white/40 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-white/70 font-mono">{val}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
