import React from 'react';
import { Hero } from '../components/sections/Hero';
import { Gallery } from '../components/sections/Gallery';
import { About } from '../components/sections/About';
import { CTABanner } from '../components/sections/CTABanner';

const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <Gallery />
      <About />
      <CTABanner />
    </main>
  );
};

export default Home;
