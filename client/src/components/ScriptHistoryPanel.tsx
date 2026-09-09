/**
 * SCRIPT HISTORY PANEL
 * Slide-in panel for viewing, searching, and managing saved BOF scripts.
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  BookMarked,
  X,
  Copy,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  FileText,
  Pencil,
  Check,
} from 'lucide-react';

interface ScriptHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScriptHistoryPanel({ isOpen, onClose }: ScriptHistoryPanelProps) {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [notesValue, setNotesValue] = useState('');

  const utils = trpc.useUtils();

  const { data: scripts = [], isLoading } = trpc.savedScripts.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const deleteMutation = trpc.savedScripts.delete.useMutation({
    onSuccess: () => {
      utils.savedScripts.getAll.invalidate();
      toast.success('Script deleted');
    },
    onError: (err) => toast.error(err.message || 'Failed to delete script'),
  });

  const updateNotesMutation = trpc.savedScripts.updateNotes.useMutation({
    onSuccess: () => {
      utils.savedScripts.getAll.invalidate();
      setEditingNotesId(null);
      toast.success('Notes saved');
    },
    onError: (err) => toast.error(err.message || 'Failed to save notes'),
  });

  const copyToClipboard = (text: string, label = 'Copied!') => {
    navigator.clipboard.writeText(text).then(() => toast.success(label));
  };

  const filteredScripts = scripts.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.productName.toLowerCase().includes(q) ||
      s.hookName.toLowerCase().includes(q) ||
      s.fullScript.toLowerCase().includes(q) ||
      (s.notes && s.notes.toLowerCase().includes(q))
    );
  });

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-96 bg-[#0d1426] border-l border-white/10 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-white">Script History</span>
            {scripts.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {scripts.length}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        {scripts.length > 0 && (
          <div className="px-4 py-2.5 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search scripts..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 text-xs h-8 pl-8"
              />
            </div>
          </div>
        )}

        {/* Script list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-amber-400/40 animate-spin" />
            </div>
          )}

          {!isLoading && !isAuthenticated && (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-white/30">Sign in to view your saved scripts.</p>
            </div>
          )}

          {!isLoading && isAuthenticated && scripts.length === 0 && (
            <div className="px-4 py-8 text-center">
              <FileText className="w-8 h-8 text-white/10 mx-auto mb-2" />
              <p className="text-xs text-white/30">No scripts saved yet.</p>
              <p className="text-[10px] text-white/20 mt-1">Save scripts from the generator to build your library.</p>
            </div>
          )}

          {!isLoading && isAuthenticated && filteredScripts.length === 0 && scripts.length > 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-white/30">No scripts match your search.</p>
            </div>
          )}

          <div className="divide-y divide-white/5">
            {filteredScripts.map(script => {
              const isExpanded = expandedId === script.id;
              const isEditingNotes = editingNotesId === script.id;

              return (
                <div key={script.id} className="px-4 py-3">
                  {/* Script header */}
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white/80 truncate">{script.productName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-amber-400/60">{script.hookName}</span>
                        {script.creatorVoice && script.creatorVoice !== 'hybrid' && (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-white/5 text-white/30 border border-white/10">
                            {script.creatorVoice === 'faith' ? '@faith' : script.creatorVoice === 'dealscope' ? '@dealscope' : script.creatorVoice}
                          </span>
                        )}
                        <span className="text-[9px] text-white/20">{formatDate(script.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => copyToClipboard(script.fullScript, 'Script copied!')}
                        className="p-1 text-white/30 hover:text-amber-300 transition-colors"
                        title="Copy script"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate({ id: script.id })}
                        className="p-1 text-white/30 hover:text-red-400 transition-colors"
                        title="Delete script"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : script.id)}
                        className="p-1 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Script preview (collapsed) */}
                  {!isExpanded && (
                    <p className="text-[10px] text-white/25 mt-1.5 line-clamp-2 font-mono leading-relaxed">
                      {script.fullScript}
                    </p>
                  )}

                  {/* Expanded view */}
                  {isExpanded && (
                    <div className="mt-3 space-y-3">
                      {/* Full script */}
                      <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">Full Script</p>
                          <button
                            onClick={() => copyToClipboard(script.fullScript, 'Script copied!')}
                            className="text-white/20 hover:text-amber-300 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-white/80 font-mono leading-relaxed whitespace-pre-wrap">
                          {script.fullScript}
                        </p>
                      </div>

                      {/* Script breakdown if available */}
                      {(script.verbalHook || script.dealReveal || script.urgencyClose) && (
                        <div className="space-y-1.5">
                          {script.textHook && (
                            <div className="bg-white/3 rounded-lg p-2.5 border border-amber-500/15">
                              <p className="text-[9px] text-amber-400/50 mb-1">📱 Text Hook</p>
                              <p className="text-xs text-white/60">{script.textHook}</p>
                            </div>
                          )}
                          {script.verbalHook && (
                            <div className="bg-white/3 rounded-lg p-2.5 border border-amber-500/15">
                              <p className="text-[9px] text-amber-400/50 mb-1">🎤 Verbal Hook</p>
                              <p className="text-xs text-white/60">{script.verbalHook}</p>
                            </div>
                          )}
                          {script.urgencyClose && (
                            <div className="bg-white/3 rounded-lg p-2.5 border border-red-500/15">
                              <p className="text-[9px] text-red-400/50 mb-1">⏰ Urgency Close</p>
                              <p className="text-xs text-white/60">{script.urgencyClose}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      <div>
                        {isEditingNotes ? (
                          <div className="space-y-2">
                            <Input
                              value={notesValue}
                              onChange={e => setNotesValue(e.target.value)}
                              placeholder="Add notes about this script..."
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 text-xs h-8"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => updateNotesMutation.mutate({ id: script.id, notes: notesValue })}
                                disabled={updateNotesMutation.isPending}
                                size="sm"
                                className="bg-amber-500 hover:bg-amber-400 text-black text-xs h-7 px-3"
                              >
                                <Check className="w-3 h-3 mr-1" /> Save
                              </Button>
                              <Button
                                onClick={() => setEditingNotesId(null)}
                                size="sm"
                                variant="ghost"
                                className="text-white/40 hover:text-white text-xs h-7 px-3"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingNotesId(script.id);
                              setNotesValue(script.notes || '');
                            }}
                            className="flex items-center gap-1.5 text-[10px] text-white/25 hover:text-amber-400/60 transition-colors"
                          >
                            <Pencil className="w-3 h-3" />
                            {script.notes ? script.notes : 'Add notes...'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
