import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../buttons/Button';
import { useScrollTo } from '../../hooks/useScrollTo';
import { fadeUp, staggerContainer } from '../../styles/animations';

export const Hero: React.FC = () => {
  const { scrollTo } = useScrollTo();

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&q=80&fit=crop"
          alt="Barber shop atmosphere"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Multi-layer dark overlay for cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black-900/95 via-black-900/75 to-black-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black-900 via-transparent to-black-900/30" />
        {/* Subtle gold glow */}
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gold/5 blur-[120px] pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container w-full pt-24 pb-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-accent font-medium">
              Premium Grooming Experience
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-heading font-extrabold text-5xl sm:text-6xl md:text-7xl leading-[1.05] text-white mb-6 text-balance"
          >
            Book Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">
              Barber Experience
            </span>
            <br />
            in Seconds.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-[#9A9A9A] leading-relaxed mb-10 max-w-xl font-body"
          >
            Precision cuts, master craftsmen, zero waiting. Schedule your next
            session and walk in ready.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <Button to="/booking" variant="primary" size="lg">
              Book Now
              <ArrowRight />
            </Button>
            <Button
              onClick={() => scrollTo('gallery')}
              variant="secondary"
              size="lg"
            >
              View Gallery
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-20 flex flex-wrap gap-8 md:gap-14"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="flex flex-col gap-1">
              <span className="font-heading font-bold text-3xl text-white">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-[0.18em] text-[#9A9A9A]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#555555]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent"
        />
      </motion.div>
    </section>
  );
};

const stats = [
  { value: '500+', label: 'Cuts Delivered' },
  { value: '4.9★', label: 'Avg. Rating' },
  { value: '3 min', label: 'To Book' },
];

const ArrowRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);
