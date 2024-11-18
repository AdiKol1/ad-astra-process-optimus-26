import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Control } from "react-hook-form";
import type { AuditFormData } from "@/types/assessment";

interface FormFieldsProps {
  control: Control<AuditFormData>;
}

export const FormFields = ({ control }: FormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="employees" className="text-gold font-semibold">
          Number of Employees
        </Label>
        <Controller
          name="employees"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              id="employees"
              className="bg-space border-gold/20 text-white focus:ring-gold/30 focus:border-gold"
              placeholder="Enter number of employees"
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="processVolume" className="text-gold font-semibold">
          Monthly Transaction Volume
        </Label>
        <Controller
          name="processVolume"
          control={control}
          render={({ field }) => (
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
            >
              <SelectTrigger className="bg-space border-gold/20 text-white">
                <SelectValue placeholder="Select volume range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Less than 100">Less than 100</SelectItem>
                <SelectItem value="100-500">100-500</SelectItem>
                <SelectItem value="501-1000">501-1000</SelectItem>
                <SelectItem value="1001-5000">1001-5000</SelectItem>
                <SelectItem value="More than 5000">More than 5000</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry" className="text-gold font-semibold">
          Industry
        </Label>
        <Controller
          name="industry"
          control={control}
          render={({ field }) => (
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
            >
              <SelectTrigger className="bg-space border-gold/20 text-white">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small_business">Small Business</SelectItem>
                <SelectItem value="real_estate">Real Estate</SelectItem>
                <SelectItem value="construction">Construction/Roofing</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timelineExpectation" className="text-gold font-semibold">
          Implementation Timeline
        </Label>
        <Controller
          name="timelineExpectation"
          control={control}
          render={({ field }) => (
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
            >
              <SelectTrigger className="bg-space border-gold/20 text-white">
                <SelectValue placeholder="Select your timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1_month">1 Month</SelectItem>
                <SelectItem value="3_months">3 Months</SelectItem>
                <SelectItem value="6_months">6 Months</SelectItem>
                <SelectItem value="12_months">12 Months</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );
};