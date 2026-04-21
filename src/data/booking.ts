// ─────────────────────────────────────────────
// Booking domain types & static data
// ─────────────────────────────────────────────

export type ServiceId = 'vip' | 'quick' | 'groom' | 'standard';
export type PaymentMethod = 'cash' | 'online' | 'deposit';

export interface Service {
  id: ServiceId;
  icon?: string;        // legacy — new UI uses SVG icons
  name: string;
  tagline: string;
  description: string;
  price?: number;       // not shown to user; set by barber config
  duration: string | null; // null = queue-based
  requiresSlot: boolean;
  badge?: string;
}

export interface ExtraService {
  id: string;
  label: string;
  price: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingState {
  step: number;
  service: Service | null;
  date: string;       // ISO date string "YYYY-MM-DD"
  timeSlot: string;   // "10:00 AM"
  extras: string[];   // extra service ids
  name: string;
  phone: string;
  payment: PaymentMethod | null;
}

// ─── Static service catalogue ───────────────
// Prices are intentionally omitted — set dynamically by barber configuration
export const SERVICES: Service[] = [
  {
    id: 'vip',
    name: 'VIP Cut',
    tagline: 'The full luxury experience',
    description: 'Premium cut with hot towel, scalp massage & expert styling finish.',
    duration: '60 min',
    requiresSlot: true,
    badge: 'Popular',
  },
  {
    id: 'quick',
    name: 'Quick Cut',
    tagline: 'Sharp look, fast session',
    description: 'Clean precision cut — in and out with zero compromise on quality.',
    duration: '30 min',
    requiresSlot: true,
  },
  {
    id: 'groom',
    name: 'Groom Package',
    tagline: 'Head-to-beard perfection',
    description: 'Full cut + beard sculpt + brow line. Built for events.',
    duration: '75 min',
    requiresSlot: true,
    badge: 'Best Value',
  },
  {
    id: 'standard',
    name: 'Standard Cut',
    tagline: 'Walk-in queue system',
    description: 'Join the live queue — no appointment needed.',
    duration: null,
    requiresSlot: false,
  },
];

// ─── Extra services catalogue ────────────────
export const EXTRAS: ExtraService[] = [
  { id: 'haircut_detail', label: 'Haircut Detail & Line-up', price: 10 },
  { id: 'beard_trim',     label: 'Beard Trim & Shape',       price: 15 },
  { id: 'styling',        label: 'Styling & Finish',          price: 12 },
  { id: 'scalp_massage',  label: 'Scalp Massage',             price: 18 },
];

// ─── Available time slots (mock) ────────────
export const TIME_SLOTS: TimeSlot[] = [
  { time: '9:00 AM',  available: true  },
  { time: '9:30 AM',  available: false },
  { time: '10:00 AM', available: true  },
  { time: '10:30 AM', available: true  },
  { time: '11:00 AM', available: false },
  { time: '11:30 AM', available: true  },
  { time: '12:00 PM', available: false },
  { time: '12:30 PM', available: true  },
  { time: '1:00 PM',  available: true  },
  { time: '1:30 PM',  available: true  },
  { time: '2:00 PM',  available: false },
  { time: '2:30 PM',  available: true  },
  { time: '3:00 PM',  available: true  },
  { time: '3:30 PM',  available: false },
  { time: '4:00 PM',  available: true  },
  { time: '4:30 PM',  available: true  },
];

// ─── Payment methods ─────────────────────────
export interface PaymentOption {
  id: PaymentMethod;
  icon: string;
  label: string;
  description: string;
}

export const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: 'cash',    icon: 'banknote',    label: 'Cash',           description: 'Pay at the shop on arrival.' },
  { id: 'online',  icon: 'creditcard',  label: 'Online Payment', description: 'Secure card payment now.' },
  { id: 'deposit', icon: 'shieldcheck', label: 'Deposit',        description: 'Pay 50% now, rest at shop.' },
];

// ─── Step metadata ────────────────────────────
export interface StepMeta {
  label: string;
  shortLabel: string;
}

export const STEPS: StepMeta[] = [
  { label: 'Service',  shortLabel: 'Service'  },
  { label: 'Schedule', shortLabel: 'Time'     },
  { label: 'Extras',   shortLabel: 'Extras'   },
  { label: 'Info',     shortLabel: 'Info'     },
  { label: 'Payment',  shortLabel: 'Payment'  },
  { label: 'Summary',  shortLabel: 'Summary'  },
];

// ─── Helpers ─────────────────────────────────
export const calcTotal = (service: Service | null, extras: string[]): number => {
  const base = service?.price ?? 0;
  const extrasTotal = extras.reduce((sum, id) => {
    const ex = EXTRAS.find((e) => e.id === id);
    return sum + (ex?.price ?? 0);
  }, 0);
  return base + extrasTotal;
};

export const getEstimatedWait = (): string => '~15–25 min';
