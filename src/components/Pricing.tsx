import React from 'react';
import { Check } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const Pricing: React.FC = () => {
  const tiers: PricingTier[] = [
    {
      name: "Starter",
      price: "$99",
      description: "Perfect for small businesses looking to optimize a single process.",
      features: [
        "Process assessment for 1 workflow",
        "Basic automation recommendations",
        "Email support",
        "1 user license",
        "Basic reporting"
      ],
      cta: "Get Started"
    },
    {
      name: "Professional",
      price: "$299",
      description: "Ideal for growing businesses with multiple processes to optimize.",
      features: [
        "Process assessment for up to 5 workflows",
        "Advanced automation recommendations",
        "Priority email & chat support",
        "5 user licenses",
        "Advanced reporting & analytics",
        "Custom integrations",
        "ROI calculator"
      ],
      cta: "Go Professional",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Comprehensive solution for organizations with complex process needs.",
      features: [
        "Unlimited process assessments",
        "Enterprise-grade automation solutions",
        "24/7 dedicated support",
        "Unlimited user licenses",
        "Advanced analytics & custom dashboards",
        "Custom integrations & API access",
        "Dedicated account manager",
        "On-site training & implementation"
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            The right price for your process optimization
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Choose the perfect plan to help your organization streamline workflows, reduce errors, and increase productivity.
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {tiers.map((tier) => (
            <div 
              key={tier.name} 
              className={`relative p-8 bg-white border rounded-2xl shadow-sm flex flex-col ${
                tier.popular ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 -mt-3 mr-6 px-4 py-1 bg-blue-500 rounded-full text-xs font-semibold uppercase tracking-wide text-white">
                  Most Popular
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                
                <div className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                  {tier.price !== "Custom" && <span className="ml-1 text-xl font-semibold">/month</span>}
                </div>
                
                <p className="mt-6 text-gray-500">{tier.description}</p>

                <ul role="list" className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <a
                href="#"
                className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                  tier.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h3>
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Can I switch plans later?</h4>
                <p className="mt-2 text-gray-500">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">Is there a free trial?</h4>
                <p className="mt-2 text-gray-500">We offer a 14-day free trial for our Starter and Professional plans so you can experience the benefits before committing.</p>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h4>
                <p className="mt-2 text-gray-500">We accept all major credit cards, as well as PayPal. Enterprise customers can also pay via invoice.</p>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">Do you offer discounts for non-profits or educational institutions?</h4>
                <p className="mt-2 text-gray-500">Yes, we offer special pricing for non-profits, educational institutions, and startups. Contact our sales team for more information.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
