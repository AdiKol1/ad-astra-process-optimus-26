import React from 'react';
import { Star, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-12 max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Star className="text-gold h-8 w-8 animate-twinkle" />
          <Compass className="text-gold h-8 w-8 animate-float" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
          Welcome to Ad Astra: A Full-Stack Process Optimization Marketing Agency Rooted in Stoic Principles
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
          At Ad Astra, we combine ancient Stoic wisdom with modern automation technology to drive sustainable growth. By focusing on what we can control - your core processes - we help companies streamline operations and build systems that scale.
        </p>
        <Button className="bg-gold hover:bg-gold-light text-space text-lg px-8 py-6">
          Begin Your Journey
        </Button>
      </div>
    </div>
  );
};

export default Hero;