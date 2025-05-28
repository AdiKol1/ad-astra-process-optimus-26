import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { auditFormSchema } from '@/lib/schemas/auditFormSchema';
import type { AuditFormData } from '@/lib/schemas/auditFormSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Briefcase, Phone, Users, Calendar, Clock, Info, AlertCircle, User, Mail, BarChart2, Shield, Lock, ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { telemetry } from '@/utils/monitoring/telemetry';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Textarea,
} from '@/components/ui/textarea';
import {
  MessageSquare,
  Building2,
} from 'lucide-react';
import {
  Loader2,
} from 'lucide-react';

interface LeadCaptureFormProps {
  onSubmit: (data: AuditFormData) => Promise<void>;
}

// Progress messages based on completion percentage
const PROGRESS_MESSAGES = [
  { threshold: 0, message: "Let's get started!" },
  { threshold: 25, message: "Great start! Keep going." },
  { threshold: 50, message: "Halfway there! You're doing great." },
  { threshold: 75, message: "Almost complete! Just a few more fields." },
  { threshold: 90, message: "You're all set! Submit your form when ready." },
];

// Define industry options as literal types
type Industry = 'small_business' | 'real_estate' | 'construction' | 'legal' | 'healthcare' | 'other';
type TimelineExpectation = '1_month' | '3_months' | '6_months' | '12_months';

// Industry-specific default values
interface IndustryDefaults {
  processVolume: string;
  timelineExpectation: TimelineExpectation;
  employees: string;
  industrySpecificMessage: string;
}

// Industry-specific defaults based on industry selection
const INDUSTRY_DEFAULTS: Record<Industry, IndustryDefaults> = {
  small_business: {
    processVolume: '0-50',
    timelineExpectation: '1_month',
    employees: '1-10',
    industrySpecificMessage: 'Small businesses typically benefit from process automation to compete with larger companies.'
  },
  real_estate: {
    processVolume: '51-200',
    timelineExpectation: '3_months',
    employees: '11-50',
    industrySpecificMessage: 'Real estate companies often see ROI in document processing and client communications.'
  },
  construction: {
    processVolume: '51-200',
    timelineExpectation: '6_months',
    employees: '51-200',
    industrySpecificMessage: 'Construction firms benefit from project management and resource allocation optimization.'
  },
  legal: {
    processVolume: '201-500',
    timelineExpectation: '3_months',
    employees: '11-50',
    industrySpecificMessage: 'Legal firms can save significant time through document automation and client intake processes.'
  },
  healthcare: {
    processVolume: '501-1000',
    timelineExpectation: '6_months',
    employees: '51-200',
    industrySpecificMessage: 'Healthcare organizations often see major improvements in patient processing and administrative tasks.'
  },
  other: {
    processVolume: '51-200',
    timelineExpectation: '3_months',
    employees: '11-50',
    industrySpecificMessage: 'Most organizations can achieve 30-40% efficiency gains through process optimization.'
  }
};

function getProgressMessage(progress: number): string {
  // Find the appropriate message based on progress percentage
  const message = PROGRESS_MESSAGES
    .filter(m => m.threshold <= progress)
    .sort((a, b) => b.threshold - a.threshold)[0];
  
  return message?.message || PROGRESS_MESSAGES[0].message;
}

// Format phone number as user types
function formatPhoneNumber(value: string): string {
  // Remove all non-numeric characters
  const phoneNumber = value.replace(/\D/g, '');
  
  // Apply formatting based on length
  if (phoneNumber.length < 4) {
    return phoneNumber;
  } else if (phoneNumber.length < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
}

// Style enhancement: Add a Card wrapper component with improved styling
const FormCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn(
    "bg-white border rounded-xl shadow-lg overflow-hidden transition-all",
    "hover:shadow-xl hover:border-blue-100",
    className
  )}>
    {children}
  </div>
);

// Style enhancement: Styled field container
const FieldWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn("mb-6", className)}>
    {children}
  </div>
);

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [phoneValue, setPhoneValue] = useState('');
  const [progressMessage, setProgressMessage] = useState(PROGRESS_MESSAGES[0].message);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>('small_business');
  const [industrySpecificMessage, setIndustrySpecificMessage] = useState<string>(
    INDUSTRY_DEFAULTS.small_business.industrySpecificMessage
  );
  const [showIndustryTooltip, setShowIndustryTooltip] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, dirtyFields },
    control,
    reset
  } = useForm<AuditFormData>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      industry: 'small_business',
      timelineExpectation: INDUSTRY_DEFAULTS.small_business.timelineExpectation,
      employees: INDUSTRY_DEFAULTS.small_business.employees,
      processVolume: INDUSTRY_DEFAULTS.small_business.processVolume,
      message: ''
    },
    mode: 'onChange'
  });

  // Handle industry change to update defaults
  const handleIndustryChange = (value: Industry) => {
    const industryDefaults = INDUSTRY_DEFAULTS[value];
    
    // Update form values with industry-specific defaults
    setValue('industry', value);
    setValue('timelineExpectation', industryDefaults.timelineExpectation);
    setValue('employees', industryDefaults.employees);
    setValue('processVolume', industryDefaults.processVolume);
    
    // Update UI state
    setSelectedIndustry(value);
    setIndustrySpecificMessage(industryDefaults.industrySpecificMessage);
    setShowIndustryTooltip(true);
    
    // Hide tooltip after 5 seconds
    setTimeout(() => {
      setShowIndustryTooltip(false);
    }, 5000);
    
    // Track the industry change in telemetry
    telemetry.track('industry_selected', {
      industry: value,
      defaults_applied: true
    });
  };

  // Watch form fields to calculate progress
  useEffect(() => {
    const subscription = watch((value) => {
      // Count filled fields (with valid values)
      const requiredFields = ['name', 'email', 'industry', 'timelineExpectation'];
      const dirtyFieldsCount = Object.keys(dirtyFields).length;
      const totalRequiredFields = requiredFields.length;
      
      // Calculate progress percentage
      const calculatedProgress = Math.min(
        100, 
        Math.round((dirtyFieldsCount / totalRequiredFields) * 100)
      );
      
      setFormProgress(calculatedProgress);
      setProgressMessage(getProgressMessage(calculatedProgress));
      
      // Track progress in telemetry
      if (calculatedProgress > 0 && calculatedProgress % 25 === 0) {
        telemetry.track('lead_form_progress', {
          progress: calculatedProgress,
          filledFields: dirtyFieldsCount,
          requiredFields: totalRequiredFields
        });
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch, dirtyFields]);

  // Handle phone number formatting
  useEffect(() => {
    setValue('phone', phoneValue);
  }, [phoneValue, setValue]);

  const handleFormSubmit = async (data: AuditFormData) => {
    setIsSubmitting(true);
    try {
      telemetry.track('lead_form_submitted', {
        hasPhone: !!data.phone,
        hasMessage: !!data.message,
        industry: data.industry,
        timeline: data.timelineExpectation
      });
      
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format phone number as user types
    const formattedValue = formatPhoneNumber(e.target.value);
    setPhoneValue(formattedValue);
  };

  const getFormSectionAnimation = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.3 }
  });

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full max-w-5xl mx-auto">
      {/* Progress tracker - enhanced styling */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-800">Form Completion</h3>
          <span className="text-sm font-medium text-blue-700">{Math.round(formProgress)}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${Math.round(formProgress)}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">{progressMessage}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Left Column */}
        <motion.div 
          {...getFormSectionAnimation(0.1)}
          className="space-y-6"
        >
          <FormCard className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-500" />
              Personal Information
            </h3>

            <FieldWrapper>
              <FormLabel htmlFor="name" className="text-gray-700 font-medium">
                Your Name <span className="text-red-500">*</span>
              </FormLabel>
              <div className="relative">
                <span className="absolute left-3 inset-y-0 flex items-center text-gray-400">
                  <User className="h-4 w-4" />
                </span>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...register("name")}
                    className="pl-10 py-3 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all"
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500 text-sm mt-1" />
            </FieldWrapper>

            <FieldWrapper>
              <FormLabel htmlFor="email" className="text-gray-700 font-medium">
                Email Address <span className="text-red-500">*</span>
              </FormLabel>
              <div className="relative">
                <span className="absolute left-3 inset-y-0 flex items-center text-gray-400">
                  <Mail className="h-4 w-4" />
                </span>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    {...register("email")}
                    className="pl-10 py-3 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all"
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500 text-sm mt-1" />
            </FieldWrapper>

            <FieldWrapper>
              <FormLabel htmlFor="phone" className="text-gray-700 font-medium">
                Phone Number <span className="text-red-500">*</span>
              </FormLabel>
              <div className="relative">
                <span className="absolute left-3 inset-y-0 flex items-center text-gray-400">
                  <Phone className="h-4 w-4" />
                </span>
                <FormControl>
                  <Input
                    placeholder="(555) 123-4567"
                    {...register("phone")}
                    onChange={handlePhoneChange}
                    className="pl-10 py-3 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all"
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500 text-sm mt-1" />
            </FieldWrapper>
          </FormCard>

          <FormCard className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
              Additional Details
            </h3>
            
            <FieldWrapper>
              <FormLabel htmlFor="message" className="text-gray-700 font-medium">
                Additional Information
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us more about your specific needs or challenges..."
                  {...register("message")}
                  className="min-h-32 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all resize-y"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm mt-1" />
            </FieldWrapper>
          </FormCard>
        </motion.div>

        {/* Right Column */}
        <motion.div 
          {...getFormSectionAnimation(0.2)}
          className="space-y-6"
        >
          <FormCard className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-blue-500" />
              Business Information
            </h3>

            <FieldWrapper>
              <FormLabel htmlFor="industry" className="text-gray-700 font-medium">
                Industry <span className="text-red-500">*</span>
              </FormLabel>
              <Controller
                name="industry"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleIndustryChange(value as Industry);
                    }} 
                    value={field.value}
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-3 flex items-center text-gray-400">
                        <Briefcase className="h-4 w-4" />
                      </span>
                      <FormControl>
                        <SelectTrigger className="pl-10 py-6 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                      </FormControl>
                    </div>
                    <SelectContent className="bg-white border-gray-200 rounded-lg shadow-lg max-h-80">
                      <SelectGroup>
                        <SelectLabel className="text-gray-500 font-medium">Industries</SelectLabel>
                        <SelectItem value="small_business" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">
                          Small Business
                        </SelectItem>
                        <SelectItem value="real_estate" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">
                          Real Estate
                        </SelectItem>
                        <SelectItem value="construction" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">
                          Construction
                        </SelectItem>
                        <SelectItem value="legal" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">
                          Legal
                        </SelectItem>
                        <SelectItem value="healthcare" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">
                          Healthcare
                        </SelectItem>
                        <SelectItem value="other" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">
                          Other
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-sm mt-2 text-indigo-600 font-medium">
                {INDUSTRY_DEFAULTS[watch("industry") as Industry]?.industrySpecificMessage || ""}
              </p>
              <FormMessage className="text-red-500 text-sm mt-1" />
            </FieldWrapper>

            <FieldWrapper>
              <FormLabel htmlFor="employees" className="text-gray-700 font-medium">
                Number of Employees <span className="text-red-500">*</span>
              </FormLabel>
              <Controller
                name="employees"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-3 flex items-center text-gray-400">
                        <Users className="h-4 w-4" />
                      </span>
                      <FormControl>
                        <SelectTrigger className="pl-10 py-6 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                      </FormControl>
                    </div>
                    <SelectContent className="bg-white border-gray-200 rounded-lg shadow-lg">
                      <SelectGroup>
                        <SelectLabel className="text-gray-500 font-medium">Company Size</SelectLabel>
                        <SelectItem value="1-10" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">1-10 employees</SelectItem>
                        <SelectItem value="11-50" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">11-50 employees</SelectItem>
                        <SelectItem value="51-200" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">51-200 employees</SelectItem>
                        <SelectItem value="201-500" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">201-500 employees</SelectItem>
                        <SelectItem value="501-1000" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">501-1000 employees</SelectItem>
                        <SelectItem value="1000+" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">1000+ employees</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <FormMessage className="text-red-500 text-sm mt-1" />
            </FieldWrapper>

            <FieldWrapper>
              <FormLabel htmlFor="timelineExpectation" className="text-gray-700 font-medium">
                Implementation Timeline <span className="text-red-500">*</span>
              </FormLabel>
              <Controller
                name="timelineExpectation"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-3 flex items-center text-gray-400">
                        <Calendar className="h-4 w-4" />
                      </span>
                      <FormControl>
                        <SelectTrigger className="pl-10 py-6 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all">
                          <SelectValue placeholder="Select expected timeline" />
                        </SelectTrigger>
                      </FormControl>
                    </div>
                    <SelectContent className="bg-white border-gray-200 rounded-lg shadow-lg">
                      <SelectGroup>
                        <SelectLabel className="text-gray-500 font-medium">Implementation Timeline</SelectLabel>
                        <SelectItem value="1_month" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">Within 1 month</SelectItem>
                        <SelectItem value="3_months" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">1-3 months</SelectItem>
                        <SelectItem value="6_months" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">3-6 months</SelectItem>
                        <SelectItem value="12_months" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">6-12 months</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <FormMessage className="text-red-500 text-sm mt-1" />
            </FieldWrapper>

            <FieldWrapper>
              <FormLabel htmlFor="processVolume" className="text-gray-700 font-medium">
                Monthly Process Volume <span className="text-red-500">*</span>
              </FormLabel>
              <Controller
                name="processVolume"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-3 flex items-center text-gray-400">
                        <BarChart2 className="h-4 w-4" />
                      </span>
                      <FormControl>
                        <SelectTrigger className="pl-10 py-6 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all">
                          <SelectValue placeholder="Select process volume" />
                        </SelectTrigger>
                      </FormControl>
                    </div>
                    <SelectContent className="bg-white border-gray-200 rounded-lg shadow-lg">
                      <SelectGroup>
                        <SelectLabel className="text-gray-500 font-medium">Process Volume</SelectLabel>
                        <SelectItem value="0-50" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">0-50 processes</SelectItem>
                        <SelectItem value="51-100" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">51-100 processes</SelectItem>
                        <SelectItem value="101-500" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">101-500 processes</SelectItem>
                        <SelectItem value="500+" className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-2">500+ processes</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <FormMessage className="text-red-500 text-sm mt-1" />
            </FieldWrapper>
          </FormCard>

          <FormCard className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <Shield className="mr-2 h-5 w-5 text-blue-500" />
              Trust & Privacy
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-2 mt-1">
                  <Shield className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-sm text-gray-600">
                  Your information is secure and will never be shared with third parties without your permission.
                </p>
              </div>
              <div className="flex items-start">
                <div className="mr-2 mt-1">
                  <Lock className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-sm text-gray-600">
                  All data is encrypted and stored securely according to industry best practices.
                </p>
              </div>
            </div>
          </FormCard>
        </motion.div>
      </div>

      <motion.div 
        {...getFormSectionAnimation(0.3)}
        className="mt-8 flex justify-center"
      >
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
};

export default LeadCaptureForm;
