import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import About from '../components/About';
import Services from '../components/Services';

const Index = () => {
  useEffect(() => {
    console.log('Index component mounted');
  }, []);

  console.log('Index component rendering');

  return (
    <div className="flex flex-col gap-0">
      <section className="py-24 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl max-w-3xl">
              Transform Your Business with AI-Powered Process Optimization
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Leverage cutting-edge AI technology to streamline operations, boost efficiency, and drive sustainable growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/assessment"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
              >
                Start Free Assessment
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
              >
                Explore Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Services />
      <About />

      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Optimize Your Business?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Take our free assessment to discover how AI can transform your business processes.
            </p>
            <Link
              to="/assessment"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            >
              Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;