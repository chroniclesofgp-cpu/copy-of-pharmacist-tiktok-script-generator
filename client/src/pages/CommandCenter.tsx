/**
 * RxContent Command Center
 * Mission control dashboard — maps every doc, script, video, workflow, and tool
 * built for the pharmacist TikTok content operation.
 *
 * Design: Deep Navy bg, Electric Teal accents, White text (matches app theme)
 * Sections: Stats → Scripts → Videos → Intelligence Library → Product Intel →
 *           Creator Research → Workflow & Timing → Priority Actions
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  FileText,
  Video,
  BookOpen,
  Package,
  Users,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  TrendingUp,
  Eye,
  DollarSign,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  RefreshCw,
  Pill,
  FlaskConical,
  GitBranch,
  ShoppingCart,
  Microscope,
  Target,
  Activity,
  BookMarked,
  Brain,
  Lightbulb,
  ArrowRight,
  ChevronRight,
  X,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Section =
  | 'stats'
  | 'scripts'
  | 'videos'
  | 'intel'
  | 'products'
  | 'creators'
  | 'workflow'
  | 'actions';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function diagnosisColor(diagnosis: string | null): string {
  if (!diagnosis) return 'bg-white/10 text-white/50';
  if (diagnosis.includes('BREAKOUT')) return 'bg-teal-500/20 text-teal-300 border border-teal-500/30';
  if (diagnosis.includes('HIDDEN GEM')) return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
  if (diagnosis.includes('Iterate')) return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
  if (diagnosis.includes('Remake')) return 'bg-orange-500/20 text-orange-300 border border-orange-500/30';
  if (diagnosis.includes('Retire')) return 'bg-red-500/20 text-red-300 border border-red-500/30';
  return 'bg-white/10 text-white/50';
}

function watchTimeColor(pct: number): string {
  if (pct >= 25) return 'text-teal-400';
  if (pct >= 15) return 'text-green-400';
  if (pct >= 10) return 'text-yellow-400';
  if (pct >= 5) return 'text-orange-400';
  return 'text-red-400';
}

function priorityColor(priority: string): string {
  if (priority === 'HIGH') return 'bg-teal-500/20 text-teal-300 border border-teal-500/30';
  if (priority === 'MEDIUM') return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
  return 'bg-white/10 text-white/50';
}

function workflowColor(color: string): string {
  const map: Record<string, string> = {
    blue: 'border-blue-500/40 bg-blue-500/10',
    yellow: 'border-yellow-500/40 bg-yellow-500/10',
    green: 'border-teal-500/40 bg-teal-500/10',
    purple: 'border-violet-500/40 bg-violet-500/10',
    teal: 'border-cyan-500/40 bg-cyan-500/10',
    orange: 'border-orange-500/40 bg-orange-500/10',
    indigo: 'border-indigo-500/40 bg-indigo-500/10',
  };
  return map[color] ?? 'border-white/20 bg-white/5';
}

function workflowDotColor(color: string): string {
  const map: Record<string, string> = {
    blue: 'bg-blue-400',
    yellow: 'bg-yellow-400',
    green: 'bg-teal-400',
    purple: 'bg-violet-400',
    teal: 'bg-cyan-400',
    orange: 'bg-orange-400',
    indigo: 'bg-indigo-400',
  };
  return map[color] ?? 'bg-white/50';
}

function categoryColor(category: string): string {
  const map: Record<string, string> = {
    'Core Framework': 'bg-teal-500/20 text-teal-300',
    'Project Intelligence': 'bg-violet-500/20 text-violet-300',
    'Performance Tracking': 'bg-blue-500/20 text-blue-300',
    'Planning': 'bg-amber-500/20 text-amber-300',
    'Research Methodology': 'bg-pink-500/20 text-pink-300',
  };
  return map[category] ?? 'bg-white/10 text-white/50';
}

function productCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    'Supplements': 'bg-teal-500/20 text-teal-300',
    'Skincare': 'bg-pink-500/20 text-pink-300',
    'Energy/Nootropics': 'bg-amber-500/20 text-amber-300',
    'Other': 'bg-white/10 text-white/50',
  };
  return map[cat] ?? 'bg-white/10 text-white/50';
}

// ─── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  count,
  color = 'teal',
  sectionKey,
  expanded,
  onToggle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  count?: number;
  color?: string;
  sectionKey: Section;
  expanded: boolean;
  onToggle: (key: Section) => void;
}) {
  const colorMap: Record<string, string> = {
    teal: 'bg-teal-500/20 border-teal-500/40 text-teal-400',
    blue: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
    violet: 'bg-violet-500/20 border-violet-500/40 text-violet-400',
    amber: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
    pink: 'bg-pink-500/20 border-pink-500/40 text-pink-400',
    orange: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
    cyan: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
    green: 'bg-green-500/20 border-green-500/40 text-green-400',
  };
  const cls = colorMap[color] ?? colorMap.teal;

  return (
    <button
      onClick={() => onToggle(sectionKey)}
      className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${cls}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{title}</span>
            {count !== undefined && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/10 text-white/50 font-mono">{count}</span>
            )}
          </div>
          <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="text-white/30 group-hover:text-white/60 transition-colors">
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>
    </button>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function CommandCenter() {
  const [expandedSections, setExpandedSections] = useState<Set<Section>>(
    new Set(['stats', 'scripts', 'actions'] as Section[])
  );
  const [expandedVideo, setExpandedVideo] = useState<number | null>(null);
  const [expandedWorkflow, setExpandedWorkflow] = useState<number | null>(null);
  const [selectedScript, setSelectedScript] = useState<{ key: string; filename: string; product: string } | null>(null);

  const utils = trpc.useUtils();
  const { data: stats, isLoading: statsLoading } = trpc.commandCenter.getVideoStats.useQuery();
  const { data: videos, isLoading: videosLoading } = trpc.commandCenter.getVideos.useQuery();
  const { data: scripts, isLoading: scriptsLoading } = trpc.commandCenter.getScripts.useQuery();
  const { data: filmedScripts } = trpc.commandCenter.getFilmedScripts.useQuery();
  const { data: intelDocs } = trpc.commandCenter.getIntelDocs.useQuery();
  const { data: productIntel } = trpc.commandCenter.getProductIntel.useQuery();
  const { data: creators } = trpc.commandCenter.getCreatorResearch.useQuery();
  const { data: workflow } = trpc.commandCenter.getWorkflow.useQuery();

  const filmedSet = new Set((filmedScripts ?? []).map(f => f.scriptKey));

  const markFilmedMutation = trpc.commandCenter.markAsFilmed.useMutation({
    onSuccess: () => {
      utils.commandCenter.getFilmedScripts.invalidate();
    },
    onError: () => {
      toast.error('Failed to update filmed status');
    },
  });

  function toggleSection(key: Section) {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const isExpanded = (key: Section) => expandedSections.has(key);

  // Priority actions derived from video data
  const priorityActions = [
    {
      priority: 1,
      action: "Refilm Video 6 (Deodorant Stack) with new hook",
      why: "$6.00 GMV on 229 views — highest conversion rate in batch. Hook is the only problem.",
      hook: "If your underarms are dark and nothing has worked, it's because you're only treating one of two problems.",
      tag: "HIDDEN GEM",
      color: "amber",
    },
    {
      priority: 2,
      action: "Write + film next Toplux Magnesium script (V18 structure)",
      why: "V18 is highest GMV ($10.18). Combine V18 hook + V2 hook specificity. Tighten education section.",
      hook: "Double chin, belly fat, love handles — you're not just eating too much.",
      tag: "BREAKOUT Replicate",
      color: "teal",
    },
    {
      priority: 3,
      action: "Refilm Video 8 (Bloom vs Loaded Tea) with conditional close",
      why: "V7 (8,675 views) vs V8 (184 views) — only difference is the conditional close. Add 'here's who should buy which one.'",
      hook: "Add: 'Here's who should buy which one — if you want X, get Bloom. If you want Y, get Loaded Tea.'",
      tag: "Remake",
      color: "blue",
    },
    {
      priority: 4,
      action: "Film all 21 scripts in the scripts folder",
      why: "21 scripts are written and ready. Film in priority order: HIGH priority first.",
      hook: "Open Scripts section below → sort by HIGH priority → film in order.",
      tag: "Film Queue",
      color: "violet",
    },
    {
      priority: 5,
      action: "Log analytics for any new videos at 7-day mark",
      why: "7-day analytics are the reliable read. Pull screenshot → log in VIDEO_PERFORMANCE_LOG.md → update database.",
      hook: "See Workflow section for exact timing and logging protocol.",
      tag: "Ongoing",
      color: "orange",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">
      {/* ── Top Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0f1e]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide text-white font-mono">Command Center</h1>
              <p className="text-[10px] text-white/40 tracking-widest uppercase hidden sm:block">RxContent Mission Control</p>
            </div>
          </div>
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
            <Link href="/editor">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
                <span className="hidden sm:inline">Video</span>Editor
              </button>
            </Link>
            <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
              <span className="hidden sm:inline">Command</span>Center
            </button>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-4">

        {/* ── Hero Stats Bar ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl border border-white/10 bg-white/5 animate-pulse" />
            ))
          ) : stats ? (
            <>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-white/40">
                  <Video className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-widest">Videos</span>
                </div>
                <span className="text-2xl font-bold text-white font-mono">{stats.totalVideos}</span>
                <span className="text-[10px] text-white/30">posted</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-white/40">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-widest">Views</span>
                </div>
                <span className="text-2xl font-bold text-white font-mono">{stats.totalViews.toLocaleString()}</span>
                <span className="text-[10px] text-white/30">total</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-white/40">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-widest">GMV</span>
                </div>
                <span className="text-2xl font-bold text-teal-400 font-mono">${stats.totalGMV}</span>
                <span className="text-[10px] text-white/30">earned</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-white/40">
                  <Activity className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-widest">Avg Watch</span>
                </div>
                <span className={`text-2xl font-bold font-mono ${watchTimeColor(stats.avgWatchPct)}`}>{stats.avgWatchPct}%</span>
                <span className="text-[10px] text-white/30">retention</span>
              </div>
              <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-teal-400">
                  <Star className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-widest">Breakouts</span>
                </div>
                <span className="text-2xl font-bold text-teal-300 font-mono">{stats.breakouts}</span>
                <span className="text-[10px] text-teal-400/60">5K+ views</span>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-widest">Hidden Gems</span>
                </div>
                <span className="text-2xl font-bold text-amber-300 font-mono">{stats.hiddenGems}</span>
                <span className="text-[10px] text-amber-400/60">low views, GMV+</span>
              </div>
            </>
          ) : null}
        </div>

        {/* ── Priority Actions ──────────────────────────────────────────────── */}
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 overflow-hidden">
          <SectionHeader
            icon={AlertCircle}
            title="Priority Actions"
            subtitle="What to do next — in order"
            count={priorityActions.length}
            color="orange"
            sectionKey="actions"
            expanded={isExpanded('actions')}
            onToggle={toggleSection}
          />
          {isExpanded('actions') && (
            <div className="p-4 pt-0 space-y-3">
              {priorityActions.map((item) => (
                <div key={item.priority} className="flex gap-3 p-3 rounded-lg border border-white/10 bg-white/5">
                  <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white/70">{item.priority}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{item.action}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        item.color === 'amber' ? 'bg-amber-500/20 text-amber-300' :
                        item.color === 'teal' ? 'bg-teal-500/20 text-teal-300' :
                        item.color === 'blue' ? 'bg-blue-500/20 text-blue-300' :
                        item.color === 'violet' ? 'bg-violet-500/20 text-violet-300' :
                        'bg-orange-500/20 text-orange-300'
                      }`}>{item.tag}</span>
                    </div>
                    <p className="text-xs text-white/50 mt-1">{item.why}</p>
                    <div className="mt-2 p-2 rounded-md bg-white/5 border border-white/10">
                      <p className="text-xs text-white/60 font-mono leading-relaxed">{item.hook}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Scripts Ready to Film ─────────────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <SectionHeader
            icon={FileText}
            title="Scripts Ready to Film"
            subtitle="All written scripts — film in priority order"
            count={scripts?.length}
            color="teal"
            sectionKey="scripts"
            expanded={isExpanded('scripts')}
            onToggle={toggleSection}
          />
          {isExpanded('scripts') && (
            <div className="p-4 pt-0">
              {/* Filmed count summary */}
              <div className="mb-3 flex items-center gap-2 text-xs text-white/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>{filmedSet.size} of {scripts?.length ?? 0} filmed</span>
                <span className="mx-1">·</span>
                <span className="text-white/30">Filmed scripts move to bottom</span>
              </div>
              {scriptsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Sort: unfilmed HIGH → MEDIUM → LOW first, then filmed */}
                  {[...(scripts ?? [])]
                    .sort((a, b) => {
                      const aFilmed = filmedSet.has(a.key) ? 1 : 0;
                      const bFilmed = filmedSet.has(b.key) ? 1 : 0;
                      if (aFilmed !== bFilmed) return aFilmed - bFilmed;
                      const order: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
                      return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
                    })
                    .map((script) => {
                      const isFilmed = filmedSet.has(script.key);
                      const isPending = markFilmedMutation.isPending && markFilmedMutation.variables?.scriptKey === script.key;
                      return (
                        <div key={script.key} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          isFilmed
                            ? 'border-white/5 bg-white/2 opacity-50'
                            : 'border-white/10 bg-white/5 hover:bg-white/8'
                        }`}>
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                            isFilmed ? 'bg-teal-500/20 border border-teal-500/30' : 'bg-teal-500/10 border border-teal-500/20'
                          }`}>
                            {isFilmed
                              ? <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                              : <FileText className="w-3.5 h-3.5 text-teal-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-bold font-mono ${isFilmed ? 'text-white/40 line-through' : 'text-white/80'}`}>{script.key}</span>
                              <span className="text-xs text-white/30">—</span>
                              <span className={`text-xs ${isFilmed ? 'text-white/30' : 'text-white/70'}`}>{script.product}</span>
                            </div>
                            <span className="text-[10px] text-white/30">{script.hookType}</span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${priorityColor(script.priority)}`}>
                            {script.priority}
                          </span>
                          <button
                            onClick={() => setSelectedScript({ key: script.key, filename: script.filename, product: script.product })}
                            className="text-[10px] px-2.5 py-1 rounded-md font-medium shrink-0 transition-colors bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/80"
                          >
                            View
                          </button>
                          <button
                            onClick={() => markFilmedMutation.mutate({ scriptKey: script.key, filmed: !isFilmed })}
                            disabled={isPending}
                            className={`text-[10px] px-2.5 py-1 rounded-md font-medium shrink-0 transition-colors ${
                              isFilmed
                                ? 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/50'
                                : 'bg-teal-500/20 text-teal-300 border border-teal-500/30 hover:bg-teal-500/30'
                            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isPending ? '...' : isFilmed ? 'Unmark' : 'Mark Filmed'}
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Video Performance ─────────────────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <SectionHeader
            icon={TrendingUp}
            title="Video Performance"
            subtitle="All 22 posted videos with analytics and diagnosis"
            count={videos?.length}
            color="blue"
            sectionKey="videos"
            expanded={isExpanded('videos')}
            onToggle={toggleSection}
          />
          {isExpanded('videos') && (
            <div className="p-4 pt-0 space-y-4">
              {/* Hook type performance table */}
              {stats?.hookPerformance && stats.hookPerformance.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Hook Type Performance</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 pr-4 text-white/40 font-medium">Hook Type</th>
                          <th className="text-right py-2 pr-4 text-white/40 font-medium">Avg Views</th>
                          <th className="text-right py-2 pr-4 text-white/40 font-medium">Avg Watch %</th>
                          <th className="text-right py-2 text-white/40 font-medium">Videos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.hookPerformance.map((h) => (
                          <tr key={h.hookType} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                            <td className="py-2 pr-4 text-white/70">{h.hookType}</td>
                            <td className="py-2 pr-4 text-right font-mono text-white/80">{h.avgViews.toLocaleString()}</td>
                            <td className={`py-2 pr-4 text-right font-mono font-bold ${watchTimeColor(h.avgWatchPct)}`}>{h.avgWatchPct}%</td>
                            <td className="py-2 text-right text-white/40">{h.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Individual video list */}
              {videosLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-14 rounded-lg bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {videos?.map((video) => (
                    <div key={video.id} className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
                      <button
                        onClick={() => setExpandedVideo(expandedVideo === video.id ? null : video.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left"
                      >
                        <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-white/60 font-mono">V{video.videoNumber}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-white/80">{video.product}</span>
                            <span className="text-[10px] text-white/40">{video.hookType}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] text-white/50 font-mono">{(video.views ?? 0).toLocaleString()} views</span>
                            <span className={`text-[10px] font-mono font-bold ${watchTimeColor(video.watchTimePct ?? 0)}`}>{video.watchTimePct}% watch</span>
                            {video.gmv && video.gmv !== '$0.00' && (
                              <span className="text-[10px] text-teal-400 font-mono font-bold">{video.gmv} GMV</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${diagnosisColor(video.diagnosis)}`}>
                            {video.diagnosis?.replace(' — Iterate', '').replace(' — Replicate', '') ?? '—'}
                          </span>
                          {expandedVideo === video.id ? <ChevronUp className="w-3.5 h-3.5 text-white/30" /> : <ChevronDown className="w-3.5 h-3.5 text-white/30" />}
                        </div>
                      </button>
                      {expandedVideo === video.id && (
                        <div className="px-3 pb-3 border-t border-white/10 pt-3 space-y-2">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="p-2 rounded-md bg-white/5 border border-white/10">
                              <p className="text-[10px] text-white/30 uppercase tracking-widest">Avg Watch</p>
                              <p className="text-sm font-bold text-white font-mono">{video.avgWatchSec}s</p>
                            </div>
                            <div className="p-2 rounded-md bg-white/5 border border-white/10">
                              <p className="text-[10px] text-white/30 uppercase tracking-widest">Watch %</p>
                              <p className={`text-sm font-bold font-mono ${watchTimeColor(video.watchTimePct ?? 0)}`}>{video.watchTimePct}%</p>
                            </div>
                            <div className="p-2 rounded-md bg-white/5 border border-white/10">
                              <p className="text-[10px] text-white/30 uppercase tracking-widest">GMV</p>
                              <p className="text-sm font-bold text-teal-400 font-mono">{video.gmv}</p>
                            </div>
                            <div className="p-2 rounded-md bg-white/5 border border-white/10">
                              <p className="text-[10px] text-white/30 uppercase tracking-widest">Posted</p>
                              <p className="text-sm font-bold text-white font-mono">{video.postDate}</p>
                            </div>
                          </div>
                          {video.ctaId && (
                            <div className="p-2 rounded-md bg-teal-500/5 border border-teal-500/20">
                              <p className="text-[10px] text-teal-300/70 uppercase tracking-widest mb-1">CTA Experiment</p>
                              <p className="text-xs text-white/70 leading-relaxed"><span className="font-mono font-semibold text-teal-300">{video.ctaId}</span>{video.urgencyTrigger ? ` · ${video.urgencyTrigger}` : ''}</p>
                              {video.filmingDayCheck && <p className="text-[10px] text-white/35 mt-1">Filming-day check: {video.filmingDayCheck.replaceAll('_', ' ')}</p>}
                            </div>
                          )}
                          {video.action && (
                            <div className="p-2 rounded-md bg-orange-500/5 border border-orange-500/20">
                              <p className="text-[10px] text-orange-400/70 uppercase tracking-widest mb-1">Action</p>
                              <p className="text-xs text-white/60 leading-relaxed">{video.action}</p>
                            </div>
                          )}
                          {video.tiktokUrl && (
                            <a
                              href={video.tiktokUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View on TikTok
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Intelligence Library ──────────────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <SectionHeader
            icon={BookOpen}
            title="Intelligence Library"
            subtitle="Core frameworks, reference guides, and research docs"
            count={intelDocs?.length}
            color="violet"
            sectionKey="intel"
            expanded={isExpanded('intel')}
            onToggle={toggleSection}
          />
          {isExpanded('intel') && (
            <div className="p-4 pt-0 space-y-2">
              {/* Required reading callout */}
              <div className="p-3 rounded-lg border border-teal-500/30 bg-teal-500/5 mb-3">
                <p className="text-xs font-semibold text-teal-300 mb-1">Required reading before writing any script manually:</p>
                <p className="text-[11px] text-teal-400/70 font-mono">HOOK_FRAMEWORKS → SCRIPT_ARCHITECTURE_GUIDE → BUYER_PSYCHOLOGY_LEVERS → PHRASE_BANK → VISUAL_OVERLAY_PLAYBOOK → HEALTHCARE_HOOK_REFERENCE_GUIDE → Product Intel Doc</p>
              </div>
              {intelDocs?.map((doc) => (
                <div key={doc.name} className="flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-white/5">
                  <div className="w-8 h-8 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <BookMarked className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white/80 font-mono">{doc.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${categoryColor(doc.category)}`}>{doc.category}</span>
                    </div>
                    <p className="text-[11px] text-white/40 mt-0.5 leading-relaxed">{doc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Intel ─────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <SectionHeader
            icon={Package}
            title="Product Intel"
            subtitle="Verified ingredient profiles, mechanisms, and 4-video campaign plans"
            count={productIntel?.length}
            color="pink"
            sectionKey="products"
            expanded={isExpanded('products')}
            onToggle={toggleSection}
          />
          {isExpanded('products') && (
            <div className="p-4 pt-0">
              {/* Group by category */}
              {['Skincare', 'Supplements', 'Energy/Nootropics', 'Other'].map((cat) => {
                const items = productIntel?.filter(p => p.category === cat) ?? [];
                if (items.length === 0) return null;
                return (
                  <div key={cat} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${productCategoryColor(cat)}`}>{cat}</span>
                      <span className="text-[10px] text-white/30">{items.length} products</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {items.map((product) => (
                        <div key={product.filename} className="flex items-center gap-2 p-2.5 rounded-lg border border-white/10 bg-white/5">
                          <div className="w-6 h-6 rounded-md bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
                            <Pill className="w-3 h-3 text-pink-400" />
                          </div>
                          <span className="text-xs text-white/70 truncate">{product.product}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Creator Research ─────────────────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <SectionHeader
            icon={Users}
            title="Creator Research"
            subtitle="5 analyzed creators — 84 videos, ~$4.3M estimated GMV"
            count={creators?.length}
            color="amber"
            sectionKey="creators"
            expanded={isExpanded('creators')}
            onToggle={toggleSection}
          />
          {isExpanded('creators') && (
            <div className="p-4 pt-0 space-y-3">
              {creators?.map((creator) => (
                <div key={creator.handle} className="p-3 rounded-lg border border-white/10 bg-white/5">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white">@{creator.handle}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-white/40">{creator.videosAnalyzed} videos analyzed</span>
                          <span className="text-[10px] text-teal-400 font-mono">{creator.estimatedGMV} est. GMV</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-white/50 mt-2 leading-relaxed">{creator.keyPattern}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Workflow & Timing ─────────────────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <SectionHeader
            icon={Clock}
            title="Workflow & Timing"
            subtitle="Exact protocol for posting, logging, deciding, and scripting"
            count={workflow?.length}
            color="cyan"
            sectionKey="workflow"
            expanded={isExpanded('workflow')}
            onToggle={toggleSection}
          />
          {isExpanded('workflow') && (
            <div className="p-4 pt-0 space-y-3">
              {workflow?.map((step, i) => (
                <div key={step.phase} className={`rounded-lg border overflow-hidden ${workflowColor(step.color)}`}>
                  <button
                    onClick={() => setExpandedWorkflow(expandedWorkflow === i ? null : i)}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/5 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${workflowDotColor(step.color)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{step.title}</span>
                        <span className="text-[10px] text-white/40 font-mono">({step.timing})</span>
                      </div>
                    </div>
                    {expandedWorkflow === i ? <ChevronUp className="w-3.5 h-3.5 text-white/30 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-white/30 shrink-0" />}
                  </button>
                  {expandedWorkflow === i && (
                    <div className="px-3 pb-3 border-t border-white/10 pt-3">
                      <ul className="space-y-2">
                        {step.actions.map((action, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 text-white/30 shrink-0 mt-0.5" />
                            <span className="text-xs text-white/60 leading-relaxed">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Performance Table ─────────────────────────────────────── */}
        {stats?.productPerformance && stats.productPerformance.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Product Performance Summary</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 text-white/40 font-medium">Product</th>
                    <th className="text-right py-2 pr-4 text-white/40 font-medium">Total Views</th>
                    <th className="text-right py-2 pr-4 text-white/40 font-medium">Total GMV</th>
                    <th className="text-right py-2 text-white/40 font-medium">Videos</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.productPerformance.map((p) => (
                    <tr key={p.product} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-2 pr-4 text-white/70">{p.product}</td>
                      <td className="py-2 pr-4 text-right font-mono text-white/80">{p.totalViews.toLocaleString()}</td>
                      <td className={`py-2 pr-4 text-right font-mono font-bold ${parseFloat(p.totalGMV) > 0 ? 'text-teal-400' : 'text-white/30'}`}>
                        ${p.totalGMV}
                      </td>
                      <td className="py-2 text-right text-white/40">{p.videoCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="h-8" />
      </main>

      {/* ── Script Viewer Modal ──────────────────────────────────────────────── */}
      {selectedScript && (
        <ScriptModal
          scriptKey={selectedScript.key}
          filename={selectedScript.filename}
          product={selectedScript.product}
          onClose={() => setSelectedScript(null)}
        />
      )}
    </div>
  );
}

// ─── Script Modal ─────────────────────────────────────────────────────────────

function ScriptModal({
  scriptKey,
  filename,
  product,
  onClose,
}: {
  scriptKey: string;
  filename: string;
  product: string;
  onClose: () => void;
}) {
  const { data, isLoading } = trpc.commandCenter.getScriptContent.useQuery({ filename });
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const utils = trpc.useUtils();

  const saveMutation = trpc.commandCenter.saveScriptContent.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        setSaved(true);
        setEditMode(false);
        utils.commandCenter.getScriptContent.invalidate({ filename });
        setTimeout(() => setSaved(false), 2000);
      } else {
        toast.error('Failed to save script');
      }
    },
    onError: () => toast.error('Failed to save script'),
  });

  function handleEdit() {
    setEditContent(data?.content ?? '');
    setEditMode(true);
  }

  function handleSave() {
    saveMutation.mutate({ filename, content: editContent });
  }

  function handleCopy() {
    const text = editMode ? editContent : (data?.content ?? '');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl border border-white/15 bg-[#0d1117] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <p className="text-xs font-mono text-teal-400 uppercase tracking-widest">{scriptKey}</p>
            <p className="text-sm font-semibold text-white mt-0.5">{product}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`text-[10px] px-2.5 py-1 rounded-md font-medium transition-colors border ${
                copied
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                  : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            {/* Edit / Save / Cancel */}
            {!editMode ? (
              <button
                onClick={handleEdit}
                className="text-[10px] px-2.5 py-1 rounded-md font-medium transition-colors border bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/80"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="text-[10px] px-2.5 py-1 rounded-md font-medium transition-colors border bg-teal-500/20 text-teal-300 border-teal-500/30 hover:bg-teal-500/30 disabled:opacity-50"
                >
                  {saveMutation.isPending ? 'Saving...' : saved ? 'Saved!' : 'Save'}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="text-[10px] px-2.5 py-1 rounded-md font-medium transition-colors border bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
            </div>
          ) : editMode ? (
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full h-full min-h-[400px] bg-transparent text-xs text-white/80 font-mono leading-relaxed resize-none outline-none border border-white/10 rounded-lg p-3 focus:border-teal-500/40"
              spellCheck={false}
              autoFocus
            />
          ) : data?.content ? (
            <pre className="text-xs text-white/80 whitespace-pre-wrap font-mono leading-relaxed">{data.content}</pre>
          ) : (
            <p className="text-xs text-white/40 text-center py-12">Script content not available</p>
          )}
        </div>
      </div>
    </div>
  );
}
