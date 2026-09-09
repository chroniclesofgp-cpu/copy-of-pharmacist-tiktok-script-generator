import { useState } from 'react';
import { PRODUCT_LIBRARY, PRODUCT_CATEGORIES, type ProductProfile } from '@/lib/productLibrary';
import { BookOpen, ChevronDown, ChevronUp, X, ShieldCheck, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { HOOKS } from '@/lib/scriptData';

// Vault item shape (subset of ProductVault from schema)
interface VaultItem {
  id: number;
  productName: string;
  verdict: string;
  talkingPoints: string | null;
  hookRecommendation: string | null;
  affiliateLink: string | null;
  category: string | null;
}

// Parsed hook recommendation
interface HookRec { hookId: string; rationale: string }

const VERDICT_ICON = {
  promote: { icon: CheckCircle2, color: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  caution: { icon: AlertTriangle, color: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  avoid: { icon: XCircle, color: 'text-red-400', badge: 'bg-red-500/20 text-red-300 border-red-500/30' },
};

interface ProductLibraryProps {
  onSelect: (product: ProductProfile) => void;
  onSelectVault?: (item: VaultItem, hookId: string | null) => void;
  onClear?: () => void;
  selectedProductId?: string;
}

export function ProductLibrary({ onSelect, onSelectVault, onClear, selectedProductId }: ProductLibraryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Fetch vault items only when authenticated and panel is open
  const { data: vaultItems } = trpc.vetting.listVault.useQuery(
    undefined,
    { enabled: isAuthenticated && isOpen }
  );

  const filteredProducts = activeCategory
    ? PRODUCT_LIBRARY.filter(p => p.category === activeCategory)
    : PRODUCT_LIBRARY;

  const selectedProduct = selectedProductId
    ? PRODUCT_LIBRARY.find(p => p.id === selectedProductId)
    : null;

  const parseFirstHookId = (hookRecommendation: string | null): string | null => {
    if (!hookRecommendation) return null;
    try {
      const parsed = JSON.parse(hookRecommendation) as HookRec[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].hookId;
    } catch {
      // Legacy plain hookId string
      return hookRecommendation;
    }
    return null;
  };

  const handleVaultSelect = (item: VaultItem) => {
    const hookId = parseFirstHookId(item.hookRecommendation);
    // Build a ProductProfile-compatible object from vault data
    const talkingPoints: string[] = (() => {
      if (!item.talkingPoints) return [];
      try { return JSON.parse(item.talkingPoints) as string[]; } catch { return []; }
    })();
    const syntheticProfile: ProductProfile = {
      id: `vault-${item.id}`,
      name: item.productName,
      category: item.category ?? 'Supplement',
      keyBenefit: talkingPoints[0] ?? '',
      description: talkingPoints.join(' '),
      emoji: '🔬',
      topHooks: hookId ? [hookId] : [],
    };
    onSelect(syntheticProfile);
    onSelectVault?.(item, hookId);
    setIsOpen(false);
  };

  return (
    <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-teal-500/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-400" />
          <span className="text-sm font-semibold text-teal-300">Product Library</span>
          {selectedProduct ? (
            <span className="text-[10px] text-teal-300 bg-teal-500/20 border border-teal-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              {selectedProduct.emoji} {selectedProduct.name}
              <button
                onClick={e => {
                  e.stopPropagation();
                  onClear?.();
                }}
                className="ml-0.5 hover:text-white transition-colors"
                aria-label="Clear product selection"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ) : (
            <span className="text-[10px] text-teal-500/70 bg-teal-500/15 px-2 py-0.5 rounded-full">
              {PRODUCT_LIBRARY.length} quick-start products
              {vaultItems && vaultItems.length > 0 && ` · ${vaultItems.length} saved`}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-teal-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-teal-400" />
        )}
      </button>

      {/* Expanded panel */}
      {isOpen && (
        <div className="border-t border-teal-500/20 px-4 pb-4 pt-3 space-y-4">

          {/* ── MY PRODUCTS (Vault) ── */}
          {isAuthenticated && vaultItems && vaultItems.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                <p className="text-[10px] text-violet-300 font-semibold uppercase tracking-widest">My Products</p>
                <span className="text-[9px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded-full border border-white/10">{vaultItems.length}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {vaultItems.map(item => {
                  const verdictKey = (item.verdict as string) in VERDICT_ICON ? item.verdict as keyof typeof VERDICT_ICON : 'caution';
                  const { icon: VIcon, color: vColor, badge: vBadge } = VERDICT_ICON[verdictKey];
                  const hookId = parseFirstHookId(item.hookRecommendation);
                  const hookName = hookId ? (HOOKS.find(h => h.id === hookId)?.name ?? hookId) : null;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleVaultSelect(item)}
                      className="flex flex-col items-start gap-1.5 p-3 rounded-lg border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/40 transition-all text-left group"
                    >
                      <div className="flex items-center gap-1.5 w-full">
                        <VIcon className={`w-3.5 h-3.5 flex-shrink-0 ${vColor}`} />
                        <span className="text-[11px] font-semibold text-white/90 group-hover:text-white leading-tight truncate flex-1">
                          {item.productName}
                        </span>
                      </div>
                      {hookName && (
                        <span className="text-[9px] text-teal-400/70 truncate w-full">{hookName}</span>
                      )}
                      {item.category && (
                        <span className="text-[9px] text-white/30">{item.category}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── QUICK START (Static profiles) ── */}
          <div>
            {isAuthenticated && vaultItems && vaultItems.length > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                <p className="text-[10px] text-teal-300 font-semibold uppercase tracking-widest">Quick Start</p>
              </div>
            )}
            {(!isAuthenticated || !vaultItems || vaultItems.length === 0) && (
              <p className="text-[10px] text-white/40 mb-3">
                Tap any product to auto-fill the form and highlight the best hooks in the sidebar
              </p>
            )}

            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                onClick={() => setActiveCategory(null)}
                className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors ${
                  activeCategory === null
                    ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                    : 'border-white/10 text-white/40 hover:text-white/60 hover:border-white/20'
                }`}
              >
                All
              </button>
              {PRODUCT_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors ${
                    activeCategory === cat
                      ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                      : 'border-white/10 text-white/40 hover:text-white/60 hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => {
                    onSelect(product);
                    setIsOpen(false);
                  }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all text-center group ${
                    selectedProductId === product.id
                      ? 'bg-teal-500/20 border-teal-500/40'
                      : 'border-white/10 bg-white/[0.03] hover:bg-teal-500/10 hover:border-teal-500/30'
                  }`}
                >
                  <span className="text-2xl">{product.emoji}</span>
                  <span className={`text-[11px] font-semibold leading-tight ${
                    selectedProductId === product.id ? 'text-teal-200' : 'text-white/80 group-hover:text-white'
                  }`}>
                    {product.name}
                  </span>
                  <span className={`text-[9px] ${
                    selectedProductId === product.id ? 'text-teal-400/70' : 'text-white/30 group-hover:text-teal-400/70'
                  }`}>
                    {product.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
