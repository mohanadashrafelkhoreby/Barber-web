import React from 'react';
import { Link } from 'react-router-dom';

const ScissorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black-900 border-t border-surface-border">
      <div className="section-container py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" aria-label="BarberX">
          <span className="text-gold">
            <ScissorIcon />
          </span>
          <span className="font-heading font-bold text-lg tracking-wider text-white">
            BARBER<span className="text-gold">X</span>
          </span>
        </Link>

        {/* Center: tagline */}
        <p className="text-[#555555] text-sm text-center">
          © {new Date().getFullYear()} BarberX. All rights reserved.
        </p>

        {/* Right: links */}
        <div className="flex items-center gap-6">
          <Link to="/booking" className="text-sm text-[#9A9A9A] hover:text-gold transition-colors duration-200">
            Book Now
          </Link>
          <a href="#gallery" className="text-sm text-[#9A9A9A] hover:text-gold transition-colors duration-200">
            Gallery
          </a>
        </div>
      </div>
    </footer>
  );
};
