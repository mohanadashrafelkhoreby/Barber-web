import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { BookingState } from '../../data/booking';
import { useBooking } from '../../context/BookingContext';
import { CheckCircleIcon, CalendarIcon, ClockIcon, UsersIcon, ArrowRightIcon } from './BookingIcons';

function formatDisplayDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function generateRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'BX-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

interface ConfirmScreenProps {
  state: BookingState;
}

export const ConfirmScreen: React.FC<ConfirmScreenProps> = ({ state }) => {
  const { reset } = useBooking();
  const navigate = useNavigate();
  // Generate a stable ref during this component's lifetime
  const bookingRef = useMemo(() => generateRef(), []);

  const handleDone = () => {
    reset();
    navigate('/');
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09 } },
  };

  const itemVariants = {
    hidden:   { opacity: 0, y: 20 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center px-4 pt-10 pb-16"
    >
      {/* Animated checkmark */}
      <motion.div
        variants={itemVariants}
        className="relative mb-8"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6, type: 'spring', bounce: 0.35 }}
          className="w-24 h-24 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4, type: 'spring', bounce: 0.4 }}
          >
            <CheckCircleIcon size={40} className="text-gold" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Glow ring */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border border-gold/30"
        />
      </motion.div>

      {/* Headline */}
      <motion.h1 variants={itemVariants} className="font-heading font-bold text-3xl text-white mb-2">
        You're booked.
      </motion.h1>
      <motion.p variants={itemVariants} className="text-[#9A9A9A] text-sm font-body max-w-xs leading-relaxed">
        We'll see you soon, {state.name.split(' ')[0]}. Get ready for a premium experience.
      </motion.p>

      {/* Booking ref badge */}
      <motion.div
        variants={itemVariants}
        className="mt-6 mb-8 px-5 py-3 rounded-2xl border border-[#2A2A2A] bg-[#111]"
      >
        <p className="text-[9px] uppercase tracking-[0.3em] text-[#555] font-accent mb-1">
          Booking Reference
        </p>
        <p className="text-xl font-heading font-bold tracking-[0.2em] text-gold">
          {bookingRef}
        </p>
      </motion.div>

      {/* Detail cards */}
      <motion.div variants={itemVariants} className="w-full max-w-sm space-y-2.5">
        {/* Service */}
        {state.service && (
          <DetailRow
            icon={<div className="w-2 h-2 rounded-full bg-gold" />}
            label="Service"
            value={state.service.name}
          />
        )}

        {/* Barber */}
        {state.barber && (
          <DetailRow
            icon={<UsersIcon size={14} className="text-[#777]" />}
            label="Barber"
            value={state.barber.name}
          />
        )}

        {/* Date */}
        {state.date && (
          <DetailRow
            icon={<CalendarIcon size={14} className="text-[#777]" />}
            label="Date"
            value={formatDisplayDate(state.date)}
          />
        )}

        {/* Time */}
        {state.service?.requiresSlot && state.timeSlot ? (
          <DetailRow
            icon={<ClockIcon size={14} className="text-[#777]" />}
            label="Time"
            value={state.timeSlot}
          />
        ) : !state.service?.requiresSlot ? (
          <DetailRow
            icon={<UsersIcon size={14} className="text-[#777]" />}
            label="Arrival"
            value="Walk-in queue"
          />
        ) : null}

        {/* Phone */}
        {state.phone && (
          <DetailRow
            icon={<div className="w-2 h-2 rounded-full bg-[#333]" />}
            label="Phone"
            value={state.phone}
          />
        )}
      </motion.div>

      {/* Note */}
      <motion.p
        variants={itemVariants}
        className="mt-6 text-[11px] text-[#444] font-accent max-w-xs"
      >
        A confirmation will be sent via SMS. Please arrive 5 minutes early.
      </motion.p>

      {/* Done button */}
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleDone}
        className="
          mt-8 flex items-center gap-2.5 px-8 py-4 rounded-2xl
          bg-[#141414] border border-[#2A2A2A] hover:border-[#3A3A3A]
          text-white font-body font-medium text-sm
          transition-all duration-200
        "
      >
        Back to Home
        <ArrowRightIcon size={14} />
      </motion.button>
    </motion.div>
  );
};

// ─── Detail row ──────────────────────────────

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#0F0F0F] border border-[#1E1E1E]">
    <div className="flex items-center gap-2.5">
      {icon}
      <span className="text-xs text-[#555] font-body">{label}</span>
    </div>
    <span className="text-xs text-[#CCC] font-body font-medium">{value}</span>
  </div>
);
