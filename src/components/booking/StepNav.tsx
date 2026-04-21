import React from 'react';
import { motion } from 'framer-motion';

interface StepNavProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
  isLast?: boolean;
}

export const StepNav: React.FC<StepNavProps> = ({
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
  showBack = true,
  isLast = false,
}) => {
  return (
    <div className={`flex items-center mt-8 gap-4 ${showBack ? 'justify-between' : 'justify-end'}`}>
      {showBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[#9A9A9A] hover:text-white transition-colors duration-200 group"
        >
          <ArrowLeft />
          Back
        </button>
      )}

      <motion.button
        whileHover={nextDisabled ? {} : { scale: 1.02 }}
        whileTap={nextDisabled ? {} : { scale: 0.97 }}
        onClick={onNext}
        disabled={nextDisabled}
        className={`
          flex items-center gap-2.5 px-7 py-3.5 rounded-full
          font-body font-semibold text-sm tracking-wide
          transition-all duration-300
          ${isLast
            ? 'bg-gold text-black-900 shadow-[0_0_24px_rgba(201,168,76,0.35)] hover:bg-gold-light hover:shadow-[0_0_36px_rgba(201,168,76,0.5)]'
            : 'bg-gold text-black-900 shadow-[0_0_20px_rgba(201,168,76,0.2)] hover:bg-gold-light'
          }
          disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        `}
      >
        {nextLabel}
        {!isLast && <ArrowRight />}
        {isLast && <CheckCircle />}
      </motion.button>
    </div>
  );
};

const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 8H3M7 12l-4-4 4-4" />
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const CheckCircle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
