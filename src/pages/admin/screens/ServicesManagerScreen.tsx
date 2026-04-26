import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_SERVICES } from '../../../data/admin';
import type { AdminService } from '../../../data/admin';
import { PlusIcon, EditIcon, TrashIcon, SaveIcon, XIcon, TagIcon } from '../../../components/admin/AdminIcons';

let nextServiceId = 100;

const INPUT_CLASS =
  'w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-2.5 text-sm font-body text-white placeholder-[#333] focus:outline-none focus:border-[#333] transition-colors';

type EditForm = {
  title: string;
  duration: string;
  description: string;
};

const EMPTY_FORM: EditForm = { title: '', duration: '', description: '' };

function serviceToForm(s: AdminService): EditForm {
  return {
    title: s.title,
    duration: String(s.duration),
    description: s.description,
  };
}

export const ServicesManagerScreen: React.FC = () => {
  const [services, setServices] = useState<AdminService[]>(MOCK_SERVICES);
  const [editingId, setEditingId] = useState<string | null>(null); // null = adding new
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EditForm>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (service: AdminService) => {
    setEditingId(service.id);
    setForm(serviceToForm(service));
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = () => {
    const parsed: AdminService = {
      id: editingId ?? `svc-${nextServiceId++}`,
      title: form.title.trim(),
      duration: parseInt(form.duration) || 0,
      description: form.description.trim(),
    };
    if (!parsed.title) return;
    if (editingId) {
      setServices((prev) => prev.map((s) => (s.id === editingId ? parsed : s)));
    } else {
      setServices((prev) => [...prev, parsed]);
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  };

  const set = (field: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <motion.div
      key="services"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">Services</h1>
          <p className="text-sm text-[#555] font-body mt-0.5">{services.length} service{services.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-black-900 text-sm font-body font-semibold hover:bg-gold/90 transition-colors"
        >
          <PlusIcon size={15} strokeWidth={2.5} />
          Add Service
        </button>
      </div>

      {/* Service cards */}
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#333]">
          <TagIcon size={36} strokeWidth={1.2} />
          <p className="text-sm font-body mt-3">No services yet — add one above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {services.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-base font-heading font-semibold text-white leading-tight">{service.title}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEdit(service)}
                      className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#555] hover:text-white hover:border-[#444] transition-colors"
                      title="Edit"
                    >
                      <EditIcon size={14} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(service.id)}
                      className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#555] hover:text-red-400 hover:border-red-400/30 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon size={14} strokeWidth={2} />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-body text-[#555] mb-4 leading-relaxed">{service.description || '—'}</p>

                {/* Footer stats */}
                <div className="flex items-center gap-3 pt-3 border-t border-[#141414]">
                  <div className="flex-1">
                    <p className="text-xs font-body text-[#444] mb-0.5">Duration</p>
                    <p className="text-base font-heading font-bold text-white">{service.duration} min</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add / Edit Modal */}
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
              key="form-modal"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl w-full max-w-sm p-6 pointer-events-auto">
                {/* Modal header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-heading font-bold text-white">
                    {editingId ? 'Edit Service' : 'Add Service'}
                  </h2>
                  <button onClick={closeForm} className="text-[#444] hover:text-[#888] transition-colors">
                    <XIcon size={18} strokeWidth={2} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-body text-[#555] mb-1.5">Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={set('title')}
                      placeholder="e.g. VIP Cut"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-[#555] mb-1.5">Duration (min)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.duration}
                      onChange={set('duration')}
                      placeholder="60"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-[#555] mb-1.5">Description</label>
                    <textarea
                      value={form.description}
                      onChange={set('description')}
                      placeholder="Short description..."
                      rows={3}
                      className={`${INPUT_CLASS} resize-none`}
                    />
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
                    onClick={handleSave}
                    disabled={!form.title.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gold text-black-900 text-sm font-body font-semibold hover:bg-gold/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <SaveIcon size={14} strokeWidth={2} />
                    Save
                  </button>
                </div>
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
                <p className="text-white font-heading font-semibold mb-1">Delete Service?</p>
                <p className="text-sm font-body text-[#555] mb-5">
                  "{services.find((s) => s.id === deleteConfirm)?.title}" will be removed permanently.
                </p>
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
