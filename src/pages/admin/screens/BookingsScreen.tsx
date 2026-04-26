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
  XIcon,
  ReceiptIcon,
  CreditCardIcon,
} from '../../../components/admin/AdminIcons';

type FilterTab = 'all' | BookingStatus;

interface Props {
  bookings: AdminBooking[];
  onUpdateStatus: (id: string, status: BookingStatus) => void;
}

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'pending',  label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'done',     label: 'Done' },
  { id: 'rejected', label: 'Rejected' },
];

const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Cash', card: 'Card', online: 'Online',
};

const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-[11px] font-body font-medium border ${cfg.bg} ${cfg.border} ${cfg.textColor}`}>
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
      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onUpdate(booking.id, 'approved')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 text-xs font-body font-medium hover:bg-emerald-500/10 transition-colors duration-150"
        >
          <CheckCircleIcon size={14} strokeWidth={2} />
          Approve
        </button>
        <button
          onClick={() => onUpdate(booking.id, 'rejected')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-body font-medium hover:bg-red-500/10 transition-colors duration-150"
        >
          <XCircleIcon size={14} strokeWidth={2} />
          Reject
        </button>
        <a
          href={`tel:${booking.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center px-3 py-1.5 rounded-lg border border-[#2A2A2A] text-[#666] hover:text-[#999] hover:border-[#444] transition-colors duration-150"
        >
          <PhoneIcon size={13} strokeWidth={2} />
        </a>
      </div>
    );
  }
  if (booking.status === 'approved') {
    return (
      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onUpdate(booking.id, 'done')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3A3A3A] text-[#888] text-xs font-body font-medium hover:border-[#555] hover:text-white transition-colors duration-150"
        >
          <CheckSquareIcon size={14} strokeWidth={2} />
          Mark Done
        </button>
        <a
          href={`tel:${booking.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center px-3 py-1.5 rounded-lg border border-[#2A2A2A] text-[#666] hover:text-[#999] hover:border-[#444] transition-colors duration-150"
        >
          <PhoneIcon size={13} strokeWidth={2} />
        </a>
      </div>
    );
  }
  return null;
};

// â”€â”€â”€ Invoice Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const InvoiceModal: React.FC<{ booking: AdminBooking; onClose: () => void }> = ({ booking, onClose }) => {
  const cfg = STATUS_CONFIG[booking.status];
  return (
    <>
      <motion.div
        key="inv-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/70 z-50"
        onClick={onClose}
      />
      <motion.div
        key="inv-panel"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl w-full max-w-sm p-6 pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 text-[#888]">
              <ReceiptIcon size={16} strokeWidth={1.8} />
              <span className="text-sm font-body font-semibold text-white">Booking Invoice</span>
            </div>
            <button onClick={onClose} className="text-[#444] hover:text-[#888] transition-colors">
              <XIcon size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Booking ID + status */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1A1A1A]">
            <span className="text-xs font-body text-[#444]">{booking.id}</span>
            <StatusBadge status={booking.status} />
          </div>

          {/* Details */}
          <div className="space-y-3 mb-5">
            <div className="flex justify-between">
              <span className="text-xs font-body text-[#555] uppercase tracking-wider">Customer</span>
              <span className="text-sm font-body font-medium text-white">{booking.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-body text-[#555] uppercase tracking-wider">Phone</span>
              <a href={`tel:${booking.phone}`} className="text-sm font-body text-[#888] hover:text-white transition-colors">{booking.phone}</a>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-body text-[#555] uppercase tracking-wider">Date &amp; Time</span>
              <span className="text-sm font-body text-[#888]">{formatAdminDate(booking.date)} آ· {booking.time}</span>
            </div>
          </div>

          {/* Services */}
          <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-3 mb-4 space-y-2">
            <div className="flex justify-between text-sm font-body">
              <span className="text-[#888]">{booking.service}</span>
              <span className="text-white font-medium">EGP {booking.price - (booking.extras?.length ? booking.extras.reduce((acc, e) => acc + (e === 'Beard Trim' ? 30 : e === 'Hot Towel' ? 20 : e === 'Color Treatment' ? 100 : 0), 0) : 0)}</span>
            </div>
            {booking.extras && booking.extras.map((extra) => (
              <div key={extra} className="flex justify-between text-xs font-body">
                <span className="text-[#555]">+ {extra}</span>
                <span className="text-[#666]">EGP {extra === 'Beard Trim' ? 30 : extra === 'Hot Towel' ? 20 : 100}</span>
              </div>
            ))}
          </div>

          {/* Total + payment */}
          <div className="flex items-center justify-between pt-3 border-t border-[#1A1A1A] mb-2">
            <span className="text-sm font-body font-semibold text-white">Total</span>
            <span className="text-lg font-heading font-bold text-gold">EGP {booking.price}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#555]">
              <CreditCardIcon size={13} strokeWidth={1.8} />
              <span className="text-xs font-body">Payment method</span>
            </div>
            <span className="text-xs font-body font-medium text-[#888] capitalize">{PAYMENT_LABELS[booking.paymentMethod]}</span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// â”€â”€â”€ Main Screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const BookingsScreen: React.FC<Props> = ({ bookings, onUpdateStatus }) => {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

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

      {/* Filter tabs + search */}
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
                <span className={`ml-1.5 text-[10px] ${filter === tab.id ? 'text-gold' : 'text-[#444]'}`}>
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
        <div className="hidden md:grid grid-cols-[minmax(180px,1fr)_160px_110px_220px] gap-0 items-center px-5 py-3 bg-[#0D0D0D] border-b border-[#1A1A1A]">
          <p className="text-xs font-body font-medium text-[#444] uppercase tracking-wider">Customer</p>
          <p className="text-xs font-body font-medium text-[#444] uppercase tracking-wider">Date &amp; Time</p>
          <p className="text-xs font-body font-medium text-[#444] uppercase tracking-wider">Status</p>
          <p className="text-xs font-body font-medium text-[#444] uppercase tracking-wider">Actions</p>
        </div>

        <AnimatePresence initial={false}>
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#444] text-sm font-body">No bookings found</div>
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
                  booking.status === 'done' || booking.status === 'rejected' ? 'opacity-60' : ''
                }`}
              >
                {/* Desktop row */}
                <div
                  className="hidden md:grid grid-cols-[minmax(180px,1fr)_160px_110px_220px] gap-0 items-center px-5 py-4 bg-[#0A0A0A] hover:bg-[#0F0F0F] transition-colors duration-100 cursor-pointer"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div>
                    <p className="text-sm font-body font-medium text-white">{booking.customerName}</p>
                    <p className="text-xs font-body text-[#444] mt-0.5">{booking.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-body text-[#888]">{formatAdminDate(booking.date)}</p>
                    <p className="text-xs font-body text-[#444] mt-0.5">{booking.time}</p>
                  </div>
                  <StatusBadge status={booking.status} />
                  <ActionButtons booking={booking} onUpdate={onUpdateStatus} />
                </div>

                {/* Mobile card */}
                <div
                  className="md:hidden px-4 py-4 bg-[#0A0A0A] cursor-pointer"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-body font-medium text-white">{booking.customerName}</p>
                      <p className="text-xs font-body text-[#444] mt-0.5">{booking.service}</p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="text-xs font-body text-[#555] mb-3">
                    {formatAdminDate(booking.date)} آ· {booking.time}
                  </p>
                  <div onClick={(e) => e.stopPropagation()}>
                    <ActionButtons booking={booking} onUpdate={onUpdateStatus} />
                  </div>
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

      {/* Invoice modal */}
      <AnimatePresence>
        {selectedBooking && (
          <InvoiceModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

