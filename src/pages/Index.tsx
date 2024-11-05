import React from 'react';
import StarryBackground from '@/components/StarryBackground';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Marketing from '@/components/Marketing';

const Index = () => {
  return (
    <main className="relative">
      <StarryBackground />
      <Hero />
      <Marketing />
      <Services />
    </main>
  );
};

export default Index;