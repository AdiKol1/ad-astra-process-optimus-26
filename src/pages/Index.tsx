import { lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { WebSocketTest } from '@/components/connection/WebSocketTest';
import ChatBot from '@/components/ChatBot';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <WebSocketTest />
      </div>
      
      <Helmet>
        <title>Ad Astra - Marketing Automation & Process Optimization</title>
        <meta name="description" content="Transform your business with our expert marketing automation and process optimization services. Get started with our free assessment today." />
      </Helmet>

      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="mb-6 text-4xl md:text-5xl font-bold font-heading">
                  Transform Your Business with Marketing Automation
                </h1>
                <p className="mb-8 text-lg text-gray-900">
                  Unlock your business potential with our expert marketing automation and process optimization services. Start with our free assessment today.
                </p>
                <div className="flex flex-wrap">
                  <div className="w-full md:w-auto mb-4 md:mb-0 md:mr-4">
                    <Link to="/assessment">
                      <Button size="lg" className="w-full md:w-auto">
                        Start Free Assessment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <img
                  className="relative mx-auto rounded-lg"
                  src="/images/hero-image.jpg"
                  alt="Marketing Automation"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Our Services</h2>
            <p className="text-lg text-gray-600">
              Comprehensive solutions to streamline your marketing operations and drive growth
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Lead Generation</h3>
              <p className="text-gray-600 mb-4">
                Automated systems to capture and nurture quality leads
              </p>
              <Link to="/services/lead-generation" className="text-primary hover:underline">
                Learn more <ArrowRight className="inline-block ml-1 h-4 w-4" />
              </Link>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">CRM Systems</h3>
              <p className="text-gray-600 mb-4">
                Integrated solutions for customer relationship management
              </p>
              <Link to="/services/crm-systems" className="text-primary hover:underline">
                Learn more <ArrowRight className="inline-block ml-1 h-4 w-4" />
              </Link>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Content Generation</h3>
              <p className="text-gray-600 mb-4">
                AI-powered content creation and management tools
              </p>
              <Link to="/services/content-generation" className="text-primary hover:underline">
                Learn more <ArrowRight className="inline-block ml-1 h-4 w-4" />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      <ChatBot />
    </div>
  );
};

export default Index;
