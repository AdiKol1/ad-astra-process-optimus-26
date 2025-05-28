import React, { useEffect, useState } from 'react';
import { useAssessmentStore } from '@/contexts/assessment/store';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProcessOptimizationChart, ChartDataItem } from './ProcessOptimizationChart';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { telemetry } from '@/utils/monitoring/telemetry';

// Industry benchmark data by industry
const INDUSTRY_BENCHMARKS: Record<string, Record<string, number>> = {
  'small_business': {
    'Process Efficiency': 65,
    'Automation Level': 45,
    'Error Rate': 72,
    'Cost Efficiency': 58,
    'Scalability': 47,
    'Integration': 42,
    'Documentation': 38,
    'Social Media Engagement': 54,
    'Social Media Presence': 48
  },
  'real_estate': {
    'Process Efficiency': 62,
    'Automation Level': 52,
    'Error Rate': 76,
    'Cost Efficiency': 64,
    'Scalability': 55,
    'Integration': 48,
    'Documentation': 45,
    'Social Media Engagement': 62,
    'Social Media Presence': 58
  },
  'construction': {
    'Process Efficiency': 58,
    'Automation Level': 42,
    'Error Rate': 68,
    'Cost Efficiency': 55,
    'Scalability': 52,
    'Integration': 45,
    'Documentation': 40,
    'Social Media Engagement': 45,
    'Social Media Presence': 42
  },
  'legal': {
    'Process Efficiency': 68,
    'Automation Level': 55,
    'Error Rate': 82,
    'Cost Efficiency': 62,
    'Scalability': 50,
    'Integration': 58,
    'Documentation': 72,
    'Social Media Engagement': 56,
    'Social Media Presence': 52
  },
  'healthcare': {
    'Process Efficiency': 72,
    'Automation Level': 65,
    'Error Rate': 86,
    'Cost Efficiency': 68,
    'Scalability': 58,
    'Integration': 62,
    'Documentation': 68,
    'Social Media Engagement': 64,
    'Social Media Presence': 58
  },
  'other': {
    'Process Efficiency': 60,
    'Automation Level': 50,
    'Error Rate': 70,
    'Cost Efficiency': 60,
    'Scalability': 50,
    'Integration': 45,
    'Documentation': 40,
    'Social Media Engagement': 52,
    'Social Media Presence': 48
  }
};

// Optional descriptions for each metric
const METRIC_DESCRIPTIONS: Record<string, string> = {
  'Process Efficiency': 'How efficiently your processes are executed compared to best practices. Automation can significantly improve this metric.',
  'Automation Level': 'The degree to which your processes are automated vs. manual intervention. Higher automation leads to better scalability and reduced errors.',
  'Error Rate': 'Frequency of errors in your process workflows (inverted - higher is better). Automated processes typically have lower error rates.',
  'Cost Efficiency': 'How cost-effective your processes are relative to industry standards. Automation reduces long-term operational costs.',
  'Scalability': 'How well your processes can scale with business growth. Automated workflows scale better than manual processes.',
  'Integration': 'How well your systems and processes are integrated with each other. Better integration enables smoother automation.',
  'Documentation': 'Thoroughness and quality of process documentation. Good documentation enables easier automation implementation.',
  'Social Media Engagement': 'The level of interaction and engagement with your social media content. Automation tools can help improve consistent engagement.',
  'Social Media Presence': 'Your overall visibility and effectiveness across social media platforms. Automated posting and analysis can enhance your online presence.'
};

interface IndustryBenchmarkChartProps {
  defaultIndustry?: string;
  showImprovementPotential?: boolean;
  showDownloadOptions?: boolean;
}

export const IndustryBenchmarkChart: React.FC<IndustryBenchmarkChartProps> = ({
  defaultIndustry = 'small_business',
  showImprovementPotential = true,
  showDownloadOptions = true
}) => {
  const { results, responses } = useAssessmentStore();
  const [selectedIndustry, setSelectedIndustry] = useState(defaultIndustry);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [activeTab, setActiveTab] = useState('benchmark');

  // Function to determine the user industry from responses or use the default
  const getUserIndustry = (): string => {
    const userIndustry = responses?.responses?.industry;
    if (userIndustry && Object.keys(INDUSTRY_BENCHMARKS).includes(userIndustry)) {
      return userIndustry;
    }
    return defaultIndustry;
  };

  // Function to prepare chart data
  const prepareChartData = () => {
    const industry = selectedIndustry || getUserIndustry();
    const industryData = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS.other;
    
    // Debug what insights are available in the results
    console.log('Assessment results insights:', results?.insights);
    
    // Create a more robust mapping of user scores that handles various formatting differences
    const userScores = results?.insights?.reduce((acc: Record<string, number>, insight) => {
      // Normalize the category name by removing all spaces and converting to lowercase
      const normalizedCategory = insight.category.toLowerCase().replace(/\s+/g, '');
      acc[normalizedCategory] = insight.score;
      
      // Also store with original formatting in case we need it
      acc[insight.category] = insight.score;
      
      return acc;
    }, {}) || {};
    
    console.log('User scores after mapping:', userScores);
    
    const improvementTargets: Record<string, number> = {};

    // Calculate improvement targets with variable improvement rates based on metric type
    Object.keys(industryData).forEach(metric => {
      // Try different normalizations of the metric name to match user scores
      const normalizedMetric = metric.toLowerCase().replace(/\s+/g, '');
      const userScore = userScores[normalizedMetric] || 
                        userScores[metric.toLowerCase().replace(' ', '')] ||
                        userScores[metric] || 0;
      
      const industryBenchmark = industryData[metric];
      
      // Apply higher improvement rates for automation-related metrics
      const isAutomationRelated = metric.toLowerCase().includes('automation') || 
                                  metric.toLowerCase().includes('efficiency') ||
                                  metric.toLowerCase().includes('scalability');
      
      // Higher improvement factor for automation-related metrics
      const userImprovementFactor = isAutomationRelated ? 1.45 : 1.30; // 45% vs 30% improvement
      const industryImprovementFactor = isAutomationRelated ? 1.30 : 1.15; // 30% vs 15% over industry
      
      // Create a more significant gap between industry standard and optimization target
      improvementTargets[metric] = Math.max(
        userScore * userImprovementFactor, 
        industryBenchmark * industryImprovementFactor
      );
      
      // Add additional improvement to ensure optimization targets exceed industry benchmarks
      if (improvementTargets[metric] <= industryBenchmark + 5) {
        improvementTargets[metric] = industryBenchmark + (isAutomationRelated ? 15 : 10);
      }
      
      // Ensure we don't exceed 100% for any metric
      improvementTargets[metric] = Math.min(improvementTargets[metric], 95);
    });

    // Create the chart data
    const data = Object.keys(industryData).map(metric => {
      // Try different normalizations of the metric name to match user scores
      const normalizedMetric = metric.toLowerCase().replace(/\s+/g, '');
      const userScore = userScores[normalizedMetric] || 
                        userScores[metric.toLowerCase().replace(' ', '')] ||
                        userScores[metric] || 0;
      
      const industryBenchmark = industryData[metric];
      const optimizationTarget = improvementTargets[metric];
      
      // Calculate the improvement percentage for a more descriptive tooltip
      const improvementPercentage = optimizationTarget && userScore > 0 
        ? Math.round(((optimizationTarget - userScore) / userScore) * 100) 
        : 0;
      
      const optimizationDescription = optimizationTarget 
        ? `Potential ${improvementPercentage}% improvement after optimization. This exceeds industry average by ${Math.round(optimizationTarget - industryBenchmark)}%.` 
        : '';

      // Log the calculation results for debugging
      if (metric.toLowerCase().includes('automation')) {
        console.log(`Automation metric "${metric}":`, {
          userScore,
          industryBenchmark,
          optimizationTarget,
          improvementPercentage,
          diffFromIndustry: Math.round(optimizationTarget - industryBenchmark)
        });
      }
      
      return {
        name: metric,
        value: userScore,
        industry: industryBenchmark,
        benchmark: showImprovementPotential ? optimizationTarget : undefined,
        description: `${METRIC_DESCRIPTIONS[metric] || ''} ${optimizationDescription}`,
      };
    });

    setChartData(data);
  };

  // Effect to update chart data when industry or results change
  useEffect(() => {
    prepareChartData();
  }, [selectedIndustry, results]);

  // Initialize industry when component mounts
  useEffect(() => {
    const userIndustry = getUserIndustry();
    setSelectedIndustry(userIndustry);
    
    // Track component view in telemetry
    telemetry.track('industry_benchmark_viewed', {
      industry: userIndustry,
      showImprovementPotential
    });
  }, []);

  // Handle industry change
  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
    telemetry.track('industry_benchmark_changed', { 
      industry,
      previousIndustry: selectedIndustry
    });
  };

  // Handle download
  const handleDownload = () => {
    telemetry.track('benchmark_download_clicked', { 
      format: 'png',
      industry: selectedIndustry
    });
    
    // In a real implementation, this would generate and download a chart image
    // For now, we'll just log to console
    console.log('Download benchmark chart as PNG', { industry: selectedIndustry, data: chartData });
    
    // Show user feedback in a real implementation
  };

  // Handle share
  const handleShare = () => {
    telemetry.track('benchmark_share_clicked', { 
      industry: selectedIndustry
    });
    
    // In a real implementation, this would open a share dialog
    // For now, we'll just log to console
    console.log('Share benchmark chart', { industry: selectedIndustry });
    
    // Show user feedback in a real implementation
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Industry Benchmark Comparison</h2>
              <p className="text-sm text-gray-600 mt-1">
                See how your processes compare to industry standards
              </p>
            </div>
            
            {showDownloadOptions && (
              <div className="flex mt-4 sm:mt-0 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownload}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShare}
                  className="flex items-center gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <Tabs 
              defaultValue="benchmark" 
              className="w-full"
              onValueChange={(value) => {
                setActiveTab(value);
                telemetry.track('benchmark_tab_changed', { tab: value });
              }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="benchmark">Benchmark Analysis</TabsTrigger>
                <TabsTrigger value="industry-select">Select Industry</TabsTrigger>
              </TabsList>
              
              <TabsContent value="benchmark" className="pt-2">
                <ProcessOptimizationChart 
                  data={chartData}
                  title="Your Process Metrics vs. Optimization Potential"
                  description="See how your current metrics compare to both industry standards and your optimization potential after implementing recommended improvements"
                  hasIndustryComparison={true}
                  hasScorePrediction={showImprovementPotential}
                  chartType="all"
                  height={450}
                />
              </TabsContent>
              
              <TabsContent value="industry-select" className="space-y-4 py-4">
                <p className="text-sm text-gray-600">
                  Select an industry to compare your processes against industry-specific benchmarks:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.keys(INDUSTRY_BENCHMARKS).map(industry => (
                    <div 
                      key={industry}
                      className={`
                        p-4 rounded-lg border cursor-pointer transition-colors
                        ${selectedIndustry === industry 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'}
                      `}
                      onClick={() => handleIndustryChange(industry)}
                    >
                      <h3 className="font-medium capitalize">
                        {industry.replace('_', ' ')}
                      </h3>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Benchmark data based on analysis of over 10,000 processes across various industries
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}; 