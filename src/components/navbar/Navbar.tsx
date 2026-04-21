import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../buttons/Button';
import { navLinks } from '../../data/content';
import { useScrolled } from '../../hooks/useScrolled';
import { useScrollTo } from '../../hooks/useScrollTo';
import { MOCK_POINTS } from '../../data/points';

// Inline star icon (filled) for points pill
const StarFilledIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Scissor icon inline SVG
const ScissorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

const HamburgerIcon = ({ open }: { open: boolean }) => (
  <div className="w-6 h-5 flex flex-col justify-between cursor-pointer" aria-label="Toggle menu">
    <motion.span
      animate={open ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
      className="block h-0.5 w-full bg-white origin-center transition-all"
    />
    <motion.span
      animate={open ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
      className="block h-0.5 w-full bg-white"
    />
    <motion.span
      animate={open ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
      className="block h-0.5 w-full bg-white origin-center transition-all"
    />
  </div>
);

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrolled(30);
  const { scrollTo } = useScrollTo();
  const location = useLocation();

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('#')) {
      const id = href.replace('#', '');
      if (location.pathname !== '/') {
        window.location.href = `/${href}`;
      } else {
        scrollTo(id);
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black-900/95 backdrop-blur-md border-b border-surface-border shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-container h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          aria-label="BarberX Home"
        >
          <span className="text-gold group-hover:text-gold-light transition-colors duration-300">
            <ScissorIcon />
          </span>
          <span className="font-heading font-bold text-xl tracking-wider text-white group-hover:text-gold transition-colors duration-300">
            BARBER<span className="text-gold">X</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return link.href.startsWith('#') ? (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`text-sm font-body tracking-wide transition-colors duration-200 relative group ${
                  active ? 'text-white' : 'text-[#9A9A9A] hover:text-white'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300 ${
                  active ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </button>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className={`text-sm font-body tracking-wide transition-colors duration-200 relative group ${
                  active ? 'text-white' : 'text-[#9A9A9A] hover:text-white'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300 ${
                  active ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            );
          })}

          {/* Points indicator */}
          <Link
            to="/points"
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full
              transition-all duration-200 group
              ${
                isActive('/points')
                  ? 'border border-gold/60 bg-gold/18 shadow-[0_0_10px_rgba(201,168,76,0.18)]'
                  : 'border border-gold/25 bg-gold/8 hover:border-gold/50 hover:bg-gold/14'
              }
            `}
          >
            <span className="text-gold group-hover:scale-110 transition-transform duration-200">
              <StarFilledIcon size={11} />
            </span>
            <span className="text-xs font-accent font-medium text-gold tracking-wide">
              {MOCK_POINTS} pts
            </span>
          </Link>

          <div className={`rounded-xl transition-all duration-200 ${
            isActive('/booking') ? 'shadow-[0_0_14px_rgba(201,168,76,0.30)] ring-1 ring-gold/40' : ''
          }`}>
            <Button to="/booking" variant="primary" size="sm">
              Book Now
            </Button>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-1"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation"
        >
          <HamburgerIcon open={mobileOpen} />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-black-800 border-b border-surface-border overflow-hidden"
          >
            <div className="section-container py-6 flex flex-col gap-5">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return link.href.startsWith('#') ? (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className={`text-left text-base font-body tracking-wide transition-colors duration-200 ${
                      active ? 'text-white' : 'text-[#9A9A9A] hover:text-white'
                    }`}
                  >
                    {active && <span className="inline-block w-1 h-1 rounded-full bg-gold mr-2 mb-0.5 align-middle" />}
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-base font-body tracking-wide transition-colors duration-200 flex items-center gap-2 ${
                      active ? 'text-white' : 'text-[#9A9A9A] hover:text-white'
                    }`}
                  >
                    {active && <span className="inline-block w-1 h-1 rounded-full bg-gold flex-shrink-0" />}
                    {link.label}
                  </Link>
                );
              })}
              {/* Points (mobile drawer) */}
              <Link
                to="/points"
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-2.5 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${
                    isActive('/points')
                      ? 'border border-gold/55 bg-gold/14 shadow-[0_0_10px_rgba(201,168,76,0.15)]'
                      : 'border border-gold/20 bg-gold/6 hover:border-gold/40'
                  }
                `}
              >
                <StarFilledIcon size={14} />
                <span className="text-sm font-accent font-medium text-gold">
                  {MOCK_POINTS} Points
                </span>
                <span className="ml-auto text-[10px] text-[#555] font-body">View rewards →</span>
              </Link>

              <div className={`rounded-xl transition-all duration-200 ${
                isActive('/booking') ? 'shadow-[0_0_14px_rgba(201,168,76,0.28)] ring-1 ring-gold/40' : ''
              }`}>
                <Button to="/booking" variant="primary" size="md" fullWidth>
                  Book Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
