/**
 * BOF TIKTOK SHOP SCRIPT GENERATOR
 * Design: Dark background, Amber/Orange accents (distinct from teal healthcare mode)
 * Layout: Left sidebar (hook selection) + Right main panel (inputs + output)
 * Features: Product Library, Script History, A/B Side-by-Side, Line Scroller, Creator Voice Selector
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { getLoginUrl } from '@/const';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import type { BofScript, BofBatchResult, BofABTestResult } from '../../../server/routers/bof';
import {
  BOF_HOOKS,
  BOF_DEAL_TYPES,
  BOF_TESTING_SEQUENCE,
  type BofHook,
} from '@/lib/bofHooks';
import {
  BOF_TEMPLATE_TYPE_MAP,
  VERBATIM_TEMPLATES,
  getLineOptions,
  getVerbatimTemplateOptions,
  getUrgencyCloseOptions,
} from '@/lib/bofLineBank';
import { ProductLibraryPanel, type ProductEntry } from '@/components/ProductLibraryPanel';
import { ScriptHistoryPanel } from '@/components/ScriptHistoryPanel';
import { LineScroller, TemplateSwap } from '@/components/LineScroller';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ShoppingCart,
  Copy,
  BookMarked,
  Menu,
  X,
  Zap,
  Package,
  Clock,
  Layers,
  ExternalLink,
  Star,
  Sparkles,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
  Users,
  History,
  Pencil,
  LogIn,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type BofMode = 'single' | 'batch';
type CreatorVoice = 'hybrid' | 'faith' | 'dealscope' | 'brian' | 'welearn2earn';

// Hooks that are single-creator — auto-lock voice when selected
const HOOK_CREATOR_LOCK: Record<string, CreatorVoice> = {
  'fake-outrage': 'brian',
  'hope-you-didnt-buy': 'welearn2earn',
  'got-robbed': 'welearn2earn',
  'tiktok-glitch': 'dealscope',
  'returning-this': 'faith',
};

// ─── Tier labels ──────────────────────────────────────────────────────────────

const TIER_LABELS: Record<string, { label: string; color: string }> = {
  primary: { label: 'Primary', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  secondary: { label: 'Secondary', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  'viral-trend': { label: '🔥 Viral 2026', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
};

const CREATOR_VOICE_OPTIONS: Array<{ id: CreatorVoice; label: string; sub: string }> = [
  { id: 'hybrid', label: 'Best Fit', sub: 'Blends both styles' },
  { id: 'faith', label: '@faith', sub: 'momfindsbyfaith' },
  { id: 'dealscope', label: '@dealscope', sub: 'dealscope' },
  { id: 'brian', label: '@brian', sub: 'blackfridaybrian' },
  { id: 'welearn2earn', label: '@welearn', sub: 'welearn2earn' },
];

const CREATOR_VOICE_LABEL: Record<CreatorVoice, string> = {
  hybrid: 'Best Fit',
  faith: '@faith voice',
  dealscope: '@dealscope voice',
  brian: '@brian voice',
  welearn2earn: '@welearn2earn voice',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BOF() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  // UI state
  const [bofMode, setBofMode] = useState<BofMode>('single');
  const [selectedHookId, setSelectedHookId] = useState<string>('reverse-psychology');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [productLibraryOpen, setProductLibraryOpen] = useState(false);
  const [scriptHistoryOpen, setScriptHistoryOpen] = useState(false);

  // Creator voice
  const [creatorVoice, setCreatorVoice] = useState<CreatorVoice>('hybrid');
  const [mixVoicesInSequence, setMixVoicesInSequence] = useState(false);

  // Inputs
  const [productName, setProductName] = useState('');
  const [keyBenefit, setKeyBenefit] = useState('');
  const [dealTypes, setDealTypes] = useState<string[]>(['flash-sale']);
  const [dealDeadline, setDealDeadline] = useState('tonight');
  const [creatorCode, setCreatorCode] = useState('');
  const [quantityUnlock, setQuantityUnlock] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [dealPrice, setDealPrice] = useState('');

  // Product description (for benefit lines feature)
  const [productDescription, setProductDescription] = useState('');

  // Benefit lines state
  const [benefitLines, setBenefitLines] = useState<{ lines: string[]; formattedBlock: string; insertNote: string; updatedScript: string } | null>(null);
  const [isGeneratingBenefitLines, setIsGeneratingBenefitLines] = useState(false);
  const [benefitLinesInserted, setBenefitLinesInserted] = useState(false);

  // Hooks that support the Generate Benefit Lines feature
  const BENEFIT_LINES_HOOKS = ['returning-this', 'fake-outrage', 'bundle-motherload', 'counting-hook'] as const;
  type BenefitLinesHookId = typeof BENEFIT_LINES_HOOKS[number];
  const showBenefitLinesButton = BENEFIT_LINES_HOOKS.includes(selectedHookId as BenefitLinesHookId);

  // Output
  const [generatedScript, setGeneratedScript] = useState<BofScript | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [batchResults, setBatchResults] = useState<BofBatchResult[]>([]);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);

  // A/B/C variant state — side-by-side view
  const [abTestResult, setAbTestResult] = useState<BofABTestResult | null>(null);
  const [isGeneratingVariants, setIsGeneratingVariants] = useState(false);
  const [abViewMode, setAbViewMode] = useState<'tabs' | 'sidebyside'>('tabs');
  const [activeVariant, setActiveVariant] = useState<'A' | 'B' | 'C'>('A');

  // Line scroller state — indexes per section
  const [scrollerIndexes, setScrollerIndexes] = useState<Record<string, number>>({
    textHook: 0,
    verbalHook: 0,
    dealReveal: 0,
    howTo: 0,
    urgencyClose: 0,
  });

  // Template swap state (verbatim hooks)
  const [templateIndex, setTemplateIndex] = useState(0);

  const selectedHook = BOF_HOOKS.find(h => h.id === selectedHookId);
  const isBofPlus = selectedHook?.requiresBenefitField ?? false;
  const templateType = BOF_TEMPLATE_TYPE_MAP[selectedHookId] || 'assembly';
  const isVerbatim = templateType === 'verbatim';

  // ── Derived line options for scroller ──────────────────────────────────────
  const creatorFilter = creatorVoice === 'hybrid' ? undefined
    : creatorVoice === 'faith' ? '@momfindsbyfaith' as const
    : '@dealscope' as const;

  const lineOptions = useMemo(() => {
    if (!selectedHookId || isVerbatim) return null;
    return {
      textHooks: getLineOptions(selectedHookId, 'textHooks', dealTypes, creatorFilter),
      verbalHooks: getLineOptions(selectedHookId, 'verbalHooks', dealTypes, creatorFilter),
      dealRevealOpeners: getLineOptions(selectedHookId, 'dealRevealOpeners', dealTypes, creatorFilter),
      howToLines: getLineOptions(selectedHookId, 'howToLines', dealTypes, creatorFilter),
      urgencyCloses: getUrgencyCloseOptions(selectedHookId, dealTypes, creatorFilter),
    };
  }, [selectedHookId, dealTypes, creatorFilter, isVerbatim]);

  const verbatimTemplateOptions = useMemo(() => {
    if (!isVerbatim) return [];
    return getVerbatimTemplateOptions(selectedHookId);
  }, [selectedHookId, isVerbatim]);

  // Reset scroller indexes when hook changes; auto-lock creator voice for single-creator hooks
  const handleHookChange = (hookId: string) => {
    setSelectedHookId(hookId);
    setScrollerIndexes({ textHook: 0, verbalHook: 0, dealReveal: 0, howTo: 0, urgencyClose: 0 });
    setTemplateIndex(0);
    setMobileSidebarOpen(false);
    // Auto-lock creator voice when a single-creator hook is selected
    if (HOOK_CREATOR_LOCK[hookId]) {
      setCreatorVoice(HOOK_CREATOR_LOCK[hookId]);
    } else {
      // Reset to hybrid for multi-creator hooks
      setCreatorVoice('hybrid');
    }
  };

  // ── tRPC mutations ──────────────────────────────────────────────────────────
  const generateMutation = trpc.bof.generate.useMutation();
  const batchMutation = trpc.bof.batchGenerate.useMutation();
  const abTestMutation = trpc.bof.abTest.useMutation();
  const generateBenefitLinesMutation = trpc.bof.generateBenefitLines.useMutation();
  const saveScriptMutation = trpc.savedScripts.save.useMutation({
    onSuccess: () => {
      utils.savedScripts.getAll.invalidate();
      toast.success('Script saved to history!');
    },
    onError: (err) => toast.error(err.message || 'Failed to save script'),
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  const toggleDealType = (id: string) => {
    setDealTypes(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (text: string, label = 'Copied!') => {
    navigator.clipboard.writeText(text).then(() => toast.success(label));
  };

  const handleProductSelect = (product: ProductEntry) => {
    setProductName(product.name);
    if (product.keyBenefit) setKeyBenefit(product.keyBenefit);
    toast.success(`"${product.name}" loaded into form`);
  };

  const handleSaveScript = (script: BofScript, hookName: string, variantLabel?: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    saveScriptMutation.mutate({
      productName: productName || 'Untitled',
      hookId: selectedHookId,
      hookName: variantLabel ? `${hookName} — Variant ${variantLabel}` : hookName,
      fullScript: script.fullScript,
      textHook: script.textHook || undefined,
      verbalHook: script.verbalHook || undefined,
      dealReveal: script.dealReveal || undefined,
      howTo: script.howTo || undefined,
      urgencyClose: script.urgencyClose || undefined,
      creatorVoice,
      format: script.format,
    });
  };

  // ── Generate benefit lines ───────────────────────────────────────────────────
  const handleGenerateBenefitLines = useCallback(async (currentFullScript: string) => {
    if (!productName.trim()) { toast.error('Enter a product name first'); return; }
    if (!BENEFIT_LINES_HOOKS.includes(selectedHookId as BenefitLinesHookId)) return;

    setIsGeneratingBenefitLines(true);
    setBenefitLines(null);
    setBenefitLinesInserted(false);
    try {
      const descriptionSource = productDescription.trim() || keyBenefit.trim() || productName;
      const isBundle = ['bundle-motherload', 'counting-hook'].includes(selectedHookId) ||
        descriptionSource.toLowerCase().includes('bundle') ||
        descriptionSource.toLowerCase().includes('set') ||
        descriptionSource.toLowerCase().includes('pack') ||
        descriptionSource.toLowerCase().includes('kit');

      const result = await generateBenefitLinesMutation.mutateAsync({
        hookId: selectedHookId as BenefitLinesHookId,
        productName,
        productDescription: descriptionSource,
        fullScript: currentFullScript,
        isBundle,
      });
      setBenefitLines(result);
      toast.success('Benefit lines generated!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate benefit lines';
      toast.error(message);
    } finally {
      setIsGeneratingBenefitLines(false);
    }
  }, [productName, productDescription, keyBenefit, selectedHookId, generateBenefitLinesMutation]);

  // ── Generate single script ─────────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (!productName.trim()) { toast.error('Enter a product name'); return; }
    if (!selectedHook) { toast.error('Select a hook'); return; }
    if (dealTypes.length === 0) { toast.error('Select at least one deal type'); return; }

    setIsGenerating(true);
    setGeneratedScript(null);
    setBenefitLines(null);
    setBenefitLinesInserted(false);
    setScrollerIndexes({ textHook: 0, verbalHook: 0, dealReveal: 0, howTo: 0, urgencyClose: 0 });
    setTemplateIndex(0);
    try {
      const result = await generateMutation.mutateAsync({
        hookId: selectedHook.id,
        hookName: selectedHook.name,
        hookTextFormula: selectedHook.textHookFormula,
        hookVerbalFormula: selectedHook.verbalHookFormula,
        format: selectedHook.format,
        productName,
        keyBenefit: keyBenefit || undefined,
        dealTypes,
        dealDeadline: dealDeadline || 'tonight',
        creatorCode: creatorCode || undefined,
        quantityUnlock: quantityUnlock || undefined,
        includeCoupon: dealTypes.includes('coupon'),
        retailPrice: retailPrice || undefined,
        dealPrice: dealPrice || undefined,
        creatorVoice: (creatorVoice === 'hybrid' || creatorVoice === 'brian' || creatorVoice === 'welearn2earn') ? undefined : creatorVoice,
      });
      setGeneratedScript(result);
      setAbTestResult(null);
      setActiveVariant('A');
      toast.success('Script generated!');
    } catch (err: any) {
      toast.error(err?.message || 'Generation failed. Please try again.');
    }
    setIsGenerating(false);
  }, [productName, keyBenefit, selectedHook, dealTypes, dealDeadline, creatorCode, quantityUnlock, retailPrice, dealPrice, creatorVoice]);

  // ── Swap verbatim template (re-generate with specific template index) ────────
  const [isSwappingTemplate, setIsSwappingTemplate] = useState(false);

  const handleTemplateSwap = useCallback(async (newIndex: number) => {
    if (!selectedHook || !productName.trim()) return;
    setTemplateIndex(newIndex);
    setIsSwappingTemplate(true);
    try {
      const result = await generateMutation.mutateAsync({
        hookId: selectedHook.id,
        hookName: selectedHook.name,
        hookTextFormula: selectedHook.textHookFormula,
        hookVerbalFormula: selectedHook.verbalHookFormula,
        format: selectedHook.format,
        productName,
        keyBenefit: keyBenefit || undefined,
        dealTypes,
        dealDeadline: dealDeadline || 'tonight',
        creatorCode: creatorCode || undefined,
        quantityUnlock: quantityUnlock || undefined,
        includeCoupon: dealTypes.includes('coupon'),
        retailPrice: retailPrice || undefined,
        dealPrice: dealPrice || undefined,
        creatorVoice: (creatorVoice === 'hybrid' || creatorVoice === 'brian' || creatorVoice === 'welearn2earn') ? undefined : creatorVoice,
        templateIndex: newIndex,
      });
      setGeneratedScript(result);
    } catch (err: any) {
      toast.error(err?.message || 'Template swap failed. Please try again.');
    }
    setIsSwappingTemplate(false);
  }, [selectedHook, productName, keyBenefit, dealTypes, dealDeadline, creatorCode, quantityUnlock, retailPrice, dealPrice, creatorVoice, generateMutation]);

  // ── Generate A/B/C variants ────────────────────────────────────────────────
  const handleGenerateVariants = useCallback(async () => {
    if (!generatedScript || !selectedHook) return;
    setIsGeneratingVariants(true);
    setAbTestResult(null);
    try {
      const scriptBody = [generatedScript.dealReveal, generatedScript.howTo].filter(Boolean).join('\n\n');
      const result = await abTestMutation.mutateAsync({
        hookId: selectedHook.id,
        hookName: selectedHook.name,
        format: selectedHook.format,
        productName,
        keyBenefit: keyBenefit || undefined,
        dealTypes,
        dealDeadline: dealDeadline || 'tonight',
        creatorCode: creatorCode || undefined,
        quantityUnlock: quantityUnlock || undefined,
        includeCoupon: dealTypes.includes('coupon'),
        scriptBody,
        creatorVoice: (creatorVoice === 'hybrid' || creatorVoice === 'brian' || creatorVoice === 'welearn2earn') ? undefined : creatorVoice,
      });
      setAbTestResult(result);
      setActiveVariant('A');
      toast.success('3 variants generated!');
    } catch (err: any) {
      toast.error(err?.message || 'Variant generation failed.');
    }
    setIsGeneratingVariants(false);
  }, [generatedScript, selectedHook, productName, keyBenefit, dealTypes, dealDeadline, creatorCode, quantityUnlock, creatorVoice]);

  // ── Batch generate 6-video testing sequence ────────────────────────────────
  const handleBatchGenerate = useCallback(async () => {
    if (!productName.trim()) { toast.error('Enter a product name'); return; }
    if (dealTypes.length === 0) { toast.error('Select at least one deal type'); return; }

    setIsGeneratingBatch(true);
    setBatchResults([]);
    try {
      const results = await batchMutation.mutateAsync({
        productName,
        keyBenefit: keyBenefit || undefined,
        dealTypes,
        dealDeadline: dealDeadline || 'tonight',
        creatorCode: creatorCode || undefined,
        quantityUnlock: quantityUnlock || undefined,
        retailPrice: retailPrice || undefined,
        dealPrice: dealPrice || undefined,
        creatorVoice: (creatorVoice === 'hybrid' || creatorVoice === 'brian' || creatorVoice === 'welearn2earn' || mixVoicesInSequence) ? undefined : creatorVoice,
        mixVoices: mixVoicesInSequence,
      });
      setBatchResults(results);
      setExpandedBatch(`pos-1`);
      toast.success(`6-video testing sequence generated!`);
    } catch (err: any) {
      toast.error(err?.message || 'Batch generation failed. Please try again.');
    }
    setIsGeneratingBatch(false);
  }, [productName, keyBenefit, dealTypes, dealDeadline, creatorCode, quantityUnlock, retailPrice, dealPrice, creatorVoice, mixVoicesInSequence]);

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const primaryHooks = BOF_HOOKS.filter(h => h.tier === 'primary');
  const viralHooks = BOF_HOOKS.filter(h => h.tier === 'viral-trend');

  const HookButton = ({ hook }: { hook: BofHook }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => handleHookChange(hook.id)}
          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-start gap-2.5 ${
            selectedHookId === hook.id
              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
              : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'
          }`}
        >
          <span className={`mt-0.5 flex-shrink-0 ${selectedHookId === hook.id ? 'text-amber-400' : 'text-white/30'}`}>
            {hook.tier === 'viral-trend' ? '🔥' : <Zap className="w-3.5 h-3.5" />}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block truncate">{hook.name}</span>
            <span className="block text-[10px] text-white/30 mt-0.5 truncate">{hook.format}</span>
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs">
        <p className="text-xs font-medium mb-1">{hook.name}</p>
        <p className="text-xs text-white/70">{hook.psychMechanism}</p>
      </TooltipContent>
    </Tooltip>
  );

  const SidebarContent = () => (
    <>
      {/* Mode switcher */}
      <div className="p-4 border-b border-white/10">
        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Generation Mode</p>
        <div className="flex gap-2">
          <button
            onClick={() => setBofMode('single')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
              bofMode === 'single'
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                : 'text-white/40 hover:text-white/70 border border-white/10'
            }`}
          >
            Single Script
          </button>
          <button
            onClick={() => setBofMode('batch')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
              bofMode === 'batch'
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                : 'text-white/40 hover:text-white/70 border border-white/10'
            }`}
          >
            6-Video Sequence
          </button>
        </div>
      </div>

      {/* Hook library — only shown in single mode */}
      {bofMode === 'single' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <p className="text-[10px] text-amber-400/60 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> Hook Library
            </p>
            <div className="space-y-1">
              {primaryHooks.map(h => <HookButton key={h.id} hook={h} />)}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-red-400/60 uppercase tracking-widest mb-2">🔥 Viral Trend (2026)</p>
            <div className="space-y-1">
              {viralHooks.map(h => <HookButton key={h.id} hook={h} />)}
            </div>
          </div>
        </div>
      )}

      {/* Batch mode — show testing sequence */}
      {bofMode === 'batch' && (
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">6-Video Testing Sequence</p>
          <div className="space-y-2">
            {BOF_TESTING_SEQUENCE.map(seq => {
              const hook = BOF_HOOKS.find(h => h.id === seq.hookId);
              if (!hook) return null;
              return (
                <div key={seq.position} className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-amber-400 w-4">#{seq.position}</span>
                    <span className="text-xs font-medium text-white/80">{hook.name}</span>
                    <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded border ${seq.format === 'BOF+' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>
                      {seq.format}
                    </span>
                  </div>
                  {seq.includeCoupon && (
                    <p className="text-[9px] text-amber-400/60 ml-6">Includes coupon language</p>
                  )}
                  <p className="text-[9px] text-white/30 ml-6 mt-0.5">{seq.rationale}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Example videos for selected hook */}
      {bofMode === 'single' && selectedHook && selectedHook.exampleVideos.length > 0 && (
        <div className="p-4 border-t border-white/10">
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Live Examples</p>
          <div className="space-y-1.5">
            {selectedHook.exampleVideos.slice(0, 3).map((v, i) => (
              <a
                key={i}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-[10px] text-white/40 hover:text-amber-300 transition-colors group"
              >
                <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0 group-hover:text-amber-400" />
                <span>{v.creator} — {v.description}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );

  // ── Script output section ──────────────────────────────────────────────────
  const ScriptOutput = ({ script, showScroller = false, variantLabel }: {
    script: BofScript;
    showScroller?: boolean;
    variantLabel?: 'A' | 'B' | 'C';
  }) => {
    // Build the displayed script from scroller indexes (if scroller is active)
    // Note: verbatim template swap is handled by re-generate (handleTemplateSwap),
    // so we only need to handle hybrid/assembly line scrolling here.
    const displayScript = useMemo(() => {
      if (!showScroller || isVerbatim || !lineOptions) return script;

      // For hybrid/assembly: update individual sections from line bank
      const textHook = lineOptions.textHooks[scrollerIndexes.textHook] ?? script.textHook;
      const verbalHook = lineOptions.verbalHooks[scrollerIndexes.verbalHook] ?? script.verbalHook;
      const dealReveal = lineOptions.dealRevealOpeners[scrollerIndexes.dealReveal] ?? script.dealReveal;
      const howTo = lineOptions.howToLines[scrollerIndexes.howTo] ?? script.howTo;
      const urgencyClose = lineOptions.urgencyCloses[scrollerIndexes.urgencyClose] ?? script.urgencyClose;

      const fullScript = [verbalHook, dealReveal, howTo, urgencyClose].filter(Boolean).join(' ');

      return { ...script, textHook, verbalHook, dealReveal, howTo, urgencyClose, fullScript };
    }, [script, showScroller, scrollerIndexes, isVerbatim, lineOptions]);

    // ── Inline edit state ──────────────────────────────────────────────────────
    const DRAFT_KEY = `bof-draft-${selectedHookId}-${variantLabel ?? 'main'}`;
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState('');
    const [isEdited, setIsEdited] = useState(false);
    const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);
    const [hasDraft, setHasDraft] = useState(false);
    const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Check for existing draft on mount
    useEffect(() => {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setHasDraft(true);
    }, [DRAFT_KEY]);

    const startEditing = (fromDraft = false) => {
      if (fromDraft) {
        const saved = localStorage.getItem(DRAFT_KEY);
        setEditedText(saved ?? displayScript.fullScript);
      } else {
        setEditedText(displayScript.fullScript);
      }
      setIsEditing(true);
    };

    const cancelEditing = () => {
      setIsEditing(false);
      setEditedText('');
    };

    const discardDraft = () => {
      localStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
    };

    const saveEdits = () => {
      const editedScript = { ...displayScript, fullScript: editedText };
      handleSaveScript(editedScript, selectedHook?.name || 'BOF', variantLabel);
      setIsEdited(true);
      setIsEditing(false);
      // Clear draft after explicit save
      localStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
      setDraftSavedAt(null);
    };

    // Auto-save draft to localStorage (debounced 800ms)
    const handleEditChange = (value: string) => {
      setEditedText(value);
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        localStorage.setItem(DRAFT_KEY, value);
        setDraftSavedAt(new Date());
        setHasDraft(true);
      }, 800);
    };

    // Cleanup timer on unmount
    useEffect(() => {
      return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
    }, []);

    // When displayScript changes (scroller or template swap), reset edit state
    const prevFullScript = displayScript.fullScript;

    return (
      <div className="space-y-4">
        {/* Format badge */}
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded border font-medium ${
            script.format === 'BOF+'
              ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            {script.format}
          </span>
          {script.includedCouponLanguage && (
            <span className="text-xs px-2 py-1 rounded border bg-yellow-500/10 text-yellow-300 border-yellow-500/20">
              Coupon language included
            </span>
          )}
          {creatorVoice !== 'hybrid' && (
            <span className="text-xs px-2 py-1 rounded border bg-white/5 text-white/40 border-white/10">
              {CREATOR_VOICE_LABEL[creatorVoice]}
            </span>
          )}
          {isEdited && !isEditing && (
            <span className="text-xs px-2 py-1 rounded border bg-teal-500/10 text-teal-300 border-teal-500/20">
              ✏️ Edited
            </span>
          )}
        </div>

        {/* Full script */}
        <div className={`bg-[#0d1426] rounded-xl border p-4 transition-colors ${
          isEditing ? 'border-teal-500/40' : 'border-amber-500/20'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-amber-400/60 uppercase tracking-widest">Full Script</p>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing(false)}
                    className="text-white/40 hover:text-teal-300 h-7 px-2 text-xs"
                  >
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(displayScript.fullScript, 'Script copied!')}
                    className="text-white/40 hover:text-amber-300 h-7 px-2 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSaveScript(displayScript, selectedHook?.name || 'BOF', variantLabel)}
                    className="text-white/40 hover:text-amber-300 h-7 px-2 text-xs"
                  >
                    <BookMarked className="w-3 h-3 mr-1" /> Save
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelEditing}
                    className="text-white/40 hover:text-white/70 h-7 px-2 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(editedText, 'Edited script copied!')}
                    className="text-white/40 hover:text-amber-300 h-7 px-2 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={saveEdits}
                    className="text-teal-400/70 hover:text-teal-300 h-7 px-2 text-xs border border-teal-500/20 hover:border-teal-500/40"
                  >
                    <BookMarked className="w-3 h-3 mr-1" /> Save Edits
                  </Button>
                </>
              )}
            </div>
          </div>
          {isEditing ? (
            <>
              <textarea
                value={editedText}
                onChange={e => handleEditChange(e.target.value)}
                className="w-full bg-transparent text-white/90 text-sm leading-relaxed font-mono resize-none outline-none border-none focus:ring-0 min-h-[120px]"
                autoFocus
                style={{ height: 'auto' }}
                onInput={e => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = el.scrollHeight + 'px';
                }}
              />
              {draftSavedAt && (
                <p className="text-[10px] text-teal-400/50 mt-1">
                  Draft auto-saved {draftSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-white/90 text-sm leading-relaxed font-mono whitespace-pre-wrap">{displayScript.fullScript}</p>
              {/* Draft resume banner */}
              {hasDraft && (
                <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                  <span className="text-[10px] text-teal-300 flex-1">You have an unsaved draft for this script.</span>
                  <button
                    onClick={() => startEditing(true)}
                    className="text-[10px] text-teal-300 hover:text-teal-200 underline"
                  >
                    Resume
                  </button>
                  <button
                    onClick={discardDraft}
                    className="text-[10px] text-white/30 hover:text-white/60"
                  >
                    Discard
                  </button>
                </div>
              )}
            </>
          )}

          {/* Template swap for verbatim hooks */}
          {showScroller && isVerbatim && verbatimTemplateOptions.length > 1 && (
            <TemplateSwap
              templates={verbatimTemplateOptions}
              currentIndex={templateIndex}
              onIndexChange={handleTemplateSwap}
              isLoading={isSwappingTemplate}
            />
          )}
        </div>

        {/* ✨ Generate Benefit Lines — shown for eligible hooks after script is generated */}
        {showScroller && showBenefitLinesButton && !isEditing && (
          <div className="space-y-3">
            {/* Button */}
            {!benefitLines && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateBenefitLines(displayScript.fullScript)}
                disabled={isGeneratingBenefitLines}
                className="w-full bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 hover:border-purple-500/50 h-9"
              >
                {isGeneratingBenefitLines ? (
                  <><RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" /> Generating benefit lines...</>
                ) : (
                  <><Sparkles className="w-3.5 h-3.5 mr-2" /> ✨ Generate Benefit Lines</>
                )}
              </Button>
            )}

            {/* Benefit lines panel */}
            {benefitLines && (
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-purple-400/70 uppercase tracking-widest">✨ Benefit Lines</p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGenerateBenefitLines(displayScript.fullScript)}
                      disabled={isGeneratingBenefitLines}
                      className="text-white/30 hover:text-purple-300 h-6 px-2 text-[10px]"
                    >
                      <RefreshCw className={`w-3 h-3 mr-1 ${isGeneratingBenefitLines ? 'animate-spin' : ''}`} /> Regenerate
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(benefitLines.formattedBlock, 'Benefit lines copied!')}
                      className="text-white/30 hover:text-purple-300 h-6 px-2 text-[10px]"
                    >
                      <Copy className="w-3 h-3 mr-1" /> Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBenefitLines(null)}
                      className="text-white/20 hover:text-white/50 h-6 px-2 text-[10px]"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Individual lines */}
                <div className="space-y-1.5">
                  {benefitLines.lines.map((line, i) => (
                    <div key={i} className="flex items-start gap-2 group">
                      <span className="text-purple-400/40 text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                      <p className="text-sm text-white/80 font-mono leading-relaxed flex-1">{line}</p>
                      <button
                        onClick={() => copyToClipboard(line, 'Line copied!')}
                        className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-purple-300 transition-opacity flex-shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Insert note */}
                <p className="text-[10px] text-purple-400/50 italic">{benefitLines.insertNote}</p>

                {/* Insert into script button */}
                {!benefitLinesInserted ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      // Update the generatedScript with the updatedScript that has benefit lines injected
                      if (generatedScript) {
                        setGeneratedScript({ ...generatedScript, fullScript: benefitLines.updatedScript });
                        setBenefitLinesInserted(true);
                        toast.success('Benefit lines inserted into script!');
                      }
                    }}
                    className="w-full bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 h-8 text-xs"
                  >
                    <Zap className="w-3 h-3 mr-1.5" /> Insert into Script
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                    <span className="text-[10px] text-teal-300 flex-1">✓ Benefit lines inserted into script above</span>
                    <button
                      onClick={() => {
                        if (generatedScript) {
                          setGeneratedScript({ ...generatedScript, fullScript: benefitLines.updatedScript });
                        }
                      }}
                      className="text-[10px] text-teal-300/60 hover:text-teal-300 underline"
                    >
                      Re-insert
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Breakdown — with line scroller for hybrid/assembly */}
        {showScroller && !isVerbatim && lineOptions ? (
          <div className="grid grid-cols-1 gap-3">
            {lineOptions.textHooks.length > 0 && (
              <LineScroller
                label="📱 Text Hook (on screen)"
                lines={lineOptions.textHooks}
                currentIndex={scrollerIndexes.textHook}
                onIndexChange={i => setScrollerIndexes(prev => ({ ...prev, textHook: i }))}
                color="amber"
              />
            )}
            {lineOptions.verbalHooks.length > 0 && (
              <LineScroller
                label="🎤 Verbal Hook (spoken)"
                lines={lineOptions.verbalHooks}
                currentIndex={scrollerIndexes.verbalHook}
                onIndexChange={i => setScrollerIndexes(prev => ({ ...prev, verbalHook: i }))}
                color="amber"
              />
            )}
            {lineOptions.dealRevealOpeners.length > 0 && (
              <LineScroller
                label="💰 Deal Reveal"
                lines={lineOptions.dealRevealOpeners}
                currentIndex={scrollerIndexes.dealReveal}
                onIndexChange={i => setScrollerIndexes(prev => ({ ...prev, dealReveal: i }))}
                color="orange"
              />
            )}
            {lineOptions.howToLines.length > 0 && (
              <LineScroller
                label="👆 How To Claim"
                lines={lineOptions.howToLines}
                currentIndex={scrollerIndexes.howTo}
                onIndexChange={i => setScrollerIndexes(prev => ({ ...prev, howTo: i }))}
                color="orange"
              />
            )}
            {lineOptions.urgencyCloses.length > 0 && (
              <LineScroller
                label="⏰ Urgency Close"
                lines={lineOptions.urgencyCloses}
                currentIndex={scrollerIndexes.urgencyClose}
                onIndexChange={i => setScrollerIndexes(prev => ({ ...prev, urgencyClose: i }))}
                color="red"
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: '📱 Text Hook (on screen)', value: script.textHook, color: 'border-amber-500/20' },
              { label: '🎤 Verbal Hook (spoken)', value: script.verbalHook, color: 'border-amber-500/20' },
              { label: '💰 Deal Reveal', value: script.dealReveal, color: 'border-orange-500/20' },
              { label: '👆 How To Claim', value: script.howTo, color: 'border-orange-500/20' },
              { label: '⏰ Urgency Close', value: script.urgencyClose, color: 'border-red-500/20' },
            ].map(({ label, value, color }) => value ? (
              <div key={label} className={`bg-white/3 rounded-lg border ${color} p-3`}>
                <p className="text-[10px] text-white/40 mb-1.5">{label}</p>
                <p className="text-sm text-white/80">{value}</p>
              </div>
            ) : null)}
          </div>
        )}
      </div>
    );
  };

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">
      {/* Top Nav */}
      <header className="border-b border-white/10 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30 bg-[#0a0f1e]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white font-mono">ShopScript</h1>
            <p className="text-[10px] text-white/40 tracking-widest uppercase hidden sm:block">BOF TikTok Shop Generator</p>
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
            <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span className="hidden sm:inline">Shop</span>Script
            </button>
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
          {/* Product Library button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setProductLibraryOpen(true)}
            className="text-white/60 hover:text-amber-300 gap-1.5 text-xs"
            title="Product Library"
          >
            <Package className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Products</span>
          </Button>
          {/* Script History button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScriptHistoryOpen(true)}
            className="text-white/60 hover:text-amber-300 gap-1.5 text-xs"
            title="Script History"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
          </Button>
          {/* Sign In button when not authenticated */}
          {!isAuthenticated && (
            <a
              href={getLoginUrl()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </a>
          )}
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#0d1426] border-r border-white/10 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">ShopScript</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Slide-in panels */}
      <ProductLibraryPanel
        isOpen={productLibraryOpen}
        onClose={() => setProductLibraryOpen(false)}
        onSelect={handleProductSelect}
      />
      <ScriptHistoryPanel
        isOpen={scriptHistoryOpen}
        onClose={() => setScriptHistoryOpen(false)}
      />

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-49px)]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-[#0d1426] border-r border-white/10 flex-shrink-0 overflow-y-auto">
          <SidebarContent />
        </aside>

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 space-y-6">

            {/* Selected hook info — single mode only */}
            {bofMode === 'single' && selectedHook && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="text-base font-bold text-amber-200">{selectedHook.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${TIER_LABELS[selectedHook.tier].color}`}>
                        {TIER_LABELS[selectedHook.tier].label}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded border bg-white/5 text-white/40 border-white/10">
                        {selectedHook.format}
                      </span>
                      <span className="text-[10px] text-white/30">Confirmed {selectedHook.lastConfirmed}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/50 mb-2">{selectedHook.psychMechanism}</p>
                <div className="bg-black/20 rounded-lg p-3 font-mono text-xs text-white/60 whitespace-pre-wrap leading-relaxed">
                  {selectedHook.replicationTemplate}
                </div>
                {selectedHook.notes && (
                  <p className="text-[10px] text-amber-400/60 mt-2 flex items-start gap-1.5">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {selectedHook.notes}
                  </p>
                )}
              </div>
            )}

            {/* Batch mode header */}
            {bofMode === 'batch' && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <h2 className="text-base font-bold text-amber-200 mb-1">6-Video Testing Sequence</h2>
                <p className="text-xs text-white/50">
                  Generates all 6 testing scripts in one shot — different hooks, formats, and coupon placements.
                  Film all 6 in one session, post across 24–48 hours, and track by video number.
                </p>
              </div>
            )}

            {/* Product & Deal Inputs */}
            <div className="bg-[#0d1426] rounded-xl border border-white/10 p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">Product & Deal Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProductLibraryOpen(true)}
                  className="text-amber-400/60 hover:text-amber-300 text-[10px] h-6 px-2 gap-1"
                >
                  <Package className="w-3 h-3" /> From Library
                </Button>
              </div>

              {/* Product name */}
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Product Name *</label>
                <Input
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="e.g. Physician's Choice Gut Guardian 3-Pack"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-amber-500/50"
                />
              </div>

              {/* Product description — shown for benefit-lines-eligible hooks */}
              {showBenefitLinesButton && (
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">
                    Product Description <span className="text-white/30">(optional — paste TikTok Shop listing for better benefit lines)</span>
                  </label>
                  <textarea
                    value={productDescription}
                    onChange={e => setProductDescription(e.target.value)}
                    placeholder="Paste the product listing here — include all items in the bundle and key ingredients. The AI uses this to generate accurate benefit lines."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-amber-500/50 rounded-md px-3 py-2 text-sm resize-none outline-none"
                  />
                </div>
              )}

              {/* Key benefit / proof — shown automatically for BOF+ hooks */}
              {(isBofPlus || bofMode === 'batch') && (
                <div className="border border-orange-500/20 rounded-lg p-3 bg-orange-500/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded border bg-orange-500/20 text-orange-300 border-orange-500/30 font-medium">BOF+</span>
                    <label className="text-xs text-white/60 font-medium">
                      {bofMode === 'batch' ? 'Key Feature or Benefit (optional)' : 'Key Feature or Benefit *'}
                    </label>
                  </div>
                  <Input
                    value={keyBenefit}
                    onChange={e => setKeyBenefit(e.target.value)}
                    placeholder={selectedHook?.id === 'returning-this'
                      ? 'e.g. Blue: gut + skin, Green: no bloat, Pink: digestive enzymes'
                      : selectedHook?.id === 'bundle-motherload'
                      ? 'e.g. body wash (glycerin), body cream (banana flower), deodorant (mandelic acid)'
                      : 'e.g. covers acne scars in one swipe, SPF 50, skin tint finish'
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-orange-500/50"
                  />
                  <p className="text-[10px] text-white/30 mt-1.5">
                    {selectedHook?.id === 'bundle-motherload' || selectedHook?.id === 'returning-this'
                      ? 'List each item with one benefit — the script will walk through them one by one.'
                      : 'One proof point shown on camera. The script will weave it between the deal reveal and the close.'
                    }
                  </p>
                </div>
              )}

              {/* Deal types */}
              <div>
                <label className="text-xs text-white/50 mb-2 block">Active Deal Types *</label>
                <div className="flex flex-wrap gap-2">
                  {BOF_DEAL_TYPES.map(deal => (
                    <Tooltip key={deal.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => toggleDealType(deal.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            dealTypes.includes(deal.id)
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                              : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60 hover:border-white/20'
                          }`}
                        >
                          {deal.label}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{deal.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>

              {/* Creator code — shown when selected */}
              {dealTypes.includes('creator-code') && (
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Creator Code</label>
                  <Input
                    value={creatorCode}
                    onChange={e => setCreatorCode(e.target.value)}
                    placeholder="e.g. PHYS100"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-amber-500/50"
                  />
                </div>
              )}

              {/* Quantity unlock — shown when selected */}
              {dealTypes.includes('quantity-unlock') && (
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Quantity to Unlock</label>
                  <Input
                    value={quantityUnlock}
                    onChange={e => setQuantityUnlock(e.target.value)}
                    placeholder="e.g. 3 bottles"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-amber-500/50"
                  />
                </div>
              )}

              {/* Price anchor — optional */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Retail Price (optional)</label>
                  <Input
                    value={retailPrice}
                    onChange={e => setRetailPrice(e.target.value)}
                    placeholder="e.g. 49.99"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Deal Price (optional)</label>
                  <Input
                    value={dealPrice}
                    onChange={e => setDealPrice(e.target.value)}
                    placeholder="e.g. 19.99"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* Deal deadline */}
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Deal Deadline</label>
                <Input
                  value={dealDeadline}
                  onChange={e => setDealDeadline(e.target.value)}
                  placeholder="e.g. tonight, Sunday, 24 hours"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-amber-500/50"
                />
              </div>

              {/* ── Creator Voice Selector ── */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Users className="w-3 h-3 text-white/40" />
                  <label className="text-xs text-white/50">Creator Voice</label>
                </div>
                <div className="flex gap-2">
                  {CREATOR_VOICE_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setCreatorVoice(opt.id)}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium border transition-all text-center ${
                        creatorVoice === opt.id
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60 hover:border-white/20'
                      }`}
                    >
                      <span className="block font-semibold">{opt.label}</span>
                      <span className="block text-[9px] opacity-60 mt-0.5">{opt.sub}</span>
                    </button>
                  ))}
                </div>
                {/* Mix voices toggle — batch mode only */}
                {bofMode === 'batch' && (
                  <button
                    onClick={() => setMixVoicesInSequence(prev => !prev)}
                    className={`mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs border transition-all ${
                      mixVoicesInSequence
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-white/3 border-white/10 text-white/30 hover:text-white/50'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                      mixVoicesInSequence ? 'bg-amber-500 border-amber-500' : 'border-white/20'
                    }`}>
                      {mixVoicesInSequence && <span className="text-black text-[8px] font-bold">✓</span>}
                    </div>
                    Mix voices across sequence (alternates @faith and @dealscope per video)
                  </button>
                )}
              </div>

              {/* Generate buttons */}
              <div className="flex gap-3 pt-1">
                {bofMode === 'single' ? (
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                  >
                    {isGenerating ? (
                      <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                    ) : (
                      <><Zap className="w-4 h-4 mr-2" /> Generate Script</>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleBatchGenerate}
                    disabled={isGeneratingBatch}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                  >
                    {isGeneratingBatch ? (
                      <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating 6 Scripts...</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" /> Generate 6-Video Sequence</>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Single script output */}
            {generatedScript && bofMode === 'single' && (
              <div className="space-y-4">
                {/* Main script card */}
                <div className="bg-[#0d1426] rounded-xl border border-amber-500/20 p-5">
                  <h3 className="text-xs font-semibold text-amber-400/60 uppercase tracking-widest mb-4">Generated Script</h3>
                  <ScriptOutput script={generatedScript} showScroller={true} />
                </div>

                {/* A/B/C Variant Panel */}
                <div className="bg-[#0d1426] rounded-xl border border-orange-500/20 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs font-semibold text-orange-400/80 uppercase tracking-widest">A/B/C Hook + CTA Variants</p>
                      <p className="text-[10px] text-white/30 mt-0.5">3 different hook + closing combos — same deal reveal &amp; how-to</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {abTestResult && (
                        <button
                          onClick={() => setAbViewMode(prev => prev === 'tabs' ? 'sidebyside' : 'tabs')}
                          className="text-[10px] text-white/30 hover:text-orange-300 transition-colors px-2 py-1 rounded border border-white/10 hover:border-orange-500/30"
                        >
                          {abViewMode === 'tabs' ? '⊞ Side by Side' : '⊟ Tabs'}
                        </button>
                      )}
                      <Button
                        size="sm"
                        onClick={handleGenerateVariants}
                        disabled={isGeneratingVariants}
                        className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shrink-0"
                      >
                        {isGeneratingVariants
                          ? <><RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />Generating...</>
                          : <><Sparkles className="w-3.5 h-3.5 mr-1.5" />Generate Variants</>}
                      </Button>
                    </div>
                  </div>

                  {!abTestResult && !isGeneratingVariants && (
                    <div className="text-center py-6 text-white/20 text-xs">
                      <p>Generate 3 variants to find the hook + close combo that fits your voice best.</p>
                      <p className="mt-1 text-white/15">Variant A = @momfindsbyfaith voice &nbsp;·&nbsp; Variant B = @dealscope voice &nbsp;·&nbsp; Variant C = best fit</p>
                    </div>
                  )}

                  {isGeneratingVariants && (
                    <div className="text-center py-6 text-orange-400/60 text-xs animate-pulse">
                      Building 3 hook + CTA combos from the line bank...
                    </div>
                  )}

                  {abTestResult && (
                    <>
                      {/* ── TABS VIEW ── */}
                      {abViewMode === 'tabs' && (
                        <div className="space-y-4">
                          <div className="flex gap-1 p-1 rounded-lg bg-black/30 border border-white/10">
                            {(['A', 'B', 'C'] as const).map(v => {
                              const variant = abTestResult.variants.find(vr => vr.label === v);
                              return (
                                <button
                                  key={v}
                                  onClick={() => setActiveVariant(v)}
                                  className={`flex-1 py-2.5 rounded-md text-xs font-bold transition-all ${
                                    activeVariant === v
                                      ? 'bg-orange-500/25 text-orange-300 border border-orange-500/40'
                                      : 'text-white/40 hover:text-white/60'
                                  }`}
                                >
                                  Variant {v}
                                  {variant && (
                                    <span className="block text-[9px] font-normal mt-0.5 opacity-60 truncate px-1">
                                      {v === 'A' ? 'Faith voice' : v === 'B' ? 'Dealscope voice' : 'Best fit'}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {(() => {
                            const variant = abTestResult.variants.find(v => v.label === activeVariant);
                            if (!variant) return null;
                            return (
                              <div className="space-y-3">
                                <div className="grid grid-cols-1 gap-2">
                                  <div className="rounded-lg border border-orange-500/30 bg-orange-500/8 p-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="text-[10px] font-semibold text-orange-400 uppercase tracking-widest">📱 Text Hook — Variant {activeVariant}</p>
                                      <button onClick={() => copyToClipboard(variant.textHook, `Variant ${activeVariant} text hook copied!`)} className="text-white/20 hover:text-white/60 transition-colors">
                                        <Copy className="w-3 h-3" />
                                      </button>
                                    </div>
                                    <p className="text-sm text-orange-200 font-mono leading-relaxed">{variant.textHook}</p>
                                  </div>
                                  <div className="rounded-lg border border-orange-500/30 bg-orange-500/8 p-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="text-[10px] font-semibold text-orange-400 uppercase tracking-widest">🎤 Verbal Hook — Variant {activeVariant}</p>
                                      <button onClick={() => copyToClipboard(variant.verbalHook, `Variant ${activeVariant} verbal hook copied!`)} className="text-white/20 hover:text-white/60 transition-colors">
                                        <Copy className="w-3 h-3" />
                                      </button>
                                    </div>
                                    <p className="text-sm text-orange-200 font-mono leading-relaxed">{variant.verbalHook}</p>
                                  </div>
                                  <div className="rounded-lg border border-red-500/30 bg-red-500/8 p-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="text-[10px] font-semibold text-red-400 uppercase tracking-widest">⏰ Urgency Close — Variant {activeVariant}</p>
                                      <button onClick={() => copyToClipboard(variant.urgencyClose, `Variant ${activeVariant} close copied!`)} className="text-white/20 hover:text-white/60 transition-colors">
                                        <Copy className="w-3 h-3" />
                                      </button>
                                    </div>
                                    <p className="text-sm text-red-200 font-mono leading-relaxed">{variant.urgencyClose}</p>
                                  </div>
                                </div>
                                {variant.rationale && (
                                  <p className="text-[10px] text-white/30 italic px-1">{variant.rationale}</p>
                                )}
                                <ScriptOutput
                                  script={variant as any}
                                  variantLabel={variant.label}
                                />
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* ── SIDE BY SIDE VIEW ── */}
                      {abViewMode === 'sidebyside' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {abTestResult.variants.map(variant => (
                            <div key={variant.label} className="rounded-xl border border-orange-500/20 bg-black/20 p-3 flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-orange-300">Variant {variant.label}</span>
                                <span className="text-[9px] text-white/25">
                                  {variant.label === 'A' ? 'Faith voice' : variant.label === 'B' ? 'Dealscope voice' : 'Best fit'}
                                </span>
                              </div>
                              {/* Text hook */}
                              <div className="rounded-lg bg-orange-500/8 border border-orange-500/20 p-2">
                                <p className="text-[9px] text-orange-400/50 mb-1">📱 Text Hook</p>
                                <p className="text-xs text-orange-200 font-mono leading-relaxed">{variant.textHook}</p>
                              </div>
                              {/* Verbal hook */}
                              <div className="rounded-lg bg-orange-500/8 border border-orange-500/20 p-2">
                                <p className="text-[9px] text-orange-400/50 mb-1">🎤 Verbal Hook</p>
                                <p className="text-xs text-orange-200 font-mono leading-relaxed">{variant.verbalHook}</p>
                              </div>
                              {/* Urgency close */}
                              <div className="rounded-lg bg-red-500/8 border border-red-500/20 p-2">
                                <p className="text-[9px] text-red-400/50 mb-1">⏰ Urgency Close</p>
                                <p className="text-xs text-red-200 font-mono leading-relaxed">{variant.urgencyClose}</p>
                              </div>
                              {/* Full script with edit support */}
                              <div className="flex-1">
                                <ScriptOutput
                                  script={variant as any}
                                  variantLabel={variant.label}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Batch output */}
            {batchResults.length > 0 && bofMode === 'batch' && (
              <div className="bg-[#0d1426] rounded-xl border border-amber-500/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold text-amber-400/60 uppercase tracking-widest">6-Video Testing Sequence</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const allScripts = batchResults
                        .map(r => `=== VIDEO ${r.position}: ${r.hookName} (${r.format}) ===\n\n${r.script.fullScript}`)
                        .join('\n\n---\n\n');
                      copyToClipboard(allScripts, 'All 6 scripts copied!');
                    }}
                    className="text-white/40 hover:text-amber-300 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy All 6
                  </Button>
                </div>
                <Accordion type="single" collapsible value={expandedBatch || undefined} onValueChange={v => setExpandedBatch(v)}>
                  {batchResults.map(result => (
                    <AccordionItem key={result.position} value={`pos-${result.position}`} className="border-white/10">
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-3 text-left">
                          <span className="text-amber-400 font-bold text-sm w-6">#{result.position}</span>
                          <span className="text-sm font-medium text-white/80">{result.hookName}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            result.format === 'BOF+'
                              ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}>
                            {result.format}
                          </span>
                          {result.includedCouponLanguage && (
                            <span className="text-[9px] text-yellow-400/60">+ coupon</span>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <div className="flex items-center justify-between mb-3">
                          <ScriptOutput script={result.script} />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveScript(result.script, result.hookName)}
                          className="text-white/30 hover:text-amber-300 text-xs mt-2"
                        >
                          <BookMarked className="w-3 h-3 mr-1" /> Save Script #{result.position}
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
