export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'done';
export type ServiceId = 'vip' | 'quick' | 'groom' | 'standard';
export type CustomerTier = 'Bronze' | 'Silver' | 'Gold';

export interface AdminBooking {
  id: string;
  customerName: string;
  phone: string;
  service: string;
  serviceId: ServiceId;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:00 AM"
  status: BookingStatus;
  extras?: string[];
}

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  totalBookings: number;
  points: number;
  lastVisit: string; // YYYY-MM-DD
  tier: CustomerTier;
}

export interface ShopSettings {
  name: string;
  tagline: string;
  phone: string;
  address: string;
  openTime: string;  // HH:MM (24h)
  closeTime: string; // HH:MM (24h)
  workDays: string[];
}

function relativeDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export const MOCK_ADMIN_BOOKINGS: AdminBooking[] = [
  { id: 'BK-001', customerName: 'Ahmed Al-Rashid',      phone: '+966 50 123 4567', service: 'VIP Cut',        serviceId: 'vip',      date: relativeDate(0),  time: '09:00 AM', status: 'pending' },
  { id: 'BK-002', customerName: 'Khalid Mansour',        phone: '+966 55 234 5678', service: 'Groom Package',  serviceId: 'groom',    date: relativeDate(0),  time: '10:30 AM', status: 'approved' },
  { id: 'BK-003', customerName: 'Omar Al-Farsi',         phone: '+966 54 345 6789', service: 'Standard Cut',   serviceId: 'standard', date: relativeDate(0),  time: '11:00 AM', status: 'pending' },
  { id: 'BK-004', customerName: 'Yusuf Ibrahim',         phone: '+966 50 456 7890', service: 'Quick Cut',      serviceId: 'quick',    date: relativeDate(0),  time: '12:00 PM', status: 'approved', extras: ['Beard Trim'] },
  { id: 'BK-005', customerName: 'Hassan Al-Zaidi',       phone: '+966 55 567 8901', service: 'VIP Cut',        serviceId: 'vip',      date: relativeDate(0),  time: '02:00 PM', status: 'done',     extras: ['Hot Towel', 'Beard Trim'] },
  { id: 'BK-006', customerName: 'Tariq Nasser',          phone: '+966 54 678 9012', service: 'Standard Cut',   serviceId: 'standard', date: relativeDate(1),  time: '09:30 AM', status: 'pending' },
  { id: 'BK-007', customerName: 'Faisal Al-Otaibi',      phone: '+966 50 789 0123', service: 'Groom Package',  serviceId: 'groom',    date: relativeDate(1),  time: '11:00 AM', status: 'approved' },
  { id: 'BK-008', customerName: 'Salman Khalid',         phone: '+966 55 890 1234', service: 'Quick Cut',      serviceId: 'quick',    date: relativeDate(-1), time: '10:00 AM', status: 'rejected' },
  { id: 'BK-009', customerName: 'Nawaf Al-Qahtani',      phone: '+966 54 901 2345', service: 'VIP Cut',        serviceId: 'vip',      date: relativeDate(-1), time: '03:00 PM', status: 'done',     extras: ['Color Treatment'] },
  { id: 'BK-010', customerName: 'Mohammed Al-Shammari',  phone: '+966 50 012 3456', service: 'Standard Cut',   serviceId: 'standard', date: relativeDate(2),  time: '01:00 PM', status: 'pending' },
];

export const MOCK_CUSTOMERS: AdminCustomer[] = [
  { id: 'C-001', name: 'Ahmed Al-Rashid',    phone: '+966 50 123 4567', totalBookings: 12, points: 480, lastVisit: relativeDate(-3),  tier: 'Gold' },
  { id: 'C-002', name: 'Khalid Mansour',      phone: '+966 55 234 5678', totalBookings: 7,  points: 280, lastVisit: relativeDate(-7),  tier: 'Silver' },
  { id: 'C-003', name: 'Omar Al-Farsi',       phone: '+966 54 345 6789', totalBookings: 3,  points: 90,  lastVisit: relativeDate(-14), tier: 'Bronze' },
  { id: 'C-004', name: 'Yusuf Ibrahim',       phone: '+966 50 456 7890', totalBookings: 15, points: 620, lastVisit: relativeDate(-1),  tier: 'Gold' },
  { id: 'C-005', name: 'Hassan Al-Zaidi',     phone: '+966 55 567 8901', totalBookings: 6,  points: 210, lastVisit: relativeDate(0),   tier: 'Silver' },
  { id: 'C-006', name: 'Tariq Nasser',        phone: '+966 54 678 9012', totalBookings: 2,  points: 40,  lastVisit: relativeDate(-21), tier: 'Bronze' },
  { id: 'C-007', name: 'Faisal Al-Otaibi',   phone: '+966 50 789 0123', totalBookings: 9,  points: 370, lastVisit: relativeDate(-5),  tier: 'Silver' },
  { id: 'C-008', name: 'Salman Khalid',       phone: '+966 55 890 1234', totalBookings: 1,  points: 20,  lastVisit: relativeDate(-30), tier: 'Bronze' },
];

export const DEFAULT_SETTINGS: ShopSettings = {
  name: 'BarberX Studio',
  tagline: 'Premium Grooming Experience',
  phone: '+966 11 234 5678',
  address: 'King Fahd Road, Riyadh, Saudi Arabia',
  openTime: '09:00',
  closeTime: '22:00',
  workDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
};

export function formatAdminDate(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function parseTimeToMinutes(time: string): number {
  const [timePart, period] = time.split(' ');
  const [h, m] = timePart.split(':').map(Number);
  const hours = period === 'PM' && h !== 12 ? h + 12 : period === 'AM' && h === 12 ? 0 : h;
  return hours * 60 + (m || 0);
}

export const STATUS_CONFIG: Record<BookingStatus, {
  label: string;
  textColor: string;
  bg: string;
  border: string;
}> = {
  pending:  { label: 'Pending',  textColor: 'text-amber-400',   bg: 'bg-amber-400/8',    border: 'border-amber-400/20' },
  approved: { label: 'Approved', textColor: 'text-emerald-400', bg: 'bg-emerald-500/8',  border: 'border-emerald-500/20' },
  rejected: { label: 'Rejected', textColor: 'text-red-400',     bg: 'bg-red-400/8',      border: 'border-red-400/20' },
  done:     { label: 'Done',     textColor: 'text-[#555]',      bg: 'bg-[#141414]',      border: 'border-[#222]' },
};

export const TIER_CONFIG: Record<CustomerTier, {
  textColor: string;
  bg: string;
  border: string;
}> = {
  Gold:   { textColor: 'text-gold',       bg: 'bg-gold/8',        border: 'border-gold/25' },
  Silver: { textColor: 'text-[#A8A8B8]',  bg: 'bg-[#A8A8B8]/8',  border: 'border-[#A8A8B8]/25' },
  Bronze: { textColor: 'text-[#CD7F32]',  bg: 'bg-[#CD7F32]/8',  border: 'border-[#CD7F32]/25' },
};
