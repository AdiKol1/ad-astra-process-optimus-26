import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { auditFormSchema } from '@/lib/schemas/auditFormSchema';
import type { AuditFormData } from '@/types/assessment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LeadCaptureFormProps {
  onSubmit: (data: AuditFormData) => Promise<void>;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formProgress, setFormProgress] = React.useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control
  } = useForm<AuditFormData>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      industry: 'small_business',
      timelineExpectation: '3_months',
      employees: '',
      processVolume: '',
      message: ''
    }
  });

  // Watch form fields to calculate progress
  React.useEffect(() => {
    const subscription = watch((value) => {
      const filledFields = Object.values(value).filter(Boolean).length;
      const totalFields = Object.keys(value).length;
      setFormProgress((filledFields / totalFields) * 100);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleFormSubmit = async (data: AuditFormData) => {
    console.log('Form submission started:', data);
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Form Progress</span>
          <span>{Math.round(formProgress)}%</span>
        </div>
        <Progress value={formProgress} className="h-2" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="John Doe"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="john@example.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="(555) 555-5555"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select {...register('industry')}>
            <SelectTrigger>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small_business">Small Business</SelectItem>
              <SelectItem value="real_estate">Real Estate</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.industry && (
            <p className="text-sm text-red-500">{errors.industry.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="timelineExpectation">Implementation Timeline</Label>
          <Select {...register('timelineExpectation')}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1_month">Within 1 Month</SelectItem>
              <SelectItem value="3_months">Within 3 Months</SelectItem>
              <SelectItem value="6_months">Within 6 Months</SelectItem>
              <SelectItem value="12_months">Within 12 Months</SelectItem>
            </SelectContent>
          </Select>
          {errors.timelineExpectation && (
            <p className="text-sm text-red-500">{errors.timelineExpectation.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Additional Information (Optional)</Label>
          <textarea
            id="message"
            {...register('message')}
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Tell us more about your needs..."
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner className="h-4 w-4" />
            Processing...
          </div>
        ) : (
          'Get Your Free Assessment'
        )}
      </Button>
    </form>
  );
};

export default LeadCaptureForm;