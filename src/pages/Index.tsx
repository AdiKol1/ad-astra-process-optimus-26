import React from 'react';
import StarryBackground from '@/components/StarryBackground';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Marketing from '@/components/Marketing';
import TrustSignals from '@/components/TrustSignals';
import Testimonials from '@/components/Testimonials';
import CaseStudies from '@/components/social/CaseStudies';
import SuccessMetrics from '@/components/social/SuccessMetrics';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import AuditForm from '@/components/AuditForm';
import AuditValueProposition from '@/components/AuditValueProposition';

const Index = () => {
  return (
    <main className="relative pt-20">
      <StarryBackground />
      <Hero />
      <AuditValueProposition />
      <About />
      <Services />
      <TrustSignals />
      <Marketing />
      <SuccessMetrics />
      <CaseStudies />
      <Testimonials />
      <Blog />
      <section className="py-20 px-4" id="audit">
        <AuditForm />
      </section>
      <Contact />
    </main>
  );
};

export default Index;