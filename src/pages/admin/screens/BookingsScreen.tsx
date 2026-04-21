import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STATUS_CONFIG, formatAdminDate } from '../../../data/admin';
import type { AdminBooking, BookingStatus } from '../../../data/admin';
import {
  CheckCircleIcon,
  XCircleIcon,
  CheckSquareIcon,
  PhoneIcon,
  SearchIcon,
} from '../../../components/admin/AdminIcons';

type FilterTab = 'all' | BookingStatus;

interface Props {
  bookings: AdminBooking[];
  onUpdateStatus: (id: string, status: BookingStatus) => void;
}

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'done', label: 'Done' },
  { id: 'rejected', label: 'Rejected' },
];

const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-body font-medium border ${cfg.bg} ${cfg.border} ${cfg.textColor}`}>
      {cfg.label}
    </span>
  );
};

const ActionButtons: React.FC<{
  booking: AdminBooking;
  onUpdate: (id: string, status: BookingStatus) => void;
}> = ({ booking, onUpdate }) => {
  if (booking.status === 'pending') {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdate(booking.id, 'approved')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 text-xs font-body font-medium hover:bg-emerald-500/10 transition-colors duration-150"
          title="Approve booking"
        >
          <CheckCircleIcon size={14} strokeWidth={2} />
          Approve
        </button>
        <button
          onClick={() => onUpdate(booking.id, 'rejected')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-body font-medium hover:bg-red-500/10 transition-colors duration-150"
          title="Reject booking"
        >
          <XCircleIcon size={14} strokeWidth={2} />
          Reject
        </button>
        <a
          href={`tel:${booking.phone}`}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#2A2A2A] text-[#666] hover:text-[#999] hover:border-[#444] transition-colors duration-150"
          title={`Call ${booking.customerName}`}
        >
          <PhoneIcon size={13} strokeWidth={2} />
        </a>
      </div>
    );
  }

  if (booking.status === 'approved') {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdate(booking.id, 'done')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3A3A3A] text-[#888] text-xs font-body font-medium hover:border-[#555] hover:text-white transition-colors duration-150"
          title="Mark as done"
        >
          <CheckSquareIcon size={14} strokeWidth={2} />
          Mark Done
        </button>
        <a
          href={`tel:${booking.phone}`}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#2A2A2A] text-[#666] hover:text-[#999] hover:border-[#444] transition-colors duration-150"
          title={`Call ${booking.customerName}`}
        >
          <PhoneIcon size={13} strokeWidth={2} />
        </a>
      </div>
    );
  }

  return null;
};

export const BookingsScreen: React.FC<Props> = ({ bookings, onUpdateStatus }) => {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');

  const countFor = (tab: FilterTab) =>
    tab === 'all' ? bookings.length : bookings.filter((b) => b.status === tab).length;

  const filtered = bookings.filter((b) => {
    const matchFilter = filter === 'all' || b.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.customerName.toLowerCase().includes(q) ||
      b.service.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <motion.div
      key="bookings"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
    >
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">Bookings</h1>
          <p className="text-sm text-[#555] font-body mt-0.5">{bookings.length} total</p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(['pending', 'approved', 'done', 'rejected'] as BookingStatus[]).map((status) => {
          const cfg = STATUS_CONFIG[status];
          const count = countFor(status);
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`text-left rounded-xl border px-4 py-3 transition-all duration-150 ${
                filter === status
                  ? `${cfg.bg} ${cfg.border}`
                  : 'bg-[#111] border-[#1A1A1A] hover:border-[#2A2A2A]'
              }`}
            >
              <p className={`text-2xl font-heading font-bold ${filter === status ? cfg.textColor : 'text-white'}`}>
                {count}
              </p>
              <p className="text-xs font-body text-[#555] mt-0.5">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filter tabs + search bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-1 bg-[#111] border border-[#1A1A1A] rounded-xl p-1 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all duration-150 ${
                filter === tab.id
                  ? 'bg-[#1C1C1C] text-white shadow-sm'
                  : 'text-[#666] hover:text-[#999]'
              }`}
            >
              {tab.label}
              {tab.id !== 'all' && countFor(tab.id) > 0 && (
                <span className={`ml-1.5 text-[10px] ${
                  filter === tab.id ? 'text-gold' : 'text-[#444]'
                }`}>
                  {countFor(tab.id)}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative flex-1 w-full sm:max-w-xs">
          <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search by name or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl pl-9 pr-4 py-2 text-sm font-body text-white placeholder-[#444] focus:outline-none focus:border-[#333] transition-colors"
          />
        </div>
      </div>

      {/* Bookings list */}
      <div className="rounded-xl border border-[#1A1A1A] overflow-hidden">
        {/* Desktop table header */}
        <div className="hidden md:grid grid-cols-[1fr_140px_160px_110px_auto] gap-4 items-center px-5 py-3 bg-[#0D0D0D] border-b border-[#1A1A1A]">
          <p className="text-xs font-body font-medium text-[#444] uppercase tracking-wider">Customer</p>
          <p className="text-xs font-body font-medium text-[#444] uppercase tracking-wider">Service</p>
          <p className="text-xs font-body font-medium text-[#444] uppercase tracking-wider">Date &amp; Time</p>
          <p className="text-xs font-body font-medium text-[#444] uppercase tracking-wider">Status</p>
          <p className="text-xs font-body font-medium text-[#444] uppercase tracking-wider">Actions</p>
        </div>

        <AnimatePresence initial={false}>
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#444] text-sm font-body">
              No bookings found
            </div>
          ) : (
            filtered.map((booking) => (
              <motion.div
                key={booking.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className={`border-b border-[#111] last:border-b-0 ${
                  booking.status === 'done' || booking.status === 'rejected'
                    ? 'opacity-60'
                    : ''
                }`}
              >
                {/* Desktop row */}
                <div className="hidden md:grid grid-cols-[1fr_140px_160px_110px_auto] gap-4 items-center px-5 py-4 bg-[#0A0A0A] hover:bg-[#0F0F0F] transition-colors duration-100">
                  <div>
                    <p className="text-sm font-body font-medium text-white">{booking.customerName}</p>
                    <p className="text-xs font-body text-[#444] mt-0.5">{booking.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-body text-[#888]">{booking.service}</p>
                    {booking.extras && booking.extras.length > 0 && (
                      <p className="text-[11px] font-body text-[#444] mt-0.5">+{booking.extras.join(', ')}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-body text-[#888]">{formatAdminDate(booking.date)}</p>
                    <p className="text-xs font-body text-[#444] mt-0.5">{booking.time}</p>
                  </div>
                  <StatusBadge status={booking.status} />
                  <ActionButtons booking={booking} onUpdate={onUpdateStatus} />
                </div>

                {/* Mobile card */}
                <div className="md:hidden px-4 py-4 bg-[#0A0A0A]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-body font-medium text-white">{booking.customerName}</p>
                      <p className="text-xs font-body text-[#444] mt-0.5">{booking.service}</p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <p className="text-xs font-body text-[#555]">
                      {formatAdminDate(booking.date)} · {booking.time}
                    </p>
                  </div>
                  <ActionButtons booking={booking} onUpdate={onUpdateStatus} />
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-[#333] font-body mt-3 text-right">
          Showing {filtered.length} of {bookings.length} bookings
        </p>
      )}
    </motion.div>
  );
};
