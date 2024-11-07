import React from 'react';
import { Card } from '@/components/ui/card';
import { LinkedinIcon } from 'lucide-react';

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "CEO & AI Strategist",
    linkedin: "https://linkedin.com/in/sarahchen",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    name: "David Kumar",
    role: "Head of AI Development",
    linkedin: "https://linkedin.com/in/davidkumar",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
  }
];

const About = () => {
  return (
    <section className="py-20 px-4" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">About Ad Astra</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We combine cutting-edge AI technology with proven marketing strategies to help businesses reach new heights. Our mission is to make AI-powered marketing accessible and effective for businesses of all sizes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {teamMembers.map((member, index) => (
            <Card key={index} className="bg-space-light p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-gray-300">{member.role}</p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-gold hover:text-gold-light mt-2"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                    <span>LinkedIn Profile</span>
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;