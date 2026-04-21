import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../buttons/Button';
import { fadeUp, staggerContainer } from '../../styles/animations';

export const CTABanner: React.FC = () => {
  return (
    <section
      id="cta"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-label="Call to action"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&q=80&fit=crop&crop=top"
          alt="Barber at work"
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black-900/85" />
        {/* Gold radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.12)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 section-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-10 bg-gold opacity-60" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-accent">
              Next Level
            </span>
            <span className="h-px w-10 bg-gold opacity-60" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={fadeUp}
            className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6"
          >
            Ready for your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">
              next cut?
            </span>
          </motion.h2>

          {/* Sub */}
          <motion.p
            variants={fadeUp}
            className="text-[#9A9A9A] text-lg mb-10 max-w-md mx-auto"
          >
            Claim your slot now. Walk in sharp, leave sharper.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp}>
            <Button to="/booking" variant="primary" size="lg">
              Book Appointment
              <CalendarIcon />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const CalendarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
