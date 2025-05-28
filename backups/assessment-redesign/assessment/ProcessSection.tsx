import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { telemetry } from '@/lib/telemetry';
import { useAssessmentStore } from '@/contexts/assessment/store';
import { Industry } from '@/types/assessment';

const processSchema = z.object({
  processName: z.string().min(1, 'Process name is required'),
  processVolume: z.string().min(1, 'Process volume is required'),
  timeSpent: z.string().min(1, 'Time spent is required'),
  errorRate: z.string().min(1, 'Error rate is required'),
  manualProcesses: z.string().min(1, 'Manual processes percentage is required'),
  industry: z.nativeEnum(Industry, { errorMap: () => ({ message: 'Industry is required' }) }),
  challenges: z.string().min(1, 'Challenges description is required'),
  currentTools: z.string().optional(),
  additionalInfo: z.string().optional(),
  teamSize: z.string().min(1, 'Team size is required'),
});

type ProcessFormData = z.infer<typeof processSchema>;

interface ProcessSectionProps {
  onComplete: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onComplete }) => {
  const { updateResponses } = useAssessmentStore();
  const form = useForm<ProcessFormData>({
    resolver: zodResolver(processSchema),
    defaultValues: {
      processName: '',
      processVolume: '',
      timeSpent: '',
      errorRate: '',
      manualProcesses: '',
      industry: undefined,
      challenges: '',
      currentTools: '',
      additionalInfo: '',
      teamSize: '',
    },
  });

  const onSubmit = (data: ProcessFormData) => {
    updateResponses(data);
    telemetry.track('process_form_submitted', { industry: data.industry });
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Process Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="processName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Process Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter process name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="processVolume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Volume</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter monthly volume" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeSpent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Spent (hours/month)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter time spent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="errorRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Error Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter error rate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manualProcesses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manual Processes (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter manual processes percentage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Size</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter team size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Industry).map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="challenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Challenges</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the main challenges in your current process"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentTools"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Tools</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the tools currently used in this process (optional)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information about your process (optional)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" size="lg">
                Run Assessment
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
