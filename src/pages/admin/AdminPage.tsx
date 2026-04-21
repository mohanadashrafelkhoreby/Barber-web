import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MOCK_ADMIN_BOOKINGS, MOCK_CUSTOMERS, DEFAULT_SETTINGS } from '../../data/admin';
import type { AdminBooking, BookingStatus, ShopSettings } from '../../data/admin';
import {
  BookingsIcon,
  CalendarIcon,
  UsersIcon,
  SettingsIcon,
  ArrowLeftIcon,
  ScissorsIcon,
  LogOutIcon,
} from '../../components/admin/AdminIcons';
import { BookingsScreen } from './screens/BookingsScreen';
import { TodayScreen } from './screens/TodayScreen';
import { CustomersScreen } from './screens/CustomersScreen';
import { SettingsScreen } from './screens/SettingsScreen';

type Section = 'bookings' | 'today' | 'customers' | 'settings';

interface NavItem {
  id: Section;
  label: string;
  Icon: React.FC<{ size?: number; className?: string; strokeWidth?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'bookings',  label: 'Bookings',   Icon: BookingsIcon },
  { id: 'today',     label: 'Today',      Icon: CalendarIcon },
  { id: 'customers', label: 'Customers',  Icon: UsersIcon },
  { id: 'settings',  label: 'Settings',   Icon: SettingsIcon },
];

export const AdminPage: React.FC = () => {
  const [section, setSection] = useState<Section>('bookings');
  const [bookings, setBookings] = useState<AdminBooking[]>(MOCK_ADMIN_BOOKINGS);
  const [settings, setSettings] = useState<ShopSettings>(DEFAULT_SETTINGS);

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const currentPageTitle = NAV_ITEMS.find((n) => n.id === section)?.label ?? '';

  return (
    <div className="min-h-screen bg-black-900 flex">

      {/* ─── Sidebar (desktop only) ─── */}
      <aside className="hidden md:flex flex-col w-60 bg-black-800 border-r border-black-700 fixed inset-y-0 left-0 z-40 flex-shrink-0">

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-black-700 flex-shrink-0">
          <span className="text-gold">
            <ScissorsIcon size={17} strokeWidth={1.8} />
          </span>
          <div className="leading-tight">
            <p className="font-heading font-bold text-[15px] text-white tracking-wider">
              BARBER<span className="text-gold">X</span>
            </p>
            <p className="text-[10px] text-[#444] font-body tracking-wide">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = section === id;
            return (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group relative ${
                  active
                    ? 'bg-gold/8 text-gold'
                    : 'text-[#666] hover:text-[#AAA] hover:bg-[#141414]'
                }`}
              >
                {/* Active left indicator */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-gold" />
                )}
                <Icon size={17} strokeWidth={active ? 2 : 1.8} />
                <span className="text-sm font-body font-medium flex-1">{label}</span>
                {id === 'bookings' && pendingCount > 0 && (
                  <span className={`text-[10px] font-body font-semibold px-1.5 py-0.5 rounded-md ${
                    active
                      ? 'bg-amber-400/15 text-amber-400'
                      : 'bg-[#1C1C1C] text-[#555]'
                  }`}>
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-black-700 flex-shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#444] hover:text-[#777] hover:bg-[#141414] transition-all duration-150 text-sm font-body"
          >
            <LogOutIcon size={16} strokeWidth={1.8} />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* ─── Main content area ─── */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between h-14 px-4 bg-black-800 border-b border-black-700 flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-gold">
              <ScissorsIcon size={15} strokeWidth={1.8} />
            </span>
            <span className="font-heading font-bold text-sm text-white tracking-wider">
              BARBER<span className="text-gold">X</span>
            </span>
            <span className="text-[#333] text-xs font-body ml-1">/ {currentPageTitle}</span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[#444] hover:text-[#777] transition-colors text-xs font-body"
          >
            <ArrowLeftIcon size={14} />
            Site
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-7 pb-24 md:pb-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {section === 'bookings' && (
              <BookingsScreen
                key="bookings"
                bookings={bookings}
                onUpdateStatus={updateBookingStatus}
              />
            )}
            {section === 'today' && (
              <TodayScreen
                key="today"
                bookings={bookings}
                onUpdateStatus={updateBookingStatus}
              />
            )}
            {section === 'customers' && (
              <CustomersScreen
                key="customers"
                customers={MOCK_CUSTOMERS}
              />
            )}
            {section === 'settings' && (
              <SettingsScreen
                key="settings"
                settings={settings}
                onSave={setSettings}
              />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ─── Mobile bottom navigation ─── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-black-800 border-t border-black-700 z-40 flex">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = section === id;
          return (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 relative transition-colors duration-150 ${
                active ? 'text-gold' : 'text-[#444] hover:text-[#777]'
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b bg-gold" />
              )}
              <Icon size={19} strokeWidth={active ? 2 : 1.7} />
              <span className="text-[10px] font-body font-medium">{label}</span>
              {id === 'bookings' && pendingCount > 0 && (
                <span className="absolute top-2 right-1/4 translate-x-1/2 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
