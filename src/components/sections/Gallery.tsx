import React from 'react';
import { motion } from 'framer-motion';
import { galleryItems } from '../../data/content';
import { StyleCard } from '../cards/StyleCard';
import { fadeUp, staggerContainer } from '../../styles/animations';

export const Gallery: React.FC = () => {
  return (
    <section
      id="gallery"
      className="section-padding bg-black-900 relative overflow-hidden"
      aria-label="Gallery"
    >
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[150px] pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-10 bg-gold opacity-70" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-accent">
              Our Work
            </span>
            <span className="h-px w-10 bg-gold opacity-70" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-heading font-bold text-4xl md:text-5xl text-white mb-4"
          >
            Every Cut, a Statement
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-[#9A9A9A] text-lg max-w-lg mx-auto"
          >
            Precision and artistry in every session. Let the work speak.
          </motion.p>
        </motion.div>

        {/* Divider */}
        <div className="gold-divider mb-16" />

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {galleryItems.map((item, index) => (
            <StyleCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
