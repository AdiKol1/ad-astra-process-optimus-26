import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What is AI-powered marketing automation?",
    answer: "AI-powered marketing automation combines artificial intelligence with automated marketing processes to optimize campaigns, personalize customer interactions, and drive better results with less manual effort."
  },
  {
    question: "How long does implementation typically take?",
    answer: "Implementation timelines vary based on your needs, but typically range from 2-4 weeks. Our team works closely with you to ensure a smooth transition and minimal disruption to your operations."
  },
  {
    question: "What ROI can I expect?",
    answer: "Most clients see a positive ROI within the first 3-6 months, with average efficiency gains of 40% in marketing operations and a 25% reduction in customer acquisition costs."
  },
  {
    question: "How do you ensure data security?",
    answer: "We maintain the highest standards of data security with end-to-end encryption, regular security audits, and compliance with major data protection regulations including GDPR and CCPA."
  },
  {
    question: "What support do you provide?",
    answer: "We offer comprehensive support including 24/7 technical assistance, regular strategy sessions, and dedicated account management to ensure your success."
  }
];

const FAQ = () => {
  return (
    <section className="py-20 px-4 bg-space">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <HelpCircle className="h-12 w-12 text-gold mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300">
            Get answers to common questions about our services
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-space-light border border-gold/20 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-space-light/50">
                <span className="text-left">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 text-gray-300">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;