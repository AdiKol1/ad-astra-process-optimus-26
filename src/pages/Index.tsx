import React from 'react';
import StarryBackground from '@/components/StarryBackground';
import Hero from '@/components/Hero';
import Services from '@/components/Services';

const Index = () => {
  return (
    <main className="relative">
      <StarryBackground />
      <Hero />
      <Services />
    </main>
  );
};

export default Index;