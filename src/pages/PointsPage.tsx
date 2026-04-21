import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MOCK_POINTS,
  POINTS_HISTORY,
  REWARDS,
  TIERS,
  getProgressToNext,
  formatPointsDate,
} from '../data/points';
import {
  TrophyIcon,
  GiftIcon,
  TrendingUpIcon,
  AwardIcon,
  HistoryIcon,
} from '../components/booking/BookingIcons';

// ─── Animation helpers ────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// ─── Tier badge colours (inline, not from Tailwind JIT) ──────
const TIER_STYLES = {
  Bronze: {
    pill:    'bg-amber-600/15 border-amber-600/30 text-amber-500',
    bar:     'bg-gradient-to-r from-amber-700 to-amber-500',
    glow:    '0 0 28px rgba(217,119,6,0.18)',
    icon:    'text-amber-500',
    iconBg:  'bg-amber-600/10',
  },
  Silver: {
    pill:    'bg-slate-400/15 border-slate-400/30 text-slate-300',
    bar:     'bg-gradient-to-r from-slate-500 to-slate-300',
    glow:    '0 0 28px rgba(203,213,225,0.14)',
    icon:    'text-slate-300',
    iconBg:  'bg-slate-400/10',
  },
  Gold: {
    pill:    'bg-gold/15 border-gold/30 text-gold',
    bar:     'bg-gradient-to-r from-gold-dark to-gold-light',
    glow:    '0 0 28px rgba(201,168,76,0.22)',
    icon:    'text-gold',
    iconBg:  'bg-gold/10',
  },
} as const;

// ─── Component ────────────────────────────────

const PointsPage: React.FC = () => {
  const { tierConfig, progressPct, pointsNeeded } = getProgressToNext(MOCK_POINTS);
  const styles = TIER_STYLES[tierConfig.name];

  const [activeTab, setActiveTab] = useState<'history' | 'rewards'>('history');

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16 md:pt-20">

      <main className="max-w-lg mx-auto px-5 pt-8 pb-24">

        {/* ── Hero balance card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl border border-[#2A2A2A] bg-[#0F0F0F] overflow-hidden p-6 mb-6"
          style={{ boxShadow: styles.glow }}
        >
          {/* Background texture */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-5"
            style={{ background: `radial-gradient(circle, currentColor, transparent)` }} />

          {/* Tier badge */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#555] font-accent mb-1">
                Loyalty Status
              </p>
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-heading font-semibold ${styles.pill}`}>
                <AwardIcon size={13} className={styles.icon} strokeWidth={1.75} />
                {tierConfig.name} Member
              </div>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${styles.iconBg}`}>
              <TrophyIcon size={24} className={styles.icon} strokeWidth={1.5} />
            </div>
          </div>

          {/* Big balance */}
          <div className="mb-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#555] font-accent mb-1">
              Current Balance
            </p>
            <div className="flex items-end gap-2">
              <span className={`font-heading font-bold text-5xl leading-none ${styles.icon}`}>
                {MOCK_POINTS}
              </span>
              <span className="text-[#9A9A9A] text-sm font-body mb-1">points</span>
            </div>
          </div>

          {/* Progress bar */}
          {pointsNeeded !== null ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-accent text-[#555]">
                  {tierConfig.name} · {MOCK_POINTS} pts
                </span>
                <span className="text-[10px] font-accent text-[#555]">
                  {tierConfig.nextThreshold} pts · {TIERS[TIERS.findIndex(t => t.name === tierConfig.name) + 1]?.name}
                </span>
              </div>
              <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-full ${styles.bar}`}
                />
              </div>
              <p className="mt-2 text-[11px] text-[#555] font-body">
                <span className="text-[#9A9A9A] font-medium">{pointsNeeded} more points</span> to reach{' '}
                {TIERS[TIERS.findIndex(t => t.name === tierConfig.name) + 1]?.name}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-gold/30 rounded-full overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-gold-dark to-gold-light rounded-full" />
              </div>
              <span className="text-[10px] font-accent text-gold">Top tier</span>
            </div>
          )}
        </motion.div>

        {/* ── Tier overview strip ── */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-2 mb-8"
        >
          {TIERS.map((tier) => {
            const ts = TIER_STYLES[tier.name];
            const isActive = tier.name === tierConfig.name;
            return (
              <div
                key={tier.name}
                className={`
                  rounded-2xl p-4 border text-center transition-all duration-200
                  ${isActive
                    ? `${ts.pill} border-opacity-60`
                    : 'border-[#1E1E1E] bg-[#0C0C0C]'
                  }
                `}
              >
                <div className={`text-xs font-heading font-semibold mb-0.5 ${isActive ? ts.icon : 'text-[#444]'}`}>
                  {tier.name}
                </div>
                <div className={`text-[10px] font-accent ${isActive ? 'text-[#9A9A9A]' : 'text-[#333]'}`}>
                  {tier.minPoints}+ pts
                </div>
                {isActive && (
                  <div className="mt-2 w-4 h-0.5 rounded-full mx-auto" style={{
                    background: tier.name === 'Gold' ? '#C9A84C' : tier.name === 'Silver' ? '#CBD5E1' : '#D97706'
                  }} />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* ── Tab bar ── */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex gap-1 mb-5 bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl p-1"
        >
          {(['history', 'rewards'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                text-xs font-heading font-medium transition-all duration-200
                ${activeTab === tab
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'text-[#555] hover:text-[#9A9A9A]'
                }
              `}
            >
              {tab === 'history'
                ? <><HistoryIcon size={13} /> Point History</>
                : <><GiftIcon size={13} /> Rewards</>
              }
            </button>
          ))}
        </motion.div>

        {/* ── History tab ── */}
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-2"
          >
            {POINTS_HISTORY.map((event, i) => {
              const isEarned = event.points > 0;
              return (
                <motion.div
                  key={event.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-4 px-4 py-4 rounded-2xl border border-[#1A1A1A] bg-[#0D0D0D] hover:border-[#2A2A2A] transition-colors duration-200"
                >
                  {/* Icon */}
                  <div className={`
                    w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                    ${isEarned ? 'bg-emerald-500/10' : 'bg-red-500/10'}
                  `}>
                    <TrendingUpIcon
                      size={15}
                      className={isEarned ? 'text-emerald-400' : 'text-red-400'}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-heading font-medium text-white truncate">
                      {event.service}
                    </p>
                    <p className="text-[10px] text-[#555] font-body mt-0.5">
                      {formatPointsDate(event.date)}
                    </p>
                  </div>

                  {/* Points delta */}
                  <div className="text-right flex-shrink-0">
                    <span className={`
                      text-sm font-heading font-bold
                      ${isEarned ? 'text-emerald-400' : 'text-red-400'}
                    `}>
                      {isEarned ? '+' : ''}{event.points}
                    </span>
                    <p className="text-[9px] font-accent text-[#444] mt-0.5 uppercase tracking-wider">
                      pts
                    </p>
                  </div>
                </motion.div>
              );
            })}

            <p className="text-center text-[11px] text-[#333] font-body pt-4">
              Points are awarded after each completed appointment.
            </p>
          </motion.div>
        )}

        {/* ── Rewards tab ── */}
        {activeTab === 'rewards' && (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-3"
          >
            {/* How it works note */}
            <div className="p-4 rounded-2xl border border-[#1E1E1E] bg-[#0C0C0C] mb-2">
              <p className="text-[11px] text-[#666] font-body leading-relaxed">
                Every completed appointment earns you points based on the service value. Redeem points at checkout for discounts and free services.
              </p>
            </div>

            {REWARDS.map((reward, i) => {
              const unlocked = MOCK_POINTS >= reward.points;
              const redeemPct = Math.min(100, Math.round((MOCK_POINTS / reward.points) * 100));
              return (
                <motion.div
                  key={reward.points}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className={`
                    relative rounded-2xl border p-5 overflow-hidden
                    transition-all duration-200
                    ${unlocked
                      ? 'border-gold/30 bg-[#0F0F0F] shadow-[0_0_20px_rgba(201,168,76,0.08)]'
                      : 'border-[#1A1A1A] bg-[#0A0A0A]'
                    }
                  `}
                >
                  {unlocked && (
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] text-emerald-400 font-accent uppercase tracking-wide">
                          Unlocked
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`
                      w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                      ${unlocked ? 'bg-gold/10' : 'bg-[#141414]'}
                    `}>
                      <GiftIcon
                        size={18}
                        className={unlocked ? 'text-gold' : 'text-[#333]'}
                        strokeWidth={1.6}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Reward name */}
                      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                        <span className={`text-sm font-heading font-bold ${unlocked ? 'text-white' : 'text-[#444]'}`}>
                          {reward.reward}
                        </span>
                        <span className={`text-[10px] font-accent ${unlocked ? 'text-gold' : 'text-[#333]'}`}>
                          {reward.points} pts
                        </span>
                      </div>

                      {/* Description */}
                      <p className={`text-xs font-body leading-relaxed mb-3 ${unlocked ? 'text-[#9A9A9A]' : 'text-[#3A3A3A]'}`}>
                        {reward.description}
                      </p>

                      {/* Mini progress bar */}
                      {!unlocked && (
                        <div>
                          <div className="h-1 bg-[#141414] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${redeemPct}%` }}
                              transition={{ delay: 0.2 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                              className="h-full bg-[#2A2A2A] rounded-full"
                            />
                          </div>
                          <p className="mt-1 text-[10px] text-[#333] font-accent">
                            {reward.points - MOCK_POINTS} more pts needed
                          </p>
                        </div>
                      )}

                      {/* Redeem button (unlocked only) */}
                      {unlocked && (
                        <button className="
                          flex items-center gap-2 px-4 py-1.5 rounded-xl
                          bg-gold/10 border border-gold/25
                          hover:bg-gold/18 hover:border-gold/40
                          text-gold text-xs font-heading font-medium
                          transition-all duration-200
                        ">
                          <GiftIcon size={11} strokeWidth={2} />
                          Redeem at checkout
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Earn more CTA */}
            <div className="mt-4 p-5 rounded-2xl border border-[#1E1E1E] bg-[#0C0C0C] text-center">
              <p className="text-xs text-[#666] font-body mb-3">
                Book your next appointment to keep earning points.
              </p>
              <Link
                to="/booking"
                className="
                  inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                  bg-gold text-black-900 font-body font-semibold text-xs
                  hover:bg-gold-light transition-colors duration-200
                "
              >
                Book Appointment
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default PointsPage;
