// ─────────────────────────────────────────────
// Loyalty Points domain types & static data
// ─────────────────────────────────────────────

export type Tier = 'Bronze' | 'Silver' | 'Gold';

export interface TierConfig {
  name: Tier;
  minPoints: number;
  nextThreshold: number | null; // null = top tier
  color: string;          // Tailwind text color class
  bg: string;             // Tailwind bg class
  border: string;         // Tailwind border class
  glow: string;           // Tailwind shadow / glow
}

export interface PointsEvent {
  id: string;
  date: string;           // ISO date "YYYY-MM-DD"
  description: string;
  service: string;
  points: number;         // positive = earned, negative = redeemed
}

export interface RewardTier {
  points: number;
  reward: string;
  description: string;
}

// ─── Tier configuration ───────────────────────

export const TIERS: TierConfig[] = [
  {
    name: 'Bronze',
    minPoints: 0,
    nextThreshold: 500,
    color: 'text-amber-600',
    bg: 'bg-amber-600/10',
    border: 'border-amber-600/30',
    glow: 'shadow-[0_0_24px_rgba(217,119,6,0.15)]',
  },
  {
    name: 'Silver',
    minPoints: 500,
    nextThreshold: 1500,
    color: 'text-slate-300',
    bg: 'bg-slate-300/10',
    border: 'border-slate-300/30',
    glow: 'shadow-[0_0_24px_rgba(203,213,225,0.12)]',
  },
  {
    name: 'Gold',
    minPoints: 1500,
    nextThreshold: null,
    color: 'text-gold',
    bg: 'bg-gold/10',
    border: 'border-gold/30',
    glow: 'shadow-[0_0_24px_rgba(201,168,76,0.18)]',
  },
];

// ─── Mock user loyalty state ──────────────────

export const MOCK_POINTS = 120;

// ─── Point history (mock) ─────────────────────

export const POINTS_HISTORY: PointsEvent[] = [
  {
    id: 'ph1',
    date: '2026-04-18',
    description: 'Appointment completed',
    service: 'VIP Cut',
    points: 65,
  },
  {
    id: 'ph2',
    date: '2026-04-05',
    description: 'Appointment completed',
    service: 'Groom Package',
    points: 85,
  },
  {
    id: 'ph3',
    date: '2026-03-22',
    description: 'Reward redeemed',
    service: '10% discount applied',
    points: -100,
  },
  {
    id: 'ph4',
    date: '2026-03-14',
    description: 'Appointment completed',
    service: 'Quick Cut',
    points: 30,
  },
  {
    id: 'ph5',
    date: '2026-02-28',
    description: 'Appointment completed',
    service: 'VIP Cut',
    points: 65,
  },
  {
    id: 'ph6',
    date: '2026-02-10',
    description: 'Welcome bonus',
    service: 'New member reward',
    points: 50,
  },
];

// ─── Reward explanations ──────────────────────

export const REWARDS: RewardTier[] = [
  {
    points: 100,
    reward: '10% Off',
    description: 'Redeem 100 points for 10% off your next cut.',
  },
  {
    points: 250,
    reward: 'Free Add-on',
    description: '250 points unlocks a free add-on service (beard trim or scalp massage).',
  },
  {
    points: 500,
    reward: 'Free Cut',
    description: '500 points earns you a complimentary Standard Cut.',
  },
  {
    points: 1000,
    reward: 'VIP Session',
    description: '1,000 points — enjoy a full VIP Cut, on the house.',
  },
];

// ─── Helpers ─────────────────────────────────

export function getTier(points: number): TierConfig {
  // Iterate in reverse to get highest matching tier
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (points >= TIERS[i].minPoints) return TIERS[i];
  }
  return TIERS[0];
}

export function getProgressToNext(points: number): {
  tierConfig: TierConfig;
  progressPct: number;
  pointsNeeded: number | null;
} {
  const tierConfig = getTier(points);
  if (tierConfig.nextThreshold === null) {
    return { tierConfig, progressPct: 100, pointsNeeded: null };
  }
  const range = tierConfig.nextThreshold - tierConfig.minPoints;
  const earned = points - tierConfig.minPoints;
  const progressPct = Math.min(100, Math.round((earned / range) * 100));
  const pointsNeeded = tierConfig.nextThreshold - points;
  return { tierConfig, progressPct, pointsNeeded };
}

export function formatPointsDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
