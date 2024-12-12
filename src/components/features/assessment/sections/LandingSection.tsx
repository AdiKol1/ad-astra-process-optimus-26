import React from 'react';

interface LandingSectionProps {
  onNext: () => void;
}

const LandingSection: React.FC<LandingSectionProps> = ({ onNext }) => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Process Optimization Assessment
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Discover your process automation potential and get personalized recommendations
        to optimize your business operations.
      </p>
      <div className="mt-10">
        <button
          onClick={onNext}
          className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Start Assessment
        </button>
      </div>
    </div>
  );
};

export default LandingSection;
