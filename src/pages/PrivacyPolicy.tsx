import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/shared/SEO';

const PrivacyPolicy = () => {
  return (
    <>
      <SEO 
        title="Privacy Policy - Ad Astra Process Optimus"
        description="Our privacy policy and how we handle your data"
      />
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-space-light rounded-lg my-8">
        <h1 className="text-3xl font-bold text-gold">Privacy Policy</h1>
        
        <div className="space-y-4 text-white/90">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gold">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us when using our Process Automation Assessment tool, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Business information (employee count, industry, process volumes)</li>
              <li>Assessment responses and preferences</li>
              <li>Contact information when provided</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gold">2. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Generate your process automation assessment results</li>
              <li>Improve our assessment tool and recommendations</li>
              <li>Contact you about your assessment results when requested</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gold">3. Data Storage</h2>
            <p>Assessment data is stored securely using Google Sheets and is only accessible to authorized personnel. We implement appropriate data collection, storage, and processing practices to protect against unauthorized access, alteration, disclosure, or destruction of your information.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-gold">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us.</p>
          </section>
        </div>

        <div className="pt-4">
          <Link to="/" className="text-gold hover:text-gold-light underline">
            Return to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;