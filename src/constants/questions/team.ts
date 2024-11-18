export const teamQuestions = {
  title: "Team Structure & Resource Analysis",
  questions: [
    // Team Composition
    {
      id: "teamSize",
      type: "number",
      label: "Total team size",
      required: true,
      min: 1
    },
    {
      id: "departments",
      type: "multiSelect",
      label: "Which departments are involved?",
      options: [
        "Operations",
        "Finance",
        "HR",
        "Sales",
        "Customer Service",
        "IT",
        "Management"
      ],
      required: true
    },
    {
      id: "roleBreakdown",
      type: "multiInput",
      label: "Number of team members by role",
      description: "This helps us calculate more accurate cost savings by role",
      fields: [
        { id: "managers", label: "Managers/Supervisors" },
        { id: "specialists", label: "Specialists/Technical Staff" },
        { id: "operators", label: "Operators/General Staff" }
      ],
      required: true
    },

    // Time Allocation
    {
      id: "hoursPerWeek",
      type: "number",
      label: "Average working hours per week",
      required: true,
      min: 1,
      max: 168,
      default: 40
    },
    {
      id: "overtimeHours",
      type: "number",
      label: "Average overtime hours per week (if applicable)",
      description: "Used to calculate potential overtime reduction",
      required: false,
      min: 0,
      default: 0
    },
    {
      id: "weeksPerYear",
      type: "number",
      label: "Working weeks per year",
      required: true,
      min: 1,
      max: 52,
      default: 52
    },

    // Cost Structure
    {
      id: "hourlyRates",
      type: "multiInput",
      label: "Average hourly rates by role (including benefits)",
      description: "Include base salary, benefits, and overhead costs",
      fields: [
        { id: "managerRate", label: "Manager Rate" },
        { id: "specialistRate", label: "Specialist Rate" },
        { id: "operatorRate", label: "Operator Rate" }
      ],
      required: true
    },
    {
      id: "overtimeRate",
      type: "number",
      label: "Overtime hourly rate multiplier",
      description: "E.g., 1.5 for time-and-a-half",
      required: false,
      min: 1,
      default: 1.5
    },

    // Process Costs
    {
      id: "toolingCosts",
      type: "number",
      label: "Monthly software/tools cost",
      description: "Current spending on tools and software licenses",
      required: true,
      min: 0
    },
    {
      id: "trainingCosts",
      type: "number",
      label: "Annual training/onboarding costs",
      description: "Including new hire training and ongoing skill development",
      required: true,
      min: 0
    },

    // Revenue & Value Metrics
    {
      id: "annualRevenue",
      type: "number",
      label: "Annual revenue from this process/department",
      description: "Used to calculate potential revenue impact of improvements",
      required: true,
      min: 0
    },
    {
      id: "revenueGrowthTarget",
      type: "number",
      label: "Target revenue growth percentage",
      description: "Your annual revenue growth target",
      required: false,
      min: 0,
      max: 100
    },
    {
      id: "processValue",
      type: "multiSelect",
      label: "Value drivers for this process",
      description: "Select all that apply",
      options: [
        "Direct Revenue Generation",
        "Cost Reduction",
        "Customer Satisfaction",
        "Employee Productivity",
        "Quality Improvement",
        "Compliance/Risk Management"
      ],
      required: true
    },

    // Efficiency Metrics
    {
      id: "errorRate",
      type: "number",
      label: "Current error/rework rate (%)",
      description: "Percentage of work that needs correction/rework",
      required: false,
      min: 0,
      max: 100
    },
    {
      id: "processBacklog",
      type: "number",
      label: "Average backlog (hours)",
      description: "Typical backlog of pending work in hours",
      required: false,
      min: 0
    }
  ]
};