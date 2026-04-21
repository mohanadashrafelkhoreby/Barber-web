import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy-load pages for code splitting
const Home = lazy(() => import('../pages/Home'));
const Booking = lazy(() => import('../pages/BookingPage'));
const Points = lazy(() => import('../pages/PointsPage'));
const Gallery = lazy(() => import('../pages/GalleryPage'));

const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-black-900 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-surface-border border-t-gold rounded-full animate-spin" />
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/points" element={<Points />} />
        <Route path="/gallery" element={<Gallery />} />
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
