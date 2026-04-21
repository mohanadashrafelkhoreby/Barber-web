import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EXTRAS, PAYMENT_OPTIONS } from '../../data/booking';
import type { PaymentMethod } from '../../data/booking';
import { useBooking } from '../../context/BookingContext';
import {
  PlusIcon,
  ChevronDownIcon,
  UserIcon,
  PhoneIcon,
  BanknoteIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  LockIcon,
  CheckIcon,
  ArrowRightIcon,
} from './BookingIcons';
import { staggerContainer, fadeUp } from '../../styles/animations';

// Icon map for payment methods
const PAY_ICONS: Record<string, React.FC<{ size?: number; className?: string; strokeWidth?: number }>> = {
  banknote: BanknoteIcon,
  creditcard: CreditCardIcon,
  shieldcheck: ShieldCheckIcon,
};

interface DetailsPaneProps {
  onConfirm: () => void;
  submitting: boolean;
}

export const DetailsPane: React.FC<DetailsPaneProps> = ({ onConfirm, submitting }) => {
  const { state, toggleExtra, setName, setPhone, setPayment } = useBooking();
  const [extrasOpen, setExtrasOpen] = useState(false);

  // Derived
  const extrasTotal = EXTRAS.filter((e) => state.extras.includes(e.id))
    .reduce((s, e) => s + e.price, 0);

  const isNameValid = state.name.trim().length >= 2;
  const isPhoneValid = /^\+?[\d\s\-().]{7,}$/.test(state.phone.trim());
  const canConfirm = isNameValid && isPhoneValid && !!state.payment;

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
            03 / Complete your booking
          </span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl text-white">
          Almost there.
        </motion.h2>
      </motion.div>

      {/* ─── Main checkout card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-[#2A2A2A] bg-[#0F0F0F] overflow-hidden"
      >

        {/* ── Extras accordion ── */}
        <div className="p-5">
          <button
            onClick={() => setExtrasOpen((v) => !v)}
            className="flex items-center justify-between w-full group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${extrasOpen ? 'bg-gold/10' : 'bg-[#1A1A1A] group-hover:bg-[#222]'}`}>
                <PlusIcon size={14} className={extrasOpen ? 'text-gold' : 'text-[#555]'} strokeWidth={2} />
              </div>
              <div className="text-left">
                <p className="text-sm font-heading font-medium text-white">Add-ons</p>
                <p className="text-[10px] text-[#555] font-accent mt-0.5">
                  {state.extras.length > 0
                    ? `${state.extras.length} selected · +$${extrasTotal}`
                    : 'Optional extras'}
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: extrasOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDownIcon size={16} className="text-[#555]" />
            </motion.div>
          </button>

          {/* Extras list */}
          <AnimatePresence>
            {extrasOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div className="mt-4 space-y-2">
                  {EXTRAS.map((extra) => {
                    const isOn = state.extras.includes(extra.id);
                    return (
                      <button
                        key={extra.id}
                        onClick={() => toggleExtra(extra.id)}
                        className={`
                          w-full flex items-center justify-between
                          px-3.5 py-3 rounded-xl border transition-all duration-180
                          ${isOn
                            ? 'border-gold/40 bg-gold/5'
                            : 'border-[#222] bg-[#141414] hover:border-[#333]'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0
                            transition-all duration-180
                            ${isOn ? 'bg-gold border-gold' : 'bg-transparent border-[#444]'}
                          `}>
                            {isOn && (
                              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="2 6 5 9 10 3" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-xs font-body ${isOn ? 'text-white' : 'text-[#9A9A9A]'}`}>
                            {extra.label}
                          </span>
                        </div>
                        <span className={`text-xs font-heading font-semibold flex-shrink-0 ${isOn ? 'text-gold' : 'text-[#555]'}`}>
                          +${extra.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-px bg-[#1E1E1E]" />

        {/* ── Customer Info ── */}
        <div className="p-5 space-y-3.5">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#9A9A9A] font-accent mb-4">
            Your Details
          </p>

          {/* Name */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none">
              <UserIcon size={14} />
            </span>
            <input
              type="text"
              value={state.name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              autoComplete="name"
              className={`
                w-full pl-10 pr-10 py-3 rounded-xl bg-[#141414] border
                font-body text-sm text-white placeholder-[#333]
                outline-none transition-all duration-200
                focus:bg-[#161616]
                ${state.name && !isNameValid
                  ? 'border-red-500/40 focus:border-red-500/60'
                  : state.name && isNameValid
                  ? 'border-gold/30 focus:border-gold/50'
                  : 'border-[#222] focus:border-[#3A3A3A]'
                }
              `}
            />
            {state.name && isNameValid && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gold">
                <CheckIcon size={13} strokeWidth={2.5} />
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none">
              <PhoneIcon size={14} />
            </span>
            <input
              type="tel"
              value={state.phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              autoComplete="tel"
              className={`
                w-full pl-10 pr-10 py-3 rounded-xl bg-[#141414] border
                font-body text-sm text-white placeholder-[#333]
                outline-none transition-all duration-200
                focus:bg-[#161616]
                ${state.phone && !isPhoneValid
                  ? 'border-red-500/40 focus:border-red-500/60'
                  : state.phone && isPhoneValid
                  ? 'border-gold/30 focus:border-gold/50'
                  : 'border-[#222] focus:border-[#3A3A3A]'
                }
              `}
            />
            {state.phone && isPhoneValid && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gold">
                <CheckIcon size={13} strokeWidth={2.5} />
              </span>
            )}
          </div>
        </div>

        <div className="h-px bg-[#1E1E1E]" />

        {/* ── Payment method ── */}
        <div className="p-5">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#9A9A9A] font-accent mb-4">
            Payment Method
          </p>

          <div className="grid grid-cols-3 gap-2.5">
            {PAYMENT_OPTIONS.map((opt) => {
              const PayIcon = PAY_ICONS[opt.icon] ?? BanknoteIcon;
              const isSelected = state.payment === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setPayment(opt.id as PaymentMethod)}
                  className={`
                    flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border
                    transition-all duration-200 group
                    ${isSelected
                      ? 'border-gold/60 bg-gold/6 shadow-[0_0_20px_rgba(201,168,76,0.1)]'
                      : 'border-[#222] bg-[#141414] hover:border-[#333]'
                    }
                  `}
                >
                  <div className={`transition-colors duration-200 ${isSelected ? 'text-gold' : 'text-[#555] group-hover:text-[#777]'}`}>
                    <PayIcon size={18} strokeWidth={1.6} />
                  </div>
                  <span className={`text-[11px] font-heading font-medium leading-tight text-center ${isSelected ? 'text-white' : 'text-[#666]'}`}>
                    {opt.label}
                  </span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 rounded-full bg-gold flex items-center justify-center"
                    >
                      <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2 6 5 9 10 3" />
                      </svg>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Deposit note */}
          <AnimatePresence>
            {state.payment === 'deposit' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: 'hidden' }}
                className="mt-3"
              >
                <p className="text-[11px] text-gold/80 bg-gold/5 border border-gold/15 rounded-lg px-3 py-2.5 font-accent">
                  50% charged now as a deposit. Remaining balance due at the shop.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-px bg-[#1E1E1E]" />

        {/* ── Summary & Confirm ── */}
        <div className="p-5">
          {/* Price summary */}
          <div className="mb-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#555] font-body">Service price</span>
              <span className="text-xs text-[#555] font-body italic">Set by barber</span>
            </div>
            {extrasTotal > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9A9A9A] font-body">Add-ons</span>
                <span className="text-xs text-white font-heading font-semibold">+${extrasTotal}</span>
              </div>
            )}
            <div className="h-px bg-[#1E1E1E] my-2" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9A9A9A] font-body">Due today</span>
              <span className="text-sm text-gold font-heading font-bold">
                {state.payment === 'deposit' && extrasTotal > 0
                  ? `$${Math.ceil(extrasTotal / 2)} deposit`
                  : state.payment === 'online' && extrasTotal > 0
                  ? `$${extrasTotal} add-ons`
                  : 'At appointment'}
              </span>
            </div>
          </div>

          {/* Confirm button */}
          <motion.button
            whileHover={canConfirm && !submitting ? { scale: 1.02 } : {}}
            whileTap={canConfirm && !submitting ? { scale: 0.98 } : {}}
            onClick={canConfirm && !submitting ? onConfirm : undefined}
            disabled={!canConfirm || submitting}
            className={`
              w-full flex items-center justify-center gap-3 py-4 rounded-2xl
              font-body font-semibold text-sm tracking-wide
              transition-all duration-300
              ${canConfirm && !submitting
                ? 'bg-gold text-black-900 shadow-[0_0_28px_rgba(201,168,76,0.3)] hover:bg-gold-light hover:shadow-[0_0_40px_rgba(201,168,76,0.45)]'
                : 'bg-[#1A1A1A] text-[#444] cursor-not-allowed'
              }
            `}
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-black/20 border-t-black/70 rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              <>
                Confirm Booking
                {canConfirm && <ArrowRightIcon size={15} />}
              </>
            )}
          </motion.button>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <LockIcon size={11} className="text-[#444]" />
            <span className="text-[10px] text-[#444] font-accent">Secure · Your data is protected</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
