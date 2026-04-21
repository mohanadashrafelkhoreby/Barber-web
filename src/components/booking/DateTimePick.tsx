import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIME_SLOTS, getEstimatedWait } from '../../data/booking';
import { useBooking } from '../../context/BookingContext';
import { CalendarIcon, ClockIcon, UsersIcon } from './BookingIcons';
import { staggerContainer, fadeUp } from '../../styles/animations';

// ─── Date helpers ─────────────────────────────

function buildQuickDates() {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < 2; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    dates.push({
      label: i === 0 ? 'Today' : 'Tomorrow',
      sub: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      value: d.toISOString().split('T')[0],
    });
  }
  return dates;
}

function formatDisplayDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

interface DateTimePickProps {
  onTimeSelected: () => void;
}

export const DateTimePick: React.FC<DateTimePickProps> = ({ onTimeSelected }) => {
  const { state, setDate, setTimeSlot } = useBooking();
  const quickDates = useMemo(buildQuickDates, []);
  const [showCustomDate, setShowCustomDate] = useState(false);

  const minDate = new Date().toISOString().split('T')[0];
  const requiresSlot = state.service?.requiresSlot ?? true;

  const handleDateSelect = (value: string) => {
    setDate(value);
    setShowCustomDate(false);
  };

  const handleTimeSelect = (time: string) => {
    setTimeSlot(time);
    setTimeout(onTimeSelected, 280);
  };

  const isQuickDate = quickDates.some((d) => d.value === state.date);

  return (
    <section>
      {/* Section label */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-5"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-2.5 mb-1">
          <span className="w-5 h-px bg-gold opacity-60" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-accent">
            02 / Date {requiresSlot ? '& Time' : ''}
          </span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl text-white">
          When would you like to come in?
        </motion.h2>
      </motion.div>

      {/* ─── Date selector ─── */}
      <div className="space-y-3">
        {/* Quick date pills */}
        <div className="flex gap-2.5 flex-wrap">
          {quickDates.map((d) => {
            const isSelected = state.date === d.value && !showCustomDate;
            return (
              <button
                key={d.value}
                onClick={() => handleDateSelect(d.value)}
                className={`
                  flex flex-col items-start px-4 py-3 rounded-xl border
                  transition-all duration-200 min-w-[108px]
                  ${isSelected
                    ? 'border-gold/60 bg-gold/8 shadow-[0_0_20px_rgba(201,168,76,0.1)]'
                    : 'border-[#2A2A2A] bg-[#111] hover:border-[#3A3A3A]'
                  }
                `}
              >
                <span className={`text-xs font-heading font-semibold ${isSelected ? 'text-white' : 'text-[#CCC]'}`}>
                  {d.label}
                </span>
                <span className={`text-[10px] font-accent mt-0.5 ${isSelected ? 'text-gold' : 'text-[#555]'}`}>
                  {d.sub}
                </span>
              </button>
            );
          })}

          {/* Custom date picker trigger */}
          <button
            onClick={() => setShowCustomDate((v) => !v)}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-xl border
              transition-all duration-200
              ${showCustomDate || (!isQuickDate && state.date)
                ? 'border-gold/60 bg-gold/8'
                : 'border-[#2A2A2A] bg-[#111] hover:border-[#3A3A3A]'
              }
            `}
          >
            <CalendarIcon size={14} className={showCustomDate || (!isQuickDate && state.date) ? 'text-gold' : 'text-[#555]'} />
            <span className={`text-xs font-heading font-medium ${showCustomDate || (!isQuickDate && state.date) ? 'text-white' : 'text-[#777]'}`}>
              {!isQuickDate && state.date
                ? formatDisplayDate(state.date)
                : 'Pick a date'}
            </span>
          </button>
        </div>

        {/* Native date input */}
        <AnimatePresence>
          {showCustomDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              <input
                type="date"
                min={minDate}
                value={state.date || ''}
                onChange={(e) => handleDateSelect(e.target.value)}
                className="
                  booking-date-input
                  w-full px-4 py-3 rounded-xl bg-[#111] border border-[#2A2A2A]
                  text-white text-sm font-body outline-none
                  focus:border-gold/50 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)]
                  transition-all duration-200 cursor-pointer
                "
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Time slots (after date selected) ─── */}
      <AnimatePresence>
        {state.date && requiresSlot && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6"
          >
            {/* Label */}
            <div className="flex items-center gap-2 mb-3">
              <ClockIcon size={13} className="text-[#555]" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A9A9A] font-accent">
                Available slots — {formatDisplayDate(state.date)}
              </span>
            </div>

            {/* Slot grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isSelected = state.timeSlot === slot.time;
                return (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    className={`
                      py-2.5 rounded-xl text-xs font-heading font-medium text-center
                      border transition-all duration-180
                      ${!slot.available
                        ? 'border-[#1E1E1E] bg-[#0D0D0D] text-[#2A2A2A] cursor-not-allowed line-through'
                        : isSelected
                        ? 'border-gold bg-gold text-black-900 shadow-[0_0_16px_rgba(201,168,76,0.3)] scale-105'
                        : 'border-[#2A2A2A] bg-[#111] text-[#9A9A9A] hover:border-[#404040] hover:text-white hover:scale-[1.02]'
                      }
                    `}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-[10px] text-[#444] font-accent">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0D0D0D] border border-[#1E1E1E]" />
                Unavailable
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-[#9A9A9A] font-accent">
                <span className="w-2.5 h-2.5 rounded-sm bg-gold" />
                Selected
              </span>
            </div>
          </motion.div>
        )}

        {/* ─── Queue info (Standard Cut) ─── */}
        {state.date && !requiresSlot && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6"
          >
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-[#2A2A2A] bg-[#111]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <UsersIcon size={16} className="text-emerald-400" />
              </div>
              <div>
                <p className="font-heading font-semibold text-white text-sm mb-1">
                  You'll be added to the live queue
                </p>
                <p className="text-[#9A9A9A] text-xs leading-relaxed">
                  Walk in on {formatDisplayDate(state.date)} and we'll call you when it's your turn.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <ClockIcon size={12} className="text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-accent">
                    Est. wait: {getEstimatedWait()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
