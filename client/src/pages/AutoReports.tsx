/**
 * AUTO REPORTS — Video Lab Automated Analysis
 * Design: Clinical Command Center (matches VideoLab aesthetic)
 * 
 * Shows scheduled TikTok video analysis reports from the agent cron.
 * Users can add metrics per video and trigger AI diagnosis.
 */
import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import {
  Video,
  BarChart2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  FlaskConical,
  BookMarked,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  Bot,
  Eye,
  Target,
  Wrench,
  XCircle,
  Sparkles,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type VerdictType = 'BREAKOUT' | 'HIDDEN GEM' | 'Iterate' | 'Remake' | 'Retire' | null;

interface VideoEntry {
  videoUrl: string;
  postDate: string;
  hookType: string;
  hookFramework: string;
  sectionSequence: string[];
  spokenHook: string;
  textOverlayHook: string | null;
  overlayStrategy: string;
  productRevealed: string | null;
  productRevealTiming: string;
  ctaDelivery: string;
  credentialPlacement: string;
  estimatedRuntime: string;
  qualityFlags: string[];
  iterationNotes: string;
  views?: number;
  watchTimePct?: number;
  avgWatchSec?: string;
  saves?: number;
  shares?: number;
  comments?: number;
  gmv?: string;
  diagnosis?: string;
}

// ─── Verdict Badge ────────────────────────────────────────────────────────────
function VerdictBadge({ verdict }: { verdict: VerdictType }) {
  if (!verdict) return null;
  const config: Record<string, { color: string; icon: React.ElementType }> = {
    'BREAKOUT':    { color: 'bg-teal-500/20 text-teal-300 border-teal-500/30', icon: TrendingUp },
    'HIDDEN GEM':  { color: 'bg-violet-500/20 text-violet-300 border-violet-500/30', icon: Sparkles },
    'Iterate':     { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: Wrench },
    'Remake':      { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: RefreshCw },
    'Retire':      { color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: XCircle },
  };
  const c = config[verdict] ?? config['Iterate'];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.color}`}>
      <Icon className="w-3 h-3" />
      {verdict}
    </span>
  );
}

// ─── Quality Flag Badge ───────────────────────────────────────────────────────
function QualityFlag({ flag }: { flag: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-300 border border-red-500/20">
      <AlertTriangle className="w-3 h-3" />
      {flag}
    </span>
  );
}

// ─── Section Sequence ─────────────────────────────────────────────────────────
function SectionSequence({ sections }: { sections: string[] }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {sections.map((s, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-white/60 border border-white/10 font-mono">
            {s}
          </span>
          {i < sections.length - 1 && <span className="text-white/20 text-xs">→</span>}
        </span>
      ))}
    </div>
  );
}

// ─── Metrics Input Row ────────────────────────────────────────────────────────
function MetricsInputRow({
  video,
  reportId,
  onSaved,
}: {
  video: VideoEntry;
  reportId: number;
  onSaved: () => void;
}) {
  const [views, setViews] = useState(video.views?.toString() ?? '');
  const [watchTimePct, setWatchTimePct] = useState(video.watchTimePct?.toString() ?? '');
  const [avgWatchSec, setAvgWatchSec] = useState(video.avgWatchSec ?? '');
  const [saves, setSaves] = useState(video.saves?.toString() ?? '');
  const [shares, setShares] = useState(video.shares?.toString() ?? '');
  const [comments, setComments] = useState(video.comments?.toString() ?? '');
  const [gmv, setGmv] = useState(video.gmv ?? '');

  const updateMetrics = trpc.autoReports.updateVideoMetrics.useMutation({
    onSuccess: () => {
      toast.success('Metrics saved');
      onSaved();
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSave = () => {
    updateMetrics.mutate({
      reportId,
      videoUrl: video.videoUrl,
      metrics: {
        views: views ? parseInt(views) : undefined,
        watchTimePct: watchTimePct ? parseFloat(watchTimePct) : undefined,
        avgWatchSec: avgWatchSec || undefined,
        saves: saves ? parseInt(saves) : undefined,
        shares: shares ? parseInt(shares) : undefined,
        comments: comments ? parseInt(comments) : undefined,
        gmv: gmv || undefined,
      },
    });
  };

  return (
    <div className="space-y-3 pt-3 border-t border-white/10">
      <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Add Metrics from TikTok Analytics</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Views</label>
          <Input
            value={views}
            onChange={e => setViews(e.target.value)}
            placeholder="e.g. 4200"
            className="h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/20"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Watch Time %</label>
          <Input
            value={watchTimePct}
            onChange={e => setWatchTimePct(e.target.value)}
            placeholder="e.g. 42"
            className="h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/20"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Avg Watch</label>
          <Input
            value={avgWatchSec}
            onChange={e => setAvgWatchSec(e.target.value)}
            placeholder="e.g. 18s"
            className="h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/20"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Saves</label>
          <Input
            value={saves}
            onChange={e => setSaves(e.target.value)}
            placeholder="e.g. 84"
            className="h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/20"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Shares</label>
          <Input
            value={shares}
            onChange={e => setShares(e.target.value)}
            placeholder="e.g. 12"
            className="h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/20"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Comments</label>
          <Input
            value={comments}
            onChange={e => setComments(e.target.value)}
            placeholder="e.g. 31"
            className="h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/20"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">GMV ($)</label>
          <Input
            value={gmv}
            onChange={e => setGmv(e.target.value)}
            placeholder="e.g. $127.40"
            className="h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/20"
          />
        </div>
      </div>
      <Button
        onClick={handleSave}
        disabled={updateMetrics.isPending}
        size="sm"
        className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8"
      >
        {updateMetrics.isPending ? <RefreshCw className="w-3 h-3 animate-spin mr-1.5" /> : null}
        Save Metrics
      </Button>
    </div>
  );
}

// ─── Diagnosis Panel ──────────────────────────────────────────────────────────
function DiagnosisPanel({
  video,
  reportId,
  onDiagnosed,
}: {
  video: VideoEntry;
  reportId: number;
  onDiagnosed: () => void;
}) {
  const [diagnosisResult, setDiagnosisResult] = useState<{
    verdict: VerdictType;
    failedSection: string;
    rootCause: string;
    evidence: string;
    nextAction: string;
    whatWorked: string;
    priorityScore: number;
  } | null>(null);

  const diagnoseMutation = trpc.autoReports.diagnoseVideo.useMutation({
    onSuccess: (data) => {
      setDiagnosisResult(data.diagnosis);
      toast.success('Diagnosis complete');
      onDiagnosed();
    },
    onError: (e) => toast.error(e.message),
  });

  const hasMetrics = video.views !== undefined && video.views !== null;

  if (!hasMetrics && !diagnosisResult) {
    return (
      <div className="pt-3 border-t border-white/10">
        <p className="text-xs text-white/30 italic">Add metrics above to unlock AI diagnosis</p>
      </div>
    );
  }

  return (
    <div className="pt-3 border-t border-white/10 space-y-3">
      {!diagnosisResult && (
        <Button
          onClick={() => diagnoseMutation.mutate({ reportId, videoUrl: video.videoUrl })}
          disabled={diagnoseMutation.isPending}
          size="sm"
          className="bg-violet-600 hover:bg-violet-500 text-white text-xs h-8 gap-1.5"
        >
          {diagnoseMutation.isPending ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : (
            <Bot className="w-3 h-3" />
          )}
          {diagnoseMutation.isPending ? 'Diagnosing...' : 'Run AI Diagnosis'}
        </Button>
      )}

      {diagnosisResult && (
        <div className="space-y-3 bg-[#0d1117] rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-white">AI Diagnosis</span>
            </div>
            <div className="flex items-center gap-2">
              <VerdictBadge verdict={diagnosisResult.verdict} />
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                diagnosisResult.priorityScore >= 8 ? 'bg-red-500/20 text-red-300' :
                diagnosisResult.priorityScore >= 5 ? 'bg-amber-500/20 text-amber-300' :
                'bg-white/10 text-white/50'
              }`}>
                P{diagnosisResult.priorityScore}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Target className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Root Cause</p>
                <p className="text-sm text-white/90">{diagnosisResult.rootCause}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <BarChart2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Evidence</p>
                <p className="text-sm text-white/70">{diagnosisResult.evidence}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">What Worked</p>
                <p className="text-sm text-white/70">{diagnosisResult.whatWorked}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-teal-500/5 border border-teal-500/20 rounded-lg p-3">
              <Zap className="w-3.5 h-3.5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-teal-400 uppercase tracking-wider mb-0.5 font-semibold">Next Action</p>
                <p className="text-sm text-white font-medium">{diagnosisResult.nextAction}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              setDiagnosisResult(null);
              diagnoseMutation.mutate({ reportId, videoUrl: video.videoUrl });
            }}
            variant="ghost"
            size="sm"
            className="text-white/30 hover:text-white/60 text-xs h-7 gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Re-run
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────────────
function VideoCard({ video, reportId, onRefresh }: { video: VideoEntry; reportId: number; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false);

  const hasMetrics = video.views !== undefined && video.views !== null;

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0a0f1a]">
      {/* Header row */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-start justify-between px-4 py-3 hover:bg-white/3 transition-colors text-left"
      >
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-white/40 font-mono">{video.postDate}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/50 border border-white/10 font-mono">
              {video.hookType}
            </span>
            {video.productRevealed && (
              <span className="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                {video.productRevealed}
              </span>
            )}
            {hasMetrics && video.diagnosis && (
              <VerdictBadge verdict={video.diagnosis as VerdictType} />
            )}
            {hasMetrics && !video.diagnosis && (
              <span className="text-xs px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                Metrics added — run diagnosis
              </span>
            )}
            {!hasMetrics && (
              <span className="text-xs text-white/20 italic">No metrics yet</span>
            )}
          </div>
          <p className="text-sm text-white/80 font-medium leading-snug line-clamp-1">
            "{video.spokenHook}"
          </p>
          {video.qualityFlags && video.qualityFlags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {video.qualityFlags.map((f, i) => <QualityFlag key={i} flag={f} />)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="p-1.5 rounded hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          {expanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/5">
          {/* Content structure */}
          <div className="pt-3 space-y-3">
            <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Content Structure</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-white/30">Section sequence</span>
                <div className="mt-1">
                  <SectionSequence sections={video.sectionSequence ?? []} />
                </div>
              </div>
              <div>
                <span className="text-white/30">Overlay strategy</span>
                <p className="text-white/70 mt-0.5">{video.overlayStrategy || '—'}</p>
              </div>
              <div>
                <span className="text-white/30">Product reveal timing</span>
                <p className="text-white/70 mt-0.5">{video.productRevealTiming || '—'}</p>
              </div>
              <div>
                <span className="text-white/30">Estimated runtime</span>
                <p className="text-white/70 mt-0.5">{video.estimatedRuntime || '—'}</p>
              </div>
              <div>
                <span className="text-white/30">CTA delivery</span>
                <p className="text-white/70 mt-0.5">{video.ctaDelivery || '—'}</p>
              </div>
              <div>
                <span className="text-white/30">Credential placement</span>
                <p className="text-white/70 mt-0.5">{video.credentialPlacement || '—'}</p>
              </div>
            </div>
            {video.textOverlayHook && (
              <div>
                <span className="text-xs text-white/30">Text overlay hook</span>
                <p className="text-sm text-white/70 mt-0.5 font-mono">"{video.textOverlayHook}"</p>
              </div>
            )}
            {video.iterationNotes && !video.diagnosis && (
              <div className="bg-white/3 rounded-lg p-3 border border-white/5">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Agent Notes</p>
                <p className="text-xs text-white/60">{video.iterationNotes}</p>
              </div>
            )}
          </div>

          {/* Metrics input */}
          <MetricsInputRow video={video} reportId={reportId} onSaved={onRefresh} />

          {/* AI Diagnosis */}
          <DiagnosisPanel video={video} reportId={reportId} onDiagnosed={onRefresh} />
        </div>
      )}
    </div>
  );
}

// ─── Report Card ──────────────────────────────────────────────────────────────
function ReportCard({ report }: { report: {
  id: number;
  runDate: string;
  videosFound: number;
  videosAnalyzed: number;
  status: string;
  createdAt: Date;
  videoSummaries: {
    videoUrl: string;
    postDate: string;
    hookType: string;
    spokenHook: string;
    qualityFlags: string[];
    hasMetrics: boolean;
    diagnosis: string | null;
  }[];
}}) {
  const [expanded, setExpanded] = useState(false);
  const { data: fullReport, refetch } = trpc.autoReports.getReport.useQuery(
    { id: report.id },
    { enabled: expanded }
  );

  const pendingMetrics = report.videoSummaries.filter(v => !v.hasMetrics).length;
  const pendingDiagnosis = report.videoSummaries.filter(v => v.hasMetrics && !v.diagnosis).length;

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      {/* Report header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white/3 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/30 to-violet-600/30 border border-blue-500/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Run: {report.runDate}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                report.status === 'complete'
                  ? 'bg-teal-500/10 text-teal-300 border-teal-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
              }`}>
                {report.status}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-white/40">
                <span className="text-white/70 font-medium">{report.videosAnalyzed}</span> videos analyzed
              </span>
              {pendingMetrics > 0 && (
                <span className="text-xs text-amber-400">
                  {pendingMetrics} need metrics
                </span>
              )}
              {pendingDiagnosis > 0 && (
                <span className="text-xs text-violet-400">
                  {pendingDiagnosis} ready for diagnosis
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 font-mono hidden sm:block">
            {new Date(report.createdAt).toLocaleString()}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </div>
      </button>

      {/* Video list */}
      {expanded && (
        <div className="p-4 space-y-3 bg-[#080c14]">
          {!fullReport ? (
            <div className="flex items-center gap-2 text-white/40 text-sm py-4">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Loading videos...
            </div>
          ) : fullReport.parsedReport.videos.length === 0 ? (
            <p className="text-sm text-white/30 italic py-4 text-center">No videos found in this run</p>
          ) : (
            fullReport.parsedReport.videos.map((video, i) => (
              <VideoCard
                key={i}
                video={video as VideoEntry}
                reportId={report.id}
                onRefresh={() => refetch()}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AutoReports() {
  const { isAuthenticated } = useAuth();

  const { data: reports, isLoading, refetch } = trpc.autoReports.getReports.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 60_000, // refresh every minute
  });

  // ── Auth gate ───────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060a12] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Bot className="w-12 h-12 text-blue-400 mx-auto" />
          <p className="text-white/60">Sign in to view your automated video reports</p>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a12] text-white flex flex-col">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[#060a12]/95 backdrop-blur border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white font-mono">Auto Reports</h1>
            <p className="text-[10px] text-white/40 tracking-widest uppercase hidden sm:block">Scheduled Analysis · @dealsbygp</p>
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
            <Link href="/videolab">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                <span className="hidden sm:inline">Video</span>Lab
              </button>
            </Link>
            <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
              <span className="hidden sm:inline">Auto</span>Reports
            </button>
            <Link href="/command">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-300 inline-block" />
                <span className="hidden sm:inline">Command</span>Center
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

      {/* ── Page content ────────────────────────────────────────────────────── */}
      <div className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-4">

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3">
          <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-white/60 space-y-0.5">
            <p className="text-blue-300 font-medium">Automated analysis runs every 3 days</p>
            <p>The agent watches every video posted in the last 4 days and analyzes content structure automatically. Add your metrics from TikTok Analytics, then run AI Diagnosis to get a specific verdict and next action.</p>
          </div>
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Analysis Reports</h2>
            <p className="text-xs text-white/40 mt-0.5">
              {reports?.length ?? 0} report{(reports?.length ?? 0) !== 1 ? 's' : ''} · @dealsbygp
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="ghost"
            size="sm"
            className="text-white/40 hover:text-white gap-1.5 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>

        {/* Report list */}
        {isLoading ? (
          <div className="flex items-center gap-3 text-white/40 py-12 justify-center">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading reports...</span>
          </div>
        ) : !reports || reports.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
              <Bot className="w-8 h-8 text-white/20" />
            </div>
            <div className="space-y-1">
              <p className="text-white/50 font-medium">No reports yet</p>
              <p className="text-white/30 text-sm">The first automated run will happen within 3 days.</p>
              <p className="text-white/20 text-xs mt-2">You can trigger a test run from Settings → Schedules → Run Now</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
