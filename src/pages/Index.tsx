import React from 'react';
import StarryBackground from '@/components/StarryBackground';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Marketing from '@/components/Marketing';
import AuditForm from '@/components/AuditForm';

const Index = () => {
  return (
    <main className="relative">
      <StarryBackground />
      <Hero />
      <Marketing />
      <section className="py-20 px-4">
        <AuditForm />
      </section>
      <Services />
    </main>
  );
};

export default Index;