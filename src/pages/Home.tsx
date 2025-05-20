import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const startAssessment = () => {
    console.log('Home: Navigate to assessment');
    navigate('/assessment');
  };

  return (
    <div className="bg-white">
      <Helmet>
        <title>Ad Astra Process Optimus - Home</title>
        <meta name="description" content="Ad Astra Process Optimus - Optimize your business processes" />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transform Your Business Processes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Identify automation opportunities, streamline workflows, and boost productivity with our intelligent process assessment.
          </p>
          <button
            onClick={startAssessment}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Free Assessment
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our assessment helps you identify opportunities for improvement in your business processes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Complete Assessment</h3>
              <p className="text-gray-600">Answer questions about your current business processes.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Insights</h3>
              <p className="text-gray-600">Receive a detailed analysis of your process efficiency.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-blue-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Implement Solutions</h3>
              <p className="text-gray-600">Follow our recommendations to optimize your workflows.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 