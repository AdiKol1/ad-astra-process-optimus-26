import React from 'react';
import { Star, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuditForm } from '@/contexts/AuditFormContext';

const Hero = () => {
  const { openAuditForm } = useAuditForm();

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-12 max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Star className="text-gold h-8 w-8 animate-twinkle" />
          <Compass className="text-gold h-8 w-8 animate-float" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
          Scale Your Business with AI-Powered Process Optimization
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Join industry leaders who have increased their operational efficiency by 300% with our proven systems. Our unique blend of Stoic principles and cutting-edge automation delivers predictable, measurable growth.
        </p>
        <div className="space-y-4">
          <Button onClick={openAuditForm} className="bg-gold hover:bg-gold-light text-space text-lg px-8 py-6">
            Get Your Free Process Audit
          </Button>
          <p className="text-sm text-gray-400">Limited Time Offer: Comprehensive Audit Worth $1,500 - Now Free</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;