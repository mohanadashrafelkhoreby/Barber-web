import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_GALLERY } from '../../../data/admin';
import type { GalleryItem, GalleryItemType } from '../../../data/admin';
import {
  ImageIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
  StarFilledIcon,
  StarIcon,
} from '../../../components/admin/AdminIcons';

const MAX_FEATURED = 6;

const INPUT_CLASS =
  'w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-2.5 text-sm font-body text-white placeholder-[#333] focus:outline-none focus:border-[#333] transition-colors';

interface GalleryForm {
  title: string;
  type: GalleryItemType;
  previewUrl: string | null;
}

const EMPTY_FORM: GalleryForm = { title: '', type: 'Haircut', previewUrl: null };

let nextId = 1;

export const GalleryManagerScreen: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>(MOCK_GALLERY);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<GalleryForm>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const featuredCount = items.filter((i) => i.featured).length;

  const sortedItems = [...items].sort((a, b) => {
    if (a.featured === b.featured) return 0;
    return a.featured ? -1 : 1;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((f) => ({ ...f, previewUrl: url }));
    e.target.value = '';
  };

  const openForm = () => {
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const closeForm = () => {
    if (form.previewUrl) URL.revokeObjectURL(form.previewUrl);
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleAdd = () => {
    if (!form.previewUrl || !form.title.trim()) return;
    const newItem: GalleryItem = {
      id: `G-${String(nextId++).padStart(3, '0')}`,
      imageUrl: form.previewUrl,
      title: form.title.trim(),
      type: form.type,
      featured: false,
    };
    setItems((prev) => [newItem, ...prev]);
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const toggleFeatured = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.featured) return { ...item, featured: false };
        if (featuredCount >= MAX_FEATURED) return item;
        return { ...item, featured: true };
      })
    );
  };

  const handleDelete = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.imageUrl);
      return prev.filter((i) => i.id !== id);
    });
    setDeleteConfirm(null);
  };

  return (
    <motion.div
      key="gallery"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">Gallery</h1>
          <p className="text-sm text-[#555] font-body mt-0.5">
            {items.length} photo{items.length !== 1 ? 's' : ''}&nbsp;&middot;&nbsp;{featuredCount}/{MAX_FEATURED} featured
          </p>
        </div>
        <button
          onClick={openForm}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-black-900 text-sm font-body font-semibold hover:bg-gold/90 transition-colors"
        >
          <PlusIcon size={15} strokeWidth={2.5} />
          Add Photo
        </button>
      </div>

      {/* Gallery grid */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#333]">
          <ImageIcon size={36} strokeWidth={1.2} />
          <p className="text-sm font-body mt-3">No photos yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence>
            {sortedItems.map((item) => {
              const canPin = item.featured || featuredCount < MAX_FEATURED;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-xl overflow-hidden bg-[#111] border border-[#1A1A1A]"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    {item.featured && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-gold/90 text-black text-[10px] font-body font-bold px-1.5 py-0.5 rounded">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card footer */}
                  <div className="bg-[#0D0D0D] px-2.5 pt-2 pb-2.5 border-t border-[#1A1A1A]">
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <p className="text-xs font-body font-medium text-white truncate">{item.title}</p>
                      <span
                        className={`flex-shrink-0 text-[10px] font-body font-semibold px-1.5 py-0.5 rounded border ${
                          item.type === 'Haircut'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleFeatured(item.id)}
                        disabled={!canPin}
                        title={
                          item.featured
                            ? 'Remove from featured'
                            : featuredCount >= MAX_FEATURED
                            ? 'Max 6 featured reached'
                            : 'Add to featured'
                        }
                        className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg border text-[11px] font-body transition-colors ${
                          item.featured
                            ? 'bg-gold/10 border-gold/30 text-gold'
                            : canPin
                            ? 'border-[#2A2A2A] text-[#444] hover:text-[#888] hover:border-[#444]'
                            : 'border-[#1A1A1A] text-[#333] cursor-not-allowed opacity-50'
                        }`}
                      >
                        {item.featured ? (
                          <StarFilledIcon size={11} className="text-gold" />
                        ) : (
                          <StarIcon size={11} strokeWidth={2} />
                        )}
                        {item.featured ? 'Unpin' : 'Pin'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#2A2A2A] text-[#444] hover:text-red-400 hover:border-red-400/30 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon size={12} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Photo Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              key="form-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={closeForm}
            />
            <motion.div
              key="form-panel"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl w-full max-w-sm p-6 pointer-events-auto">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-heading font-bold text-white">Add Photo</h2>
                  <button onClick={closeForm} className="text-[#444] hover:text-[#888] transition-colors">
                    <XIcon size={18} strokeWidth={2} />
                  </button>
                </div>

                <div className="space-y-4">
                  {!form.previewUrl ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-[#2A2A2A] rounded-xl py-8 flex flex-col items-center gap-3 text-[#444] hover:border-[#3A3A3A] hover:text-[#666] transition-colors cursor-pointer"
                    >
                      <ImageIcon size={24} strokeWidth={1.5} />
                      <span className="text-sm font-body">Click to select a photo</span>
                      <span className="text-xs font-body text-[#333]">JPEG, PNG, WebP</span>
                    </button>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-[#111]">
                      <img src={form.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => {
                          URL.revokeObjectURL(form.previewUrl!);
                          setForm((f) => ({ ...f, previewUrl: null }));
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-[#aaa] hover:text-white transition-colors"
                      >
                        <XIcon size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-body text-[#555] mb-1.5">Haircut Name</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Fade Cut, Line Up..."
                      maxLength={50}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-body text-[#555] mb-1.5">Type</label>
                    <div className="flex gap-2">
                      {(['Haircut', 'Beard'] as GalleryItemType[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => setForm((f) => ({ ...f, type: t }))}
                          className={`flex-1 py-2 rounded-xl border text-sm font-body font-medium transition-colors ${
                            form.type === t
                              ? 'bg-gold/10 border-gold/40 text-gold'
                              : 'bg-[#0A0A0A] border-[#1A1A1A] text-[#555] hover:border-[#2A2A2A] hover:text-[#888]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={closeForm}
                    className="flex-1 py-2 rounded-xl bg-[#141414] border border-[#1A1A1A] text-sm font-body text-[#555] hover:text-[#888] hover:border-[#2A2A2A] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={!form.previewUrl || !form.title.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gold text-black-900 text-sm font-body font-semibold hover:bg-gold/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <PlusIcon size={14} strokeWidth={2.5} />
                    Add Photo
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              key="del-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              key="del-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-6 max-w-xs w-full pointer-events-auto text-center">
                <div className="w-12 h-12 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center mx-auto mb-4">
                  <TrashIcon size={20} strokeWidth={1.8} className="text-red-400" />
                </div>
                <p className="text-white font-heading font-semibold mb-1">Delete Photo?</p>
                <p className="text-sm font-body text-[#555] mb-5">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-2 rounded-xl bg-[#141414] border border-[#1A1A1A] text-sm font-body text-[#555] hover:text-[#888] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-sm font-body text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
