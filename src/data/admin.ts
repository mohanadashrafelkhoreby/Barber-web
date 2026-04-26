export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'done';
export type ServiceId = 'vip' | 'quick' | 'groom' | 'standard';
export type CustomerTier = 'Bronze' | 'Silver' | 'Gold';

export type PaymentMethod = 'cash' | 'card' | 'online';

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
  price: number;       // SAR
  paymentMethod: PaymentMethod;
}

export interface AdminService {
  id: string;
  title: string;
  duration: number; // minutes
  description: string;
}

export type GalleryItemType = 'Haircut' | 'Beard';

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  type: GalleryItemType;
  featured: boolean;
}

export interface CustomerBookingRecord {
  id: string;
  service: string;
  price: number;
  date: string;
  status: BookingStatus;
}

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  totalBookings: number;
  points: number;
  totalSpent: number; // SAR
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
  timeBetweenBookings: number; // minutes
  pointValue: number; // 1 point = X SAR
}

export type BarberStatus = 'active' | 'unavailable';

export interface Barber {
  id: string;
  name: string;
  photo: string | null;
  status: BarberStatus;
}

export interface BarberStats {
  barberId: string;
  totalBookings: number;
  totalRevenue: number; // SAR
  thisMonthBookings: number;
  thisMonthRevenue: number; // SAR
}

function relativeDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export const MOCK_ADMIN_BOOKINGS: AdminBooking[] = [
  { id: 'BK-001', customerName: 'Ahmed Al-Rashid',      phone: '+966 50 123 4567', service: 'VIP Cut',        serviceId: 'vip',      date: relativeDate(0),  time: '09:00 AM', status: 'pending',  price: 200, paymentMethod: 'card' },
  { id: 'BK-002', customerName: 'Khalid Mansour',        phone: '+966 55 234 5678', service: 'Groom Package',  serviceId: 'groom',    date: relativeDate(0),  time: '10:30 AM', status: 'approved', price: 150, paymentMethod: 'cash' },
  { id: 'BK-003', customerName: 'Omar Al-Farsi',         phone: '+966 54 345 6789', service: 'Standard Cut',   serviceId: 'standard', date: relativeDate(0),  time: '11:00 AM', status: 'pending',  price: 80,  paymentMethod: 'cash' },
  { id: 'BK-004', customerName: 'Yusuf Ibrahim',         phone: '+966 50 456 7890', service: 'Quick Cut',      serviceId: 'quick',    date: relativeDate(0),  time: '12:00 PM', status: 'approved', price: 90,  paymentMethod: 'card',   extras: ['Beard Trim'] },
  { id: 'BK-005', customerName: 'Hassan Al-Zaidi',       phone: '+966 55 567 8901', service: 'VIP Cut',        serviceId: 'vip',      date: relativeDate(0),  time: '02:00 PM', status: 'done',     price: 250, paymentMethod: 'online', extras: ['Hot Towel', 'Beard Trim'] },
  { id: 'BK-006', customerName: 'Tariq Nasser',          phone: '+966 54 678 9012', service: 'Standard Cut',   serviceId: 'standard', date: relativeDate(1),  time: '09:30 AM', status: 'pending',  price: 80,  paymentMethod: 'cash' },
  { id: 'BK-007', customerName: 'Faisal Al-Otaibi',      phone: '+966 50 789 0123', service: 'Groom Package',  serviceId: 'groom',    date: relativeDate(1),  time: '11:00 AM', status: 'approved', price: 150, paymentMethod: 'card' },
  { id: 'BK-008', customerName: 'Salman Khalid',         phone: '+966 55 890 1234', service: 'Quick Cut',      serviceId: 'quick',    date: relativeDate(-1), time: '10:00 AM', status: 'rejected', price: 60,  paymentMethod: 'cash' },
  { id: 'BK-009', customerName: 'Nawaf Al-Qahtani',      phone: '+966 54 901 2345', service: 'VIP Cut',        serviceId: 'vip',      date: relativeDate(-1), time: '03:00 PM', status: 'done',     price: 300, paymentMethod: 'online', extras: ['Color Treatment'] },
  { id: 'BK-010', customerName: 'Mohammed Al-Shammari',  phone: '+966 50 012 3456', service: 'Standard Cut',   serviceId: 'standard', date: relativeDate(2),  time: '01:00 PM', status: 'pending',  price: 80,  paymentMethod: 'cash' },
];

export const MOCK_CUSTOMERS: AdminCustomer[] = [
  { id: 'C-001', name: 'Ahmed Al-Rashid',    phone: '+966 50 123 4567', totalBookings: 12, points: 480, totalSpent: 1760, lastVisit: relativeDate(-3),  tier: 'Gold' },
  { id: 'C-002', name: 'Khalid Mansour',      phone: '+966 55 234 5678', totalBookings: 7,  points: 280, totalSpent: 1050, lastVisit: relativeDate(-7),  tier: 'Silver' },
  { id: 'C-003', name: 'Omar Al-Farsi',       phone: '+966 54 345 6789', totalBookings: 3,  points: 90,  totalSpent: 310,  lastVisit: relativeDate(-14), tier: 'Bronze' },
  { id: 'C-004', name: 'Yusuf Ibrahim',       phone: '+966 50 456 7890', totalBookings: 15, points: 620, totalSpent: 2100, lastVisit: relativeDate(-1),  tier: 'Gold' },
  { id: 'C-005', name: 'Hassan Al-Zaidi',     phone: '+966 55 567 8901', totalBookings: 6,  points: 210, totalSpent: 780,  lastVisit: relativeDate(0),   tier: 'Silver' },
  { id: 'C-006', name: 'Tariq Nasser',        phone: '+966 54 678 9012', totalBookings: 2,  points: 40,  totalSpent: 160,  lastVisit: relativeDate(-21), tier: 'Bronze' },
  { id: 'C-007', name: 'Faisal Al-Otaibi',    phone: '+966 50 789 0123', totalBookings: 9,  points: 370, totalSpent: 1350, lastVisit: relativeDate(-5),  tier: 'Silver' },
  { id: 'C-008', name: 'Salman Khalid',       phone: '+966 55 890 1234', totalBookings: 1,  points: 20,  totalSpent: 60,   lastVisit: relativeDate(-30), tier: 'Bronze' },
];

export const MOCK_CUSTOMER_BOOKING_HISTORY: Record<string, CustomerBookingRecord[]> = {
  'C-001': [
    { id: 'H-001-1', service: 'VIP Cut',       price: 200, date: relativeDate(-3),  status: 'done' },
    { id: 'H-001-2', service: 'Standard Cut',   price: 80,  date: relativeDate(-18), status: 'done' },
    { id: 'H-001-3', service: 'Groom Package',  price: 150, date: relativeDate(-35), status: 'done' },
    { id: 'H-001-4', service: 'VIP Cut',        price: 230, date: relativeDate(-52), status: 'done' },
  ],
  'C-002': [
    { id: 'H-002-1', service: 'Groom Package',  price: 150, date: relativeDate(-7),  status: 'done' },
    { id: 'H-002-2', service: 'Quick Cut',       price: 60,  date: relativeDate(-25), status: 'done' },
    { id: 'H-002-3', service: 'Standard Cut',    price: 80,  date: relativeDate(-45), status: 'done' },
  ],
  'C-003': [
    { id: 'H-003-1', service: 'Standard Cut',   price: 80,  date: relativeDate(-14), status: 'done' },
    { id: 'H-003-2', service: 'Quick Cut',       price: 60,  date: relativeDate(1),   status: 'pending' },
  ],
  'C-004': [
    { id: 'H-004-1', service: 'VIP Cut',        price: 200, date: relativeDate(-1),  status: 'approved' },
    { id: 'H-004-2', service: 'Groom Package',  price: 180, date: relativeDate(-14), status: 'done' },
    { id: 'H-004-3', service: 'VIP Cut',        price: 200, date: relativeDate(-30), status: 'done' },
    { id: 'H-004-4', service: 'Standard Cut',   price: 80,  date: relativeDate(-50), status: 'done' },
  ],
  'C-005': [
    { id: 'H-005-1', service: 'VIP Cut',        price: 250, date: relativeDate(0),   status: 'done' },
    { id: 'H-005-2', service: 'Quick Cut',       price: 60,  date: relativeDate(-20), status: 'done' },
  ],
  'C-006': [
    { id: 'H-006-1', service: 'Standard Cut',   price: 80,  date: relativeDate(-21), status: 'done' },
    { id: 'H-006-2', service: 'Standard Cut',   price: 80,  date: relativeDate(1),   status: 'pending' },
  ],
  'C-007': [
    { id: 'H-007-1', service: 'Groom Package',  price: 150, date: relativeDate(-5),  status: 'approved' },
    { id: 'H-007-2', service: 'VIP Cut',        price: 200, date: relativeDate(-22), status: 'done' },
    { id: 'H-007-3', service: 'Standard Cut',   price: 80,  date: relativeDate(-40), status: 'done' },
  ],
  'C-008': [
    { id: 'H-008-1', service: 'Quick Cut',       price: 60,  date: relativeDate(-30), status: 'rejected' },
  ],
};

export const MOCK_SERVICES: AdminService[] = [
  { id: 'vip',      title: 'VIP Cut',       duration: 60, description: 'Premium cut with hot towel finish and styling.' },
  { id: 'groom',    title: 'Groom Package', duration: 45, description: 'Full grooming with beard shaping and styling.' },
  { id: 'standard', title: 'Standard Cut',  duration: 30, description: 'Classic haircut and clean finish.' },
  { id: 'quick',    title: 'Quick Cut',     duration: 20, description: 'Fast and clean basic cut.' },
];

export const MOCK_GALLERY: GalleryItem[] = [];

export const DEFAULT_SETTINGS: ShopSettings = {
  name: 'BarberX Studio',
  tagline: 'Premium Grooming Experience',
  phone: '+966 11 234 5678',
  address: 'King Fahd Road, Riyadh, Saudi Arabia',
  openTime: '09:00',
  closeTime: '22:00',
  workDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
  timeBetweenBookings: 15,
  pointValue: 0.1,
};

export const MOCK_BARBERS: Barber[] = [
  { id: 'B-001', name: 'Rami Al-Harbi',  photo: null, status: 'active' },
  { id: 'B-002', name: 'Saad Al-Dosari', photo: null, status: 'active' },
  { id: 'B-003', name: 'Nabil Qassem',   photo: null, status: 'unavailable' },
];

export const MOCK_BARBER_STATS: Record<string, BarberStats> = {
  'B-001': { barberId: 'B-001', totalBookings: 148, totalRevenue: 22350, thisMonthBookings: 18, thisMonthRevenue: 2700 },
  'B-002': { barberId: 'B-002', totalBookings: 97,  totalRevenue: 11640, thisMonthBookings: 12, thisMonthRevenue: 1440 },
  'B-003': { barberId: 'B-003', totalBookings: 61,  totalRevenue: 7320,  thisMonthBookings: 0,  thisMonthRevenue: 0 },
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
