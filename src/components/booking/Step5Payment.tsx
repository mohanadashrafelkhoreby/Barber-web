import React from 'react';
import { motion } from 'framer-motion';
import { PAYMENT_OPTIONS, calcTotal } from '../../data/booking';
import type { PaymentMethod } from '../../data/booking';
import { useBooking } from '../../context/BookingContext';
import { StepNav } from './StepNav';
import { fadeUp, staggerContainer } from '../../styles/animations';

export const Step5Payment: React.FC = () => {
  const { state, setPayment, next, back } = useBooking();
  const total = calcTotal(state.service, state.extras);

  return (
    <div>
      {/* Header */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-8">
        <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.28em] text-gold font-accent mb-2">
          Step 5 of 6
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl md:text-3xl text-white mb-2">
          Payment Method
        </motion.h2>
        <motion.p variants={fadeUp} className="text-[#9A9A9A] text-sm">
          Choose how you'd like to pay. All options are secure.
        </motion.p>
      </motion.div>

      {/* Amount Due */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between p-4 rounded-2xl bg-black-700 border border-surface-border mb-6"
      >
        <span className="text-sm text-[#9A9A9A] font-body">Amount Due</span>
        <span className="font-heading font-bold text-2xl text-gold">${total}</span>
      </motion.div>

      {/* Payment cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PAYMENT_OPTIONS.map((option, i) => {
          const isSelected = state.payment === option.id;
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setPayment(option.id as PaymentMethod)}
              className={`
                relative flex flex-col items-center text-center gap-3
                p-5 rounded-2xl border-2
                transition-all duration-250
                ${isSelected
                  ? 'border-gold bg-gold/8 shadow-[0_0_24px_rgba(201,168,76,0.18)]'
                  : 'border-surface-border bg-surface hover:border-gold/30'
                }
              `}
            >
              <span className="text-3xl">{option.icon}</span>
              <div>
                <p className={`font-heading font-semibold text-sm mb-1 ${isSelected ? 'text-white' : 'text-[#9A9A9A]'}`}>
                  {option.label}
                </p>
                <p className="text-[#555] text-[11px] leading-snug">
                  {option.description}
                </p>
              </div>

              {/* Selected ring */}
              {isSelected && (
                <motion.div
                  layoutId="payment-ring"
                  className="absolute inset-0 rounded-2xl border-2 border-gold pointer-events-none"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Deposit note */}
      {state.payment === 'deposit' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-4 rounded-xl bg-gold/8 border border-gold/20"
        >
          <p className="text-gold text-xs font-accent">
            💡 You'll pay <strong>${Math.ceil(total / 2)}</strong> now as a deposit. The remaining <strong>${Math.floor(total / 2)}</strong> is due at the shop.
          </p>
        </motion.div>
      )}

      <StepNav
        showBack
        onBack={back}
        onNext={next}
        nextDisabled={!state.payment}
      />
    </div>
  );
};
