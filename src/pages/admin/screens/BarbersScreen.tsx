import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_BARBERS, MOCK_BARBER_STATS } from '../../../data/admin';
import type { Barber, BarberStatus } from '../../../data/admin';
import { PlusIcon, EditIcon, XIcon, UserIcon, ArrowLeftIcon } from '../../../components/admin/AdminIcons';

const STATUS_CONFIG: Record<BarberStatus, { label: string; textColor: string; bg: string; border: string }> = {
  active:      { label: 'Available',     textColor: 'text-emerald-400', bg: 'bg-emerald-500/8',  border: 'border-emerald-500/20' },
  unavailable: { label: 'Not Available', textColor: 'text-red-400',    bg: 'bg-red-400/[0.08]',  border: 'border-red-400/20' },
};

const emptyForm = (): Omit<Barber, 'id'> => ({
  name: '',
  photo: null,
  status: 'active',
});

// ─── Barber Profile View ──────────────────────────────────────────────────────

const BarberProfile: React.FC<{ barber: Barber; onBack: () => void }> = ({ barber, onBack }) => {
  const stats = MOCK_BARBER_STATS[barber.id] ?? {
    totalBookings: 0, totalRevenue: 0, thisMonthBookings: 0, thisMonthRevenue: 0,
  };
  const st = STATUS_CONFIG[barber.status];
  const monthName = new Date().toLocaleString('en-US', { month: 'long' });

  const statCards = [
    { label: 'Total Bookings',          value: stats.totalBookings.toString(),                         sub: 'all time' },
    { label: 'Total Revenue',           value: `EGP ${stats.totalRevenue.toLocaleString()}`,           sub: 'all time' },
    { label: `${monthName} Bookings`,   value: stats.thisMonthBookings.toString(),                     sub: 'this month' },
    { label: `${monthName} Revenue`,    value: `EGP ${stats.thisMonthRevenue.toLocaleString()}`,       sub: 'this month' },
  ];

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
    >
      {/* Back + breadcrumb */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[#555] hover:text-[#888] text-sm font-body transition-colors duration-150"
        >
          <ArrowLeftIcon size={15} strokeWidth={2} />
          Back
        </button>
        <span className="text-[#333] text-sm font-body">/</span>
        <span className="text-sm font-body text-white">Barber Profile</span>
      </div>

      {/* Identity card */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-5 mb-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#141414] border border-[#1A1A1A] flex-shrink-0 overflow-hidden flex items-center justify-center text-[#333]">
          {barber.photo ? (
            <img src={barber.photo} alt={barber.name} className="w-full h-full object-cover" />
          ) : (
            <UserIcon size={24} strokeWidth={1.4} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-heading font-bold text-white">{barber.name}</p>
          <p className="text-xs font-body text-[#444] mt-0.5">{barber.id}</p>
        </div>
        <span className={`text-[11px] font-body font-medium px-2.5 py-1 rounded-lg border ${st.textColor} ${st.bg} ${st.border}`}>
          {st.label}
        </span>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {statCards.map((card) => (
          <div key={card.label} className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3">
            <p className="text-xl font-heading font-bold text-white">{card.value}</p>
            <p className="text-xs font-body text-[#888] mt-0.5 leading-tight">{card.label}</p>
            <p className="text-[10px] font-body text-[#444] mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Monthly summary */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-5">
        <h2 className="text-sm font-body font-semibold text-white mb-4 pb-3 border-b border-[#1A1A1A]">
          {monthName} Summary
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-[#888]">Bookings completed</span>
            <span className="text-sm font-body font-medium text-white">{stats.thisMonthBookings}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-[#888]">Revenue generated</span>
            <span className="text-sm font-body font-medium text-white">EGP {stats.thisMonthRevenue.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-[#888]">Avg. per booking</span>
            <span className="text-sm font-body font-medium text-white">
              {stats.thisMonthBookings > 0
                ? `EGP ${Math.round(stats.thisMonthRevenue / stats.thisMonthBookings)}`
                : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#1A1A1A]">
            <span className="text-sm font-body text-[#888]">Current status</span>
            <span className={`text-[11px] font-body font-medium px-2.5 py-1 rounded-lg border ${st.textColor} ${st.bg} ${st.border}`}>
              {st.label}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Barbers Screen ──────────────────────────────────────────────────────

export const BarbersScreen: React.FC = () => {
  const [barbers, setBarbers] = useState<Barber[]>(MOCK_BARBERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Barber | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [viewingBarber, setViewingBarber] = useState<Barber | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setPhotoPreview(null);
    setModalOpen(true);
  };

  const openEdit = (e: React.MouseEvent, barber: Barber) => {
    e.stopPropagation();
    setEditing(barber);
    setForm({ name: barber.name, photo: barber.photo, status: barber.status });
    setPhotoPreview(barber.photo);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setPhotoPreview(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    setForm((prev) => ({ ...prev, photo: url }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      const updated = { ...editing, ...form };
      setBarbers((prev) => prev.map((b) => (b.id === editing.id ? updated : b)));
      if (viewingBarber?.id === editing.id) setViewingBarber(updated);
    } else {
      const newBarber: Barber = {
        id: `B-${String(barbers.length + 1).padStart(3, '0')}`,
        ...form,
      };
      setBarbers((prev) => [...prev, newBarber]);
    }
    closeModal();
  };

  const toggleStatus = (e: React.MouseEvent, barber: Barber, status: BarberStatus) => {
    e.stopPropagation();
    const updated = { ...barber, status };
    setBarbers((prev) => prev.map((b) => (b.id === barber.id ? updated : b)));
    if (viewingBarber?.id === barber.id) setViewingBarber(updated);
  };

  const inputClass =
    'w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-2.5 text-sm font-body text-white placeholder-[#333] focus:outline-none focus:border-[#333] transition-colors';

  // Show profile view
  if (viewingBarber) {
    return (
      <BarberProfile
        barber={barbers.find((b) => b.id === viewingBarber.id) ?? viewingBarber}
        onBack={() => setViewingBarber(null)}
      />
    );
  }

  return (
    <motion.div
      key="barbers"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">Barbers</h1>
          <p className="text-sm text-[#555] font-body mt-0.5">{barbers.length} team member{barbers.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-black-900 text-sm font-body font-medium hover:bg-gold-light transition-colors duration-150"
        >
          <PlusIcon size={15} strokeWidth={2.5} />
          Add Barber
        </button>
      </div>

      {/* Barbers list */}
      <div className="space-y-2">
        {barbers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[#333]">
            <UserIcon size={40} strokeWidth={1.2} />
            <p className="mt-3 text-sm font-body">No barbers yet. Add your first team member.</p>
          </div>
        )}
        {barbers.map((barber) => (
          <div
            key={barber.id}
            onClick={() => setViewingBarber(barber)}
            className="flex items-center gap-4 bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-3 group cursor-pointer hover:border-[#2A2A2A] transition-colors duration-150"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#1A1A1A] flex-shrink-0 overflow-hidden flex items-center justify-center text-[#333]">
              {barber.photo ? (
                <img src={barber.photo} alt={barber.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={18} strokeWidth={1.6} />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-medium text-white truncate">{barber.name}</p>
              <p className="text-[11px] font-body text-[#444]">{barber.id}</p>
            </div>

            {/* Availability toggle buttons */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={(e) => toggleStatus(e, barber, 'active')}
                className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium border transition-all duration-150 ${
                  barber.status === 'active'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-[#0A0A0A] border-[#1A1A1A] text-[#555] hover:border-[#2A2A2A] hover:text-[#888]'
                }`}
              >
                Available
              </button>
              <button
                onClick={(e) => toggleStatus(e, barber, 'unavailable')}
                className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium border transition-all duration-150 ${
                  barber.status === 'unavailable'
                    ? 'bg-red-400/[0.08] border-red-400/20 text-red-400'
                    : 'bg-[#0A0A0A] border-[#1A1A1A] text-[#555] hover:border-[#2A2A2A] hover:text-[#888]'
                }`}
              >
                Not Available
              </button>
            </div>

            {/* Edit */}
            <button
              onClick={(e) => openEdit(e, barber)}
              className="text-[#333] hover:text-[#888] transition-colors opacity-0 group-hover:opacity-100 duration-150 flex-shrink-0"
              aria-label="Edit barber"
            >
              <EditIcon size={15} strokeWidth={1.8} />
            </button>
          </div>
        ))}
      </div>

      {/* ─── Modal ─── */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={closeModal}
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl w-full max-w-md p-6 pointer-events-auto">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-heading font-bold text-white">
                    {editing ? 'Edit Barber' : 'Add Barber'}
                  </h2>
                  <button onClick={closeModal} className="text-[#444] hover:text-[#888] transition-colors">
                    <XIcon size={18} strokeWidth={2} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Photo */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#141414] border border-[#1A1A1A] flex-shrink-0 overflow-hidden flex items-center justify-center text-[#333]">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={26} strokeWidth={1.4} />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-body font-medium text-[#888] uppercase tracking-wider mb-1.5">
                        Photo
                      </label>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141414] border border-[#1A1A1A] text-xs font-body text-[#666] hover:text-[#AAA] hover:border-[#2A2A2A] transition-colors">
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                      </label>
                      {photoPreview && (
                        <button
                          type="button"
                          onClick={() => { setPhotoPreview(null); setForm((p) => ({ ...p, photo: null })); }}
                          className="ml-2 text-[11px] font-body text-[#444] hover:text-red-400 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-body font-medium text-[#888] uppercase tracking-wider mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Rami Al-Harbi"
                      className={inputClass}
                    />
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-xs font-body font-medium text-[#888] uppercase tracking-wider mb-2">
                      Availability
                    </label>
                    <div className="flex gap-2">
                      {(['active', 'unavailable'] as BarberStatus[]).map((s) => {
                        const active = form.status === s;
                        const cfg = STATUS_CONFIG[s];
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setForm((p) => ({ ...p, status: s }))}
                            className={`flex-1 py-2 rounded-xl text-sm font-body font-medium border transition-all duration-150 ${
                              active
                                ? `${cfg.bg} ${cfg.border} ${cfg.textColor}`
                                : 'bg-[#0A0A0A] border-[#1A1A1A] text-[#555] hover:border-[#2A2A2A] hover:text-[#888]'
                            }`}
                          >
                            {cfg.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2.5 rounded-xl bg-[#141414] border border-[#1A1A1A] text-sm font-body text-[#555] hover:text-[#888] hover:border-[#2A2A2A] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!form.name.trim()}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-150 ${
                      form.name.trim()
                        ? 'bg-gold text-black-900 hover:bg-gold-light'
                        : 'bg-[#111] border border-[#1A1A1A] text-[#444] cursor-not-allowed'
                    }`}
                  >
                    {editing ? 'Save Changes' : 'Add Barber'}
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
