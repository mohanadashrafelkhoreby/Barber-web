import React from 'react';
import { motion } from 'framer-motion';
import { STEPS } from '../../data/booking';
import { useBooking } from '../../context/BookingContext';

export const StepIndicator: React.FC = () => {
  const { state, goTo } = useBooking();
  const current = state.step;

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="flex items-center min-w-max mx-auto px-4 sm:px-0">
        {STEPS.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < current;
          const isActive = stepNum === current;

          return (
            <React.Fragment key={step.label}>
              {/* Step node */}
              <button
                onClick={() => isCompleted && goTo(stepNum)}
                disabled={!isCompleted}
                className="flex flex-col items-center gap-1.5 group"
                aria-label={`Step ${stepNum}: ${step.label}`}
              >
                {/* Circle */}
                <motion.div
                  animate={{
                    backgroundColor: isCompleted
                      ? '#C9A84C'
                      : isActive
                      ? 'transparent'
                      : 'transparent',
                    borderColor: isCompleted
                      ? '#C9A84C'
                      : isActive
                      ? '#C9A84C'
                      : '#2A2A2A',
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center
                    transition-colors duration-300
                    ${isCompleted ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  {isCompleted ? (
                    <CheckIcon />
                  ) : (
                    <span
                      className={`text-xs font-heading font-semibold ${
                        isActive ? 'text-gold' : 'text-[#555]'
                      }`}
                    >
                      {stepNum}
                    </span>
                  )}
                </motion.div>

                {/* Label */}
                <span
                  className={`text-[10px] uppercase tracking-[0.15em] font-accent whitespace-nowrap hidden sm:block ${
                    isActive
                      ? 'text-gold'
                      : isCompleted
                      ? 'text-[#9A9A9A]'
                      : 'text-[#444]'
                  }`}
                >
                  {step.shortLabel}
                </span>
              </button>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 mx-1.5 sm:mx-2.5 h-px min-w-[20px] sm:min-w-[40px] relative overflow-hidden bg-surface-border rounded-full">
                  <motion.div
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    initial={{ scaleX: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="absolute inset-0 bg-gold origin-left rounded-full"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="#0A0A0A"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="2 6 5 9 10 3" />
  </svg>
);
