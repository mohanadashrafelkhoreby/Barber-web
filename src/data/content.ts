export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
}

// Filter categories used on the /gallery page
export type GalleryFilter = 'All' | 'Haircut' | 'Beard';

export const galleryItems: GalleryItem[] = [
  // ── Haircut ──
  {
    id: 1,
    title: 'Classic Fade',
    category: 'Haircut',
    imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=85&fit=crop',
    aspectRatio: 'portrait',
  },
  {
    id: 2,
    title: 'Skin Taper',
    category: 'Haircut',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=85&fit=crop',
    aspectRatio: 'portrait',
  },
  {
    id: 3,
    title: 'Textured Crop',
    category: 'Haircut',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=85&fit=crop',
    aspectRatio: 'portrait',
  },
  {
    id: 4,
    title: 'High Top Fade',
    category: 'Haircut',
    imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=85&fit=crop',
    aspectRatio: 'portrait',
  },
  {
    id: 5,
    title: 'Low Fade Clean',
    category: 'Haircut',
    imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=85&fit=crop',
    aspectRatio: 'portrait',
  },
  // ── Beard ──
  {
    id: 6,
    title: 'Full Beard Sculpt',
    category: 'Beard',
    imageUrl: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=800&q=85&fit=crop',
    aspectRatio: 'portrait',
  },
  {
    id: 7,
    title: 'Sharp Lineup',
    category: 'Beard',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=85&fit=crop',
    aspectRatio: 'portrait',
  },
  {
    id: 8,
    title: 'Beard & Fade Combo',
    category: 'Beard',
    imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800&q=85&fit=crop',
    aspectRatio: 'portrait',
  },
  {
    id: 9,
    title: 'Stubble Trim',
    category: 'Beard',
    imageUrl: 'https://images.unsplash.com/photo-1578307985698-b853c6a9f95f?w=800&q=85&fit=crop',
    aspectRatio: 'portrait',
  },
  // ── VIP ──
  {
    id: 10,
    title: 'VIP Signature Cut',
    category: 'Haircut',
    imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=85&fit=crop',
    aspectRatio: 'portrait',
  },
  {
    id: 11,
    title: 'Executive Style',
    category: 'Haircut',
    imageUrl: 'https://images.unsplash.com/photo-1541585452817-f27c05c61cb7?w=800&q=85&fit=crop',
    aspectRatio: 'portrait',
  },
  {
    id: 12,
    title: 'Full Groom Package',
    category: 'Beard',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=85&fit=crop&crop=faces',
    aspectRatio: 'portrait',
  },
];

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Gallery', href: '/gallery' },
];
