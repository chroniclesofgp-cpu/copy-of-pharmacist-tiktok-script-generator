/**
 * SAVED SCRIPTS PAGE
 * Library of all saved scripts — searchable, filterable, expandable
 */

import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useSavedScripts } from '@/contexts/SavedScriptsContext';
import {
  Pill,
  ArrowLeft,
  Copy,
  Trash2,
  BookMarked,
  Wand2,
  FlaskConical,
  GitBranch,
  ShoppingCart,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
} from 'lucide-react';

export default function SavedScripts() {
  const { savedScripts, deleteScript, clearAll } = useSavedScripts();

  // ── Search & filter state ──────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Derived values ─────────────────────────────────────────────────────────
  const allModes = useMemo(() => {
    const modes = new Set(savedScripts.map(s => s.mode));
    return Array.from(modes);
  }, [savedScripts]);

  const filteredScripts = useMemo(() => {
    let result = savedScripts;

    // Mode filter
    if (filterMode !== 'all') {
      result = result.filter(s => s.mode === filterMode);
    }

    // Search — matches product name, hook name, or script content
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.productName.toLowerCase().includes(q) ||
        s.hookName.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q)
      );
    }

    return result;
  }, [savedScripts, filterMode, searchQuery]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success('Copied to clipboard!'));
  };

  const modeIcon = (mode: string) => {
    if (mode === 'generate') return <Wand2 className="w-3.5 h-3.5 text-teal-400" />;
    if (mode === 'clone') return <FlaskConical className="w-3.5 h-3.5 text-purple-400" />;
    if (mode === 'bof') return <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />;
    return <GitBranch className="w-3.5 h-3.5 text-orange-400" />;
  };

  const modeColor = (mode: string) => {
    if (mode === 'generate') return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
    if (mode === 'clone') return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    if (mode === 'bof') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
  };

  const modeLabel = (mode: string) => {
    if (mode === 'generate') return 'Generate';
    if (mode === 'clone') return 'Clone';
    if (mode === 'bof') return 'ShopScript BOF';
    return 'Iterate';
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-white/10 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-20 bg-[#0a0f1e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center flex-shrink-0">
            <Pill className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white font-mono">RxContent</h1>
            <p className="text-[10px] text-white/40 tracking-widest uppercase">Saved Scripts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {savedScripts.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { if (confirm('Clear all saved scripts?')) { clearAll(); toast.success('All scripts cleared'); } }}
              className="text-red-400/60 hover:text-red-400 text-xs gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear All</span>
            </Button>
          )}
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white gap-1.5 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Generator</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {savedScripts.length === 0 ? (
          /* ── Empty state ─────────────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-20 md:py-24 text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <BookMarked className="w-8 h-8 text-white/20" />
            </div>
            <h2 className="text-lg font-semibold text-white/60 mb-2">No saved scripts yet</h2>
            <p className="text-sm text-white/30 mb-6">Generate a script and click the Save button to build your library.</p>
            <Link href="/">
              <Button className="bg-teal-500 hover:bg-teal-400 text-black font-bold text-sm">
                Go Generate a Script
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* ── Search + filter bar ───────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by product, hook, or content…"
                  className="pl-8 pr-8 bg-white/5 border-white/10 text-white placeholder:text-white/25 text-xs h-8 focus-visible:ring-teal-500/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Mode filter pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter className="w-3 h-3 text-white/30 flex-shrink-0" />
                <button
                  onClick={() => setFilterMode('all')}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors font-medium ${
                    filterMode === 'all'
                      ? 'bg-white/15 border-white/30 text-white'
                      : 'bg-transparent border-white/10 text-white/40 hover:text-white/60'
                  }`}
                >
                  All
                </button>
                {allModes.map(m => (
                  <button
                    key={m}
                    onClick={() => setFilterMode(m)}
                    className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border transition-colors font-medium ${
                      filterMode === m
                        ? modeColor(m)
                        : 'bg-transparent border-white/10 text-white/40 hover:text-white/60'
                    }`}
                  >
                    {modeIcon(m)}
                    {modeLabel(m)}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Results count ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                {filteredScripts.length === savedScripts.length
                  ? `${savedScripts.length} Script${savedScripts.length !== 1 ? 's' : ''}`
                  : `${filteredScripts.length} of ${savedScripts.length} Scripts`}
              </p>
              {(searchQuery || filterMode !== 'all') && (
                <button
                  onClick={() => { setSearchQuery(''); setFilterMode('all'); }}
                  className="text-[10px] text-teal-400/60 hover:text-teal-400 transition-colors flex items-center gap-1"
                >
                  <X className="w-2.5 h-2.5" /> Clear filters
                </button>
              )}
            </div>

            {/* ── No results ────────────────────────────────────────────────── */}
            {filteredScripts.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
                <p className="text-sm text-white/40">No scripts match your search.</p>
                <button
                  onClick={() => { setSearchQuery(''); setFilterMode('all'); }}
                  className="mt-2 text-xs text-teal-400/70 hover:text-teal-400 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* ── Script cards ──────────────────────────────────────────────── */}
            {filteredScripts.map((script) => {
              const isExpanded = expandedId === script.id;
              return (
                <div
                  key={script.id}
                  className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden"
                >
                  {/* Card header — always visible */}
                  <div className="p-4 md:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-wrap min-w-0 flex-1">
                        <span className={`flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 mt-0.5 ${modeColor(script.mode)}`}>
                          {modeIcon(script.mode)}
                          {modeLabel(script.mode)}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-white leading-tight">{script.productName}</h3>
                          <p className="text-[11px] text-white/40 mt-0.5 leading-tight">{script.hookName}</p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[10px] text-white/25 hidden sm:block">
                          {new Date(script.savedAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => copyToClipboard(script.content)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
                          title="Copy full script"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { deleteScript(script.id); toast.success('Script deleted'); if (expandedId === script.id) setExpandedId(null); }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                          title="Delete script"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Date on mobile */}
                    <p className="text-[10px] text-white/25 mt-1.5 sm:hidden">
                      {new Date(script.savedAt).toLocaleDateString()}
                    </p>

                    {/* Preview — first 3 lines, always visible */}
                    <div className="mt-3">
                      <pre className="font-mono text-xs text-white/50 leading-relaxed whitespace-pre-wrap line-clamp-3 overflow-hidden">
                        {script.content}
                      </pre>
                    </div>

                    {/* Expand / collapse toggle */}
                    <button
                      onClick={() => toggleExpand(script.id)}
                      className="mt-2.5 text-[10px] text-teal-400/60 hover:text-teal-400 transition-colors flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <><ChevronUp className="w-3 h-3" /> Collapse script</>
                      ) : (
                        <><ChevronDown className="w-3 h-3" /> Expand full script</>
                      )}
                    </button>
                  </div>

                  {/* Expanded full script */}
                  {isExpanded && (
                    <div className="border-t border-white/10 bg-black/20 p-4 md:p-5">
                      <pre className="font-mono text-xs text-white/70 leading-relaxed whitespace-pre-wrap">
                        {script.content}
                      </pre>
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(script.content)}
                          className="text-[10px] text-teal-400/70 hover:text-teal-400 transition-colors flex items-center gap-1 border border-teal-500/20 rounded-lg px-3 py-1.5"
                        >
                          <Copy className="w-3 h-3" /> Copy full script
                        </button>
                        <button
                          onClick={() => setExpandedId(null)}
                          className="text-[10px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
                        >
                          <ChevronUp className="w-3 h-3" /> Collapse
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
