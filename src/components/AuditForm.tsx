import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  industry: z.enum(["real_estate", "small_business", "other"]),
  employeeCount: z.string(),
  currentProcesses: z.string().min(10, "Please provide more detail about your current processes"),
  biggestChallenge: z.string().min(10, "Please describe your challenge in more detail"),
  idealOutcome: z.string().min(10, "Please describe your ideal outcome"),
  timelineExpectation: z.enum(["1_month", "3_months", "6_months", "flexible"]),
});

const AuditForm = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "small_business",
      timelineExpectation: "3_months",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real application, this would send the data to your backend
    console.log(values);
    toast({
      title: "Audit Request Received!",
      description: "Our team will analyze your information and send you a comprehensive report within 24 hours.",
    });
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/10 backdrop-blur-lg rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Business Process Audit</h2>
      <p className="text-gray-300 mb-8 text-center">Complete this 10-minute assessment to receive your free comprehensive process optimization report (Worth $1,500)</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Company" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Role</FormLabel>
                  <FormControl>
                    <Input placeholder="CEO / Manager / Agent" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-6" />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="real_estate" />
                      </FormControl>
                      <FormLabel className="font-normal">Real Estate</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="small_business" />
                      </FormControl>
                      <FormLabel className="font-normal">Small/Medium Business</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="other" />
                      </FormControl>
                      <FormLabel className="font-normal">Other</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employeeCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Employees/Team Members</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 5-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentProcesses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Describe your current business processes and workflows</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What tools do you use? How do you manage tasks? What's your daily workflow like?"
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
            name="biggestChallenge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What's your biggest operational challenge right now?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What's the one problem that, if solved, would make everything else easier?"
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
            name="idealOutcome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What does success look like for you?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your ideal scenario after implementing process improvements"
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
            name="timelineExpectation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>When would you like to see results?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="1_month" />
                      </FormControl>
                      <FormLabel className="font-normal">Within 1 month</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="3_months" />
                      </FormControl>
                      <FormLabel className="font-normal">Within 3 months</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="6_months" />
                      </FormControl>
                      <FormLabel className="font-normal">Within 6 months</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="flexible" />
                      </FormControl>
                      <FormLabel className="font-normal">Flexible</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-gold hover:bg-gold-light text-space text-lg py-6">
            Get Your Free Process Audit Report
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AuditForm;