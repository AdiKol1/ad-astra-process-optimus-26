import React from 'react';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';

const Contact = () => {
  return (
    <section className="py-20 px-4 bg-space-light" id="contact">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h2>
          <p className="text-xl text-gray-300">Ready to transform your marketing with AI? Let's talk.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 bg-space">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-gold" />
                <div>
                  <h3 className="font-bold">Email</h3>
                  <p className="text-gray-300">contact@adastra.ai</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-gold" />
                <div>
                  <h3 className="font-bold">Phone</h3>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="w-6 h-6 text-gold" />
                <div>
                  <h3 className="font-bold">Address</h3>
                  <p className="text-gray-300">123 Innovation Drive, Tech City, TC 12345</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <a href="https://linkedin.com/company/adastra" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="https://twitter.com/adastra" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </Card>

          <Card className="p-8 bg-space">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596073366!2d-74.25987368715491!3d40.69767006458873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1647043435129!5m2!1sen!2s"
              className="w-full h-full min-h-[300px] rounded-lg"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;