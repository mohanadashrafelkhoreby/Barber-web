import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ShopSettings } from '../../../data/admin';
import { SaveIcon, CheckIcon } from '../../../components/admin/AdminIcons';

interface Props {
  settings: ShopSettings;
  onSave: (s: ShopSettings) => void;
}

const ALL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Field: React.FC<{
  label: string;
  children: React.ReactNode;
  description?: string;
}> = ({ label, children, description }) => (
  <div>
    <label className="block text-xs font-body font-medium text-[#888] uppercase tracking-wider mb-2">
      {label}
    </label>
    {children}
    {description && (
      <p className="text-[11px] font-body text-[#444] mt-1.5">{description}</p>
    )}
  </div>
);

export const SettingsScreen: React.FC<Props> = ({ settings, onSave }) => {
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Reset dirty when settings prop changes from parent
  useEffect(() => {
    setForm(settings);
    setDirty(false);
  }, [settings]);

  const update = <K extends keyof ShopSettings>(key: K, value: ShopSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const toggleDay = (day: string) => {
    const next = form.workDays.includes(day)
      ? form.workDays.filter((d) => d !== day)
      : [...form.workDays, day];
    update('workDays', next);
  };

  const handleSave = () => {
    onSave(form);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass =
    'w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-2.5 text-sm font-body text-white placeholder-[#333] focus:outline-none focus:border-[#333] transition-colors';

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">Settings</h1>
          <p className="text-sm text-[#555] font-body mt-0.5">Shop configuration</p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-body"
              >
                <CheckIcon size={13} strokeWidth={2.5} />
                Saved
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={handleSave}
            disabled={!dirty}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-medium transition-all duration-150 ${
              dirty
                ? 'bg-gold text-black-900 hover:bg-gold-light'
                : 'bg-[#111] border border-[#1A1A1A] text-[#444] cursor-not-allowed'
            }`}
          >
            <SaveIcon size={15} strokeWidth={2} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Shop Information */}
        <section className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-5">
          <h2 className="text-sm font-body font-semibold text-white mb-4 pb-3 border-b border-[#1A1A1A]">
            Shop Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Shop Name">
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className={inputClass}
                placeholder="e.g. BarberX Studio"
              />
            </Field>
            <Field label="Tagline">
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => update('tagline', e.target.value)}
                className={inputClass}
                placeholder="Short shop description"
              />
            </Field>
            <Field label="Phone Number">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={inputClass}
                placeholder="+966 11 234 5678"
              />
            </Field>
            <Field label="Address">
              <input
                type="text"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                className={inputClass}
                placeholder="Street, City"
              />
            </Field>
          </div>
        </section>

        {/* Working Hours */}
        <section className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-5">
          <h2 className="text-sm font-body font-semibold text-white mb-4 pb-3 border-b border-[#1A1A1A]">
            Working Hours
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Opening Time">
              <input
                type="time"
                value={form.openTime}
                onChange={(e) => update('openTime', e.target.value)}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </Field>
            <Field label="Closing Time">
              <input
                type="time"
                value={form.closeTime}
                onChange={(e) => update('closeTime', e.target.value)}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </Field>
          </div>
        </section>

        {/* Working Days */}
        <section className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-5">
          <h2 className="text-sm font-body font-semibold text-white mb-4 pb-3 border-b border-[#1A1A1A]">
            Working Days
          </h2>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map((day) => {
              const active = form.workDays.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-xl text-sm font-body font-medium border transition-all duration-150 ${
                    active
                      ? 'bg-gold/10 border-gold/40 text-gold'
                      : 'bg-[#0A0A0A] border-[#1A1A1A] text-[#555] hover:border-[#2A2A2A] hover:text-[#888]'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] font-body text-[#444] mt-3">
            {form.workDays.length > 0
              ? `Open ${form.workDays.length} days: ${form.workDays.join(', ')}`
              : 'No working days selected'}
          </p>
        </section>
      </div>
    </motion.div>
  );
};
