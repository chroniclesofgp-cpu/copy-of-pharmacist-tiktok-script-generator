/**
 * PHARMACIST TIKTOK SCRIPT GENERATOR — RxContent
 * Design: Clinical Command Center
 * Colors: Deep Navy bg, Electric Teal accents, White text
 * Responsive: Desktop = 2-col sidebar layout | Mobile = hamburger drawer + stacked layout
 */

import { useState, useCallback, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  HOOKS,
  PSYCH_TRIGGERS,
  COMPLIANCE_RULES,
  INTRO_PHRASES,
  generateScript,
  type GeneratedScript,
  type IterationLevel,
  type ProductInputs,
  type IntroPhrase,
} from '@/lib/scriptData';
import { useSavedScripts } from '@/contexts/SavedScriptsContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import type { TranscribeResult, RewriteResult, IterateResult, HookVariant, ABVariantsResult, BatchGenerateResult, Citation, GeneratedVisual, ScriptBrief } from '../../../server/routers/tiktok';
import { TranscriptionLoading, RewriteLoading, IterateLoading } from '@/components/TranscriptionLoading';
import { ProductLibrary } from '@/components/ProductLibrary';
import type { ProductProfile } from '@/lib/productLibrary';
import {
  Pill,
  Zap,
  Copy,
  RefreshCw,
  ExternalLink,
  FlaskConical,
  GitBranch,
  Wand2,
  Info,
  ShieldCheck,
  BookMarked,
  Link2,
  Star,
  AlertTriangle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Sparkles,
  Clock,
  BookOpen,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Brain,
  Pencil,
  Check,
  ClipboardCheck,
  AlertCircle,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Mode = 'generate' | 'clone' | 'iterate';
type CloneTab = 'transcript' | 'rewrite';

export default function Home() {
  const { saveScript } = useSavedScripts();
  const { user } = useAuth();  // Used for vault-linked generation

  const [mode, setMode] = useState<Mode>('generate');
  const [selectedHookId, setSelectedHookId] = useState<string>('after-1-month');

  // Mobile sidebar state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Product inputs (shared across modes)
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [keyBenefit, setKeyBenefit] = useState('');
  const [productLink, setProductLink] = useState('');

  // Settings
  const [useMisdirection, setUseMisdirection] = useState(false);
  const [introPhrase, setIntroPhrase] = useState<IntroPhrase | 'none'>('none');
  const [bannedWordsInput, setBannedWordsInput] = useState('');
  const [showCompliance, setShowCompliance] = useState(false);
  const [showWordFilter, setShowWordFilter] = useState(false);

  // Generate mode output
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Clone mode state
  const [cloneVideoUrl, setCloneVideoUrl] = useState('');
  const [cloneTranscript, setCloneTranscript] = useState<TranscribeResult | null>(null);
  const [cloneRewrite, setCloneRewrite] = useState<RewriteResult | null>(null);
  const [cloneTab, setCloneTab] = useState<CloneTab>('transcript');
  const [activeHookIndex, setActiveHookIndex] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);

  // Iterate mode state
  const [iterateVideoUrl, setIterateVideoUrl] = useState('');
  const [iterateTranscript, setIterateTranscript] = useState<TranscribeResult | null>(null);
  const [iterateResult, setIterateResult] = useState<IterateResult | null>(null);
  const [activeIterateLevel, setActiveIterateLevel] = useState<IterationLevel>('70');
  const [isIterateTranscribing, setIsIterateTranscribing] = useState(false);
  const [isIterating, setIsIterating] = useState(false);

  // Inline editing state
  const [editingTranscript, setEditingTranscript] = useState(false);
  const [transcriptEditText, setTranscriptEditText] = useState('');
  const [editingRewrite, setEditingRewrite] = useState(false);
  const [rewriteEditText, setRewriteEditText] = useState('');
  const [editingIterate, setEditingIterate] = useState(false);
  const [iterateEditText, setIterateEditText] = useState('');
  const [editingGenerate, setEditingGenerate] = useState(false);
  const [generateEditText, setGenerateEditText] = useState('');
  // Per-section inline editing state
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sectionEditText, setSectionEditText] = useState('');
  // Medication Side Effect hook fields
  const [medicationName, setMedicationName] = useState('');
  const [medicationSubType, setMedicationSubType] = useState<'nutrient-depletion' | 'known-side-effect' | 'drug-interaction'>('nutrient-depletion');

  // Smart hook suggestions — tracks which product is selected from the library
  const [selectedProduct, setSelectedProduct] = useState<ProductProfile | null>(null);

  // Upgrade 1: Vault product connection
  const [selectedVaultId, setSelectedVaultId] = useState<number | undefined>(undefined);

  // Upgrade 2: Citations from last generation
  const [generatedCitations, setGeneratedCitations] = useState<Citation[]>([]);
  const [showCitations, setShowCitations] = useState(false);
  const [generatedScriptBrief, setGeneratedScriptBrief] = useState<ScriptBrief | null>(null);
  const [isSavingBrief, setIsSavingBrief] = useState(false);
  const [briefSaved, setBriefSaved] = useState(false);

  // Upgrade 3: Generate Visuals
  const [generatedVisuals, setGeneratedVisuals] = useState<GeneratedVisual[]>([]);
  const [isGeneratingVisuals, setIsGeneratingVisuals] = useState(false);
  const [showVisuals, setShowVisuals] = useState(false);

  const selectedHook = HOOKS.find(h => h.id === selectedHookId);
  const tier1Hooks = HOOKS.filter(h => h.tier === 'tier1');
  const tier2Hooks = HOOKS.filter(h => h.tier === 'tier2');

  // Returns true if this hook is a top match for the currently selected product
  const isTopHook = (hookId: string) =>
    selectedProduct ? selectedProduct.topHooks.includes(hookId) : false;
  // Returns true if any product is selected AND this hook is NOT a top match
  const isDimmedHook = (hookId: string) =>
    selectedProduct !== null && !selectedProduct.topHooks.includes(hookId);

  const getBannedWords = () => bannedWordsInput.split(',').map(w => w.trim()).filter(Boolean);

  // A/B Variants state
  const [abVariants, setAbVariants] = useState<ABVariantsResult | null>(null);
  const [scriptReview, setScriptReview] = useState<{
    overallScore: 'pass' | 'needs_work' | 'major_issues';
    totalWordCount: number;
    estimatedSeconds: number;
    flags: Array<{ section: string; severity: 'warning' | 'info'; issue: string; suggestion: string }>;
    summary: string;
  } | null>(null);
  const [isReviewingScript, setIsReviewingScript] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [activeAbVariant, setActiveAbVariant] = useState<'A' | 'B' | 'C'>('A');
  const [isGeneratingAB, setIsGeneratingAB] = useState(false);

  // Batch Generation state
  const [batchResults, setBatchResults] = useState<BatchGenerateResult[] | null>(null);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);
  const [expandedBatchHook, setExpandedBatchHook] = useState<string | null>(null);

  // tRPC mutations
  const transcribeMutation = trpc.tiktok.transcribe.useMutation();
  const rewriteMutation = trpc.tiktok.rewrite.useMutation();
  const iterateMutation = trpc.tiktok.iterate.useMutation();
  const abVariantsMutation = trpc.tiktok.generateABVariants.useMutation();
  const batchGenerateMutation = trpc.tiktok.batchGenerate.useMutation();
  const generateCaptionMutation = trpc.tiktok.generateCaption.useMutation();
  const generateSingleMutation = trpc.tiktok.generateSingle.useMutation();
  const reviewScriptMutation = trpc.tiktok.reviewScript.useMutation();
  const generateVisualsMutation = trpc.tiktok.generateVisuals.useMutation();
  const saveScriptBriefMutation = trpc.vetting.saveScriptBrief.useMutation();
  // Caption & Hashtag state
  type CaptionResult = { captionLine1: string; captionLine2: string; hashtags: string[] };
  const [generateCaption, setGenerateCaption] = useState<CaptionResult | null>(null);
  const [cloneCaption, setCloneCaption] = useState<CaptionResult | null>(null);
  const [iterateCaption, setIterateCaption] = useState<CaptionResult | null>(null);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState<'generate' | 'clone' | 'iterate' | null>(null);

  // ── URL Param Pre-Population (from Vet Product "Use Hook" button) ──────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hookParam = params.get('hook');
    const productParam = params.get('product');
    const linkParam = params.get('link');
    const benefitParam = params.get('keyBenefit');
    if (hookParam) setSelectedHookId(hookParam);
    if (productParam) setProductName(productParam);
    if (linkParam) setProductLink(linkParam);
    if (benefitParam) setKeyBenefit(benefitParam);
    // Clear params from URL without reload
    if (hookParam || productParam || linkParam || benefitParam) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // ── Caption Generator ───────────────────────────────────────────────────────
  const handleGenerateCaption = useCallback(async (
    mode: 'generate' | 'clone' | 'iterate',
    script: string,
    hookName: string,
  ) => {
    const pName = productName.trim() || 'this product';
    // Extract brand from product name (first word) or use product name
    const brand = pName.split(' ')[0];
    const benefit = keyBenefit.trim() || 'health benefits';
    setIsGeneratingCaption(mode);
    try {
      const result = await generateCaptionMutation.mutateAsync({
        productName: pName,
        brandName: brand,
        keyBenefit: benefit,
        hookType: hookName,
        script,
      });
      if (mode === 'generate') setGenerateCaption(result);
      else if (mode === 'clone') setCloneCaption(result);
      else setIterateCaption(result);
    } catch {
      toast.error('Failed to generate caption. Please try again.');
    } finally {
      setIsGeneratingCaption(null);
    }
  }, [productName, keyBenefit, generateCaptionMutation]);

  // ── Generate Mode ─────────────────────────────────────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (!productName.trim()) { toast.error('Please enter a product name'); return; }
    setIsGenerating(true);
    // Reset visuals/citations from previous run
    setGeneratedVisuals([]);
    setShowVisuals(false);
    setGeneratedCitations([]);
    setShowCitations(false);
    setBriefSaved(false);
    setGeneratedScriptBrief(null);
    try {
      const phrase = introPhrase !== 'none' ? introPhrase : undefined;
      const result = await generateSingleMutation.mutateAsync({
        hookId: selectedHookId,
        hookName: selectedHook?.name || selectedHookId,
        productName,
        productDescription: productDescription || undefined,
        keyBenefit: keyBenefit || undefined,
        productLink: productLink || undefined,
        useMisdirection,
        bannedWords: getBannedWords(),
        introPhrase: phrase,
        vaultProductId: selectedVaultId,
        userId: user?.id,
      });
      setGeneratedScript(result);
      // Capture citations and script brief
      if (result.citations && result.citations.length > 0) {
        setGeneratedCitations(result.citations);
      }
      if (result.scriptBrief) {
        setGeneratedScriptBrief(result.scriptBrief);
      }
      if (result.complianceHardFlags.length > 0) {
        toast.warning(`${result.complianceHardFlags.length} hard violation(s) detected — review before posting.`);
      } else if (result.complianceSoftFlags.length > 0) {
        toast.success(`Script generated! ${result.complianceSoftFlags.length} soft caution(s) noted — nothing to worry about.`);
      } else {
        toast.success('Script generated!');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Generation failed. Please try again.');
    }
    setIsGenerating(false);
  }, [productName, productDescription, keyBenefit, productLink, selectedHookId, selectedHook, useMisdirection, introPhrase, bannedWordsInput, generateSingleMutation, selectedVaultId]);

  // ── Generate Visuals ─────────────────────────────────────────────────────────────────────────────
  const handleGenerateVisuals = useCallback(async () => {
    if (!generatedScript) return;
    setIsGeneratingVisuals(true);
    try {
      const result = await generateVisualsMutation.mutateAsync({
        productName,
        hookId: selectedHookId,
        fullScript: generatedScript.fullScript,
        citations: generatedCitations.length > 0 ? generatedCitations : undefined,
        mechanism: generatedScriptBrief?.mechanism,
        gap: generatedScriptBrief?.gap,
        differentiator: generatedScriptBrief?.differentiator,
      });
      setGeneratedVisuals(result.visuals);
      setShowVisuals(true);
      toast.success(`${result.visuals.length} visual${result.visuals.length > 1 ? 's' : ''} generated!`);
    } catch (err: any) {
      toast.error(err?.message || 'Visual generation failed. Please try again.');
    }
    setIsGeneratingVisuals(false);
  }, [generatedScript, productName, selectedHookId, generatedCitations, generatedScriptBrief, generateVisualsMutation]);

  // ── Save Script Brief to Vault ─────────────────────────────────────────────────────────────
  const handleSaveScriptBrief = useCallback(async () => {
    if (!generatedScriptBrief || !selectedVaultId) return;
    setIsSavingBrief(true);
    try {
      await saveScriptBriefMutation.mutateAsync({
        vaultItemId: selectedVaultId,
        scriptBrief: generatedScriptBrief,
      });
      setBriefSaved(true);
      toast.success('Research brief saved to vault!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save brief. Please try again.');
    }
    setIsSavingBrief(false);
  }, [generatedScriptBrief, selectedVaultId, saveScriptBriefMutation]);

  // ── Clone Mode ─────────────────────────────────────────────────────────────────────────────
  const handleTranscribeClone = useCallback(async () => {
    if (!cloneVideoUrl.trim()) { toast.error('Please enter a TikTok video URL'); return; }
    setIsTranscribing(true);
    setCloneTranscript(null);
    setCloneRewrite(null);
    try {
      const result = await transcribeMutation.mutateAsync({ url: cloneVideoUrl });
      setCloneTranscript(result);
      setCloneTab('transcript');
      toast.success('Video transcribed! Review the script then click "Generate Pharmacist Rewrite".');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to transcribe video. Make sure it\'s a public TikTok URL.');
    }
    setIsTranscribing(false);
  }, [cloneVideoUrl]);

  const handleGenerateRewrite = useCallback(async () => {
    if (!cloneTranscript) { toast.error('Transcribe a video first'); return; }
    setIsRewriting(true);
    try {
      const result = await rewriteMutation.mutateAsync({
        transcript: cloneTranscript.fullTranscript,
        bannedWords: getBannedWords(),
        introPhrase: introPhrase !== 'none' ? INTRO_PHRASES[introPhrase].text : undefined,
        productName: productName.trim() || undefined,
        productDescription: productDescription.trim() || undefined,
        keyBenefit: keyBenefit.trim() || undefined,
      });
      setCloneRewrite(result);
      setActiveHookIndex(0);
      setCloneTab('rewrite');
      if (result.hardViolations && result.hardViolations.length > 0) {
        toast.warning(`${result.hardViolations.length} hard violation(s) found and corrected in your rewrite.`);
      } else if (result.softCautions && result.softCautions.length > 0) {
        toast.success(`Pharmacist rewrite ready! ${result.softCautions.length} soft caution(s) noted — nothing to worry about.`);
      } else {
        toast.success('Pharmacist rewrite ready! Original hook framework preserved.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to generate rewrite. Please try again.');
    }
    setIsRewriting(false);
  }, [cloneTranscript, bannedWordsInput]);

  const currentRewrite: HookVariant | undefined = cloneRewrite?.pharmacistRewrites[activeHookIndex];

  // ── Iterate Mode ───────────────────────────────────────────────────────────
  const handleTranscribeIterate = useCallback(async () => {
    if (!iterateVideoUrl.trim()) { toast.error('Please enter a TikTok video URL'); return; }
    setIsIterateTranscribing(true);
    setIterateTranscript(null);
    setIterateResult(null);
    try {
      const result = await transcribeMutation.mutateAsync({ url: iterateVideoUrl });
      setIterateTranscript(result);
      toast.success('Video transcribed! Now generate your 70/20/10 iterations.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to transcribe video. Make sure it\'s a public TikTok URL.');
    }
    setIsIterateTranscribing(false);
  }, [iterateVideoUrl]);

  const handleGenerateIterations = useCallback(async () => {
    if (!iterateTranscript) { toast.error('Transcribe a video first'); return; }
    setIsIterating(true);
    try {
      const result = await iterateMutation.mutateAsync({
        transcript: iterateTranscript.fullTranscript,
        bannedWords: getBannedWords(),
      });
      setIterateResult(result);
      setActiveIterateLevel('70');
      toast.success('All 3 iteration levels generated!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to generate iterations. Please try again.');
    }
    setIsIterating(false);
  }, [iterateTranscript, bannedWordsInput]);

  // ── Review Script ────────────────────────────────────────────────────────
  const handleReviewScript = useCallback(async () => {
    if (!generatedScript) { toast.error('Generate a script first'); return; }
    setIsReviewingScript(true);
    setShowReview(true);
    setScriptReview(null);
    try {
      const result = await reviewScriptMutation.mutateAsync({
        fullScript: editingGenerate ? generateEditText : generatedScript.fullScript,
        hookId: selectedHookId,
        hookName: selectedHook?.name || selectedHookId,
      });
      setScriptReview(result);
    } catch (err: any) {
      toast.error(err?.message || 'Review failed. Please try again.');
      setShowReview(false);
    }
    setIsReviewingScript(false);
  }, [generatedScript, editingGenerate, generateEditText, selectedHookId, selectedHook]);

  // ── A/B Variants ──────────────────────────────────────────────────────────
  const handleGenerateABVariants = useCallback(async () => {
    if (!generatedScript) { toast.error('Generate a script first'); return; }
    setIsGeneratingAB(true);
    try {
      const result = await abVariantsMutation.mutateAsync({
        hookId: selectedHookId,
        hookName: selectedHook?.name || selectedHookId,
        script: generatedScript.fullScript,
        productName: productName || undefined,
        keyBenefit: keyBenefit || undefined,
        bannedWords: getBannedWords(),
      });
      setAbVariants(result);
      setActiveAbVariant('A');
      toast.success('3 opening line variants generated!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to generate variants. Please try again.');
    }
    setIsGeneratingAB(false);
  }, [generatedScript, selectedHookId, selectedHook, productName, keyBenefit, bannedWordsInput]);

  // ── Batch Generation ───────────────────────────────────────────────────────
  const handleBatchGenerate = useCallback(async () => {
    if (!productName.trim()) { toast.error('Please enter a product name first'); return; }
    setIsGeneratingBatch(true);
    setBatchResults(null);
    try {
      const results = await batchGenerateMutation.mutateAsync({
        productName,
        productDescription: productDescription || undefined,
        keyBenefit: keyBenefit || undefined,
        productLink: productLink || undefined,
        useMisdirection,
        bannedWords: getBannedWords(),
      });
      setBatchResults(results);
      setExpandedBatchHook(results[0]?.hookId || null);
      toast.success(`${results.length} scripts generated for all hooks!`);
    } catch (err: any) {
      toast.error(err?.message || 'Batch generation failed. Please try again.');
    }
    setIsGeneratingBatch(false);
  }, [productName, productDescription, keyBenefit, productLink, useMisdirection, bannedWordsInput]);

  // ── Utilities ──────────────────────────────────────────────────────────────
  const copyToClipboard = (text: string, label = 'Copied!') => {
    navigator.clipboard.writeText(text).then(() => toast.success(label));
  };

  // Renders script text with [VISUAL: ...] cues styled distinctly from dialogue
  const renderScriptWithVisualCues = (text: string) => {
    const parts = text.split(/(\[VISUAL:[^\]]+\])/g);
    return (
      <span>
        {parts.map((part, i) => {
          if (part.startsWith('[VISUAL:') && part.endsWith(']')) {
            return (
              <span key={i} className="inline-flex items-center gap-1 mx-0.5 my-0.5 px-2 py-0.5 rounded bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[10px] font-semibold tracking-wide not-italic">
                <span className="text-teal-500/70">▶</span>
                {part.slice(1, -1)}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  // Renders the full script with inline section label badges.
  // Matches each section's first sentence in the full script and prepends a colored label.
  const renderScriptWithSectionLabels = (text: string, script: typeof generatedScript) => {
    if (!script) return renderScriptWithVisualCues(text);
    const sections: { key: string; label: string; color: string }[] = [
      { key: 'verbalHook', label: 'VERBAL HOOK', color: 'text-teal-400 bg-teal-500/15 border-teal-500/30' },
      { key: 'authorityPivot', label: 'AUTHORITY', color: 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30' },
      { key: 'problem', label: 'PROBLEM', color: 'text-amber-300 bg-amber-500/15 border-amber-500/30' },
      { key: 'mechanism', label: 'MECHANISM', color: 'text-purple-300 bg-purple-500/15 border-purple-500/30' },
      { key: 'misdirection', label: 'MISDIRECTION', color: 'text-rose-300 bg-rose-500/15 border-rose-500/30' },
      { key: 'cta', label: 'CTA', color: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' },
    ];
    // Build a map of insertion positions: find where each section text starts in the full script
    type Marker = { pos: number; label: string; color: string };
    const markers: Marker[] = [];
    for (const { key, label, color } of sections) {
      const value = (script as unknown as Record<string, string>)[key];
      if (!value || value.length < 8) continue;
      // Use the first 30 chars of the section value to locate it in the full script
      const snippet = value.slice(0, 30).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = text.search(new RegExp(snippet, 'i'));
      if (match >= 0) markers.push({ pos: match, label, color });
    }
    markers.sort((a, b) => a.pos - b.pos);
    if (markers.length === 0) return renderScriptWithVisualCues(text);
    // Split text at marker positions and interleave label badges
    const parts: React.ReactNode[] = [];
    let cursor = 0;
    for (const { pos, label, color } of markers) {
      if (pos > cursor) parts.push(<span key={`t-${cursor}`}>{renderScriptWithVisualCues(text.slice(cursor, pos))}</span>);
      parts.push(
        <span key={`m-${pos}`} className={`inline-flex items-center gap-1 mx-0.5 my-1 px-2 py-0.5 rounded border text-[9px] font-bold tracking-widest ${color}`}>
          {label}
        </span>
      );
      cursor = pos;
    }
    if (cursor < text.length) parts.push(<span key={`t-end`}>{renderScriptWithVisualCues(text.slice(cursor))}</span>);
    return <>{parts}</>;
  };

  const handleSaveScript = (content: string, hookName: string) => {
    if (!content) { toast.error('Nothing to save'); return; }
    saveScript({ productName: productName || 'Untitled', hookName, mode, content });
    toast.success('Script saved to your library!');
  };

  const modeConfig = {
    generate: {
      icon: <Wand2 className="w-4 h-4" />,
      label: 'Generate',
      color: 'text-teal-400',
      tooltip: 'Write a new script from scratch. Pick a hook framework, enter your product details, and get a full pharmacist-style TikTok script.',
    },
    clone: {
      icon: <FlaskConical className="w-4 h-4" />,
      label: 'Clone',
      color: 'text-purple-400',
      tooltip: 'Paste any TikTok video URL. The tool transcribes it word-for-word, then rewrites it in your voice across multiple hook frameworks.',
    },
    iterate: {
      icon: <GitBranch className="w-4 h-4" />,
      label: 'Iterate',
      color: 'text-amber-400',
      tooltip: 'Paste a winning video URL (yours or a competitor\'s). The tool generates all three iteration levels — 70% similar, 20% remixed, and 10% reimagined — in one click.',
    },
  };

  // ── Sidebar Content ────────────────────────────────────────────────────────
  const SidebarContent = () => (
    <>
      {/* Mode Selector */}
      <div className="p-4 border-b border-white/10">
        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Mode</p>
        <div className="flex flex-col gap-1.5">
          {(['generate', 'clone', 'iterate'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setMobileSidebarOpen(false); }}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === m
                  ? 'bg-teal-500/20 border border-teal-500/40 text-teal-300'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className={mode === m ? modeConfig[m].color : 'text-white/40'}>{modeConfig[m].icon}</span>
              <span className="flex-1 text-left">{modeConfig[m].label} Mode</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="ml-auto text-white/20 hover:text-white/60 transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[220px] text-xs leading-relaxed">
                  {modeConfig[m].tooltip}
                </TooltipContent>
              </Tooltip>
            </button>
          ))}
        </div>
      </div>

      {/* Hook Selector (Generate mode only) */}
      {mode === 'generate' && (
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Hook Library</p>

          <p className="text-[10px] text-teal-400/70 uppercase tracking-widest mb-2">Tier 1 — Heavy Hitters</p>
          {selectedProduct && (
            <p className="text-[10px] text-teal-400/60 mb-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block"></span>
              Best hooks for {selectedProduct.name} highlighted
            </p>
          )}
          <div className="flex flex-col gap-1 mb-4">
            {tier1Hooks.map(hook => (
              <button
                key={hook.id}
                onClick={() => { setSelectedHookId(hook.id); setMobileSidebarOpen(false); }}
                className={`text-left px-3 py-2 rounded-lg text-xs transition-all ${
                  selectedHookId === hook.id
                    ? 'bg-teal-500/20 border border-teal-500/40 text-teal-200'
                    : isDimmedHook(hook.id)
                    ? 'text-white/20 border border-transparent'
                    : isTopHook(hook.id)
                    ? 'text-teal-200 bg-teal-500/10 border border-teal-500/25 hover:bg-teal-500/20'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="flex items-center justify-between gap-1">
                  <span>{hook.name}</span>
                  {isTopHook(hook.id) && selectedHookId !== hook.id && (
                    <span className="flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded border bg-teal-500/20 text-teal-300 border-teal-500/30">
                      Best match
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>

          <p className="text-[10px] text-amber-400/70 uppercase tracking-widest mb-2">Tier 2 — Situational</p>
          <div className="flex flex-col gap-1">
            {tier2Hooks.map(hook => (
              <button
                key={hook.id}
                onClick={() => { setSelectedHookId(hook.id); setMobileSidebarOpen(false); }}
                className={`text-left px-3 py-2 rounded-lg text-xs transition-all ${
                  selectedHookId === hook.id
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                    : isDimmedHook(hook.id)
                    ? 'text-white/20 border border-transparent'
                    : isTopHook(hook.id)
                    ? 'text-teal-200 bg-teal-500/10 border border-teal-500/25 hover:bg-teal-500/20'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="flex items-center justify-between gap-1">
                  <span>{hook.name}</span>
                  {isTopHook(hook.id) && selectedHookId !== hook.id && (
                    <span className="flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded border bg-teal-500/20 text-teal-300 border-teal-500/30">
                      Best match
                    </span>
                  )}
                </span>
                {hook.conditions && <span className="block text-[10px] text-white/30 mt-0.5">Situational</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Panel */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => setShowCompliance(!showCompliance)}
          className="flex items-center justify-between w-full text-[10px] text-white/40 uppercase tracking-widest hover:text-white/60 transition-colors"
        >
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> TikTok Compliance</span>
          {showCompliance ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        {showCompliance && (
          <div className="mt-3 space-y-1.5">
            {COMPLIANCE_RULES.guidelines.slice(0, 5).map((g, i) => (
              <p key={i} className="text-[10px] text-white/40 leading-relaxed">• {g}</p>
            ))}
            <p className="text-[10px] text-teal-400/60 mt-2">Scripts are auto-checked against all rules.</p>
          </div>
        )}
      </div>
    </>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">
      {/* Top Nav */}
      <header className="border-b border-white/10 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30 bg-[#0a0f1e]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
            <Pill className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white font-mono">RxContent</h1>
            <p className="text-[10px] text-white/40 tracking-widest uppercase hidden sm:block">Pharmacist Script Generator</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Tool switcher — visible on all screen sizes */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
            <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
              <span className="hidden sm:inline">Rx</span>Content
            </button>
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

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#0d1426] border-r border-white/10 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Menu</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-53px)]">
        {/* LEFT SIDEBAR — Desktop only */}
        <aside className="hidden md:flex w-72 border-r border-white/10 flex-col overflow-y-auto bg-[#0d1426]">
          <SidebarContent />
        </aside>

        {/* MAIN PANEL */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-6">
            <div className="max-w-3xl mx-auto space-y-4 md:space-y-5">

              {/* Hook Info Card (Generate mode) */}
              {mode === 'generate' && selectedHook && (
                <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge className="text-[10px] bg-teal-500/20 text-teal-300 border-teal-500/30 hover:bg-teal-500/20">
                          {selectedHook.tier === 'tier1' ? 'Tier 1' : 'Tier 2'}
                        </Badge>
                        <h2 className="text-sm font-semibold text-white">{selectedHook.name}</h2>
                      </div>
                      <p className="text-xs text-white/50 mb-2">{selectedHook.bestFor}</p>
                      <div className="font-mono text-xs text-teal-300 bg-black/30 rounded px-3 py-2 border border-teal-500/20 break-words">
                        "{selectedHook.textHook}"
                      </div>
                    </div>
                    {selectedHook.exampleVideo && (
                      <a
                        href={selectedHook.exampleVideo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-center"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-white/50" />
                        <span className="text-[10px] text-white/50">{selectedHook.exampleVideo.creator}</span>
                        <span className="text-[10px] font-bold text-teal-400">{selectedHook.exampleVideo.views}</span>
                      </a>
                    )}
                  </div>
                  {selectedHook.conditions && (
                    <div className="mt-3 flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                      <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-300/80">{selectedHook.conditions}</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {selectedHook.psychTriggers.map(t => {
                      const trigger = PSYCH_TRIGGERS.find(pt => pt.label === t);
                      return (
                        <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full border ${trigger?.color || 'bg-white/10 text-white/50 border-white/10'}`}>
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mobile: Mode switcher pills */}
              <div className="flex md:hidden gap-2">
                {(['generate', 'clone', 'iterate'] as Mode[]).map(m => (
                  <Tooltip key={m}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setMode(m)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all border ${
                          mode === m
                            ? m === 'generate' ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                            : m === 'clone' ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                            : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-white/5 border-white/10 text-white/40'
                        }`}
                      >
                        <span>{modeConfig[m].icon}</span>
                        {modeConfig[m].label}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[200px] text-xs leading-relaxed">
                      {modeConfig[m].tooltip}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>

              {/* PRODUCT LIBRARY + PRODUCT INPUTS — Generate Mode only */}
              {mode === 'generate' && (
                <>
                  <ProductLibrary
                    selectedProductId={selectedProduct?.id}
                    onSelect={(product: ProductProfile) => {
                      setProductName(product.name);
                      setKeyBenefit(product.keyBenefit);
                      setProductDescription(product.description);
                      setSelectedProduct(product);
                      // Auto-select the first top hook for this product
                      if (product.topHooks.length > 0) {
                        setSelectedHookId(product.topHooks[0]);
                      }
                    }}
                    onSelectVault={(item, hookId) => {
                      // Pre-fill affiliate link from vault item
                      if (item.affiliateLink) setProductLink(item.affiliateLink);
                      if (hookId) setSelectedHookId(hookId);
                      // Upgrade 1: Store vault item ID so generateSingle can inject vault context
                      setSelectedVaultId(item.id);
                      // Also pre-fill product name from vault
                      if (item.productName) setProductName(item.productName);
                    }}
                    onClear={() => {
                      setSelectedProduct(null);
                    }}
                  />

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 md:p-5 space-y-4">
                    <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">Product Details</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1.5">Product Name <span className="text-red-400">*</span></label>
                        <Input
                          value={productName}
                          onChange={e => setProductName(e.target.value)}
                          placeholder="e.g. Magnesium Glycinate"
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/30 focus:border-teal-500/60 focus:ring-teal-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1.5">Key Benefit / Main Claim</label>
                        <Input
                          value={keyBenefit}
                          onChange={e => setKeyBenefit(e.target.value)}
                          placeholder="e.g. Improves sleep and reduces anxiety"
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/30 focus:border-teal-500/60 focus:ring-teal-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">Product Description <span className="text-white/40 font-normal">(paste from TikTok Shop)</span></label>
                      <Textarea
                        value={productDescription}
                        onChange={e => setProductDescription(e.target.value)}
                        placeholder="Paste the product description from TikTok Shop here — the more detail, the better the script..."
                        rows={3}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/30 focus:border-teal-500/60 focus:ring-teal-500/20 resize-none"
                      />
                    </div>

                    {/* Medication Side Effect hook — extra fields */}
                    {selectedHookId === 'medication-side-effect' && (
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <Brain className="w-3.5 h-3.5 text-amber-400" />
                          <p className="text-xs font-semibold text-amber-300">Medication Side Effect Hook — Extra Fields</p>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white/80 mb-1.5">Medication Name <span className="text-red-400">*</span></label>
                          <Input
                            value={medicationName}
                            onChange={e => setMedicationName(e.target.value)}
                            placeholder="e.g. GLP-1 / Ozempic, Metformin, Statin"
                            className="bg-white/10 border-white/30 text-white placeholder:text-white/30 focus:border-amber-500/60 focus:ring-amber-500/20"
                          />
                          <p className="text-[10px] text-white/30 mt-1">This replaces [MEDICATION] in your hook. Be specific — e.g. "Metformin" or "GLP-1 / Ozempic".</p>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white/80 mb-1.5">Sub-Type</label>
                          <div className="space-y-1.5">
                            {([
                              { value: 'nutrient-depletion', label: 'Nutrient Depletion', desc: 'The drug depletes a nutrient the product replenishes (e.g., Metformin → B12 depletion)' },
                              { value: 'known-side-effect', label: 'Known Side Effect', desc: 'The drug causes a side effect the product helps manage (e.g., GLP-1 → collagen/muscle loss)' },
                              { value: 'drug-interaction', label: 'Drug Interaction', desc: 'The product supports the drug or mitigates a known interaction risk' },
                            ] as const).map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => setMedicationSubType(opt.value)}
                                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                                  medicationSubType === opt.value
                                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                                    : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
                                }`}
                              >
                                <span className="font-semibold block">{opt.label}</span>
                                <span className="text-[10px] opacity-70 mt-0.5 block">{opt.desc}</span>
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-white/30 mt-1.5">⚠️ LLM-generated clinical details — always vet before posting.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── GENERATE MODE ── */}
              {mode === 'generate' && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 md:p-5 space-y-4">
                  <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">Script Settings</p>

                  {/* Misdirection Toggle */}
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    <button
                      onClick={() => setUseMisdirection(!useMisdirection)}
                      className={`flex-shrink-0 w-10 h-5 rounded-full transition-all relative mt-0.5 ${useMisdirection ? 'bg-teal-500' : 'bg-white/20'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${useMisdirection ? 'left-5' : 'left-0.5'}`} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">Misdirection Technique</p>
                      <p className="text-xs text-white/40 mt-0.5">Adds an honest "correction" line that builds trust by setting realistic expectations</p>
                      <p className="text-[10px] text-white/30 mt-1 italic">e.g. "Everyone says you feel it in 3 days, but real results take 3–4 weeks." This makes you more believable, not less.</p>

                      {/* All compatible hooks list — only show when toggle is ON */}
                      {useMisdirection && (
                        <div className="mt-2 text-[10px] text-white/30 space-y-1">
                          <p className="font-semibold text-white/40 uppercase tracking-wider">Works well with:</p>
                          <div className="flex flex-wrap gap-1">
                            {HOOKS.filter(h => h.misdirectionCompatibility === 'high').map(h => (
                              <span key={h.id} className="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">{h.name.replace('The ', '').replace(' Hook', '').replace(' Formula', '')}</span>
                            ))}
                          </div>
                          <p className="font-semibold text-white/40 uppercase tracking-wider mt-1">Use with care:</p>
                          <div className="flex flex-wrap gap-1">
                            {HOOKS.filter(h => h.misdirectionCompatibility === 'medium').map(h => (
                              <span key={h.id} className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">{h.name.replace('The ', '').replace(' Hook', '').replace(' Formula', '')}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Intro Phrase Selector */}
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">Intro Phrase</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">A/B Test</span>
                    </div>
                    <p className="text-xs text-white/40">Prepend a credential opener to your script. Test both to see which converts better.</p>
                    <div className="space-y-2">
                      {(['none', 'option1', 'option4'] as const).map(opt => (
                        <button
                          key={opt}
                          onClick={() => setIntroPhrase(opt)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                            introPhrase === opt
                              ? 'bg-teal-500/15 border-teal-500/40 text-teal-300'
                              : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
                          }`}
                        >
                          {opt === 'none' ? (
                            <span className="font-medium">No intro phrase</span>
                          ) : (
                            <>
                              <span className="font-semibold block mb-0.5">{INTRO_PHRASES[opt].label}</span>
                              <span className="italic text-[11px] opacity-80">"{INTRO_PHRASES[opt].text}"</span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Word Filter */}
                  <div>
                    <button
                      onClick={() => setShowWordFilter(!showWordFilter)}
                      className="flex items-center gap-2 text-xs text-white/50 hover:text-white/70 transition-colors"
                    >
                      {showWordFilter ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {showWordFilter ? 'Hide' : 'Show'} Personal Word Filter
                    </button>
                    {showWordFilter && (
                      <div className="mt-3">
                        <label className="block text-xs font-semibold text-white/80 mb-1.5">Words / Phrases to Exclude <span className="text-white/40 font-normal">(comma-separated)</span></label>
                        <Input
                          value={bannedWordsInput}
                          onChange={e => setBannedWordsInput(e.target.value)}
                          placeholder="e.g. amazing, life-changing, miracle"
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/30 focus:border-teal-500/60"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── CLONE MODE ── */}
              {mode === 'clone' && (
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 md:p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-purple-400" />
                    <p className="text-xs font-semibold text-purple-300/70 uppercase tracking-widest">Clone a Viral Video</p>
                  </div>
                  <p className="text-xs text-white/40">Paste any TikTok video URL — the tool will transcribe it word-for-word and generate your pharmacist-adapted version with multiple hook options to cycle through.</p>

                  <div className="flex gap-2">
                    <Input
                      value={cloneVideoUrl}
                      onChange={e => setCloneVideoUrl(e.target.value)}
                      placeholder="https://www.tiktok.com/@creator/video/..."
                      className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/30 focus:border-purple-500/60"
                    />
                    <Button
                      onClick={handleTranscribeClone}
                      disabled={isTranscribing}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 shrink-0"
                    >
                      {isTranscribing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                      <span className="ml-2 hidden sm:inline">{isTranscribing ? 'Transcribing...' : 'Transcribe'}</span>
                    </Button>
                  </div>

                  {/* Clone Mode Loading Overlay */}
                  <TranscriptionLoading isActive={isTranscribing} mode="clone" />

                  {/* Transcript + Rewrite Tabs */}
                  {cloneTranscript && (
                    <div className="space-y-3">
                      {/* Tab Bar */}
                      <div className="flex gap-1 p-1 rounded-lg bg-black/30 border border-white/10">
                        <button
                          onClick={() => setCloneTab('transcript')}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${
                            cloneTab === 'transcript' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" /> Original Script
                        </button>
                        <button
                          onClick={() => cloneRewrite ? setCloneTab('rewrite') : toast.info('Generate your pharmacist rewrite first')}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${
                            cloneTab === 'rewrite' ? 'bg-purple-500/20 text-purple-300' : 'text-white/40 hover:text-white/60'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Pharmacist Rewrite
                        </button>
                      </div>

                      {/* Transcript Tab */}
                      {cloneTab === 'transcript' && (
                        <div className="space-y-3">
                          {/* Meta info */}
                          <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-white/50">
                              <Clock className="w-3.5 h-3.5" />
                              {Math.round(cloneTranscript.durationSeconds)}s video
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-white/50">
                              <BookOpen className="w-3.5 h-3.5" />
                              Grade {cloneTranscript.readingLevel} reading level
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-white/50">
                              <FileText className="w-3.5 h-3.5" />
                              {cloneTranscript.wordCount} words
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-white/50">
                              <span className="text-purple-400">@{cloneTranscript.creatorHandle}</span>
                            </div>
                          </div>

                          {/* Full transcript */}
                          <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Original Transcript — Word for Word</p>
                              <div className="flex gap-2">
                                {!editingTranscript && (
                                  <button onClick={() => { setTranscriptEditText(cloneTranscript.fullTranscript); setEditingTranscript(true); }} className="text-white/20 hover:text-teal-400 transition-colors" title="Edit transcript">
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {editingTranscript && (
                                  <>
                                    <button onClick={() => { setCloneTranscript({ ...cloneTranscript, fullTranscript: transcriptEditText }); setEditingTranscript(false); toast.success('Transcript updated'); }} className="text-emerald-400 hover:text-emerald-300 transition-colors" title="Save edits">
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => setEditingTranscript(false)} className="text-white/30 hover:text-white/60 transition-colors" title="Cancel">
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                                <button onClick={() => copyToClipboard(editingTranscript ? transcriptEditText : cloneTranscript.fullTranscript, 'Transcript copied!')} className="text-white/20 hover:text-white/60 transition-colors">
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            {editingTranscript ? (
                              <textarea
                                value={transcriptEditText}
                                onChange={e => setTranscriptEditText(e.target.value)}
                                className="w-full font-mono text-xs text-white/90 leading-relaxed bg-white/5 border border-teal-500/30 rounded p-2 resize-none focus:outline-none focus:border-teal-400"
                                rows={Math.max(6, transcriptEditText.split('\n').length + 2)}
                                autoFocus
                              />
                            ) : (
                              <p className="font-mono text-xs text-white/80 leading-relaxed whitespace-pre-wrap">{cloneTranscript.fullTranscript}</p>
                            )}
                          </div>

                          {/* Generate Rewrite Button */}
                          <Button
                            onClick={handleGenerateRewrite}
                            disabled={isRewriting}
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold"
                          >
                            {isRewriting ? (
                              <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Generating pharmacist rewrites...</span>
                            ) : (
                              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate Pharmacist Rewrite</span>
                            )}
                          </Button>

                          {/* Rewrite Loading Overlay */}
                          <RewriteLoading isActive={isRewriting} />
                        </div>
                      )}

                      {/* Rewrite Tab */}
                      {cloneTab === 'rewrite' && cloneRewrite && currentRewrite && (
                        <div className="space-y-3">
                          {/* Detected Hook Framework */}
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/30 border border-purple-500/20">
                            <GitBranch className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-purple-300">{currentRewrite.hookName}</p>
                              <p className="text-[10px] text-white/40 mt-0.5">{currentRewrite.hookCategory} · Original framework preserved</p>
                            </div>
                          </div>

                          {/* Opening Line highlight */}
                          <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3">
                            <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest mb-2">Opening Hook Line</p>
                            <p className="font-mono text-sm text-purple-200 leading-relaxed">"{currentRewrite.openingLine}"</p>
                          </div>

                          {/* Full rewritten script */}
                          <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Full Pharmacist Script</p>
                                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full">
                                  {(editingRewrite ? rewriteEditText : currentRewrite.fullScript).trim().split(/\s+/).filter(Boolean).length} words
                                </span>
                              </div>
                              <div className="flex gap-2">
                                {!editingRewrite && (
                                  <button onClick={() => { setRewriteEditText(currentRewrite.fullScript); setEditingRewrite(true); }} className="text-white/20 hover:text-purple-400 transition-colors" title="Edit script">
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {editingRewrite && (
                                  <>
                                    <button
                                      onClick={() => {
                                        const updatedRewrites = cloneRewrite.pharmacistRewrites.map((r, i) =>
                                          i === activeHookIndex ? { ...r, fullScript: rewriteEditText } : r
                                        );
                                        setCloneRewrite({ ...cloneRewrite, pharmacistRewrites: updatedRewrites });
                                        setEditingRewrite(false);
                                        toast.success('Script updated');
                                      }}
                                      className="text-emerald-400 hover:text-emerald-300 transition-colors" title="Save edits">
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => setEditingRewrite(false)} className="text-white/30 hover:text-white/60 transition-colors" title="Cancel">
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                                <button onClick={() => copyToClipboard(editingRewrite ? rewriteEditText : currentRewrite.fullScript, 'Script copied!')} className="text-white/20 hover:text-white/60 transition-colors">
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleSaveScript(editingRewrite ? rewriteEditText : currentRewrite.fullScript, currentRewrite.hookName)} className="text-white/20 hover:text-amber-400 transition-colors">
                                  <Star className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            {editingRewrite ? (
                              <textarea
                                value={rewriteEditText}
                                onChange={e => setRewriteEditText(e.target.value)}
                                className="w-full font-mono text-xs text-white/90 leading-relaxed bg-white/5 border border-purple-500/30 rounded p-2 resize-none focus:outline-none focus:border-purple-400"
                                rows={Math.max(8, rewriteEditText.split('\n').length + 2)}
                                autoFocus
                              />
                            ) : (
                              <p className="font-mono text-xs text-white/80 leading-relaxed whitespace-pre-wrap">{renderScriptWithVisualCues(currentRewrite.fullScript)}</p>
                            )}
                          </div>

                          {/* Hard Violations (Red) */}
                          {cloneRewrite.hardViolations && cloneRewrite.hardViolations.length > 0 && (
                            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <XCircle className="w-3.5 h-3.5 text-red-400" />
                                <p className="text-[10px] font-semibold text-red-300 uppercase tracking-widest">Hard Violations — Corrected in Rewrite</p>
                              </div>
                              {cloneRewrite.hardViolations.map((issue: string, i: number) => (
                                <p key={i} className="text-xs text-red-300/80 mb-1">• {issue}</p>
                              ))}
                              <p className="text-[10px] text-red-400/60 mt-2">These would likely get your video removed. They have been corrected in your pharmacist rewrite.</p>
                            </div>
                          )}

                          {/* Soft Cautions (Amber/Yellow) */}
                          {cloneRewrite.softCautions && cloneRewrite.softCautions.length > 0 && (
                            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                <p className="text-[10px] font-semibold text-amber-300 uppercase tracking-widest">Soft Cautions — FYI Only</p>
                              </div>
                              {cloneRewrite.softCautions.map((caution: string, i: number) => (
                                <p key={i} className="text-xs text-amber-300/80 mb-1">• {caution}</p>
                              ))}
                              <p className="text-[10px] text-amber-400/60 mt-2">Standard TikTok creator language. Not corrected in your rewrite — just be aware.</p>
                            </div>
                          )}

                          {/* No Issues (Green) */}
                          {(!cloneRewrite.hardViolations || cloneRewrite.hardViolations.length === 0) && (!cloneRewrite.softCautions || cloneRewrite.softCautions.length === 0) && (
                            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <p className="text-[10px] font-semibold text-emerald-300 uppercase tracking-widest">Clean — No Compliance Issues</p>
                              </div>
                            </div>
                          )}

                          {/* Improvement Suggestions */}
                          {cloneRewrite.improvementSuggestions.length > 0 && (
                            <div className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-3.5 h-3.5 text-teal-400" />
                                <p className="text-[10px] font-semibold text-teal-400 uppercase tracking-widest">Suggestions to Improve Further</p>
                              </div>
                              {cloneRewrite.improvementSuggestions.map((s, i) => (
                                <p key={i} className="text-xs text-white/70 mb-1">• {s}</p>
                              ))}
                            </div>
                          )}

                          {/* Psych Triggers */}
                          {cloneRewrite.psychTriggers.length > 0 && (
                            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Brain className="w-3.5 h-3.5 text-white/40" />
                                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Psychological Triggers Detected</p>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {cloneRewrite.psychTriggers.map(t => {
                                  const trigger = PSYCH_TRIGGERS.find(pt => pt.label === t);
                                  return (
                                    <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full border ${trigger?.color || 'bg-white/10 text-white/50 border-white/10'}`}>{t}</span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {/* Triple Hook — Text Hook Suggestions (Clone Mode) */}
                          {currentRewrite && (currentRewrite as any).textHookSuggestions && ((currentRewrite as any).textHookSuggestions as string[]).length > 0 && (
                            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
                              <div className="flex items-center gap-2 mb-1">
                                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                                <p className="text-xs font-semibold text-cyan-300 uppercase tracking-widest">Text Hook Options</p>
                                <span className="text-[10px] text-cyan-500/60 font-normal normal-case tracking-normal">— on-screen overlay, first 2 seconds</span>
                              </div>
                              <p className="text-[10px] text-white/30 mb-3">Use one of these as your text overlay simultaneously with your spoken hook. Pick the angle that fits your delivery.</p>
                              <div className="space-y-2">
                                {((currentRewrite as any).textHookSuggestions as string[]).map((suggestion: string, i: number) => {
                                  const labels = ['Question', 'Provocative', 'Stakes'];
                                  return (
                                    <div key={i} className="flex items-start gap-2 rounded-lg border border-cyan-500/20 bg-black/20 px-3 py-2.5">
                                      <span className="flex-shrink-0 text-[9px] font-bold text-cyan-500/60 uppercase tracking-widest mt-0.5 w-16">{labels[i] ?? `Option ${i + 1}`}</span>
                                      <p className="flex-1 font-mono text-xs text-cyan-200 leading-relaxed">"{suggestion}"</p>
                                      <button
                                        onClick={() => copyToClipboard(suggestion, 'Text hook copied!')}
                                        className="flex-shrink-0 text-white/20 hover:text-cyan-400 transition-colors ml-1"
                                        title="Copy"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                              <p className="text-[10px] text-white/20 mt-3 italic">Triple hook strategy: visual hook (what's on screen) + spoken hook (first words) + text hook (overlay) = 3 simultaneous attention triggers.</p>
                            </div>
                          )}
                         </div>
                      )}
                    </div>
                  )}
                  {/* Clone Mode Caption & Hashtag Generator */}
                  {cloneRewrite && (
                    <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest">Caption & Hashtags</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const currentRewrite = cloneRewrite.pharmacistRewrites[activeHookIndex];
                            const script = editingRewrite ? rewriteEditText : (currentRewrite?.fullScript || '');
                            handleGenerateCaption('clone', script, currentRewrite?.hookName || 'Pharmacist Rewrite');
                          }}
                          disabled={isGeneratingCaption === 'clone'}
                          className="text-xs border-purple-500/30 text-purple-300 hover:bg-purple-500/10 bg-transparent gap-1.5"
                        >
                          {isGeneratingCaption === 'clone' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          {isGeneratingCaption === 'clone' ? 'Generating...' : cloneCaption ? 'Regenerate' : 'Generate Caption & Hashtags'}
                        </Button>
                      </div>
                      {cloneCaption ? (
                        <div className="space-y-3">
                          <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] text-white/40 uppercase tracking-widest">Caption</p>
                              <button onClick={() => copyToClipboard(`${cloneCaption.captionLine1}\n${cloneCaption.captionLine2}`, 'Caption copied!')} className="text-[10px] text-white/30 hover:text-purple-400 flex items-center gap-1 transition-colors">
                                <Copy className="w-3 h-3" /> Copy
                              </button>
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed">{cloneCaption.captionLine1}</p>
                            <p className="text-xs text-white/80 leading-relaxed mt-1">{cloneCaption.captionLine2}</p>
                          </div>
                          <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] text-white/40 uppercase tracking-widest">Hashtags (5)</p>
                              <button onClick={() => copyToClipboard(cloneCaption.hashtags.join(' '), 'Hashtags copied!')} className="text-[10px] text-white/30 hover:text-purple-400 flex items-center gap-1 transition-colors">
                                <Copy className="w-3 h-3" /> Copy All
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {cloneCaption.hashtags.map(tag => (
                                <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">{tag}</span>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(`${cloneCaption.captionLine1}\n${cloneCaption.captionLine2}\n\n${cloneCaption.hashtags.join(' ')}`, 'Caption + hashtags copied!')}
                            className="w-full text-[10px] text-white/30 hover:text-purple-300 border border-white/10 hover:border-purple-500/30 rounded-lg py-2 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Copy className="w-3 h-3" /> Copy Caption + Hashtags Together
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-white/30 text-center py-2">Click the button above to generate a ready-to-post caption and 5 targeted hashtags</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              {/* ── ITERATE MODE ── */}
              {mode === 'iterate' && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 md:p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-amber-400" />
                    <p className="text-xs font-semibold text-amber-300/70 uppercase tracking-widest">Iterate on a Winning Video</p>
                  </div>
                  <p className="text-xs text-white/40">Paste a TikTok URL (your own viral video or a competitor's) — the tool transcribes it and generates all 3 iteration levels instantly.</p>

                  <div className="flex gap-2">
                    <Input
                      value={iterateVideoUrl}
                      onChange={e => setIterateVideoUrl(e.target.value)}
                      placeholder="https://www.tiktok.com/@creator/video/..."
                      className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/30 focus:border-amber-500/60"
                    />
                    <Button
                      onClick={handleTranscribeIterate}
                      disabled={isIterateTranscribing}
                      className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 shrink-0"
                    >
                      {isIterateTranscribing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                      <span className="ml-2 hidden sm:inline">{isIterateTranscribing ? 'Transcribing...' : 'Transcribe'}</span>
                    </Button>
                  </div>

                  {/* Iterate Mode Loading Overlay */}
                  <TranscriptionLoading isActive={isIterateTranscribing} mode="iterate" />

                  {/* Transcribed + Generate Iterations */}
                  {iterateTranscript && (
                    <div className="space-y-3">
                      {/* Meta */}
                      <div className="flex flex-wrap gap-3 p-3 rounded-lg bg-black/20 border border-white/10">
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                          Video transcribed
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <Clock className="w-3.5 h-3.5" />
                          {Math.round(iterateTranscript.durationSeconds)}s
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <FileText className="w-3.5 h-3.5" />
                          {iterateTranscript.wordCount} words
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <span className="text-amber-400">@{iterateTranscript.creatorHandle}</span>
                        </div>
                      </div>

                      <Button
                        onClick={handleGenerateIterations}
                        disabled={isIterating}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold"
                      >
                        {isIterating ? (
                          <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Generating iterations...</span>
                        ) : (
                          <span className="flex items-center gap-2"><GitBranch className="w-4 h-4" /> Generate 70/20/10 Iterations</span>
                        )}
                      </Button>

                      {/* Iterate Generation Loading Overlay */}
                      <IterateLoading isActive={isIterating} />
                    </div>
                  )}

                  {/* Iteration Results */}
                  {iterateResult && (
                    <div className="space-y-3">
                      {/* Level Selector */}
                      <div className="grid grid-cols-3 gap-2">
                        {([
                          { level: '70' as IterationLevel, label: '70%', desc: 'Minor tweaks', color: 'teal', rationale: iterateResult.rationale70 },
                          { level: '20' as IterationLevel, label: '20%', desc: 'Format change', color: 'amber', rationale: iterateResult.rationale20 },
                          { level: '10' as IterationLevel, label: '10%', desc: 'Full experiment', color: 'red', rationale: iterateResult.rationale10 },
                        ]).map(({ level, label, desc, color, rationale }) => (
                          <button
                            key={level}
                            onClick={() => setActiveIterateLevel(level)}
                            className={`p-3 rounded-lg border text-center transition-all ${
                              activeIterateLevel === level
                                ? color === 'teal' ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                                : color === 'amber' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                : 'bg-red-500/20 border-red-500/40 text-red-300'
                                : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                            }`}
                          >
                            <div className="text-lg font-bold font-mono">{label}</div>
                            <div className="text-[10px] mt-0.5">{desc}</div>
                          </button>
                        ))}
                      </div>

                      {/* Rationale */}
                      {(() => {
                        const rationale = activeIterateLevel === '70' ? iterateResult.rationale70 : activeIterateLevel === '20' ? iterateResult.rationale20 : iterateResult.rationale10;
                        const script = activeIterateLevel === '70' ? iterateResult.level70 : activeIterateLevel === '20' ? iterateResult.level20 : iterateResult.level10;
                        const levelLabel = activeIterateLevel === '70' ? '70% — Minor Tweaks' : activeIterateLevel === '20' ? '20% — Format Change' : '10% — Full Experiment';
                        return (
                          <>
                            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">Strategy — {levelLabel}</p>
                              <p className="text-xs text-white/60 leading-relaxed">{rationale}</p>
                            </div>
                            <div className="rounded-lg border border-amber-500/20 bg-black/30 p-4">
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">Iteration Script</p>
                                <div className="flex gap-2">
                                  {!editingIterate && (
                                    <button onClick={() => { setIterateEditText(script); setEditingIterate(true); }} className="text-white/20 hover:text-amber-400 transition-colors" title="Edit script">
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {editingIterate && (
                                    <>
                                      <button
                                        onClick={() => {
                                          const updated = { ...iterateResult! };
                                          if (activeIterateLevel === '70') updated.level70 = iterateEditText;
                                          else if (activeIterateLevel === '20') updated.level20 = iterateEditText;
                                          else updated.level10 = iterateEditText;
                                          setIterateResult(updated);
                                          setEditingIterate(false);
                                          toast.success('Script updated');
                                        }}
                                        className="text-emerald-400 hover:text-emerald-300 transition-colors" title="Save edits">
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                      <button onClick={() => setEditingIterate(false)} className="text-white/30 hover:text-white/60 transition-colors" title="Cancel">
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </>
                                  )}
                                  <button onClick={() => copyToClipboard(editingIterate ? iterateEditText : script, 'Script copied!')} className="text-white/20 hover:text-white/60 transition-colors">
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => handleSaveScript(editingIterate ? iterateEditText : script, `${activeIterateLevel}% Iteration`)} className="text-white/20 hover:text-amber-400 transition-colors">
                                    <Star className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              {editingIterate ? (
                                <textarea
                                  value={iterateEditText}
                                  onChange={e => setIterateEditText(e.target.value)}
                                  className="w-full font-mono text-xs text-white/90 leading-relaxed bg-white/5 border border-amber-500/30 rounded p-2 resize-none focus:outline-none focus:border-amber-400"
                                  rows={Math.max(8, iterateEditText.split('\n').length + 2)}
                                  autoFocus
                                />
                              ) : (
                                <p className="font-mono text-xs text-white/80 leading-relaxed whitespace-pre-wrap">{renderScriptWithVisualCues(script)}</p>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                  {/* Iterate Mode Caption & Hashtag Generator */}
                  {iterateResult && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">Caption & Hashtags</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const script = editingIterate ? iterateEditText : (
                              activeIterateLevel === '70' ? iterateResult.level70 :
                              activeIterateLevel === '20' ? iterateResult.level20 :
                              iterateResult.level10
                            );
                            handleGenerateCaption('iterate', script, `${activeIterateLevel}% Iteration`);
                          }}
                          disabled={isGeneratingCaption === 'iterate'}
                          className="text-xs border-amber-500/30 text-amber-300 hover:bg-amber-500/10 bg-transparent gap-1.5"
                        >
                          {isGeneratingCaption === 'iterate' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          {isGeneratingCaption === 'iterate' ? 'Generating...' : iterateCaption ? 'Regenerate' : 'Generate Caption & Hashtags'}
                        </Button>
                      </div>
                      {iterateCaption ? (
                        <div className="space-y-3">
                          <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] text-white/40 uppercase tracking-widest">Caption</p>
                              <button onClick={() => copyToClipboard(`${iterateCaption.captionLine1}\n${iterateCaption.captionLine2}`, 'Caption copied!')} className="text-[10px] text-white/30 hover:text-amber-400 flex items-center gap-1 transition-colors">
                                <Copy className="w-3 h-3" /> Copy
                              </button>
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed">{iterateCaption.captionLine1}</p>
                            <p className="text-xs text-white/80 leading-relaxed mt-1">{iterateCaption.captionLine2}</p>
                          </div>
                          <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] text-white/40 uppercase tracking-widest">Hashtags (5)</p>
                              <button onClick={() => copyToClipboard(iterateCaption.hashtags.join(' '), 'Hashtags copied!')} className="text-[10px] text-white/30 hover:text-amber-400 flex items-center gap-1 transition-colors">
                                <Copy className="w-3 h-3" /> Copy All
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {iterateCaption.hashtags.map(tag => (
                                <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">{tag}</span>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(`${iterateCaption.captionLine1}\n${iterateCaption.captionLine2}\n\n${iterateCaption.hashtags.join(' ')}`, 'Caption + hashtags copied!')}
                            className="w-full text-[10px] text-white/30 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 rounded-lg py-2 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Copy className="w-3 h-3" /> Copy Caption + Hashtags Together
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-white/30 text-center py-2">Click the button above to generate a ready-to-post caption and 5 targeted hashtags</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              {/* ── GENERATE BUTTON (Generate mode only) ── */}
              {mode === 'generate' && (
                <div className="space-y-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || isGeneratingBatch}
                    className="w-full h-12 bg-teal-500 hover:bg-teal-400 text-black font-bold text-sm tracking-wide transition-all"
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Researching &amp; generating... (15–30s)</span>
                    ) : (
                      <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Generate Script</span>
                    )}
                  </Button>
                  <Button
                    onClick={handleBatchGenerate}
                    disabled={isGeneratingBatch || isGenerating}
                    variant="outline"
                    className="w-full h-10 border-teal-500/30 text-teal-300 hover:bg-teal-500/10 bg-transparent font-semibold text-xs tracking-wide transition-all"
                  >
                    {isGeneratingBatch ? (
                      <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Generating all 9 hooks... (45–90s)</span>
                    ) : (
                      <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate All 9 Core Hooks at Once</span>
                    )}
                  </Button>
                </div>
              )}

              {/* ── GENERATE MODE OUTPUT ── */}
              {mode === 'generate' && generatedScript && (
                <div className="space-y-4">
                  {/* Hard Violations (Red) */}
                  {generatedScript.complianceHardFlags.length > 0 && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <p className="text-sm font-semibold text-red-300">Hard Violations — Fix Before Posting</p>
                      </div>
                      {generatedScript.complianceHardFlags.map((flag: string, i: number) => (
                        <p key={i} className="text-xs text-red-300/80 mb-1">• {flag}</p>
                      ))}
                      <p className="text-[10px] text-red-400/60 mt-2">These would likely get your video removed.</p>
                    </div>
                  )}

                  {/* Soft Cautions (Amber) */}
                  {generatedScript.complianceSoftFlags.length > 0 && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <p className="text-sm font-semibold text-amber-300">Soft Cautions — FYI Only</p>
                      </div>
                      {generatedScript.complianceSoftFlags.map((flag: string, i: number) => (
                        <p key={i} className="text-xs text-amber-300/80 mb-1">• {flag}</p>
                      ))}
                      <p className="text-[10px] text-amber-400/60 mt-2">Standard TikTok creator language. No action needed.</p>
                    </div>
                  )}

                  {/* Automatic script-quality review — separate from compliance flags */}
                  {generatedScript.qualityReview && (
                    <div className={`rounded-xl border p-4 ${
                      generatedScript.qualityReview.verificationPassed
                        ? 'border-teal-500/30 bg-teal-500/10'
                        : 'border-amber-500/30 bg-amber-500/10'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {generatedScript.qualityReview.verificationPassed ? (
                          <ClipboardCheck className="w-4 h-4 text-teal-300" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-300" />
                        )}
                        <p className={`text-sm font-semibold ${
                          generatedScript.qualityReview.verificationPassed ? 'text-teal-200' : 'text-amber-200'
                        }`}>Automatic Script Quality Review</p>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">
                        {generatedScript.qualityReview.verificationPassed
                          ? generatedScript.qualityReview.initialPassed
                            ? 'The initial draft cleared the structural and writing review.'
                            : 'The first draft was revised, then cleared the structural and writing review.'
                          : 'The automatic reviewer found issues that still require a manual rewrite before filming.'}
                      </p>
                      {!generatedScript.qualityReview.initialPassed && generatedScript.qualityReview.initialFailedChecks.length > 0 && (
                        <div className="mt-3 rounded-lg bg-black/20 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5">First-draft findings</p>
                          {generatedScript.qualityReview.initialFailedChecks.map((check, i) => (
                            <p key={`initial-${i}`} className="text-xs text-white/65 leading-relaxed">• {check}</p>
                          ))}
                        </div>
                      )}
                      {!generatedScript.qualityReview.verificationPassed && generatedScript.qualityReview.verificationFailedChecks.length > 0 && (
                        <div className="mt-3 rounded-lg bg-black/20 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-widest text-amber-300/70 mb-1.5">Manual-review findings</p>
                          {generatedScript.qualityReview.verificationFailedChecks.map((check, i) => (
                            <p key={`verification-${i}`} className="text-xs text-amber-100/80 leading-relaxed">• {check}</p>
                          ))}
                        </div>
                      )}
                      <p className="text-[10px] text-white/35 mt-3">This review checks structure, no-redundancy, product advancement, and authority/objection discipline. It does not replace your source and filming review.</p>
                    </div>
                  )}

                  <div className="rounded-xl border border-teal-500/20 bg-black/40 p-4 md:p-5">
                    <div className="flex items-start justify-between mb-3 gap-2 flex-wrap">
                      <div>
                        <p className="text-xs font-semibold text-teal-400 uppercase tracking-widest">Full Script — Word for Word</p>
                        <p className="text-[10px] text-white/30 mt-0.5">Everything you say from start to finish</p>
                      </div>
                      <div className="flex gap-2">
                        {!editingGenerate && (
                          <Button size="sm" variant="outline" onClick={() => { setGenerateEditText(generatedScript.fullScript); setEditingGenerate(true); }} className="text-xs border-teal-500/30 text-teal-300 hover:bg-teal-500/10 bg-transparent gap-1.5">
                            <Pencil className="w-3 h-3" /> Edit
                          </Button>
                        )}
                        {editingGenerate && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => { setGeneratedScript({ ...generatedScript, fullScript: generateEditText }); setEditingGenerate(false); toast.success('Script updated'); }} className="text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 bg-transparent gap-1.5">
                              <Check className="w-3 h-3" /> Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingGenerate(false)} className="text-xs border-white/20 text-white/40 hover:bg-white/10 bg-transparent gap-1.5">
                              <X className="w-3 h-3" /> Cancel
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(editingGenerate ? generateEditText : generatedScript.fullScript, 'Full script copied!')} className="text-xs border-teal-500/30 text-teal-300 hover:bg-teal-500/10 bg-transparent gap-1.5">
                          <Copy className="w-3 h-3" /> Copy
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSaveScript(editingGenerate ? generateEditText : generatedScript.fullScript, selectedHook?.name || 'Generated Script')} className="text-xs border-white/20 text-white/60 hover:bg-white/10 bg-transparent gap-1.5">
                          <Star className="w-3 h-3" /> Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleReviewScript} disabled={isReviewingScript} className="text-xs border-amber-500/30 text-amber-300 hover:bg-amber-500/10 bg-transparent gap-1.5">
                          {isReviewingScript ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ClipboardCheck className="w-3 h-3" />}
                          {isReviewingScript ? 'Reviewing...' : 'Review'}
                        </Button>
                      </div>
                    </div>
                    {editingGenerate ? (
                      <textarea
                        value={generateEditText}
                        onChange={e => setGenerateEditText(e.target.value)}
                        className="w-full font-mono text-sm text-white/90 leading-relaxed bg-white/5 border border-teal-500/30 rounded p-3 resize-none focus:outline-none focus:border-teal-400"
                        rows={Math.max(10, generateEditText.split('\n').length + 2)}
                        autoFocus
                      />
                    ) : (
                      <p className="font-mono text-sm text-white/90 leading-relaxed whitespace-pre-wrap">{renderScriptWithSectionLabels(generatedScript.fullScript, generatedScript)}</p>
                    )}
                   </div>

                  {/* Script Review Panel */}
                  {showReview && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <ClipboardCheck className="w-4 h-4 text-amber-400" />
                          <p className="text-xs font-semibold text-amber-300 uppercase tracking-widest">Script Review</p>
                          {scriptReview && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              scriptReview.overallScore === 'pass' ? 'bg-emerald-500/20 text-emerald-300' :
                              scriptReview.overallScore === 'needs_work' ? 'bg-amber-500/20 text-amber-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {scriptReview.overallScore === 'pass' ? 'PASS' : scriptReview.overallScore === 'needs_work' ? 'NEEDS WORK' : 'MAJOR ISSUES'}
                            </span>
                          )}
                        </div>
                        <button onClick={() => setShowReview(false)} className="text-white/20 hover:text-white/60 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      {isReviewingScript && (
                        <div className="flex items-center gap-2 text-white/40 text-xs py-4">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Analyzing script... (5–10s)
                        </div>
                      )}

                      {scriptReview && !isReviewingScript && (
                        <div className="space-y-3">
                          <div className="flex gap-4 text-xs text-white/40">
                            <span>{scriptReview.totalWordCount} words</span>
                            <span>~{scriptReview.estimatedSeconds}s on camera</span>
                          </div>
                          <p className="text-xs text-white/60 leading-relaxed">{scriptReview.summary}</p>
                          {scriptReview.flags.length === 0 ? (
                            <div className="flex items-center gap-2 text-emerald-400 text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              No issues found — script is ready to film.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {scriptReview.flags.map((flag, i) => (
                                <div key={i} className={`rounded-lg border p-3 ${
                                  flag.severity === 'warning'
                                    ? 'border-amber-500/30 bg-amber-500/5'
                                    : 'border-blue-500/20 bg-blue-500/5'
                                }`}>
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    {flag.severity === 'warning'
                                      ? <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                                      : <Lightbulb className="w-3 h-3 text-blue-400 shrink-0" />}
                                    <span className={`text-[10px] font-semibold uppercase tracking-widest ${
                                      flag.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'
                                    }`}>{flag.section}</span>
                                  </div>
                                  <p className="text-xs text-white/70 leading-relaxed mb-1">{flag.issue}</p>
                                  <p className="text-xs text-white/40 leading-relaxed italic">→ {flag.suggestion}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="rounded-xl border border-white/10 bg-black/20 p-3 mb-1">
                    <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-3">Script Breakdown — Click any section to edit</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {([
                        { label: 'Text Hook (On Screen)', key: 'textHook', value: generatedScript.textHook, color: 'teal' },
                        { label: 'Verbal Hook (First Words)', key: 'verbalHook', value: generatedScript.verbalHook, color: 'teal' },
                        { label: 'Problem / Agitation', key: 'problem', value: generatedScript.problem, color: 'white' },
                        { label: 'Authority Pivot', key: 'authorityPivot', value: generatedScript.authorityPivot, color: 'white' },
                        { label: 'Mechanism (How It Works)', key: 'mechanism', value: generatedScript.mechanism, color: 'white' },
                        { label: 'Call to Action', key: 'cta', value: generatedScript.cta, color: 'white' },
                      ] as { label: string; key: string; value: string; color: string }[]).map(({ label, key, value, color }) => (
                        <div key={key} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className={`text-[10px] font-semibold uppercase tracking-widest ${color === 'teal' ? 'text-teal-400' : 'text-white/40'}`}>{label}</p>
                            <div className="flex items-center gap-1.5">
                              {editingSection === key ? (
                                <>
                                  <button
                                    onClick={() => {
                                      setGeneratedScript({ ...generatedScript, [key]: sectionEditText });
                                      setEditingSection(null);
                                      toast.success(`${label} updated`);
                                    }}
                                    className="text-emerald-400 hover:text-emerald-300 transition-colors" title="Save"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => setEditingSection(null)}
                                    className="text-white/20 hover:text-white/60 transition-colors" title="Cancel"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => { setEditingSection(key); setSectionEditText(value); }}
                                    className="text-white/20 hover:text-teal-400 transition-colors" title="Edit section"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button onClick={() => copyToClipboard(value)} className="text-white/20 hover:text-white/60 transition-colors" title="Copy">
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          {editingSection === key ? (
                            <textarea
                              value={sectionEditText}
                              onChange={e => setSectionEditText(e.target.value)}
                              className="w-full text-xs text-white/90 leading-relaxed bg-white/5 border border-teal-500/30 rounded p-2 resize-none focus:outline-none focus:border-teal-400"
                              rows={Math.max(3, sectionEditText.split('\n').length + 1)}
                              autoFocus
                            />
                          ) : (
                            <p className="text-xs text-white/80 leading-relaxed">{value}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {generatedScript.misdirection && (
                    <div className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-semibold text-teal-400 uppercase tracking-widest">Misdirection Line</p>
                        <button onClick={() => copyToClipboard(generatedScript.misdirection!)} className="text-white/20 hover:text-white/60 transition-colors">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs text-white/80 leading-relaxed">{generatedScript.misdirection}</p>
                    </div>
                  )}

                  {/* Triple Hook — Text Hook Suggestions */}
                  {generatedScript.textHookSuggestions && generatedScript.textHookSuggestions.length > 0 && (
                    <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        <p className="text-xs font-semibold text-cyan-300 uppercase tracking-widest">Text Hook Options</p>
                        <span className="text-[10px] text-cyan-500/60 font-normal normal-case tracking-normal">— on-screen overlay, first 2 seconds</span>
                      </div>
                      <p className="text-[10px] text-white/30 mb-3">Use one of these as your text overlay simultaneously with your spoken hook. Pick the angle that fits your delivery.</p>
                      <div className="space-y-2">
                        {generatedScript.textHookSuggestions.map((suggestion, i) => {
                          const labels = ['Question', 'Provocative', 'Stakes'];
                          return (
                            <div key={i} className="flex items-start gap-2 rounded-lg border border-cyan-500/20 bg-black/20 px-3 py-2.5">
                              <span className="flex-shrink-0 text-[9px] font-bold text-cyan-500/60 uppercase tracking-widest mt-0.5 w-16">{labels[i] ?? `Option ${i + 1}`}</span>
                              <p className="flex-1 font-mono text-xs text-cyan-200 leading-relaxed">"{suggestion}"</p>
                              <button
                                onClick={() => copyToClipboard(suggestion, 'Text hook copied!')}
                                className="flex-shrink-0 text-white/20 hover:text-cyan-400 transition-colors ml-1"
                                title="Copy"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-white/20 mt-3 italic">Triple hook strategy: visual hook (what's on screen) + spoken hook (first words) + text hook (overlay) = 3 simultaneous attention triggers.</p>
                    </div>
                  )}

                  {/* A/B Hook Variants */}
                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">A/B Hook Variants</p>
                        <p className="text-[10px] text-white/30 mt-0.5">3 different opening lines for the same script body</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleGenerateABVariants}
                        disabled={isGeneratingAB}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0"
                      >
                        {isGeneratingAB ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span className="ml-1.5">{isGeneratingAB ? 'Generating...' : 'Generate Variants'}</span>
                      </Button>
                    </div>

                    {abVariants && (
                      <div className="space-y-3">
                        {/* Variant Tabs */}
                        <div className="flex gap-1 p-1 rounded-lg bg-black/30 border border-white/10">
                          {(['A', 'B', 'C'] as const).map(v => (
                            <button
                              key={v}
                              onClick={() => setActiveAbVariant(v)}
                              className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${
                                activeAbVariant === v
                                  ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                                  : 'text-white/40 hover:text-white/60'
                              }`}
                            >
                              Variant {v}
                            </button>
                          ))}
                        </div>

                        {/* Active Variant Display */}
                        {(() => {
                          const variantText = activeAbVariant === 'A' ? abVariants.variantA : activeAbVariant === 'B' ? abVariants.variantB : abVariants.variantC;
                          const rationale = activeAbVariant === 'A' ? abVariants.rationaleA : activeAbVariant === 'B' ? abVariants.rationaleB : abVariants.rationaleC;
                          const fullScript = variantText + '\n\n' + abVariants.scriptBody;
                          return (
                            <>
                              <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3">
                                <div className="flex items-center justify-between mb-1.5">
                                  <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest">Opening Line — Variant {activeAbVariant}</p>
                                  <button onClick={() => copyToClipboard(variantText, `Variant ${activeAbVariant} copied!`)} className="text-white/20 hover:text-white/60 transition-colors">
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                                <p className="font-mono text-sm text-indigo-200 leading-relaxed">"{variantText}"</p>
                                <p className="text-[10px] text-white/40 mt-2 italic">{rationale}</p>
                              </div>
                              <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Full Script with Variant {activeAbVariant}</p>
                                  <div className="flex gap-2">
                                    <button onClick={() => copyToClipboard(fullScript, 'Full script copied!')} className="text-white/20 hover:text-white/60 transition-colors">
                                      <Copy className="w-3 h-3" />
                                    </button>
                                    <button onClick={() => handleSaveScript(fullScript, `${selectedHook?.name || 'Script'} — Variant ${activeAbVariant}`)} className="text-white/20 hover:text-amber-400 transition-colors">
                                      <Star className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                                <p className="font-mono text-xs text-white/80 leading-relaxed whitespace-pre-wrap">{renderScriptWithVisualCues(fullScript)}</p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {!abVariants && !isGeneratingAB && (
                      <p className="text-[10px] text-white/30 text-center py-2">Click "Generate Variants" to create 3 different opening lines for this script</p>
                    )}
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Visual Overlay Suggestions</p>
                    <p className="text-[10px] text-white/30 mb-3">What to show on screen — visuals and graphics, not text overlays</p>
                    <div className="space-y-2">
                      {generatedScript.visualOverlays.map((overlay, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-white/60 bg-white/5 rounded-lg px-3 py-2">
                          <span className="flex-shrink-0 text-white/20 font-mono">{String(i + 1).padStart(2, '0')}</span>
                          <span>{overlay}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Caption & Hashtag Generator */}
                  <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold text-teal-400 uppercase tracking-widest">Caption & Hashtags</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerateCaption('generate', editingGenerate ? generateEditText : generatedScript.fullScript, selectedHook?.name || 'Script')}
                        disabled={isGeneratingCaption === 'generate'}
                        className="text-xs border-teal-500/30 text-teal-300 hover:bg-teal-500/10 bg-transparent gap-1.5"
                      >
                        {isGeneratingCaption === 'generate' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        {isGeneratingCaption === 'generate' ? 'Generating...' : generateCaption ? 'Regenerate' : 'Generate Caption & Hashtags'}
                      </Button>
                    </div>
                    {generateCaption ? (
                      <div className="space-y-3">
                        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">Caption</p>
                            <button onClick={() => copyToClipboard(`${generateCaption.captionLine1}\n${generateCaption.captionLine2}`, 'Caption copied!')} className="text-[10px] text-white/30 hover:text-teal-400 flex items-center gap-1 transition-colors">
                              <Copy className="w-3 h-3" /> Copy
                            </button>
                          </div>
                          <p className="text-xs text-white/80 leading-relaxed">{generateCaption.captionLine1}</p>
                          <p className="text-xs text-white/80 leading-relaxed mt-1">{generateCaption.captionLine2}</p>
                        </div>
                        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">Hashtags (5)</p>
                            <button onClick={() => copyToClipboard(generateCaption.hashtags.join(' '), 'Hashtags copied!')} className="text-[10px] text-white/30 hover:text-teal-400 flex items-center gap-1 transition-colors">
                              <Copy className="w-3 h-3" /> Copy All
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {generateCaption.hashtags.map(tag => (
                              <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-mono">{tag}</span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(`${generateCaption.captionLine1}\n${generateCaption.captionLine2}\n\n${generateCaption.hashtags.join(' ')}`, 'Caption + hashtags copied!')}
                          className="w-full text-[10px] text-white/30 hover:text-teal-300 border border-white/10 hover:border-teal-500/30 rounded-lg py-2 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Copy className="w-3 h-3" /> Copy Caption + Hashtags Together
                        </button>
                      </div>
                    ) : (
                      <p className="text-[10px] text-white/30 text-center py-2">Click the button above to generate a ready-to-post caption and 5 targeted hashtags</p>
                    )}
                  </div>
                  {/* ─── UPGRADE 2: Study Citations Panel ─────────────────────────────────────────────────────────────────── */}
                  {generatedCitations.length > 0 && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">Study Citations</p>
                          <p className="text-[10px] text-white/30 mt-0.5">{generatedCitations.length} source{generatedCitations.length > 1 ? 's' : ''} used in this script</p>
                        </div>
                        <button
                          onClick={() => setShowCitations(v => !v)}
                          className="text-[10px] text-amber-400/70 hover:text-amber-300 flex items-center gap-1 transition-colors"
                        >
                          {showCitations ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {showCitations ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      {showCitations && (
                        <div className="space-y-2">
                          {generatedCitations.map((c, i) => (
                            <div key={i} className="rounded-lg bg-black/30 border border-amber-500/10 p-3 space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs text-white/80 leading-relaxed flex-1">{c.claim}</p>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${
                                  c.confidence === 'high' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                  c.confidence === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                  'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>{c.confidence}</span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] text-white/40">{c.source} ({c.year})</span>
                                {c.pmid && <span className="text-[10px] text-white/30 font-mono">PMID: {c.pmid}</span>}
                                {(() => {
                                  const href = c.doi ? `https://doi.org/${c.doi}` : c.url ? c.url : c.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/` : null;
                                  return href ? (
                                    <a
                                      href={href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-teal-400 hover:text-teal-300 flex items-center gap-0.5 transition-colors"
                                    >
                                      <ExternalLink className="w-2.5 h-2.5" /> {c.pmid && !c.doi && !c.url ? 'PubMed' : 'View Source'}
                                    </a>
                                  ) : null;
                                })()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Save Brief to Vault button — only shown when a vault product was selected */}
                      {selectedVaultId && generatedScriptBrief && (
                        <button
                          onClick={handleSaveScriptBrief}
                          disabled={isSavingBrief || briefSaved}
                          className={`w-full text-[10px] border rounded-lg py-2 transition-colors flex items-center justify-center gap-1.5 ${
                            briefSaved
                              ? 'text-green-400 border-green-500/30 bg-green-500/5'
                              : 'text-amber-400/70 hover:text-amber-300 border-amber-500/20 hover:border-amber-500/40'
                          }`}
                        >
                          {isSavingBrief ? (
                            <><RefreshCw className="w-3 h-3 animate-spin" /> Saving...</>  
                          ) : briefSaved ? (
                            <><CheckCircle2 className="w-3 h-3" /> Research Brief Saved to Vault</>
                          ) : (
                            <><BookMarked className="w-3 h-3" /> Save Research Brief to Vault</>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {/* ─── UPGRADE 3: Generate Visuals Panel ─────────────────────────────────────────────────────────────────── */}
                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest">Generate Visuals</p>
                        <p className="text-[10px] text-white/30 mt-0.5">AI-generated infographics, citation cards, and pathway diagrams for this script</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleGenerateVisuals}
                        disabled={isGeneratingVisuals}
                        className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shrink-0"
                      >
                        {isGeneratingVisuals ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                        <span className="ml-1.5">{isGeneratingVisuals ? 'Generating...' : generatedVisuals.length > 0 ? 'Regenerate' : 'Generate Visuals'}</span>
                      </Button>
                    </div>

                    {isGeneratingVisuals && (
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-32 rounded-lg bg-white/5 border border-white/10 animate-pulse" />
                        ))}
                        <p className="text-[10px] text-white/30 text-center">Generating {3} visuals — this takes 20-40 seconds</p>
                      </div>
                    )}

                    {!isGeneratingVisuals && generatedVisuals.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-white/40">{generatedVisuals.length} visual{generatedVisuals.length > 1 ? 's' : ''} ready</p>
                          <button
                            onClick={() => setShowVisuals(v => !v)}
                            className="text-[10px] text-purple-400/70 hover:text-purple-300 flex items-center gap-1 transition-colors"
                          >
                            {showVisuals ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            {showVisuals ? 'Collapse' : 'View All'}
                          </button>
                        </div>
                        {showVisuals && (
                          <div className="grid grid-cols-1 gap-4">
                            {generatedVisuals.map((v, i) => (
                              <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <p className="text-[10px] font-semibold text-purple-300 uppercase tracking-widest">
                                    {v.visualType === 'infographic' ? 'Infographic Card' :
                                     v.visualType === 'citation-card' ? 'Citation Card' :
                                     'Pathway Diagram'}
                                  </p>
                                  <a
                                    href={v.imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
                                  >
                                    <ExternalLink className="w-2.5 h-2.5" /> Open Full Size
                                  </a>
                                </div>
                                <img
                                  src={v.imageUrl}
                                  alt={v.caption || `Visual ${i + 1}`}
                                  className="w-full rounded-lg border border-purple-500/20 object-contain bg-[#0a1628]"
                                />
                                {v.caption && (
                                  <p className="text-[10px] text-white/40 text-center">{v.caption}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {!isGeneratingVisuals && generatedVisuals.length === 0 && (
                      <p className="text-[10px] text-white/30 text-center py-2">Click "Generate Visuals" to create infographic cards and citation graphics for this script</p>
                    )}
                  </div>

                </div>
              )}

              {/* ── BATCH GENERATION RESULTS ── */}
              {mode === 'generate' && batchResults && batchResults.length > 0 && (
                <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-teal-300 uppercase tracking-widest">All 9 Core Hook Scripts</p>
                      <p className="text-[10px] text-white/30 mt-0.5">Click any hook to expand its full script</p>
                    </div>
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-1 rounded-full border border-teal-500/30">{batchResults.length} scripts</span>
                  </div>

                  <div className="space-y-2">
                    {batchResults.map((item) => (
                      <div key={item.hookId} className="rounded-lg border border-white/10 bg-black/30 overflow-hidden">
                        {/* Hook Header */}
                        <button
                          onClick={() => setExpandedBatchHook(expandedBatchHook === item.hookId ? null : item.hookId)}
                          className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors text-left"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white/80">{item.hookName}</p>
                            <p className="text-[10px] text-white/40 mt-0.5 truncate">"{item.openingLine}"</p>
                          </div>
                          <div className="flex items-center gap-2 ml-3 shrink-0">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                              item.hookCategory === 'tier1'
                                ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>{item.hookCategory === 'tier1' ? 'T1' : 'T2'}</span>
                            {expandedBatchHook === item.hookId
                              ? <ChevronUp className="w-3.5 h-3.5 text-white/40" />
                              : <ChevronDown className="w-3.5 h-3.5 text-white/40" />}
                          </div>
                        </button>

                        {/* Expanded Script */}
                        {expandedBatchHook === item.hookId && (
                          <div className="border-t border-white/10 p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] font-semibold text-teal-400 uppercase tracking-widest">Full Script</p>
                              <div className="flex gap-2">
                                <button onClick={() => copyToClipboard(item.script, 'Script copied!')} className="text-white/20 hover:text-white/60 transition-colors">
                                  <Copy className="w-3 h-3" />
                                </button>
                                <button onClick={() => handleSaveScript(item.script, item.hookName)} className="text-white/20 hover:text-amber-400 transition-colors">
                                  <Star className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="font-mono text-xs text-white/80 leading-relaxed whitespace-pre-wrap">{renderScriptWithVisualCues(item.script)}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const allScripts = batchResults.map(r => `=== ${r.hookName} ===\n${r.script}`).join('\n\n');
                      copyToClipboard(allScripts, 'All 13 scripts copied!');
                    }}
                    className="w-full border-teal-500/30 text-teal-300 hover:bg-teal-500/10 bg-transparent text-xs"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy All 13 Scripts
                  </Button>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
