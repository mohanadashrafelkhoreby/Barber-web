import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../styles/animations';

const pillars = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    headline: 'Craft Above All',
    body: 'Every cut is executed with precision tools and years of trained intuition — not guesswork.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    headline: 'Respect Your Time',
    body: 'Book in under 3 minutes. Show up and sit down — no wait, no hassle, no compromise.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    headline: 'Experience First',
    body: 'From the first scroll to the final cut, every touchpoint is built around you.',
  },
];

export const About: React.FC = () => {
  return (
    <section
      id="about"
      className="section-padding bg-black-800 relative overflow-hidden"
      aria-label="About"
    >
      {/* Subtle texture gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black-900/60 to-transparent pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left: text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-gold opacity-70" />
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-accent">
                Why BarberX
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-heading font-bold text-4xl md:text-5xl text-white leading-tight mb-6"
            >
              Where Skill Meets
              <br />
              <span className="text-gold">Simplicity.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-[#9A9A9A] text-lg leading-relaxed mb-4 max-w-md"
            >
              BarberX was built for one purpose: connecting serious barbers with
              clients who value their look. No bloat, no distractions.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-[#9A9A9A] text-base leading-relaxed max-w-md"
            >
              Years of craft, distilled into a platform that works as sharply as
              the blade.
            </motion.p>
          </motion.div>

          {/* Right: pillars */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col gap-5"
          >
            {pillars.map((pillar) => (
              <motion.div
                key={pillar.headline}
                variants={fadeUp}
                className="
                  flex items-start gap-5 p-5
                  bg-black-700 border border-surface-border rounded-2xl
                  hover:border-gold/30 transition-colors duration-300
                  group
                "
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors duration-300">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-white text-base mb-1">
                    {pillar.headline}
                  </h3>
                  <p className="text-[#9A9A9A] text-sm leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
