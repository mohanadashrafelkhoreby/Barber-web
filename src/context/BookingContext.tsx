import React, { createContext, useContext, useState, useCallback } from 'react';
import type { BookingState, Service, Barber, PaymentMethod } from '../data/booking';

interface BookingContextValue {
  state: BookingState;
  goTo: (step: number) => void;
  next: () => void;
  back: () => void;
  setService: (s: Service) => void;
  setBarber: (b: Barber) => void;
  setDate: (d: string) => void;
  setTimeSlot: (t: string) => void;
  toggleExtra: (id: string) => void;
  setName: (n: string) => void;
  setPhone: (p: string) => void;
  setPayment: (m: PaymentMethod) => void;
  reset: () => void;
}

const initialState: BookingState = {
  step: 1,
  service: null,
  barber: null,
  date: '',
  timeSlot: '',
  extras: [],
  name: '',
  phone: '',
  payment: null,
};

const BookingContext = createContext<BookingContextValue | null>(null);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BookingState>(initialState);

  const goTo = useCallback((step: number) => setState((s) => ({ ...s, step })), []);
  const next = useCallback(() => setState((s) => ({ ...s, step: Math.min(s.step + 1, 6) })), []);
  const back = useCallback(() => setState((s) => ({ ...s, step: Math.max(s.step - 1, 1) })), []);

  const setService = useCallback((service: Service) =>
    setState((s) => ({ ...s, service, barber: null, date: '', timeSlot: '' })), []);

  const setBarber = useCallback((barber: Barber) =>
    setState((s) => ({ ...s, barber, date: '', timeSlot: '' })), []);

  const setDate = useCallback((date: string) =>
    setState((s) => ({ ...s, date, timeSlot: '' })), []);

  const setTimeSlot = useCallback((timeSlot: string) =>
    setState((s) => ({ ...s, timeSlot })), []);

  const toggleExtra = useCallback((id: string) =>
    setState((s) => ({
      ...s,
      extras: s.extras.includes(id)
        ? s.extras.filter((e) => e !== id)
        : [...s.extras, id],
    })), []);

  const setName = useCallback((name: string) => setState((s) => ({ ...s, name })), []);
  const setPhone = useCallback((phone: string) => setState((s) => ({ ...s, phone })), []);

  const setPayment = useCallback((payment: PaymentMethod) =>
    setState((s) => ({ ...s, payment })), []);

  const reset = useCallback(() => setState(initialState), []);

  return (
    <BookingContext.Provider value={{
      state, goTo, next, back,
      setService, setBarber, setDate, setTimeSlot,
      toggleExtra, setName, setPhone, setPayment, reset,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextValue => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
};
