import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { GalleryItem } from '../../data/content';

interface StyleCardProps {
  item: GalleryItem;
  index?: number;
}

export const StyleCard: React.FC<StyleCardProps> = ({ item, index = 0 }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl bg-surface cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full h-72 md:h-80 overflow-hidden">
        {/* Skeleton */}
        {!loaded && (
          <div className="absolute inset-0 bg-black-700 animate-pulse" />
        )}
        <img
          src={item.imageUrl}
          alt={item.title}
          onLoad={() => setLoaded(true)}
          className={`
            w-full h-full object-cover
            transition-all duration-700 ease-out
            group-hover:scale-110
            ${loaded ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* Hover Overlay */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t from-black-900/90 via-black-900/30 to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity duration-400 ease-out
            flex flex-col justify-end p-5
          "
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-gold font-accent font-medium mb-1">
              {item.category}
            </p>
            <h3 className="text-lg font-heading font-semibold text-white">
              {item.title}
            </h3>
          </motion.div>
        </div>

        {/* Always-visible badge at bottom */}
        <div className="absolute bottom-4 left-4 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
          <span className="text-xs uppercase tracking-[0.15em] text-[#9A9A9A] bg-black-900/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {item.category}
          </span>
        </div>
      </div>
    </motion.article>
  );
};
