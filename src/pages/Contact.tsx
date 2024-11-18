import React from 'react';

const Contact = () => {
  return (
    <div className="pt-16">
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-600">
            Get in touch with us to learn more about how we can help transform your business.
          </p>
          <div className="mt-8">
            <a
              href="mailto:contact@adastra.ai"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;