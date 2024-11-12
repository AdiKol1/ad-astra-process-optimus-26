import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you within 24 hours.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-space to-space-light pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gold to-gold-light">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ready to transform your marketing with AI? Let's discuss how we can help your business grow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="p-8 bg-space/50 backdrop-blur-lg border-gold/20 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gold">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-space border border-gold/20 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gold">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg bg-space border border-gold/20 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gold">Message</label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg bg-space border border-gold/20 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors h-32"
                  required
                ></textarea>
              </div>
              <Button type="submit" className="w-full bg-gold hover:bg-gold-light text-space font-semibold py-3">
                Send Message
              </Button>
            </form>
          </Card>

          <Card className="p-8 bg-space/50 backdrop-blur-lg border-gold/20 shadow-xl">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="bg-gold/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-gold">Email</h3>
                  <p className="text-gray-300">contact@adastra.ai</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-gold/10 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-gold">Phone</h3>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-gold/10 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-gold">Address</h3>
                  <p className="text-gray-300">123 Innovation Drive, Tech City, TC 12345</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gold/20">
                <h3 className="font-bold text-gold mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                     className="bg-gold/10 p-3 rounded-lg hover:bg-gold/20 transition-colors">
                    <Linkedin className="w-6 h-6 text-gold" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                     className="bg-gold/10 p-3 rounded-lg hover:bg-gold/20 transition-colors">
                    <Twitter className="w-6 h-6 text-gold" />
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;