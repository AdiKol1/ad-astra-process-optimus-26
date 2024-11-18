import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: "CRM Systems",
    description: "Custom-built CRM solutions that streamline your business processes and enhance customer relationships.",
    link: "/services/crm-systems"
  },
  {
    title: "Lead Generation Systems",
    description: "AI-powered lead generation and qualification systems that automate your outreach and conversion process.",
    link: "/services/lead-generation"
  },
  {
    title: "Content Generation Systems",
    description: "Automated content creation systems that produce high-quality, SEO-optimized content at scale.",
    link: "/services/content-generation"
  }
];

const Services = () => {
  return (
    <section className="py-16 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our range of AI-powered solutions designed to transform your business processes.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900">
                {service.title}
              </h3>
              <p className="mt-2 text-gray-600">
                {service.description}
              </p>
              <Link
                to={service.link}
                className="mt-4 inline-block text-blue-600 hover:text-blue-800"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;