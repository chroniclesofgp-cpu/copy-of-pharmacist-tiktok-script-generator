/**
 * PRODUCT LIBRARY PANEL
 * Slide-in panel for managing saved products and auto-filling the BOF form.
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  ChevronRight,
  Loader2,
} from 'lucide-react';

export interface ProductEntry {
  id: number;
  name: string;
  description: string | null;
  keyBenefit: string | null;
  category: string | null;
}

interface ProductLibraryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: ProductEntry) => void;
}

export function ProductLibraryPanel({ isOpen, onClose, onSelect }: ProductLibraryPanelProps) {
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state for add/edit
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formKeyBenefit, setFormKeyBenefit] = useState('');
  const [formCategory, setFormCategory] = useState('');

  const utils = trpc.useUtils();

  const { data: products = [], isLoading } = trpc.products.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      utils.products.getAll.invalidate();
      resetForm();
      toast.success('Product saved to library!');
    },
    onError: (err) => toast.error(err.message || 'Failed to save product'),
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      utils.products.getAll.invalidate();
      setEditingId(null);
      resetForm();
      toast.success('Product updated!');
    },
    onError: (err) => toast.error(err.message || 'Failed to update product'),
  });

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      utils.products.getAll.invalidate();
      toast.success('Product removed from library');
    },
    onError: (err) => toast.error(err.message || 'Failed to delete product'),
  });

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormKeyBenefit('');
    setFormCategory('');
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (product: ProductEntry) => {
    setEditingId(product.id);
    setFormName(product.name);
    setFormDescription(product.description || '');
    setFormKeyBenefit(product.keyBenefit || '');
    setFormCategory(product.category || '');
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!formName.trim()) { toast.error('Product name is required'); return; }
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        name: formName.trim(),
        description: formDescription.trim() || undefined,
        keyBenefit: formKeyBenefit.trim() || undefined,
        category: formCategory.trim() || undefined,
      });
    } else {
      createMutation.mutate({
        name: formName.trim(),
        description: formDescription.trim() || undefined,
        keyBenefit: formKeyBenefit.trim() || undefined,
        category: formCategory.trim() || undefined,
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-[#0d1426] border-l border-white/10 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-white">Product Library</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add new product button */}
        {!isAdding && !editingId && (
          <div className="px-4 pt-3 pb-2">
            <Button
              onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); setIsAdding(true); }}
              size="sm"
              className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs"
              variant="ghost"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add New Product
            </Button>
          </div>
        )}

        {/* Add/Edit form */}
        {(isAdding || editingId) && (
          <div className="px-4 py-3 border-b border-white/10 space-y-2.5 bg-amber-500/5">
            <p className="text-[10px] text-amber-400/60 uppercase tracking-widest font-semibold">
              {editingId ? 'Edit Product' : 'New Product'}
            </p>
            <Input
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="Product name *"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 text-xs h-8"
              autoFocus
            />
            <Input
              value={formDescription}
              onChange={e => setFormDescription(e.target.value)}
              placeholder="Short description (optional)"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 text-xs h-8"
            />
            <Input
              value={formKeyBenefit}
              onChange={e => setFormKeyBenefit(e.target.value)}
              placeholder="Key benefit / proof point (optional)"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 text-xs h-8"
            />
            <Input
              value={formCategory}
              onChange={e => setFormCategory(e.target.value)}
              placeholder="Category (e.g. Skincare, Supplements)"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 text-xs h-8"
            />
            <div className="flex gap-2 pt-1">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                size="sm"
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold h-7"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 mr-1" />}
                {editingId ? 'Update' : 'Save'}
              </Button>
              <Button
                onClick={resetForm}
                size="sm"
                variant="ghost"
                className="text-white/40 hover:text-white text-xs h-7 px-3"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Product list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-amber-400/40 animate-spin" />
            </div>
          )}

          {!isLoading && !isAuthenticated && (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-white/30">Sign in to save products to your library.</p>
            </div>
          )}

          {!isLoading && isAuthenticated && products.length === 0 && !isAdding && (
            <div className="px-4 py-8 text-center">
              <Package className="w-8 h-8 text-white/10 mx-auto mb-2" />
              <p className="text-xs text-white/30">No products saved yet.</p>
              <p className="text-[10px] text-white/20 mt-1">Add products to auto-fill the form.</p>
            </div>
          )}

          <div className="divide-y divide-white/5">
            {products.map(product => (
              <div key={product.id} className="px-4 py-3 hover:bg-white/3 group">
                {editingId === product.id ? null : (
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white/80 truncate">{product.name}</p>
                      {product.category && (
                        <p className="text-[10px] text-amber-400/50 mt-0.5">{product.category}</p>
                      )}
                      {product.keyBenefit && (
                        <p className="text-[10px] text-white/30 mt-0.5 line-clamp-2">{product.keyBenefit}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => startEdit(product as ProductEntry)}
                        className="p-1 text-white/30 hover:text-amber-300 transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate({ id: product.id })}
                        className="p-1 text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => { onSelect(product as ProductEntry); onClose(); }}
                      className="flex-shrink-0 p-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 transition-colors"
                      title="Use this product"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
