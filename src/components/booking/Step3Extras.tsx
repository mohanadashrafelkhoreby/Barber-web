import React from 'react';
import { motion } from 'framer-motion';
import { EXTRAS, calcTotal } from '../../data/booking';
import { useBooking } from '../../context/BookingContext';
import { StepNav } from './StepNav';
import { fadeUp, staggerContainer } from '../../styles/animations';

export const Step3Extras: React.FC = () => {
  const { state, toggleExtra, next, back } = useBooking();
  const total = calcTotal(state.service, state.extras);

  return (
    <div>
      {/* Header */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-8">
        <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.28em] text-gold font-accent mb-2">
          Step 3 of 6
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl md:text-3xl text-white mb-2">
          Add Extra Services
        </motion.h2>
        <motion.p variants={fadeUp} className="text-[#9A9A9A] text-sm">
          Enhance your experience. All extras are optional.
        </motion.p>
      </motion.div>

      {/* Extras list */}
      <div className="space-y-3 mb-6">
        {EXTRAS.map((extra, i) => {
          const isSelected = state.extras.includes(extra.id);
          return (
            <motion.button
              key={extra.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => toggleExtra(extra.id)}
              className={`
                w-full flex items-center justify-between
                p-4 rounded-2xl border-2 text-left
                transition-all duration-250
                ${isSelected
                  ? 'border-gold bg-gold/8'
                  : 'border-surface-border bg-surface hover:border-gold/30'
                }
              `}
            >
              <div className="flex items-center gap-3.5">
                {/* Toggle */}
                <div
                  className={`
                    w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0
                    transition-all duration-200
                    ${isSelected ? 'bg-gold border-gold' : 'bg-transparent border-surface-border'}
                  `}
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#0A0A0A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2 6 5 9 10 3" />
                    </svg>
                  )}
                </div>
                <span className={`font-body text-sm ${isSelected ? 'text-white' : 'text-[#9A9A9A]'}`}>
                  {extra.label}
                </span>
              </div>
              <span className={`font-heading font-semibold text-sm flex-shrink-0 ml-4 ${isSelected ? 'text-gold' : 'text-[#9A9A9A]'}`}>
                +${extra.price}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Live price summary */}
      <motion.div
        layout
        className="card-surface p-4 flex items-center justify-between"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#9A9A9A] font-accent">
            Current Total
          </p>
          <p className="text-[10px] text-[#555] mt-0.5">
            {state.service?.name}
            {state.extras.length > 0 && ` + ${state.extras.length} extra${state.extras.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <motion.span
          key={total}
          initial={{ scale: 1.15, color: '#E2C97E' }}
          animate={{ scale: 1, color: '#C9A84C' }}
          transition={{ duration: 0.3 }}
          className="font-heading font-bold text-2xl"
        >
          ${total}
        </motion.span>
      </motion.div>

      <StepNav
        showBack
        onBack={back}
        onNext={next}
        nextLabel="Continue"
      />
    </div>
  );
};
