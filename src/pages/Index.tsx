import React from 'react';
import About from '../components/About';
import Services from '../components/Services';

const Index = () => {
  return (
    <div className="pt-16">
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            Ad Astra Process Optimus
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your business with AI-powered process optimization
          </p>
        </div>
      </section>
      
      <About />
      <Services />
    </div>
  );
};

export default Index;