import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, FileText, PresentationChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuditForm } from '@/contexts/AuditFormContext';

const AuditValueProposition = () => {
  const { openAuditForm } = useAuditForm();

  return (
    <section className="py-20 px-4 bg-space-light/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Free Process Audit Includes:
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get a comprehensive analysis worth $1,500 - completely free for a limited time
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-space border-gold/20">
            <CardContent className="p-6">
              <PresentationChart className="h-12 w-12 text-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Performance Analysis</h3>
              <p className="text-gray-300">
                Detailed review of your current processes and identification of bottlenecks
              </p>
            </CardContent>
          </Card>

          <Card className="bg-space border-gold/20">
            <CardContent className="p-6">
              <FileText className="h-12 w-12 text-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Custom Report</h3>
              <p className="text-gray-300">
                Personalized PDF report with actionable recommendations
              </p>
            </CardContent>
          </Card>

          <Card className="bg-space border-gold/20">
            <CardContent className="p-6">
              <Clock className="h-12 w-12 text-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">ROI Timeline</h3>
              <p className="text-gray-300">
                Projected timeline for implementation and return on investment
              </p>
            </CardContent>
          </Card>

          <Card className="bg-space border-gold/20">
            <CardContent className="p-6">
              <CheckCircle className="h-12 w-12 text-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Strategy Session</h3>
              <p className="text-gray-300">
                30-minute consultation with our process optimization experts
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={openAuditForm}
            className="bg-gold hover:bg-gold-light text-space text-lg px-8 py-6"
          >
            Get Your Free Process Audit
          </Button>
          <p className="text-sm text-gray-400 mt-4">
            No credit card required • Limited time offer • 100% confidential
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuditValueProposition;