import React from 'react';
import { Star, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Star className="text-gold h-8 w-8 animate-twinkle" />
          <Compass className="text-gold h-8 w-8 animate-float" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Where Ancient Wisdom Meets Modern Technology
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Transform your business with process optimization rooted in Stoic principles
        </p>
        <Button className="bg-gold hover:bg-gold-light text-space text-lg px-8 py-6">
          Begin Your Journey
        </Button>
      </div>
    </div>
  );
};

export default Hero;