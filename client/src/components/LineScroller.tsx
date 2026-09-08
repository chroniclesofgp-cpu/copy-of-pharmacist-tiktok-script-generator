/**
 * LINE SCROLLER
 * Allows users to scroll through available line options for each script section.
 * - Hybrid/Assembly hooks: scroll individual lines per section
 * - Verbatim hooks: swap entire template variant
 */

import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface LineScrollerProps {
  label: string;
  lines: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  color?: 'amber' | 'orange' | 'red';
  className?: string;
}

export function LineScroller({
  label,
  lines,
  currentIndex,
  onIndexChange,
  color = 'amber',
  className = '',
}: LineScrollerProps) {
  if (!lines || lines.length === 0) return null;

  const colorMap = {
    amber: {
      border: 'border-amber-500/20',
      label: 'text-amber-400/60',
      button: 'text-white/30 hover:text-amber-300',
      counter: 'text-amber-400/40',
    },
    orange: {
      border: 'border-orange-500/20',
      label: 'text-orange-400/60',
      button: 'text-white/30 hover:text-orange-300',
      counter: 'text-orange-400/40',
    },
    red: {
      border: 'border-red-500/20',
      label: 'text-red-400/60',
      button: 'text-white/30 hover:text-red-300',
      counter: 'text-red-400/40',
    },
  };

  const c = colorMap[color];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < lines.length - 1;

  return (
    <div className={`bg-white/3 rounded-lg border ${c.border} p-3 ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        <p className={`text-[10px] uppercase tracking-widest font-semibold ${c.label}`}>{label}</p>
        <div className="flex items-center gap-1">
          <span className={`text-[9px] ${c.counter}`}>
            {currentIndex + 1} / {lines.length}
          </span>
          <button
            onClick={() => onIndexChange(hasPrev ? currentIndex - 1 : lines.length - 1)}
            className={`p-0.5 rounded transition-colors ${c.button}`}
            title="Previous option"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onIndexChange(hasNext ? currentIndex + 1 : 0)}
            className={`p-0.5 rounded transition-colors ${c.button}`}
            title="Next option"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p className="text-sm text-white/80 leading-relaxed font-mono">{lines[currentIndex]}</p>
      {lines.length > 1 && (
        <div className="flex gap-1 mt-2">
          {lines.map((_, i) => (
            <button
              key={i}
              onClick={() => onIndexChange(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === currentIndex ? 'bg-amber-400' : 'bg-white/15 hover:bg-white/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Template Swap (for verbatim hooks) ──────────────────────────────────────

interface TemplateSwapProps {
  templates: Array<{
    description: string;
    creator: string;
    template?: string;
    fullScript?: string;
    slots?: string[];
  }>;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  isLoading?: boolean;
}

export function TemplateSwap({ templates, currentIndex, onIndexChange, isLoading = false }: TemplateSwapProps) {
  if (!templates || templates.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
      <RefreshCw className={`w-3 h-3 text-amber-400/40 flex-shrink-0 ${isLoading ? 'animate-spin' : ''}`} />
      <p className="text-[10px] text-white/30 flex-1">{isLoading ? 'Generating...' : 'Template variant:'}</p>
      <div className="flex gap-1">
        {templates.map((t, i) => (
          <button
            key={i}
            onClick={() => !isLoading && onIndexChange(i)}
            disabled={isLoading}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all border ${
              i === currentIndex
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : isLoading
                  ? 'text-white/20 border-white/5 cursor-not-allowed'
                  : 'text-white/30 hover:text-white/60 border-white/10 hover:border-white/20'
            }`}
            title={t.description}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <span className="text-[9px] text-white/20">{templates[currentIndex]?.description}</span>
    </div>
  );
}
