import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EXTRAS, PAYMENT_OPTIONS, calcTotal } from '../../data/booking';
import { useBooking } from '../../context/BookingContext';
import { StepNav } from './StepNav';
import { fadeUp, staggerContainer } from '../../styles/animations';
import { useNavigate } from 'react-router-dom';

export const Step6Summary: React.FC = () => {
  const { state, back, reset } = useBooking();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const total = calcTotal(state.service, state.extras);

  const paymentLabel = PAYMENT_OPTIONS.find((p) => p.id === state.payment)?.label ?? '';
  const extrasSelected = EXTRAS.filter((e) => state.extras.includes(e.id));

  const handleConfirm = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setLoading(false);
    setConfirmed(true);
  };

  const handleDone = () => {
    reset();
    navigate('/');
  };

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center py-8"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 16 }}
          className="w-20 h-20 rounded-full bg-gold flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(201,168,76,0.4)]"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="font-heading font-bold text-3xl text-white mb-3"
        >
          Booking Confirmed!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-[#9A9A9A] text-sm mb-2"
        >
          We've received your booking, <span className="text-white font-medium">{state.name}</span>.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="text-[#555] text-xs mb-8"
        >
          A confirmation will be sent to {state.phone}.
        </motion.p>

        {/* Booking reference */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gold/10 border border-gold/20 mb-8"
        >
          <span className="text-[#9A9A9A] text-xs font-accent">Booking Ref:</span>
          <span className="text-gold font-heading font-bold text-sm tracking-widest">
            BX-{Math.random().toString(36).slice(2, 8).toUpperCase()}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={handleDone}
            className="px-8 py-3.5 rounded-full bg-gold text-black-900 font-body font-semibold text-sm hover:bg-gold-light transition-colors duration-200 shadow-[0_0_20px_rgba(201,168,76,0.3)]"
          >
            Back to Home
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Header */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-8">
        <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.28em] text-gold font-accent mb-2">
          Step 6 of 6
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl md:text-3xl text-white mb-2">
          Review & Confirm
        </motion.h2>
        <motion.p variants={fadeUp} className="text-[#9A9A9A] text-sm">
          Everything look right? Confirm to lock in your slot.
        </motion.p>
      </motion.div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="card-surface overflow-hidden mb-4"
      >
        {/* Service header */}
        <div className="p-5 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{state.service?.icon}</span>
            <div>
              <p className="font-heading font-semibold text-white text-base">{state.service?.name}</p>
              <p className="text-[#9A9A9A] text-xs">{state.service?.tagline}</p>
            </div>
          </div>
          <span className="font-heading font-bold text-gold text-lg">${state.service?.price}</span>
        </div>

        <div className="p-5 space-y-3.5">
          {/* Date / Time / Queue */}
          {state.service?.requiresSlot ? (
            <SummaryRow
              icon={<CalIcon />}
              label="Date & Time"
              value={`${formatDate(state.date)} at ${state.timeSlot}`}
            />
          ) : (
            <SummaryRow icon={<QueueIcon />} label="Queue System" value="Walk-in, no slot reserved" />
          )}

          {/* Extras */}
          {extrasSelected.length > 0 && (
            <SummaryRow
              icon={<PlusIcon />}
              label="Extras"
              value={
                <div className="text-right">
                  {extrasSelected.map((e) => (
                    <div key={e.id} className="flex justify-end gap-3">
                      <span className="text-[#9A9A9A] text-xs">{e.label}</span>
                      <span className="text-xs text-white">+${e.price}</span>
                    </div>
                  ))}
                </div>
              }
            />
          )}

          {/* Client */}
          <SummaryRow icon={<UserIcon />} label="Name" value={state.name} />
          <SummaryRow icon={<PhoneIcon />} label="Phone" value={state.phone} />

          {/* Payment */}
          <SummaryRow icon={<CardIcon />} label="Payment" value={paymentLabel} />
        </div>

        {/* Total */}
        <div className="p-5 border-t border-surface-border flex items-center justify-between bg-black-700/50">
          <span className="text-sm text-[#9A9A9A] uppercase tracking-[0.15em] font-accent">Total</span>
          <span className="font-heading font-bold text-2xl text-gold">${total}</span>
        </div>
      </motion.div>

      {/* Confirm CTA */}
      <AnimatePresence>
        {!loading ? (
          <StepNav
            showBack
            onBack={back}
            onNext={handleConfirm}
            nextLabel="Confirm Booking"
            isLast
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-end mt-8 gap-3"
          >
            <span className="text-[#9A9A9A] text-sm font-accent">Processing…</span>
            <div className="w-6 h-6 border-2 border-surface-border border-t-gold rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Sub-components ──────────────────────────

interface SummaryRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ icon, label, value }) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex items-center gap-2.5 text-[#555] flex-shrink-0 mt-0.5">
      {icon}
      <span className="text-xs uppercase tracking-[0.15em] text-[#9A9A9A] font-accent">{label}</span>
    </div>
    <div className="text-right text-sm text-white font-body">{value}</div>
  </div>
);

const formatDate = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const CalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const QueueIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const UserIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.48h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6 6l1.27-.85a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const CardIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
