import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuditForm } from '@/contexts/AuditFormContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from 'lucide-react';

const Navigation = () => {
  const { openAuditForm } = useAuditForm();
  const location = useLocation();

  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Cleanup
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-space/95 backdrop-blur-sm border-b border-gold/20 transition-all duration-200">
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

          <div className="flex items-center space-x-4">
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-space-light">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end" sideOffset={8}>
                  <DropdownMenuItem asChild>
                    <Link to="/" className="w-full">Home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/services" className="w-full">Services</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/blog" className="w-full">Blog</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/about" className="w-full">About</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/contact" className="w-full">Contact</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button 
              onClick={openAuditForm} 
              className="bg-gold hover:bg-gold-light text-space font-medium"
            >
              Get Free Audit
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;