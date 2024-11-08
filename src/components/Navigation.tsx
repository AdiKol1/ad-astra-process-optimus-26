import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-space/80 backdrop-blur-lg border-b border-gold/20">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif text-gold">Ad Astra</Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-gold transition-colors">Home</Link>
            <Link to="/services" className="text-white hover:text-gold transition-colors">Services</Link>
            <Link to="/blog" className="text-white hover:text-gold transition-colors">Blog</Link>
            <Link to="/about" className="text-white hover:text-gold transition-colors">About</Link>
            <Link to="/contact" className="text-white hover:text-gold transition-colors">Contact</Link>
          </div>

          <Button className="bg-gold hover:bg-gold-light text-space">
            Get Free Audit
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;