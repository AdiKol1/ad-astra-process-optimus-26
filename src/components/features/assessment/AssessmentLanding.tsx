import React, { useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, BarChart2, Users, Zap } from "lucide-react";
import { useAssessmentStore } from "@/contexts/assessment/store";
import { AssessmentStep } from '@/types/assessment/steps';
import { motion, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { Card, CardContent } from '@/components/ui/card';
import { telemetry } from '@/utils/monitoring/telemetry';
import { logger } from '@/utils/logger';

interface EngagementMetrics {
  timeSpent: number;
  scrollDepth: number;
  interactionCount: number;
}

interface AssessmentStore {
  setStep: (step: AssessmentStep) => void;
  setError: (error: Error | null) => void;
  resetAssessment: () => void;
  isInitialized: boolean;
}

interface TelemetryEvent {
  timestamp?: string;
  [key: string]: any;
}

const benefits = [
  {
    icon: BarChart2,
    title: "Process Efficiency Analysis",
    description: "Get detailed insights into your current process efficiency and potential improvements."
  },
  {
    icon: Zap,
    title: "Automation Opportunities",
    description: "Identify specific processes that can be automated for maximum impact."
  },
  {
    icon: Users,
    title: "Team Optimization",
    description: "Understand how to better allocate your team's time and resources."
  }
];

// Removed testimonials section to comply with legal requirements

const industries = [
  "Technology",
  "Healthcare",
  "Financial Services",
  "Manufacturing",
  "Retail",
  "Professional Services",
  "Real Estate"
];

interface AssessmentLandingProps {
  onStart?: () => void;
}

export const AssessmentLanding: React.FC<AssessmentLandingProps> = React.memo(({ onStart }) => {
  const store = useAssessmentStore();
  const { setStep, setError, resetAssessment, isInitialized } = store as unknown as AssessmentStore;
  const prefersReducedMotion = useReducedMotion();
  const { recordMetric } = usePerformanceMonitor();

  // Track user engagement
  const [metrics, setMetrics] = React.useState<EngagementMetrics>({
    timeSpent: 0,
    scrollDepth: 0,
    interactionCount: 0
  });

  useEffect(() => {
    const startTime = Date.now();
    let scrollDepth = 0;
    let interactions = 0;

    const handleScroll = () => {
      const newDepth = Math.floor((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
      if (newDepth > scrollDepth) {
        scrollDepth = newDepth;
        setMetrics(prev => ({ ...prev, scrollDepth }));
      }
    };

    const handleInteraction = () => {
      interactions++;
      setMetrics(prev => ({ ...prev, interactionCount: interactions }));
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keypress', handleInteraction);

    const interval = setInterval(() => {
      setMetrics(prev => ({ 
        ...prev, 
        timeSpent: Math.floor((Date.now() - startTime) / 1000) 
      }));
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keypress', handleInteraction);
      clearInterval(interval);
    };
  }, []);

  const handleStart = useCallback(() => {
    try {
      recordMetric('assessment_start_clicked');
      resetAssessment();
      
      const telemetryData: TelemetryEvent = {
        timestamp: new Date().toISOString(),
        engagement: {
          timeSpentSeconds: metrics.timeSpent,
          maxScrollDepth: metrics.scrollDepth,
          interactions: metrics.interactionCount
        },
        userAgent: navigator.userAgent,
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        referrer: document.referrer
      };

      telemetry.track('assessment_started', telemetryData);

      logger.info('User started assessment', {
        metrics,
        timestamp: new Date().toISOString()
      });

      // Call the provided onStart handler
      onStart?.();
    } catch (error) {
      const err = error as Error;
      setError(err);
      logger.error('Error starting assessment:', {
        message: err.message,
        stack: err.stack,
        metrics
      });
    }
  }, [setError, resetAssessment, metrics, recordMetric, onStart]);

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Process Optimization Assessment | Optimize Your Business Operations</title>
        <meta name="description" content="Get a detailed analysis of your business processes and discover opportunities for automation and optimization. Start your free assessment today." />
      </Helmet>

      {/* Hero Section - Enhanced with two-column layout and animation */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Left column with content */}
            <div className="md:w-1/2 text-left md:pr-12 mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mb-4">
                  #1 Process Assessment Tool
                </span>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Optimize Your Business <span className="text-blue-600">Processes</span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-xl text-gray-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Get a detailed analysis of your operations and discover opportunities 
                for automation, efficiency improvements, and cost savings.
              </motion.p>
              
              {/* Above-the-fold social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap items-center mb-8"
              >
                <div className="flex -space-x-2 mr-4 mb-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center overflow-hidden">
                      <span className="text-xs font-bold text-gray-600">{i}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">500+ businesses</span> optimized their processes this month
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
              >
                <Button 
                  size="lg" 
                  onClick={handleStart}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
                >
                  Start Free Assessment <ArrowRight className="ml-2" />
                </Button>
                <span className="text-sm text-gray-500 flex items-center">
                  <span className="mr-2">⏱️</span> Takes only 5 minutes
                </span>
              </motion.div>
            </div>
            
            {/* Right column with animation/illustration */}
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="bg-white rounded-xl shadow-2xl p-4 relative"
              >
                {/* Placeholder for animation/video - can be replaced with actual content */}
                <div className="bg-blue-50 rounded-lg aspect-video flex items-center justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-10 h-10">
                        <path d="M8 5.14v14l11-7-11-7z" />
                      </svg>
                    </div>
                    <span className="absolute -bottom-8 w-full text-center text-sm font-medium text-gray-600">
                      Watch how it works
                    </span>
                  </div>
                </div>
                
                {/* Results preview */}
                <div className="absolute -bottom-10 -left-10 bg-white rounded-lg shadow-lg p-4 w-32 hidden md:block">
                  <div className="text-sm font-semibold">ROI</div>
                  <div className="text-xl font-bold text-green-600">185%</div>
                  <div className="text-xs text-gray-500">Average increase</div>
                </div>
                
                <div className="absolute -bottom-10 -right-10 bg-white rounded-lg shadow-lg p-4 w-32 hidden md:block">
                  <div className="text-sm font-semibold">Time Saved</div>
                  <div className="text-xl font-bold text-blue-600">26hrs</div>
                  <div className="text-xs text-gray-500">Weekly average</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What You'll Get</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <benefit.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left Column: Value Stats */}
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-8">Unlock Hidden Efficiency in Your Business</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <BarChart2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Average ROI of 300%</h3>
                    <p className="text-gray-600">Our clients typically see a 3x return on their process optimization investments within the first year.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">40% Efficiency Increase</h3>
                    <p className="text-gray-600">Businesses implementing our recommendations see an average 40% increase in operational efficiency.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">25+ Hours Saved Weekly</h3>
                    <p className="text-gray-600">Our typical client saves 25+ hours per week through automated workflows and optimized processes.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Lead Capture Form */}
            <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-center">Get Your Free Assessment Report</h3>
              <p className="text-center mb-8">Complete this 5-minute assessment to receive your personalized process optimization report with actionable insights.</p>
              
              <form className="space-y-5" onSubmit={(e) => {
                e.preventDefault();
                // Track the lead capture event
                telemetry.track('assessment_lead_captured', {
                  timestamp: new Date().toISOString()
                });
                // In a real implementation, this would save the lead info
                // Then start the assessment
                if (onStart) {
                  onStart();
                }
              }}>
                <div>
                  <label htmlFor="lead-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" id="lead-name" name="name" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                
                <div>
                  <label htmlFor="lead-email" className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                  <input type="email" id="lead-email" name="email" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                
                <div>
                  <label htmlFor="lead-company" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input type="text" id="lead-company" name="company" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                
                <div>
                  <label htmlFor="lead-role" className="block text-sm font-medium text-gray-700 mb-1">Your Role</label>
                  <select id="lead-role" name="role" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select your role</option>
                    <option value="CEO/Owner">CEO/Owner</option>
                    <option value="COO/Operations">COO/Operations Director</option>
                    <option value="CTO/Technology">CTO/Technology Director</option>
                    <option value="Process Manager">Process Manager</option>
                    <option value="Department Head">Department Head</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="lead-employees" className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                  <select id="lead-employees" name="employees" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>
                
                <div className="flex items-start pt-2">
                  <input id="lead-consent" name="consent" type="checkbox" required className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="lead-consent" className="ml-2 block text-sm text-gray-700">
                    I agree to receive personalized recommendations and occasional updates. You can unsubscribe at any time.
                  </label>
                </div>
                
                <div className="pt-2">
                  <button type="submit" className="w-full bg-blue-600 text-white py-4 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium text-lg">
                    Start Your Free Assessment
                  </button>
                </div>
                
                <p className="text-xs text-center text-gray-500 mt-4">
                  Your information is secure and will never be shared with third parties. By submitting this form, you agree to our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Coverage */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Industries We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Processes?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of businesses that have improved their operations
            through our assessment.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={handleStart}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg"
          >
            Start Free Assessment <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p className="mb-4">🔒 Your information is secure and will never be shared</p>
          <p>
            Trusted by leading companies • ISO 27001 Certified • GDPR Compliant
          </p>
        </div>
      </section>
    </div>
  );
});

AssessmentLanding.displayName = 'AssessmentLanding';