import React from 'react';
import StarryBackground from '@/components/StarryBackground';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Marketing from '@/components/Marketing';
import Testimonials from '@/components/Testimonials';
import CaseStudies from '@/components/social/CaseStudies';
import SuccessMetrics from '@/components/social/SuccessMetrics';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import AuditForm from '@/components/AuditForm';

const Index = () => {
  return (
    <main className="relative pt-20">
      <StarryBackground />
      <Hero />
      <About />
      <Services />
      <Marketing />
      <SuccessMetrics />
      <CaseStudies />
      <Testimonials />
      <Blog />
      <section className="py-20 px-4" id="audit">
        <div className="max-w-xl mx-auto p-4 bg-white/10 backdrop-blur-lg rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-2 text-center">Business Process Audit</h2>
          <p className="text-gray-300 mb-4 text-sm text-center">
            Complete this 10-minute assessment to receive your free comprehensive process optimization report (Worth $1,500)
          </p>
          <AuditForm />
        </div>
      </section>
      <Contact />
    </main>
  );
};

export default Index;