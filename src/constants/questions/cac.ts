export const cacQuestions = {
  title: "Customer Acquisition",
  description: "Help us understand your customer acquisition costs",
  questions: [
    {
      id: "marketing_spend",
      text: "What's your monthly marketing and sales spend?",
      type: "select",
      options: [
        "Less than $1,000",
        "$1,000 - $5,000",
        "$5,000 - $20,000",
        "More than $20,000"
      ],
      required: true
    },
    {
      id: "new_customers",
      text: "How many new customers do you typically acquire monthly?",
      type: "select",
      options: [
        "1-5 customers",
        "6-20 customers",
        "21-50 customers",
        "More than 50"
      ],
      required: true
    }
  ]
};