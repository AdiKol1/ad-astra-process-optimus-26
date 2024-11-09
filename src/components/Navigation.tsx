import React from 'react';
import { Link } from 'react-router-dom';
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

          <div className="flex items-center space-x-4">
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-48 bg-space border border-gold/20" 
                  sideOffset={8}
                  align="end"
                  forceMount
                  style={{ backgroundColor: '#0F172A', '--tw-bg-opacity': '1' }}
                >
                  <DropdownMenuItem className="focus:bg-space-light">
                    <Link to="/" className="w-full text-white hover:text-gold">Home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-space-light">
                    <Link to="/services" className="w-full text-white hover:text-gold">Services</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-space-light">
                    <Link to="/blog" className="w-full text-white hover:text-gold">Blog</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-space-light">
                    <Link to="/about" className="w-full text-white hover:text-gold">About</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-space-light">
                    <Link to="/contact" className="w-full text-white hover:text-gold">Contact</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button onClick={openAuditForm} className="bg-gold hover:bg-gold-light text-space">
              Get Free Audit
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;