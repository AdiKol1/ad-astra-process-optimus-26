import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuditForm } from '@/contexts/AuditFormContext';

const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { openAuditForm } = useAuditForm();
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-space border-gold/20 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Wait! Don't Miss Out</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4 py-4">
          <p className="text-gray-300">
            Before you go, claim your free process audit worth $1,500!
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => {
                setIsOpen(false);
                openAuditForm();
              }} 
              className="w-full bg-gold hover:bg-gold-light text-space"
            >
              Get My Free Audit
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              className="w-full text-gray-400 hover:text-white"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;