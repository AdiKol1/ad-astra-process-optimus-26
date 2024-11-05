import React from 'react';
import { Card } from '@/components/ui/card';

const Marketing = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Optimizing Your Marketing Strategy
          </h2>
          <p className="text-xl text-gray-300">
            At Ad Astra, we transform unique business challenges into opportunities through strategic process automation. We streamline your workflows so your team can focus on what truly matters – growth.
          </p>
        </div>
        <div className="relative">
          <div className="aspect-video rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e"
              alt="Space landscape"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketing;