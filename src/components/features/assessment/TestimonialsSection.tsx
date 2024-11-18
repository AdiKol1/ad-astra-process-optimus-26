import React from 'react';
import { FiStar, FiUser, FiBuilding } from 'react-icons/fi';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  industry: string;
  results: {
    savings: string;
    efficiency: string;
    timeframe: string;
  };
}

// Placeholder testimonials - to be replaced with real ones
const placeholderTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Operations Director",
    company: "TechCorp Solutions",
    industry: "Technology",
    content: "The process assessment provided clear, actionable insights that helped us streamline our operations. We've seen remarkable improvements in our efficiency.",
    results: {
      savings: "$250,000 annually",
      efficiency: "40% improvement",
      timeframe: "3 months"
    }
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "COO",
    company: "Global Manufacturing Inc",
    industry: "Manufacturing",
    content: "This assessment tool helped us identify critical bottlenecks we weren't even aware of. The ROI has exceeded our expectations.",
    results: {
      savings: "$500,000+ annually",
      efficiency: "55% improvement",
      timeframe: "6 months"
    }
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Process Improvement Manager",
    company: "FinServe Group",
    industry: "Financial Services",
    content: "The detailed recommendations were invaluable in our digital transformation journey. Our team is now more productive than ever.",
    results: {
      savings: "$180,000 annually",
      efficiency: "35% improvement",
      timeframe: "4 months"
    }
  }
];

interface TestimonialsSectionProps {
  isVisible?: boolean;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ isVisible = false }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Success Stories
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            See how other organizations transformed their processes and achieved remarkable results
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
          {placeholderTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Company Info */}
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <FiBuilding className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {testimonial.company}
                  </h3>
                  <p className="text-sm text-gray-500">{testimonial.industry}</p>
                </div>
              </div>

              {/* Testimonial Content */}
              <blockquote className="mt-4">
                <p className="text-lg text-gray-600 italic">"{testimonial.content}"</p>
              </blockquote>

              {/* Results */}
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Results Achieved:</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex items-center">
                    <FiStar className="h-4 w-4 mr-2" />
                    <span>Cost Savings: {testimonial.results.savings}</span>
                  </div>
                  <div className="flex items-center">
                    <FiStar className="h-4 w-4 mr-2" />
                    <span>Efficiency Gain: {testimonial.results.efficiency}</span>
                  </div>
                  <div className="flex items-center">
                    <FiStar className="h-4 w-4 mr-2" />
                    <span>Implementation: {testimonial.results.timeframe}</span>
                  </div>
                </div>
              </div>

              {/* Author */}
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-base text-gray-600">
            Ready to achieve similar results for your organization?
          </p>
          <button
            type="button"
            className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Start Your Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;