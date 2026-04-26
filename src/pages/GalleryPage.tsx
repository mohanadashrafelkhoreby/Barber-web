import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryItems, type GalleryFilter } from '../data/content';

// ─── Category meta ────────────────────────────

interface FilterMeta {
  label: GalleryFilter;
  description: string;
}

const FILTERS: FilterMeta[] = [
  { label: 'All',     description: 'Full portfolio' },
  { label: 'Haircut', description: 'Fades & tapers' },
  { label: 'Beard',   description: 'Sculpts & trims' },
];

// ─── Inline SVG icons (no emoji) ─────────────

const ScissorsIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

const BeardIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a5 5 0 0 1 5 5v2c0 2-1 4-2.5 5.5a5.5 5.5 0 0 1-5 0C8 13 7 11 7 9V7a5 5 0 0 1 5-5z" />
    <path d="M7 14c-2 1-3 3-3 5h16c0-2-1-4-3-5" />
  </svg>
);

const GridIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const FILTER_ICONS: Record<GalleryFilter, React.ReactNode> = {
  All:     <GridIcon />,
  Haircut: <ScissorsIcon />,
  Beard:   <BeardIcon />,
};

// ─── Lightbox ─────────────────────────────────

interface LightboxProps {
  item: typeof galleryItems[number];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const Lightbox: React.FC<LightboxProps> = ({ item, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  // Close on backdrop click
  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  // Keyboard nav
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#111] border border-[#2A2A2A] flex items-center justify-center text-[#9A9A9A] hover:text-white hover:border-[#3A3A3A] transition-all duration-200 z-10"
        aria-label="Close"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#111]/80 border border-[#2A2A2A] flex items-center justify-center text-[#9A9A9A] hover:text-white hover:border-[#3A3A3A] transition-all duration-200 z-10"
          aria-label="Previous"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
      )}

      {/* Next */}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#111]/80 border border-[#2A2A2A] flex items-center justify-center text-[#9A9A9A] hover:text-white hover:border-[#3A3A3A] transition-all duration-200 z-10"
          aria-label="Next"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      )}

      {/* Image */}
      <motion.div
        key={item.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-2xl w-full max-h-[80vh] flex flex-col rounded-2xl overflow-hidden border border-[#2A2A2A]"
      >
        <img
          src={item.imageUrl.replace('w=800', 'w=1200')}
          alt={item.title}
          className="w-full max-h-[72vh] object-cover"
        />
        {/* Caption bar */}
        <div className="bg-[#0D0D0D] border-t border-[#1A1A1A] px-5 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-white font-heading font-semibold text-sm">{item.title}</p>
            <p className="text-[#555] text-[11px] font-accent uppercase tracking-[0.2em] mt-0.5">{item.category}</p>
          </div>
          <Link
            to="/booking"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-black-900 text-xs font-body font-semibold hover:bg-gold-light transition-colors duration-200"
          >
            Book this style
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Gallery card ─────────────────────────────

interface GalleryCardProps {
  item: typeof galleryItems[number];
  index: number;
  onClick: () => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ item, index, onClick }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-[#111] cursor-pointer"
      style={{ aspectRatio: '3/4' }}
    >
      {/* Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-[#141414] animate-pulse" />
      )}

      {/* Photo */}
      <img
        src={item.imageUrl}
        alt={item.title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`
          absolute inset-0 w-full h-full object-cover
          transition-all duration-700 ease-out
          group-hover:scale-105
          ${loaded ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* Subtle persistent vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Category pill — always visible, fades on hover */}
      <div className="absolute top-3 left-3 transition-opacity duration-300 group-hover:opacity-0">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/8 text-[10px] font-accent uppercase tracking-[0.18em] text-[#9A9A9A]">
          {FILTER_ICONS[item.category as GalleryFilter]}
          {item.category}
        </span>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/50 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex flex-col justify-end p-4">
        {/* Slide-up label */}
        <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-350 ease-out">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-accent mb-1">
            {item.category}
          </p>
          <h3 className="font-heading font-bold text-white text-base leading-tight mb-3">
            {item.title}
          </h3>
          {/* View trigger */}
          <div className="flex items-center gap-1.5 text-[11px] font-body text-[#9A9A9A]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            View full photo
          </div>
        </div>
      </div>

      {/* Gold corner accent on hover */}
      <div className="absolute top-0 right-0 w-px h-0 bg-gold group-hover:h-12 transition-all duration-400 ease-out" />
      <div className="absolute top-0 right-0 w-0 h-px bg-gold group-hover:w-12 transition-all duration-400 ease-out" />
    </motion.article>
  );
};

// ─── Page ─────────────────────────────────────

const GalleryPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('All');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filtered = activeFilter === 'All'
    ? galleryItems
    : galleryItems.filter((i) => i.category === activeFilter);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prevPhoto = () => setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i));
  const nextPhoto = () => setLightboxIdx((i) => (i !== null && i < filtered.length - 1 ? i + 1 : i));

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16 md:pt-20">

      <main className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-24">

        {/* ── Hero header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-8 h-px bg-gold opacity-60" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-accent">
              Our Work
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white leading-tight">
                The Craft Gallery
              </h1>
              <p className="text-[#555] text-sm font-body mt-2">
                Every cut tells a story. Browse our portfolio.
              </p>
            </div>
            {/* Count badge */}
            <div className="flex items-center gap-1.5 text-[#444] text-xs font-accent shrink-0">
              <GridIcon size={12} />
              <span>{filtered.length} {activeFilter === 'All' ? 'photos' : `${activeFilter} photos`}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Filter tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex gap-2 flex-wrap mb-8"
        >
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.label;
            return (
              <button
                key={f.label}
                onClick={() => setActiveFilter(f.label)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl border
                  text-xs font-heading font-medium
                  transition-all duration-220
                  ${isActive
                    ? 'border-gold/50 bg-gold/10 text-white shadow-[0_0_16px_rgba(201,168,76,0.1)]'
                    : 'border-[#1E1E1E] bg-[#0C0C0C] text-[#555] hover:border-[#2A2A2A] hover:text-[#9A9A9A]'
                  }
                `}
              >
                <span className={isActive ? 'text-gold' : 'text-[#444]'}>
                  {FILTER_ICONS[f.label]}
                </span>
                {f.label}
                {isActive && (
                  <span className="text-[9px] font-accent text-gold/70 uppercase tracking-wider ml-0.5">
                    {f.description}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── Photo grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3"
          >
            {filtered.map((item, i) => (
              <div key={item.id} className="break-inside-avoid">
                <GalleryCard
                  item={item}
                  index={i}
                  onClick={() => openLightbox(i)}
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ScissorsIcon size={28} />
            <p className="text-[#333] font-body mt-4 text-sm">No photos in this category yet.</p>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 flex flex-col items-center text-center border-t border-[#1A1A1A] pt-14"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-6 h-px bg-gold opacity-50" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-accent">Like what you see?</span>
            <span className="w-6 h-px bg-gold opacity-50" />
          </div>
          <h2 className="font-heading font-bold text-2xl text-white mb-2">
            Book your next look.
          </h2>
          <p className="text-[#555] text-sm font-body mb-7 max-w-xs">
            Tell us the style you want and we'll make it happen.
          </p>
          <Link
            to="/booking"
            className="
              inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl
              bg-gold text-black-900 font-body font-semibold text-sm
              hover:bg-gold-light shadow-[0_0_28px_rgba(201,168,76,0.25)]
              hover:shadow-[0_0_40px_rgba(201,168,76,0.4)]
              transition-all duration-300
            "
          >
            Book an Appointment
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </motion.div>
      </main>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            item={filtered[lightboxIdx]}
            onClose={closeLightbox}
            onPrev={prevPhoto}
            onNext={nextPhoto}
            hasPrev={lightboxIdx > 0}
            hasNext={lightboxIdx < filtered.length - 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
