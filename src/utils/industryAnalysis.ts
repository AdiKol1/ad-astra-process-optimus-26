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
Analyze the following industry: ${industry}
Provide specific metrics and insights about:
1. Industry benchmarks for:
   - Average processing time for common tasks
   - Typical error rates
   - Current automation adoption level
   - Average cost savings from automation
2. Key opportunities for process optimization
3. Common operational risks
4. Current industry trends
Format as JSON matching the IndustryAnalysis interface.
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
          { role: 'system', content: 'You are an industry analysis expert.' },
          { role: 'user', content: generateIndustryPrompt(industry) }
        ]
      })
    });

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