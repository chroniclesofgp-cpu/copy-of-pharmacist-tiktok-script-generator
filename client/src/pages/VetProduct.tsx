/**
 * VET A PRODUCT — Product Vetting + Product Vault
 * Design: Clinical Command Center (matches RxContent / BOF aesthetic)
 * Two sub-tabs: Vet New Product | My Vault
 */

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { HOOKS, PRODUCT_CATEGORY_META, type ProductCategory } from '@/lib/scriptData';
import {
  FlaskConical,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  BookMarked,
  ChevronRight,
  Loader2,
  Trash2,
  Pencil,
  Save,
  X,
  ExternalLink,
  Zap,
  Info,
  BookOpen,
} from 'lucide-react';

// VettingResult type defined inline to avoid cross-boundary import
type IngredientStatus = 'evidence-based' | 'fairy-dusted' | 'unsupported' | 'beneficial';
type HookRecommendation = { hookId: string; rationale: string };
type VettingResult = {
  verdict: 'promote' | 'caution' | 'avoid';
  verdictSummary: string;
  ingredientsAnalysis: Array<{ ingredient: string; status: IngredientStatus; note: string }>;
  doseFlags: string[];
  redFlags: string[];
  betterAlternatives: string[];
  talkingPoints: string[];
  hookRecommendations: HookRecommendation[];
};

type SubTab = 'vet' | 'vault';

const VERDICT_CONFIG = {
  promote: {
    label: '✅ Promote with Confidence',
    color: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
  },
  caution: {
    label: '⚠️ Promote with Caveats',
    color: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
  },
  avoid: {
    label: '❌ Do Not Promote',
    color: 'bg-red-500/15 border-red-500/40 text-red-300',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    icon: XCircle,
    iconColor: 'text-red-400',
  },
};

const INGREDIENT_STATUS_CONFIG = {
  'evidence-based': { label: 'Evidence-Based', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  'beneficial': { label: 'Beneficial', color: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  'fairy-dusted': { label: 'Fairy-Dusted', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  'unsupported': { label: 'Unsupported', color: 'bg-red-500/15 text-red-300 border-red-500/30' },
};

// Rank label for hook recommendation cards
const RANK_LABELS = ['Best Fit', '2nd Best', '3rd Best'];

export default function VetProduct() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [subTab, setSubTab] = useState<SubTab>('vet');

  // ── Vet Form State ──────────────────────────────────────────────────────────
  const [productName, setProductName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [ingredientList, setIngredientList] = useState('');
  const [category, setCategory] = useState<ProductCategory | ''>('');
  const [result, setResult] = useState<VettingResult | null>(null);

  // ── Save to Vault State ─────────────────────────────────────────────────────
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [affiliateLink, setAffiliateLink] = useState('');
  const [userNotes, setUserNotes] = useState('');

  // ── Vault Edit State ────────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editAffiliate, setEditAffiliate] = useState('');

  // ── tRPC ────────────────────────────────────────────────────────────────────
  const analyzeMutation = trpc.vetting.analyze.useMutation();
  const saveToVaultMutation = trpc.vetting.saveToVault.useMutation();
  const updateVaultMutation = trpc.vetting.updateVaultItem.useMutation();
  const deleteVaultMutation = trpc.vetting.deleteVaultItem.useMutation();
  const utils = trpc.useUtils();

  const { data: vaultItems, isLoading: vaultLoading } = trpc.vetting.listVault.useQuery(
    undefined,
    { enabled: isAuthenticated && subTab === 'vault' }
  );

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!productName.trim()) { toast.error('Please enter a product name'); return; }
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    setResult(null);
    setShowSaveForm(false);
    try {
      const res = await analyzeMutation.mutateAsync({
        productName,
        productUrl: productUrl || undefined,
        ingredientList: ingredientList || undefined,
        category: category || undefined,
      });
      setResult(res);
    } catch {
      toast.error('Analysis failed. Please try again.');
    }
  };

  const handleSaveToVault = async () => {
    if (!result) return;
    try {
      await saveToVaultMutation.mutateAsync({
        productName,
        productUrl: productUrl || undefined,
        category: category || undefined,
        verdict: result.verdict,
        ingredientsAnalysis: JSON.stringify(result.ingredientsAnalysis),
        doseFlags: JSON.stringify(result.doseFlags),
        redFlags: JSON.stringify(result.redFlags),
        betterAlternatives: JSON.stringify(result.betterAlternatives),
        talkingPoints: JSON.stringify(result.talkingPoints),
        // Store full hookRecommendations array as JSON
        hookRecommendation: JSON.stringify(result.hookRecommendations),
        affiliateLink: affiliateLink || undefined,
        userNotes: userNotes || undefined,
      });
      toast.success(`${productName} saved to Product Vault`);
      setShowSaveForm(false);
      utils.vetting.listVault.invalidate();
    } catch {
      toast.error('Failed to save to vault. Please try again.');
    }
  };

  const handleDeleteVaultItem = async (id: number, name: string) => {
    try {
      await deleteVaultMutation.mutateAsync({ id });
      toast.success(`${name} removed from vault`);
      utils.vetting.listVault.invalidate();
    } catch {
      toast.error('Failed to delete. Please try again.');
    }
  };

  const handleUpdateVaultItem = async (id: number) => {
    try {
      await updateVaultMutation.mutateAsync({ id, affiliateLink: editAffiliate || undefined, userNotes: editNotes || undefined });
      toast.success('Updated');
      setEditingId(null);
      utils.vetting.listVault.invalidate();
    } catch {
      toast.error('Failed to update. Please try again.');
    }
  };

  // Navigate to Generate Mode with the selected hook pre-populated
  const handleUseHook = (hookId: string) => {
    const params = new URLSearchParams();
    params.set('hook', hookId);
    params.set('product', productName);
    navigate(`/?${params.toString()}`);
  };

  // Navigate from vault item to Generate Mode
  const handleGenerateScript = (item: { productName: string; hookRecommendation: string | null; affiliateLink: string | null }) => {
    const params = new URLSearchParams();
    params.set('product', item.productName);
    if (item.hookRecommendation) {
      // hookRecommendation may be a JSON array or a plain hookId string
      try {
        const parsed = JSON.parse(item.hookRecommendation) as HookRecommendation[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          params.set('hook', parsed[0].hookId);
        }
      } catch {
        // Legacy plain hookId string
        params.set('hook', item.hookRecommendation);
      }
    }
    if (item.affiliateLink) params.set('link', item.affiliateLink);
    navigate(`/?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0a0f1e]/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">RxContent</p>
              <p className="text-[9px] text-white/40 uppercase tracking-widest leading-none mt-0.5">Product Vetting</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Nav tabs */}
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
            <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
              <span className="hidden sm:inline">Vet</span>Product
            </button>
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

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Sub-tab switcher */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <button
              onClick={() => setSubTab('vet')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${subTab === 'vet' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
            >
              <span className="flex items-center gap-2"><FlaskConical className="w-4 h-4" />Vet New Product</span>
            </button>
            <button
              onClick={() => setSubTab('vault')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${subTab === 'vault' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                My Vault
                {vaultItems && vaultItems.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] border border-violet-500/30">{vaultItems.length}</span>
                )}
              </span>
            </button>
          </div>

          {/* ── VET NEW PRODUCT ────────────────────────────────────────────── */}
          {subTab === 'vet' && (
            <div className="space-y-4">
              {/* Input card */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <FlaskConical className="w-4 h-4 text-violet-400" />
                  <p className="text-sm font-semibold text-white">Product Analysis</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">AI-Powered</span>
                </div>
                <p className="text-xs text-white/40">Paste the product name and any available ingredient information. The more detail you provide, the more accurate the analysis.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">Product Name <span className="text-red-400">*</span></label>
                    <Input
                      value={productName}
                      onChange={e => setProductName(e.target.value)}
                      placeholder="e.g. Magnesium Glycinate 400mg"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/30 focus:border-violet-500/60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as ProductCategory | '')}
                      className="w-full h-9 rounded-md bg-white/10 border border-white/30 text-white text-xs px-3 focus:border-violet-500/60 focus:outline-none"
                    >
                      <option value="">Select category...</option>
                      {(Object.keys(PRODUCT_CATEGORY_META) as ProductCategory[]).map(cat => (
                        <option key={cat} value={cat} className="bg-[#0a0f1e]">{PRODUCT_CATEGORY_META[cat].label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">TikTok Shop URL <span className="text-white/30 font-normal">(optional but recommended)</span></label>
                  <Input
                    value={productUrl}
                    onChange={e => setProductUrl(e.target.value)}
                    placeholder="https://www.tiktok.com/..."
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/30 focus:border-violet-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Ingredient List / Supplement Facts <span className="text-white/30 font-normal">(paste from the product listing)</span>
                  </label>
                  <Textarea
                    value={ingredientList}
                    onChange={e => setIngredientList(e.target.value)}
                    placeholder="Paste the full ingredient list or Supplement Facts panel here. Include doses if available (e.g. Magnesium Glycinate 400mg, Vitamin D3 2000IU)..."
                    rows={4}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/30 focus:border-violet-500/60 resize-none"
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={analyzeMutation.isPending || !productName.trim()}
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                >
                  {analyzeMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing...</>
                  ) : (
                    <><FlaskConical className="w-4 h-4 mr-2" />Vet This Product</>
                  )}
                </Button>
              </div>

              {/* Result card */}
              {result && (() => {
                const cfg = VERDICT_CONFIG[result.verdict];
                const VerdictIcon = cfg.icon;
                return (
                  <div className="space-y-4">
                    {/* Verdict banner */}
                    <div className={`rounded-xl border p-4 ${cfg.color}`}>
                      <div className="flex items-center gap-3">
                        <VerdictIcon className={`w-6 h-6 flex-shrink-0 ${cfg.iconColor}`} />
                        <div>
                          <p className="text-sm font-bold">{cfg.label}</p>
                          <p className="text-xs opacity-80 mt-0.5">{result.verdictSummary}</p>
                        </div>
                      </div>
                    </div>

                    {/* Ingredients table */}
                    {result.ingredientsAnalysis.length > 0 && (
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-3">Ingredients Assessment</p>
                        <div className="space-y-2">
                          {result.ingredientsAnalysis.map((ing: { ingredient: string; status: IngredientStatus; note: string }, i: number) => {
                            const sc = INGREDIENT_STATUS_CONFIG[ing.status];
                            return (
                              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5">
                                <span className={`flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded border font-medium mt-0.5 ${sc.color}`}>{sc.label}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-white">{ing.ingredient}</p>
                                  <p className="text-[11px] text-white/50 mt-0.5">{ing.note}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Flags grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {result.doseFlags.length > 0 && (
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                          <p className="text-xs font-semibold text-amber-300/70 uppercase tracking-widest mb-2">Dose Flags</p>
                          <ul className="space-y-1">
                            {result.doseFlags.map((f: string, i: number) => <li key={i} className="text-xs text-amber-200/80 flex gap-2"><span className="text-amber-400 flex-shrink-0">⚠</span>{f}</li>)}
                          </ul>
                        </div>
                      )}
                      {result.redFlags.length > 0 && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                          <p className="text-xs font-semibold text-red-300/70 uppercase tracking-widest mb-2">Red Flags</p>
                          <ul className="space-y-1">
                            {result.redFlags.map((f: string, i: number) => <li key={i} className="text-xs text-red-200/80 flex gap-2"><span className="text-red-400 flex-shrink-0">✗</span>{f}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Better alternatives */}
                    {result.betterAlternatives.length > 0 && (
                      <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
                        <p className="text-xs font-semibold text-sky-300/70 uppercase tracking-widest mb-2">Better Alternatives</p>
                        <ul className="space-y-1">
                          {result.betterAlternatives.map((a: string, i: number) => <li key={i} className="text-xs text-sky-200/80 flex gap-2"><ChevronRight className="w-3 h-3 text-sky-400 flex-shrink-0 mt-0.5" />{a}</li>)}
                        </ul>
                      </div>
                    )}

                    {/* Talking points */}
                    {result.talkingPoints.length > 0 && (
                      <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
                        <p className="text-xs font-semibold text-teal-300/70 uppercase tracking-widest mb-2">Pharmacist Talking Points</p>
                        <ul className="space-y-1.5">
                          {result.talkingPoints.map((tp: string, i: number) => (
                            <li key={i} className="text-xs text-teal-200/80 flex gap-2">
                              <span className="text-teal-400 flex-shrink-0 font-bold">{i + 1}.</span>{tp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Hook recommendations — 2-3 ranked cards */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-3">Recommended Hooks</p>
                      <div className="space-y-2.5">
                        {result.hookRecommendations.map((rec: HookRecommendation, idx: number) => {
                          const hookObj = HOOKS.find(h => h.id === rec.hookId);
                          const hookLabel = hookObj?.name ?? rec.hookId;
                          const rankLabel = RANK_LABELS[idx] ?? `#${idx + 1}`;
                          const isTop = idx === 0;
                          return (
                            <div
                              key={rec.hookId}
                              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${isTop ? 'border-teal-500/30 bg-teal-500/5' : 'border-white/10 bg-white/[0.02]'}`}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${isTop ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : 'bg-white/10 text-white/50 border-white/10'}`}>
                                    {rankLabel}
                                  </span>
                                  <p className="text-xs font-semibold text-white">{hookLabel}</p>
                                </div>
                                <p className="text-[11px] text-white/50">{rec.rationale}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUseHook(rec.hookId)}
                                className={`text-[11px] h-7 px-2.5 flex-shrink-0 gap-1 bg-transparent ${isTop ? 'border-teal-500/40 text-teal-300 hover:bg-teal-500/10 hover:border-teal-400' : 'border-white/20 text-white/60 hover:text-white hover:border-white/40'}`}
                              >
                                <Zap className="w-3 h-3" />Use Hook
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Save to Vault */}
                    {!showSaveForm ? (
                      <Button
                        onClick={() => setShowSaveForm(true)}
                        className="w-full bg-violet-600/80 hover:bg-violet-600 text-white font-semibold border border-violet-500/30"
                        variant="outline"
                      >
                        <Save className="w-4 h-4 mr-2" />Save to Product Vault
                      </Button>
                    ) : (
                      <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4 space-y-3">
                        <p className="text-sm font-semibold text-violet-300">Save to Vault</p>
                        <div>
                          <label className="block text-xs font-semibold text-white/70 mb-1.5">Affiliate Link <span className="text-white/30 font-normal">(optional — add now or later)</span></label>
                          <Input
                            value={affiliateLink}
                            onChange={e => setAffiliateLink(e.target.value)}
                            placeholder="https://www.tiktok.com/..."
                            className="bg-white/10 border-white/30 text-white placeholder:text-white/30 focus:border-violet-500/60"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-white/70 mb-1.5">Your Notes <span className="text-white/30 font-normal">(optional — your pharmacist take)</span></label>
                          <Textarea
                            value={userNotes}
                            onChange={e => setUserNotes(e.target.value)}
                            placeholder="e.g. Good magnesium glycinate but I'd mention the dose is on the lower end. Good for beginners."
                            rows={2}
                            className="bg-white/10 border-white/30 text-white placeholder:text-white/30 focus:border-violet-500/60 resize-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveToVault}
                            disabled={saveToVaultMutation.isPending}
                            className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                          >
                            {saveToVaultMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save to Vault
                          </Button>
                          <Button variant="ghost" onClick={() => setShowSaveForm(false)} className="text-white/50 hover:text-white">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── MY VAULT ──────────────────────────────────────────────────── */}
          {subTab === 'vault' && (
            <div className="space-y-4">
              {!isAuthenticated ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center">
                  <ShieldCheck className="w-10 h-10 text-violet-400/50 mx-auto mb-3" />
                  <p className="text-sm text-white/60 mb-4">Sign in to access your Product Vault</p>
                  <Button onClick={() => window.location.href = getLoginUrl()} className="bg-violet-600 hover:bg-violet-500 text-white">
                    Sign In
                  </Button>
                </div>
              ) : vaultLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                </div>
              ) : !vaultItems || vaultItems.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center">
                  <FlaskConical className="w-10 h-10 text-violet-400/30 mx-auto mb-3" />
                  <p className="text-sm text-white/50 mb-1">Your vault is empty</p>
                  <p className="text-xs text-white/30">Vet a product and save it here to build your approved product library</p>
                  <Button onClick={() => setSubTab('vet')} variant="outline" className="mt-4 border-violet-500/30 text-violet-300 hover:bg-violet-500/10 bg-transparent text-xs">
                    Vet Your First Product
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/40">{vaultItems.length} product{vaultItems.length !== 1 ? 's' : ''} in vault</p>
                    <div className="flex gap-2 text-[10px] text-white/30">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />Promote</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Caution</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Avoid</span>
                    </div>
                  </div>

                  {vaultItems.map(item => {
                    const verdictKey = (item.verdict as string) in VERDICT_CONFIG ? item.verdict as keyof typeof VERDICT_CONFIG : 'caution';
                    const cfg = VERDICT_CONFIG[verdictKey];
                    const VerdictIcon = cfg.icon;
                    const isEditing = editingId === item.id;
                    const talkingPoints = item.talkingPoints ? (() => { try { return JSON.parse(item.talkingPoints) as string[]; } catch { return []; } })() : [];

                    // Parse hookRecommendation: may be JSON array or legacy plain string
                    const parsedHooks: HookRecommendation[] = (() => {
                      if (!item.hookRecommendation) return [];
                      try {
                        const parsed = JSON.parse(item.hookRecommendation);
                        if (Array.isArray(parsed)) return parsed as HookRecommendation[];
                        return [];
                      } catch {
                        // Legacy plain hookId
                        return [{ hookId: item.hookRecommendation, rationale: '' }];
                      }
                    })();
                    const firstHookName = parsedHooks.length > 0
                      ? (HOOKS.find(h => h.id === parsedHooks[0].hookId)?.name ?? parsedHooks[0].hookId)
                      : null;

                    return (
                      <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <VerdictIcon className={`w-5 h-5 flex-shrink-0 ${cfg.iconColor}`} />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{item.productName}</p>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <Badge className={`text-[10px] ${cfg.badgeColor} hover:${cfg.badgeColor}`}>{cfg.label}</Badge>
                                {item.category && (
                                  <span className="text-[10px] text-white/30">{PRODUCT_CATEGORY_META[item.category as ProductCategory]?.label ?? item.category}</span>
                                )}
                                {firstHookName && (
                                  <span className="text-[10px] text-teal-400/60">Hook: {firstHookName}</span>
                                )}
                                <span className="text-[10px] text-white/20">{new Date(item.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              size="sm"
                              onClick={() => handleGenerateScript({ productName: item.productName, hookRecommendation: item.hookRecommendation, affiliateLink: item.affiliateLink })}
                              className="text-[11px] h-7 px-2.5 bg-teal-600/80 hover:bg-teal-600 text-white border-0 gap-1"
                            >
                              <Zap className="w-3 h-3" />Script
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => { setEditingId(isEditing ? null : item.id); setEditNotes(item.userNotes ?? ''); setEditAffiliate(item.affiliateLink ?? ''); }}
                              className="text-white/40 hover:text-white h-7 w-7 p-0"
                            >
                              {isEditing ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteVaultItem(item.id, item.productName)}
                              className="text-red-400/50 hover:text-red-400 h-7 w-7 p-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* Talking points preview */}
                        {talkingPoints.length > 0 && !isEditing && (
                          <div className="space-y-1">
                            <p className="text-[10px] text-white/30 uppercase tracking-widest">Talking Points</p>
                            {(talkingPoints as string[]).slice(0, 2).map((tp: string, i: number) => (
                              <p key={i} className="text-xs text-white/50 flex gap-2"><span className="text-teal-400 flex-shrink-0">{i + 1}.</span>{tp}</p>
                            ))}
                          </div>
                        )}

                        {/* Affiliate link + notes preview */}
                        {!isEditing && (item.affiliateLink || item.userNotes) && (
                          <div className="space-y-1.5 pt-1 border-t border-white/5">
                            {item.affiliateLink && (
                              <div className="flex items-center gap-2">
                                <ExternalLink className="w-3 h-3 text-white/30 flex-shrink-0" />
                                <a href={item.affiliateLink} target="_blank" rel="noopener noreferrer" className="text-[11px] text-teal-400/70 hover:text-teal-400 truncate">{item.affiliateLink}</a>
                              </div>
                            )}
                            {item.userNotes && (
                              <div className="flex items-start gap-2">
                                <Info className="w-3 h-3 text-white/30 flex-shrink-0 mt-0.5" />
                                <p className="text-[11px] text-white/40 italic">{item.userNotes}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Edit form */}
                        {isEditing && (
                          <div className="space-y-3 pt-2 border-t border-white/10">
                            <div>
                              <label className="block text-xs font-semibold text-white/70 mb-1">Affiliate Link</label>
                              <Input value={editAffiliate} onChange={e => setEditAffiliate(e.target.value)} placeholder="https://..." className="bg-white/10 border-white/30 text-white placeholder:text-white/30 focus:border-violet-500/60 h-8 text-xs" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-white/70 mb-1">Your Notes</label>
                              <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={2} className="bg-white/10 border-white/30 text-white placeholder:text-white/30 focus:border-violet-500/60 resize-none text-xs" />
                            </div>
                            <Button onClick={() => handleUpdateVaultItem(item.id)} disabled={updateVaultMutation.isPending} size="sm" className="bg-violet-600 hover:bg-violet-500 text-white text-xs h-8">
                              {updateVaultMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}Save Changes
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
