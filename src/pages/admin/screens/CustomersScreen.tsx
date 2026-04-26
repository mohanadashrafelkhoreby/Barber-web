import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIER_CONFIG, STATUS_CONFIG, formatAdminDate, MOCK_CUSTOMER_BOOKING_HISTORY } from '../../../data/admin';
import type { AdminCustomer, CustomerBookingRecord } from '../../../data/admin';
import {
  SearchIcon,
  TrophyIcon,
  PhoneIcon,
  StarFilledIcon,
  ArrowLeftIcon,
} from '../../../components/admin/AdminIcons';

interface Props {
  customers: AdminCustomer[];
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

// â”€â”€â”€ Customer Detail View â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CustomerDetail: React.FC<{ customer: AdminCustomer; onBack: () => void }> = ({
  customer,
  onBack,
}) => {
  const tierCfg = TIER_CONFIG[customer.tier];
  const initials = getInitials(customer.name);
  const history: CustomerBookingRecord[] = MOCK_CUSTOMER_BOOKING_HISTORY[customer.id] ?? [];

  return (
    <motion.div
      key="customer-detail"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2 }}
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#555] hover:text-white text-sm font-body mb-5 transition-colors"
      >
        <ArrowLeftIcon size={15} strokeWidth={2} />
        Back to Customers
      </button>

      {/* Identity card */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5 mb-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
          <span className="text-base font-body font-bold text-[#666]">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="text-base font-heading font-bold text-white">{customer.name}</h2>
            <span className={`text-xs font-body font-medium px-2 py-0.5 rounded border ${tierCfg.bg} ${tierCfg.border} ${tierCfg.textColor}`}>
              {customer.tier}
            </span>
          </div>
          <a href={`tel:${customer.phone}`} className="text-sm font-body text-[#555] hover:text-[#888] transition-colors flex items-center gap-1.5">
            <PhoneIcon size={12} strokeWidth={2} />
            {customer.phone}
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4 text-center">
          <p className="text-2xl font-heading font-bold text-white">{customer.totalBookings}</p>
          <p className="text-xs font-body text-[#444] mt-1">Bookings</p>
        </div>
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4 text-center">
          <p className="text-2xl font-heading font-bold text-white">{customer.totalSpent}</p>
          <p className="text-xs font-body text-[#444] mt-1">EGP Spent</p>
        </div>
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <StarFilledIcon size={14} className="text-gold" />
            <p className="text-2xl font-heading font-bold text-white">{customer.points}</p>
          </div>
          <p className="text-xs font-body text-[#444] mt-1">Points</p>
        </div>
      </div>

      {/* Booking history */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5">
        <h3 className="text-sm font-heading font-semibold text-white mb-4">Booking History</h3>
        {history.length === 0 ? (
          <p className="text-sm font-body text-[#444] text-center py-4">No booking history yet</p>
        ) : (
          <div className="space-y-2">
            {history.map((record) => {
              const cfg = STATUS_CONFIG[record.status];
              return (
                <div key={record.id} className="flex items-center justify-between py-2.5 border-b border-[#141414] last:border-b-0">
                  <div>
                    <p className="text-sm font-body font-medium text-white">{record.service}</p>
                    <p className="text-xs font-body text-[#444] mt-0.5">{formatAdminDate(record.date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-body font-medium text-[#888]">EGP {record.price}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-body border ${cfg.bg} ${cfg.border} ${cfg.textColor}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// â”€â”€â”€ Main Screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const CustomersScreen: React.FC<Props> = ({ customers }) => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  const tierCounts = {
    Gold: customers.filter((c) => c.tier === 'Gold').length,
    Silver: customers.filter((c) => c.tier === 'Silver').length,
    Bronze: customers.filter((c) => c.tier === 'Bronze').length,
  };

  return (
    <motion.div
      key="customers"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {selectedCustomer ? (
          <CustomerDetail
            key="detail"
            customer={selectedCustomer}
            onBack={() => setSelectedCustomer(null)}
          />
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-xl font-heading font-bold text-white">Customers</h1>
                <p className="text-sm text-[#555] font-body mt-0.5">{customers.length} registered</p>
              </div>
            </div>

            {/* Tier stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {(['Gold', 'Silver', 'Bronze'] as const).map((tier) => {
                const cfg = TIER_CONFIG[tier];
                return (
                  <div key={tier} className={`rounded-xl border ${cfg.border} ${cfg.bg} px-4 py-3`}>
                    <div className="flex items-center gap-2 mb-1">
                      <TrophyIcon size={14} className={cfg.textColor} strokeWidth={2} />
                      <p className={`text-xs font-body font-medium ${cfg.textColor}`}>{tier}</p>
                    </div>
                    <p className="text-2xl font-heading font-bold text-white">{tierCounts[tier]}</p>
                  </div>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative mb-4 max-w-sm">
              <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl pl-9 pr-4 py-2 text-sm font-body text-white placeholder-[#444] focus:outline-none focus:border-[#333] transition-colors"
              />
            </div>

            {/* Customer list */}
            <div className="rounded-xl border border-[#1A1A1A] overflow-hidden">
              {/* Desktop header */}
              <div className="hidden md:grid grid-cols-[1fr_140px_100px_90px_100px] gap-4 items-center px-5 py-3 bg-[#0D0D0D] border-b border-[#1A1A1A]">
                <p className="text-xs font-body font-medium text-[#444] uppercase tracking-wider">Customer</p>
                <p className="text-xs font-body font-medium text-[#444] uppercase tracking-wider">Last Visit</p>
                <p className="text-xs font-body font-medium text-[#444] uppercase tracking-wider">Bookings</p>
                <p className="text-xs font-body font-medium text-[#444] uppercase tracking-wider">Points</p>
                <p className="text-xs font-body font-medium text-[#444] uppercase tracking-wider">Tier</p>
              </div>

              {filtered.length === 0 ? (
                <div className="py-12 text-center text-[#444] text-sm font-body">No customers found</div>
              ) : (
                filtered.map((customer, i) => {
                  const tierCfg = TIER_CONFIG[customer.tier];
                  const initials = getInitials(customer.name);
                  return (
                    <motion.div
                      key={customer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-[#111] last:border-b-0"
                    >
                      {/* Desktop row */}
                      <div
                        className="hidden md:grid grid-cols-[1fr_140px_100px_90px_100px] gap-4 items-center px-5 py-4 bg-[#0A0A0A] hover:bg-[#0F0F0F] transition-colors duration-100 cursor-pointer"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-body font-bold text-[#666]">{initials}</span>
                          </div>
                          <div>
                            <p className="text-sm font-body font-medium text-white">{customer.name}</p>
                            <a
                              href={`tel:${customer.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs font-body text-[#444] hover:text-[#888] transition-colors flex items-center gap-1"
                            >
                              <PhoneIcon size={11} strokeWidth={2} />
                              {customer.phone}
                            </a>
                          </div>
                        </div>
                        <p className="text-sm font-body text-[#666]">{formatAdminDate(customer.lastVisit)}</p>
                        <p className="text-sm font-body font-medium text-white">{customer.totalBookings}</p>
                        <div className="flex items-center gap-1">
                          <StarFilledIcon size={11} className="text-gold" />
                          <p className="text-sm font-body font-medium text-white">{customer.points}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-xs font-body font-medium px-2.5 py-1 rounded-md border ${tierCfg.bg} ${tierCfg.border} ${tierCfg.textColor}`}>
                          {customer.tier}
                        </span>
                      </div>

                      {/* Mobile card */}
                      <div
                        className="md:hidden px-4 py-4 bg-[#0A0A0A] cursor-pointer"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-body font-bold text-[#666]">{initials}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="text-sm font-body font-medium text-white truncate">{customer.name}</p>
                              <span className={`text-[11px] font-body font-medium px-2 py-0.5 rounded border ${tierCfg.bg} ${tierCfg.border} ${tierCfg.textColor} flex-shrink-0`}>
                                {customer.tier}
                              </span>
                            </div>
                            <p className="text-xs font-body text-[#444]">{customer.phone}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs font-body text-[#555]">{customer.totalBookings} bookings</span>
                              <span className="flex items-center gap-1 text-xs font-body text-[#555]">
                                <StarFilledIcon size={10} className="text-gold" />
                                {customer.points} pts
                              </span>
                              <span className="text-xs font-body text-[#555]">{formatAdminDate(customer.lastVisit)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

