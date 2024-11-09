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
                <DropdownMenuContent className="bg-white" align="end">
                  <DropdownMenuItem className="focus:bg-gray-100">
                    <span className="w-full text-space hover:text-gold">
                      <Link to="/" className="block w-full">Home</Link>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-100">
                    <span className="w-full text-space hover:text-gold">
                      <Link to="/services" className="block w-full">Services</Link>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-100">
                    <span className="w-full text-space hover:text-gold">
                      <Link to="/blog" className="block w-full">Blog</Link>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-100">
                    <span className="w-full text-space hover:text-gold">
                      <Link to="/about" className="block w-full">About</Link>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-100">
                    <span className="w-full text-space hover:text-gold">
                      <Link to="/contact" className="block w-full">Contact</Link>
                    </span>
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