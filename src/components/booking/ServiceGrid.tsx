import React from 'react';
import { motion } from 'framer-motion';
import { SERVICES } from '../../data/booking';
import type { Service, ServiceId } from '../../data/booking';
import { useBooking } from '../../context/BookingContext';
import {
  CrownIcon,
  ZapIcon,
  BriefcaseIcon,
  ScissorsIcon,
} from './BookingIcons';
import { staggerContainer, fadeUp } from '../../styles/animations';

const SERVICE_ICONS: Record<ServiceId, React.FC<{ size?: number; className?: string; strokeWidth?: number }>> = {
  vip: CrownIcon,
  quick: ZapIcon,
  groom: BriefcaseIcon,
  standard: ScissorsIcon,
};

const SERVICE_COLORS: Record<ServiceId, string> = {
  vip:      'from-gold/20 to-gold/5',
  quick:    'from-blue-500/15 to-blue-500/5',
  groom:    'from-purple-500/15 to-purple-500/5',
  standard: 'from-emerald-500/15 to-emerald-500/5',
};

const ICON_COLORS: Record<ServiceId, string> = {
  vip:      'text-gold',
  quick:    'text-blue-400',
  groom:    'text-purple-400',
  standard: 'text-emerald-400',
};

interface ServiceGridProps {
  onSelected: () => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ onSelected }) => {
  const { state, setService } = useBooking();

  const handleSelect = (service: Service) => {
    setService(service);
    // Tiny delay so selection state is visible before scroll
    setTimeout(onSelected, 280);
  };

  return (
    <section>
      {/* Section label */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-5"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-2.5 mb-1">
          <span className="w-5 h-px bg-gold opacity-60" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-accent">
            01 / Service
          </span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl text-white">
          What are you coming in for?
        </motion.h2>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 gap-3">
        {SERVICES.map((service, i) => {
          const Icon = SERVICE_ICONS[service.id];
          const isSelected = state.service?.id === service.id;
          const colorClass = SERVICE_COLORS[service.id];
          const iconColor = ICON_COLORS[service.id];

          return (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => handleSelect(service)}
              className={`
                relative text-left p-4 sm:p-5 rounded-2xl border
                transition-all duration-250 group overflow-hidden
                ${isSelected
                  ? 'border-gold/60 shadow-[0_0_28px_rgba(201,168,76,0.14)]'
                  : 'border-[#2A2A2A] hover:border-[#3A3A3A]'
                }
              `}
            >
              {/* Background gradient */}
              <div
                className={`
                  absolute inset-0 bg-gradient-to-br transition-opacity duration-300
                  ${colorClass}
                  ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}
                `}
              />
              {/* Dark base */}
              <div className={`absolute inset-0 bg-[#111] -z-10 rounded-2xl ${isSelected ? 'opacity-60' : 'opacity-100'}`} />

              <div className="relative z-10">
                {/* Badge */}
                {service.badge && (
                  <span className={`
                    absolute -top-1 -right-1 text-[9px] uppercase tracking-[0.15em]
                    px-2 py-0.5 rounded-full font-accent font-medium
                    ${isSelected
                      ? 'bg-gold text-black-900'
                      : 'bg-[#2A2A2A] text-[#9A9A9A]'
                    }
                    transition-colors duration-200
                  `}>
                    {service.badge}
                  </span>
                )}

                {/* Icon */}
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center mb-3
                  transition-all duration-200
                  ${isSelected
                    ? 'bg-white/10'
                    : 'bg-[#1A1A1A] group-hover:bg-[#222]'
                  }
                `}>
                  <Icon
                    size={18}
                    className={`transition-colors duration-200 ${isSelected ? iconColor : 'text-[#777]'}`}
                    strokeWidth={1.75}
                  />
                </div>

                {/* Name */}
                <h3 className={`
                  font-heading font-semibold text-sm leading-tight mb-1
                  transition-colors duration-200
                  ${isSelected ? 'text-white' : 'text-[#CCC]'}
                `}>
                  {service.name}
                </h3>

                {/* Tagline */}
                <p className={`
                  text-[11px] leading-snug transition-colors duration-200
                  ${isSelected ? 'text-[#9A9A9A]' : 'text-[#555]'}
                `}>
                  {service.tagline}
                </p>

                {/* Duration / Queue */}
                <div className="mt-3 pt-2.5 border-t border-white/5">
                  {service.duration ? (
                    <span className={`
                      flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] font-accent
                      ${isSelected ? 'text-[#9A9A9A]' : 'text-[#444]'}
                    `}>
                      <DotIcon />
                      {service.duration}
                    </span>
                  ) : (
                    <span className={`
                      flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] font-accent
                      ${isSelected ? 'text-emerald-400/80' : 'text-[#444]'}
                    `}>
                      <DotIcon />
                      Queue system
                    </span>
                  )}
                </div>
              </div>

              {/* Selected tick */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold flex items-center justify-center"
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

const DotIcon = () => (
  <span className="inline-block w-1 h-1 rounded-full bg-current opacity-60" />
);
