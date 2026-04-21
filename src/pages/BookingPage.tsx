import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingProvider, useBooking } from '../context/BookingContext';
import { ServiceGrid } from '../components/booking/ServiceGrid';
import { BarberSelect } from '../components/booking/BarberSelect';
import { DateTimePick } from '../components/booking/DateTimePick';
import { DetailsPane } from '../components/booking/DetailsPane';
import { ConfirmScreen } from '../components/booking/ConfirmScreen';

// ─── Inner flow (needs context) ───────────────

const BookingFlow: React.FC = () => {
  const { state } = useBooking();
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const showBarber   = !!state.service;
  const showDateTime = !!state.service && !!state.barber;
  const showDetails  = state.service?.requiresSlot
    ? !!state.timeSlot
    : !!state.date;

  const barberRef  = useRef<HTMLDivElement>(null);
  const dateRef    = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>, delay = 300) => {
    setTimeout(() => {
      if (ref.current) {
        const top = ref.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, delay);
  };

  // Scroll to barber when service changes
  const prevServiceId = useRef<string | null>(null);
  useEffect(() => {
    if (state.service && state.service.id !== prevServiceId.current) {
      prevServiceId.current = state.service.id;
      scrollTo(barberRef);
    }
  }, [state.service]);

  // Scroll to datetime when barber changes
  const prevBarberId = useRef<string | null>(null);
  useEffect(() => {
    if (state.barber && state.barber.id !== prevBarberId.current) {
      prevBarberId.current = state.barber.id;
      scrollTo(dateRef);
    }
  }, [state.barber]);

  // Scroll to details when first revealed
  const prevShowDetails = useRef(false);
  useEffect(() => {
    if (showDetails && !prevShowDetails.current) {
      scrollTo(detailsRef, 350);
    }
    prevShowDetails.current = showDetails;
  }, [showDetails]);

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setConfirmed(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  if (confirmed) {
    return <ConfirmScreen state={state} />;
  }

  return (
    <div className="space-y-14 pb-24">
      {/* 01 — Service */}
      <ServiceGrid onSelected={() => scrollTo(barberRef)} />

      {/* 02 — Barber */}
      <AnimatePresence>
        {showBarber && (
          <motion.div
            key="barber"
            ref={barberRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionDivider />
            <BarberSelect onSelected={() => scrollTo(dateRef)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 03 — Date & Time */}
      <AnimatePresence>
        {showDateTime && (
          <motion.div
            key="datetime"
            ref={dateRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionDivider />
            <DateTimePick onTimeSelected={() => scrollTo(detailsRef, 350)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 04 — Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            key="details"
            ref={detailsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionDivider />
            <DetailsPane onConfirm={handleConfirm} submitting={submitting} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Subtle section divider ───────────────────

const SectionDivider: React.FC = () => (
  <div className="flex items-center gap-3 mb-10">
    <div className="flex-1 h-px bg-[#1E1E1E]" />
    <div className="w-1.5 h-1.5 rounded-full bg-[#2A2A2A]" />
    <div className="flex-1 h-px bg-[#1E1E1E]" />
  </div>
);

// ─── Progress dots ────────────────────────────

const ProgressDots: React.FC = () => {
  const { state } = useBooking();

  // Step 0 = nothing, 1 = service, 2 = barber, 3 = datetime, 4 = details
  let step = 0;
  if (state.service) step = 1;
  if (state.barber)  step = 2;
  if (state.service?.requiresSlot ? state.date : state.date) step = 3;
  if (state.service?.requiresSlot ? state.timeSlot : state.date) step = 3;
  const showDetails = state.service?.requiresSlot ? !!state.timeSlot : !!state.date;
  if (showDetails) step = 4;

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`
            rounded-full transition-all duration-300
            ${i < step
              ? 'w-4 h-1.5 bg-gold'
              : i === step
              ? 'w-2.5 h-1.5 bg-gold/50'
              : 'w-1.5 h-1.5 bg-[#2A2A2A]'
            }
          `}
        />
      ))}
    </div>
  );
};

// ─── Page shell ───────────────────────────────

const BookingPage: React.FC = () => (
  <BookingProvider>
    <div className="min-h-screen bg-[#0A0A0A] pt-16 md:pt-20">
      {/* Main content */}
      <main className="max-w-lg mx-auto px-5 pt-6">
        {/* Inline progress indicator */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#555] font-accent">Book Appointment</p>
          <ProgressDots />
        </div>
        <BookingFlow />
      </main>
    </div>
  </BookingProvider>
);

export default BookingPage;
