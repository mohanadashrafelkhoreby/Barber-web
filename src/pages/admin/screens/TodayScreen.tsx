import React from 'react';
import { motion } from 'framer-motion';
import { STATUS_CONFIG, parseTimeToMinutes } from '../../../data/admin';
import type { AdminBooking, BookingStatus } from '../../../data/admin';
import { ClockIcon, CheckCircleIcon, CheckSquareIcon, PhoneIcon } from '../../../components/admin/AdminIcons';

interface Props {
  bookings: AdminBooking[];
  onUpdateStatus: (id: string, status: BookingStatus) => void;
}

const todayStr = new Date().toISOString().split('T')[0];

const StatusDot: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const colors: Record<BookingStatus, string> = {
    pending: 'bg-amber-400',
    approved: 'bg-emerald-400',
    rejected: 'bg-red-400',
    done: 'bg-[#444]',
  };
  return <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${colors[status]}`} />;
};

export const TodayScreen: React.FC<Props> = ({ bookings, onUpdateStatus }) => {
  const todayBookings = bookings
    .filter((b) => b.date === todayStr)
    .sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

  const totalToday = todayBookings.length;
  const pending = todayBookings.filter((b) => b.status === 'pending').length;
  const approved = todayBookings.filter((b) => b.status === 'approved').length;
  const done = todayBookings.filter((b) => b.status === 'done').length;

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      key="today"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-heading font-bold text-white">Today's Schedule</h1>
        <p className="text-sm text-[#555] font-body mt-0.5">{todayLabel}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total', value: totalToday, color: 'text-white' },
          { label: 'Pending', value: pending, color: 'text-amber-400' },
          { label: 'Confirmed', value: approved, color: 'text-emerald-400' },
          { label: 'Done', value: done, color: 'text-[#555]' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3">
            <p className={`text-2xl font-heading font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs font-body text-[#555] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      {todayBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ClockIcon size={32} className="text-[#2A2A2A] mb-3" />
          <p className="text-[#444] font-body text-sm">No bookings scheduled for today</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[52px] top-4 bottom-4 w-px bg-[#1A1A1A] hidden sm:block" />

          <div className="space-y-3">
            {todayBookings.map((booking, i) => {
              const cfg = STATUS_CONFIG[booking.status];
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className={`flex gap-4 ${booking.status === 'done' || booking.status === 'rejected' ? 'opacity-50' : ''}`}
                >
                  {/* Time column */}
                  <div className="hidden sm:flex flex-col items-center w-[52px] flex-shrink-0 pt-3.5">
                    <p className="text-[11px] font-body font-medium text-[#555] text-right w-full leading-none">
                      {booking.time.replace(' AM', 'am').replace(' PM', 'pm')}
                    </p>
                  </div>

                  {/* Dot */}
                  <div className="hidden sm:flex items-start pt-4 flex-shrink-0">
                    <StatusDot status={booking.status} />
                  </div>

                  {/* Card */}
                  <div className={`flex-1 rounded-xl border ${cfg.border} bg-[#0D0D0D] px-4 py-3.5`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-body font-medium text-white truncate">
                            {booking.customerName}
                          </p>
                          {/* Time on mobile */}
                          <span className="sm:hidden text-[11px] font-body text-[#444] flex-shrink-0">
                            {booking.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="text-xs font-body text-[#666]">{booking.service}</p>
                          {booking.extras && booking.extras.length > 0 && (
                            <p className="text-[11px] font-body text-[#444]">
                              +{booking.extras.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[11px] font-body font-medium px-2 py-1 rounded-md border ${cfg.bg} ${cfg.border} ${cfg.textColor}`}>
                          {cfg.label}
                        </span>

                        {booking.status === 'pending' && (
                          <button
                            onClick={() => onUpdateStatus(booking.id, 'approved')}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-500/30 text-emerald-400 text-xs font-body hover:bg-emerald-500/10 transition-colors"
                          >
                            <CheckCircleIcon size={12} strokeWidth={2} />
                            Approve
                          </button>
                        )}
                        {booking.status === 'approved' && (
                          <button
                            onClick={() => onUpdateStatus(booking.id, 'done')}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#333] text-[#888] text-xs font-body hover:border-[#444] hover:text-white transition-colors"
                          >
                            <CheckSquareIcon size={12} strokeWidth={2} />
                            Done
                          </button>
                        )}
                        <a
                          href={`tel:${booking.phone}`}
                          className="flex items-center justify-center w-7 h-7 rounded-lg border border-[#222] text-[#555] hover:text-[#888] hover:border-[#333] transition-colors"
                        >
                          <PhoneIcon size={12} strokeWidth={2} />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};
