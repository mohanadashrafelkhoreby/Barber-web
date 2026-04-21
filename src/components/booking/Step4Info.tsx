import React from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { StepNav } from './StepNav';
import { fadeUp, staggerContainer } from '../../styles/animations';

export const Step4Info: React.FC = () => {
  const { state, setName, setPhone, next, back } = useBooking();

  const isNameValid = state.name.trim().length >= 2;
  const isPhoneValid = /^\+?[\d\s\-().]{7,}$/.test(state.phone.trim());
  const canContinue = isNameValid && isPhoneValid;

  return (
    <div>
      {/* Header */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-8">
        <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.28em] text-gold font-accent mb-2">
          Step 4 of 6
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl md:text-3xl text-white mb-2">
          Your Information
        </motion.h2>
        <motion.p variants={fadeUp} className="text-[#9A9A9A] text-sm">
          We'll use this to confirm and contact you about your appointment.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-5"
      >
        {/* Full Name */}
        <div className="group">
          <label className="block text-xs uppercase tracking-[0.18em] text-[#9A9A9A] font-accent mb-2">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]">
              <UserIcon />
            </span>
            <input
              type="text"
              value={state.name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              autoComplete="name"
              className={`
                w-full pl-11 pr-4 py-3.5 rounded-xl bg-surface border
                font-body text-sm text-white placeholder-[#444]
                outline-none transition-all duration-200
                focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)]
                ${state.name && !isNameValid
                  ? 'border-red-500/50'
                  : state.name && isNameValid
                  ? 'border-gold/40'
                  : 'border-surface-border'
                }
              `}
            />
            {state.name && isNameValid && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gold">
                <MiniCheck />
              </span>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div className="group">
          <label className="block text-xs uppercase tracking-[0.18em] text-[#9A9A9A] font-accent mb-2">
            Phone Number
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]">
              <PhoneIcon />
            </span>
            <input
              type="tel"
              value={state.phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
              className={`
                w-full pl-11 pr-4 py-3.5 rounded-xl bg-surface border
                font-body text-sm text-white placeholder-[#444]
                outline-none transition-all duration-200
                focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)]
                ${state.phone && !isPhoneValid
                  ? 'border-red-500/50'
                  : state.phone && isPhoneValid
                  ? 'border-gold/40'
                  : 'border-surface-border'
                }
              `}
            />
            {state.phone && isPhoneValid && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gold">
                <MiniCheck />
              </span>
            )}
          </div>
          {state.phone && !isPhoneValid && (
            <p className="text-red-400/80 text-xs mt-1.5 pl-1">Enter a valid phone number.</p>
          )}
        </div>

        {/* Privacy note */}
        <p className="text-[#555] text-[11px] flex items-start gap-1.5 pt-1">
          <LockIcon />
          Your information is private and only used to manage your booking.
        </p>
      </motion.div>

      <StepNav
        showBack
        onBack={back}
        onNext={next}
        nextDisabled={!canContinue}
      />
    </div>
  );
};

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.48h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6 6l1.27-.85a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MiniCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
