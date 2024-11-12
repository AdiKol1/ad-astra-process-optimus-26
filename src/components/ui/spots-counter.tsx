import React from 'react';
import { Users } from 'lucide-react';

interface SpotsCounterProps {
  totalSpots: number;
  remainingSpots: number;
}

export const SpotsCounter = ({ totalSpots, remainingSpots }: SpotsCounterProps) => {
  const percentageLeft = (remainingSpots / totalSpots) * 100;
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <Users className="h-4 w-4 text-gold" />
      <span className="text-gold font-semibold">{remainingSpots} spots remaining</span>
      <div className="w-20 h-1.5 bg-gold/20 rounded-full">
        <div 
          className="h-full bg-gold rounded-full transition-all duration-500"
          style={{ width: `${percentageLeft}%` }}
        />
      </div>
    </div>
  );
};