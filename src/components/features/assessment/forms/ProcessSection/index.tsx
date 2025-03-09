import { cn } from "@/lib/utils";
import { 
  Clock, ArrowRight, ArrowLeft, CheckCircle2, 
  FileText, Settings, Users, Zap, BarChart2, 
  PieChart, Activity, AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

// Styled components for enhanced UI
const FormCard = ({ children, className }) => (
  <div className={cn(
    "bg-white border border-gray-200 rounded-xl shadow-md p-6 mb-6",
    "hover:shadow-lg transition-all duration-300",
    className
  )}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="mb-6">
    <div className="flex items-center mb-2">
      {Icon && (
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    {description && (
      <p className="text-gray-600 text-sm ml-10">{description}</p>
    )}
  </div>
);

const ProcessSectionForm: React.FC<ProcessSectionFormProps> = ({ onSubmit, onBack }) => {
  // ... existing code ...

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-5xl mx-auto">
      {/* Progress tracker */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-800">Form Completion</h3>
          <span className="text-sm font-medium text-blue-700">{Math.round(formProgress)}%</span>
        </div>
        <div className="flex items-center mb-2">
          <Clock className="h-4 w-4 mr-2 text-blue-600" />
          <span className="text-sm text-gray-600">
            Estimated time: 3-5 minutes
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${Math.round(formProgress)}%` }}
          />
        </div>
      </div>

      {/* Process Information Section */}
      <FormCard>
        <SectionHeader 
          icon={FileText}
          title="Basic Process Information" 
          description="Tell us about the process you want to optimize"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="processName" className="text-gray-700 font-medium flex items-center">
                Process Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative mt-1">
                <Input
                  id="processName"
                  placeholder="E.g., Invoice Processing, Client Onboarding..."
                  {...register("processName")}
                  className={cn(
                    "py-3 px-4 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full",
                    errors.processName ? "border-red-500" : ""
                  )}
                />
              </div>
              {errors.processName && (
                <p className="text-sm text-red-500 mt-1">{errors.processName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="processType" className="text-gray-700 font-medium flex items-center">
                Process Type <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative mt-1">
                <Controller
                  name="processType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="processType" className="py-3 px-4 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select process type" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200 rounded-lg shadow-lg">
                        <SelectItem value="approval" className="py-2 hover:bg-blue-50">Approval Process</SelectItem>
                        <SelectItem value="documentation" className="py-2 hover:bg-blue-50">Documentation</SelectItem>
                        <SelectItem value="onboarding" className="py-2 hover:bg-blue-50">Onboarding</SelectItem>
                        <SelectItem value="reporting" className="py-2 hover:bg-blue-50">Reporting</SelectItem>
                        <SelectItem value="customer_service" className="py-2 hover:bg-blue-50">Customer Service</SelectItem>
                        <SelectItem value="data_entry" className="py-2 hover:bg-blue-50">Data Entry</SelectItem>
                        <SelectItem value="other" className="py-2 hover:bg-blue-50">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {errors.processType && (
                <p className="text-sm text-red-500 mt-1">{errors.processType.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="processFrequency" className="text-gray-700 font-medium flex items-center">
                How often is this process performed? <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative mt-1">
                <Controller
                  name="processFrequency"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="processFrequency" className="py-3 px-4 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200 rounded-lg shadow-lg">
                        <SelectItem value="daily" className="py-2 hover:bg-blue-50">Daily</SelectItem>
                        <SelectItem value="weekly" className="py-2 hover:bg-blue-50">Weekly</SelectItem>
                        <SelectItem value="monthly" className="py-2 hover:bg-blue-50">Monthly</SelectItem>
                        <SelectItem value="quarterly" className="py-2 hover:bg-blue-50">Quarterly</SelectItem>
                        <SelectItem value="yearly" className="py-2 hover:bg-blue-50">Yearly</SelectItem>
                        <SelectItem value="ad_hoc" className="py-2 hover:bg-blue-50">Ad-hoc / As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {errors.processFrequency && (
                <p className="text-sm text-red-500 mt-1">{errors.processFrequency.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="processVolume" className="text-gray-700 font-medium flex items-center">
                Approximate volume per month <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative mt-1">
                <Controller
                  name="processVolume"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="processVolume" className="py-3 px-4 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select volume" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200 rounded-lg shadow-lg">
                        <SelectItem value="1-10" className="py-2 hover:bg-blue-50">1-10 instances</SelectItem>
                        <SelectItem value="11-50" className="py-2 hover:bg-blue-50">11-50 instances</SelectItem>
                        <SelectItem value="51-100" className="py-2 hover:bg-blue-50">51-100 instances</SelectItem>
                        <SelectItem value="101-500" className="py-2 hover:bg-blue-50">101-500 instances</SelectItem>
                        <SelectItem value="500+" className="py-2 hover:bg-blue-50">500+ instances</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {errors.processVolume && (
                <p className="text-sm text-red-500 mt-1">{errors.processVolume.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="processDescription" className="text-gray-700 font-medium flex items-center">
            Process Description <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative mt-1">
            <Textarea
              id="processDescription"
              placeholder="Briefly describe the steps involved in this process..."
              {...register("processDescription")}
              className={cn(
                "min-h-28 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full resize-y",
                errors.processDescription ? "border-red-500" : ""
              )}
            />
          </div>
          {errors.processDescription && (
            <p className="text-sm text-red-500 mt-1">{errors.processDescription.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1 italic">
            Include key steps, inputs, outputs, and any known bottlenecks or pain points.
          </p>
        </div>
      </FormCard>

      {/* Current Challenges Section */}
      <FormCard>
        <SectionHeader 
          icon={AlertTriangle}
          title="Current Challenges" 
          description="What issues are you currently facing with this process?"
        />

        <div className="space-y-6">
          <div>
            <Label className="text-gray-700 font-medium">
              Select all that apply:
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Time consuming"
                  register={register}
                  name="challenges.timeConsuming"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Error prone"
                  register={register}
                  name="challenges.errorProne"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Lacks visibility"
                  register={register}
                  name="challenges.lacksVisibility"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Manual data entry"
                  register={register}
                  name="challenges.manualDataEntry"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Compliance issues"
                  register={register}
                  name="challenges.complianceIssues"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Communication gaps"
                  register={register}
                  name="challenges.communicationGaps"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Inconsistent execution"
                  register={register}
                  name="challenges.inconsistentExecution"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Customer complaints"
                  register={register}
                  name="challenges.customerComplaints"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="otherChallenges" className="text-gray-700 font-medium">
              Other challenges (optional)
            </Label>
            <div className="relative mt-1">
              <Textarea
                id="otherChallenges"
                placeholder="Any other challenges not listed above..."
                {...register("otherChallenges")}
                className="min-h-24 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full resize-y"
              />
            </div>
          </div>
        </div>
      </FormCard>

      {/* Current Tools Section */}
      <FormCard>
        <SectionHeader 
          icon={Settings}
          title="Current Tools & Systems" 
          description="What tools or systems are currently used in this process?"
        />

        <div className="space-y-6">
          <div>
            <Label className="text-gray-700 font-medium">
              Select all that apply:
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Spreadsheets (Excel, Google Sheets)"
                  register={register}
                  name="currentTools.spreadsheets"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Email"
                  register={register}
                  name="currentTools.email"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Paper forms/documents"
                  register={register}
                  name="currentTools.paperForms"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="CRM software"
                  register={register}
                  name="currentTools.crm"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Project management tools"
                  register={register}
                  name="currentTools.projectManagement"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="ERP system"
                  register={register}
                  name="currentTools.erp"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Custom software"
                  register={register}
                  name="currentTools.customSoftware"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Shared drives/folders"
                  register={register}
                  name="currentTools.sharedDrives"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="otherTools" className="text-gray-700 font-medium">
              Other tools (optional)
            </Label>
            <div className="relative mt-1">
              <Input
                id="otherTools"
                placeholder="Any other tools not listed above..."
                {...register("otherTools")}
                className="py-3 px-4 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
          </div>
        </div>
      </FormCard>

      {/* Improvement Goals Section */}
      <FormCard>
        <SectionHeader 
          icon={BarChart2}
          title="Improvement Goals" 
          description="What are your primary goals for improving this process?"
        />

        <div className="space-y-6">
          <div>
            <Label className="text-gray-700 font-medium">
              Select all that apply:
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Reduce processing time"
                  register={register}
                  name="improvementGoals.reduceTime"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Reduce errors"
                  register={register}
                  name="improvementGoals.reduceErrors"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Improve customer satisfaction"
                  register={register}
                  name="improvementGoals.improveCustomerSatisfaction"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Increase transparency"
                  register={register}
                  name="improvementGoals.increaseTransparency"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Reduce costs"
                  register={register}
                  name="improvementGoals.reduceCosts"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Improve compliance"
                  register={register}
                  name="improvementGoals.improveCompliance"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Scale the process"
                  register={register}
                  name="improvementGoals.scaleProcess"
                />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all p-3">
                <CheckboxItem
                  label="Improve data quality"
                  register={register}
                  name="improvementGoals.improveDataQuality"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="successMeasurement" className="text-gray-700 font-medium flex items-center">
              How will you measure success? <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative mt-1">
              <Textarea
                id="successMeasurement"
                placeholder="E.g., 30% reduction in processing time, zero errors in data entry..."
                {...register("successMeasurement")}
                className={cn(
                  "min-h-24 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full resize-y",
                  errors.successMeasurement ? "border-red-500" : ""
                )}
              />
            </div>
            {errors.successMeasurement && (
              <p className="text-sm text-red-500 mt-1">{errors.successMeasurement.message}</p>
            )}
          </div>
        </div>
      </FormCard>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Loader2 className="h-4 w-4" />
              </motion.div>
              Submitting...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

// Helper component for checkboxes with improved styling
const CheckboxItem = ({ label, register, name }) => {
  return (
    <div className="flex items-start">
      <Checkbox
        id={name}
        {...register(name)}
        className="mr-2 mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <Label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
};

// ... existing code ... 