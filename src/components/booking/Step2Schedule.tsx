import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TIME_SLOTS, getEstimatedWait } from '../../data/booking';
import { useBooking } from '../../context/BookingContext';
import { StepNav } from './StepNav';
import { fadeUp, staggerContainer } from '../../styles/animations';

// Generate next 7 selectable dates from today
function getAvailableDates(): { label: string; value: string; dayName: string }[] {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const value = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dates.push({ value, label, dayName });
  }
  return dates;
}

export const Step2Schedule: React.FC = () => {
  const { state, setDate, setTimeSlot, next, back } = useBooking();
  const dates = useMemo(getAvailableDates, []);

  const requiresSlot = state.service?.requiresSlot ?? true;

  const canContinue = requiresSlot
    ? !!state.date && !!state.timeSlot
    : true;

  return (
    <div>
      {/* Header */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-8">
        <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.28em] text-gold font-accent mb-2">
          Step 2 of 6
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl md:text-3xl text-white mb-2">
          {requiresSlot ? 'Pick a Date & Time' : 'Join the Queue'}
        </motion.h2>
        <motion.p variants={fadeUp} className="text-[#9A9A9A] text-sm">
          {requiresSlot
            ? 'Choose your preferred day and available time slot.'
            : 'No reservation needed — we\'ll add you to the live queue.'}
        </motion.p>
      </motion.div>

      {/* ── STANDARD CUT: Queue UI ── */}
      {!requiresSlot && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="card-surface p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-5">
            <QueueBigIcon />
          </div>
          <h3 className="font-heading font-semibold text-white text-xl mb-2">
            You'll be added to the queue
          </h3>
          <p className="text-[#9A9A9A] text-sm mb-5">
            Walk in or wait nearby — we'll notify you when it's your turn.
          </p>
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gold/10 border border-gold/20">
            <span className="text-gold text-sm font-accent font-medium">
              Estimated wait:
            </span>
            <span className="text-white font-heading font-semibold text-sm">
              {getEstimatedWait()}
            </span>
          </div>
        </motion.div>
      )}

      {/* ── SLOT REQUIRED: Date + Time picker ── */}
      {requiresSlot && (
        <>
          {/* Date Strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[#9A9A9A] font-accent mb-3">
              Select Date
            </p>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {dates.map((d) => {
                const isSelected = state.date === d.value;
                return (
                  <button
                    key={d.value}
                    onClick={() => setDate(d.value)}
                    className={`
                      flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-3 rounded-xl border-2
                      transition-all duration-200
                      ${isSelected
                        ? 'border-gold bg-gold/10 shadow-[0_0_18px_rgba(201,168,76,0.18)]'
                        : 'border-surface-border bg-surface hover:border-gold/30'
                      }
                    `}
                  >
                    <span className={`text-[10px] uppercase tracking-[0.15em] font-accent ${isSelected ? 'text-gold' : 'text-[#9A9A9A]'}`}>
                      {d.dayName}
                    </span>
                    <span className={`font-heading font-semibold text-sm ${isSelected ? 'text-white' : 'text-[#9A9A9A]'}`}>
                      {d.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Time Slots */}
          {state.date && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#9A9A9A] font-accent mb-3">
                Select Time Slot
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = state.timeSlot === slot.time;
                  return (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => slot.available && setTimeSlot(slot.time)}
                      className={`
                        py-2.5 px-1 rounded-xl text-xs font-heading font-medium text-center
                        border transition-all duration-200
                        ${!slot.available
                          ? 'border-surface-border text-[#333] cursor-not-allowed bg-black-700 line-through'
                          : isSelected
                          ? 'border-gold bg-gold text-black-900 shadow-[0_0_14px_rgba(201,168,76,0.3)]'
                          : 'border-surface-border bg-surface text-[#9A9A9A] hover:border-gold/40 hover:text-white'
                        }
                      `}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-[#555] mt-3 flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-sm bg-black-700 border border-surface-border" />
                Unavailable
                <span className="inline-block w-3 h-3 rounded-sm bg-gold ml-2" />
                Selected
              </p>
            </motion.div>
          )}
        </>
      )}

      <StepNav
        showBack
        onBack={back}
        onNext={next}
        nextDisabled={!canContinue}
      />
    </div>
  );
};

const QueueBigIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
