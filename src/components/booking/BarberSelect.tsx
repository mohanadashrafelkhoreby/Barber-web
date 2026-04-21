import React from 'react';
import { motion } from 'framer-motion';
import { BARBERS } from '../../data/booking';
import type { Barber } from '../../data/booking';
import { useBooking } from '../../context/BookingContext';
import { staggerContainer, fadeUp } from '../../styles/animations';

// Inline star icon (filled half-star not needed — all ratings > 4)
const StarIcon: React.FC<{ filled?: boolean; size?: number }> = ({ filled = true, size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m20 6-11 11-5-5" />
  </svg>
);

const BusyIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

interface Props {
  onSelected: () => void;
}

const SPECIALTY_COLORS: Record<string, { bg: string; text: string }> = {
  'VIP & Color':    { bg: 'bg-gold/10',        text: 'text-gold' },
  'Fade & Taper':   { bg: 'bg-blue-500/10',    text: 'text-blue-400' },
  'Beard & Groom':  { bg: 'bg-purple-500/10',  text: 'text-purple-400' },
  'Classic Cut':    { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
};

export const BarberSelect: React.FC<Props> = ({ onSelected }) => {
  const { state, setBarber } = useBooking();

  const handleSelect = (barber: Barber) => {
    if (!barber.available) return;
    setBarber(barber);
    setTimeout(onSelected, 280);
  };

  return (
    <section>
      {/* Section label */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[10px] font-accent font-semibold tracking-[0.25em] uppercase text-[#555]">
          02
        </span>
        <div className="flex-1 h-px bg-[#1E1E1E]" />
        <span className="text-[10px] font-accent font-semibold tracking-[0.25em] uppercase text-[#555]">
          Select Barber
        </span>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {BARBERS.map((barber) => {
          const isSelected = state.barber?.id === barber.id;
          const specialtyColor = SPECIALTY_COLORS[barber.specialty] ?? { bg: 'bg-[#1A1A1A]', text: 'text-[#777]' };

          return (
            <motion.button
              key={barber.id}
              variants={fadeUp}
              onClick={() => handleSelect(barber)}
              disabled={!barber.available}
              className={`
                relative text-left rounded-2xl border p-4 transition-all duration-200
                ${!barber.available
                  ? 'opacity-45 cursor-not-allowed border-[#1A1A1A] bg-[#0D0D0D]'
                  : isSelected
                  ? 'border-gold/60 bg-gold/5 shadow-[0_0_20px_rgba(201,168,76,0.10)]'
                  : 'border-[#1A1A1A] bg-[#0D0D0D] hover:border-[#2A2A2A] hover:bg-[#111]'
                }
              `}
            >
              {/* Top row: avatar + selected check */}
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${barber.avatarColor} border border-white/5 flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-sm font-heading font-bold ${
                    barber.id === 'omar' ? 'text-gold'
                    : barber.id === 'khalid' ? 'text-blue-400'
                    : barber.id === 'faisal' ? 'text-purple-400'
                    : 'text-emerald-400'
                  }`}>
                    {barber.initials}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-5 h-5 rounded-full bg-gold flex items-center justify-center text-black flex-shrink-0"
                    >
                      <CheckIcon />
                    </motion.span>
                  )}
                  {/* Availability badge */}
                  {barber.available ? (
                    <span className="flex items-center gap-1 text-[10px] font-body font-medium text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      Available
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-body font-medium text-[#555]">
                      <BusyIcon />
                      Busy
                    </span>
                  )}
                </div>
              </div>

              {/* Name + badge */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className={`text-sm font-body font-semibold ${isSelected ? 'text-white' : 'text-[#DDD]'}`}>
                  {barber.name}
                </p>
                {barber.badge && (
                  <span className="text-[9px] font-accent font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                    {barber.badge}
                  </span>
                )}
              </div>

              {/* Specialty tag */}
              <span className={`inline-block text-[11px] font-body font-medium px-2 py-0.5 rounded-md mb-2.5 ${specialtyColor.bg} ${specialtyColor.text}`}>
                {barber.specialty}
              </span>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <span className="text-gold">
                  <StarIcon size={11} />
                </span>
                <span className="text-[12px] font-body font-semibold text-white">{barber.rating}</span>
                <span className="text-[11px] font-body text-[#444]">({barber.reviewCount} reviews)</span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
};
