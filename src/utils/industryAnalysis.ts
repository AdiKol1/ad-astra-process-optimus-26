import { AI_CONFIG } from './aiConfig';

export interface IndustryAnalysis {
  benchmarks: {
    averageProcessingTime: string;
    errorRates: string;
    automationLevel: string;
    costSavings: string;
  };
  opportunities: string[];
  risks: string[];
  trends: string[];
}

const generateIndustryPrompt = (industry: string) => `
As an expert automation and process optimization consultant, analyze the ${industry} industry.
Focus on automation and digital transformation opportunities.

Provide detailed analysis for:

1. Industry Benchmarks:
   - Average processing time for common business processes
   - Typical error rates in manual processes
   - Current automation adoption level across the industry
   - Average cost savings achieved through automation initiatives

2. Key Automation Opportunities:
   - Identify specific processes that commonly benefit from automation
   - Areas where manual work creates bottlenecks
   - Processes with high error rates
   - Tasks that could benefit from AI/ML integration

3. Implementation Risks:
   - Common challenges in automation adoption
   - Regulatory compliance considerations
   - Change management issues
   - Technical integration challenges

4. Industry Trends:
   - Emerging automation technologies
   - Successful automation case studies
   - Digital transformation initiatives
   - Market leaders' automation strategies

Format the response as a JSON object matching this structure:
{
  "benchmarks": {
    "averageProcessingTime": "string",
    "errorRates": "string",
    "automationLevel": "string",
    "costSavings": "string"
  },
  "opportunities": ["string"],
  "risks": ["string"],
  "trends": ["string"]
}

Focus on actionable insights and quantifiable metrics where possible.
`;

const generateCompliancePrompt = (industry: string) => `
As a compliance and regulatory expert, provide detailed analysis of automation-related compliance requirements for the ${industry} industry.

Focus on:
1. Specific regulations affecting process automation
2. Data handling requirements
3. Security standards
4. Documentation requirements
5. Audit trail needs
6. Industry-specific certifications needed

Include references to relevant regulatory bodies and standards.
Highlight critical compliance risks and mitigation strategies.
Format as clear, actionable bullet points.
`;

export const getIndustryAnalysis = async (industry: string): Promise<IndustryAnalysis> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.openai.apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.openai.model,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert automation consultant with deep knowledge of industry-specific processes, compliance requirements, and optimization opportunities.'
          },
          { 
            role: 'user', 
            content: generateIndustryPrompt(industry) 
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch industry analysis');
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error fetching industry analysis:', error);
    return {
      benchmarks: {
        averageProcessingTime: 'Data unavailable',
        errorRates: 'Data unavailable',
        automationLevel: 'Data unavailable',
        costSavings: 'Data unavailable'
      },
      opportunities: ['Data unavailable'],
      risks: ['Data unavailable'],
      trends: ['Data unavailable']
    };
  }
};

export const getComplianceRequirements = async (industry: string): Promise<string[]> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.openai.apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.openai.model,
        messages: [
          { 
            role: 'system', 
            content: 'You are a compliance expert specializing in regulatory requirements for process automation and digital transformation.'
          },
          { 
            role: 'user', 
            content: generateCompliancePrompt(industry) 
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch compliance requirements');
    }

    const data = await response.json();
    return data.choices[0].message.content.split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error fetching compliance requirements:', error);
    return ['Unable to fetch compliance requirements'];
  }
};