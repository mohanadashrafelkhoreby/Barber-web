import React from 'react';
import { motion } from 'framer-motion';
import { SERVICES } from '../../data/booking';
import type { Service } from '../../data/booking';
import { useBooking } from '../../context/BookingContext';
import { StepNav } from './StepNav';
import { staggerContainer, fadeUp } from '../../styles/animations';

export const Step1Service: React.FC = () => {
  const { state, setService, next } = useBooking();

  const handleSelect = (service: Service) => {
    setService(service);
  };

  const handleNext = () => {
    if (state.service) next();
  };

  return (
    <div>
      {/* Header */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-8">
        <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.28em] text-gold font-accent mb-2">
          Step 1 of 6
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl md:text-3xl text-white mb-2">
          Choose Your Service
        </motion.h2>
        <motion.p variants={fadeUp} className="text-[#9A9A9A] text-sm">
          Select the experience you want. Each service is tailored to your needs.
        </motion.p>
      </motion.div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SERVICES.map((service, i) => {
          const isSelected = state.service?.id === service.id;
          return (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => handleSelect(service)}
              className={`
                relative text-left p-5 rounded-2xl border-2
                transition-all duration-300 group
                ${isSelected
                  ? 'border-gold bg-gold/8 shadow-[0_0_30px_rgba(201,168,76,0.18)]'
                  : 'border-surface-border bg-surface hover:border-gold/40 hover:bg-surface-raised'
                }
              `}
            >
              {/* Badge */}
              {service.badge && (
                <span className="absolute top-3.5 right-3.5 text-[10px] uppercase tracking-[0.15em] bg-gold/15 text-gold px-2.5 py-0.5 rounded-full font-accent">
                  {service.badge}
                </span>
              )}

              {/* Icon + Name */}
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl leading-none mt-0.5">{service.icon}</span>
                <div>
                  <h3 className="font-heading font-semibold text-white text-base leading-tight">
                    {service.name}
                  </h3>
                  <p className={`text-xs mt-0.5 ${isSelected ? 'text-gold' : 'text-[#9A9A9A]'}`}>
                    {service.tagline}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-[#9A9A9A] text-xs leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Footer: price + duration */}
              <div className="flex items-center justify-between">
                <span className={`font-heading font-bold text-xl ${isSelected ? 'text-gold' : 'text-white'}`}>
                  ${service.price}
                </span>
                {service.duration ? (
                  <span className="flex items-center gap-1.5 text-xs text-[#9A9A9A]">
                    <ClockIcon />
                    {service.duration}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-[#9A9A9A]">
                    <QueueIcon />
                    Queue
                  </span>
                )}
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId="service-ring"
                  className="absolute inset-0 rounded-2xl border-2 border-gold pointer-events-none"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <StepNav
        showBack={false}
        onNext={handleNext}
        nextDisabled={!state.service}
        nextLabel="Continue"
      />
    </div>
  );
};

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const QueueIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
