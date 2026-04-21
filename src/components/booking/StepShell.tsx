import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface StepShellProps {
  stepKey: number;
  children: React.ReactNode;
}

let prevStep = 1;

export const StepShell: React.FC<StepShellProps> = ({ stepKey, children }) => {
  const dir = stepKey >= prevStep ? 1 : -1;
  prevStep = stepKey;

  const xEnter = dir > 0 ? 40 : -40;
  const xExit = dir > 0 ? -40 : 40;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: xEnter }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.38, ease: 'easeOut' } }}
        exit={{ opacity: 0, x: xExit, transition: { duration: 0.25, ease: 'easeIn' } }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
