import React, { useMemo, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAssessmentStore } from '@/contexts/assessment/store';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ProcessOptimizationChart } from '../charts/ProcessOptimizationChart';
import { IndustryBenchmarkChart } from '../charts/IndustryBenchmarkChart';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight, BarChart2, FileText, BarChart3, LineChart, ListChecks, Download, Clock, CalendarIcon, Users } from 'lucide-react';
import { telemetry } from '@/utils/monitoring/telemetry';
import type { StepComponentProps } from '../core/AssessmentFlow/types';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { LightbulbIcon } from '@/components/icons/LightbulbIcon';
import { logger } from '@/utils/logger';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { CALENDAR_URL } from '@/constants/urls';

// Define recommendation interface for display purposes
interface RecommendationDisplay {
  title: string;
  description: string;
  impact: string;
  effort: string;
  timeline?: string;
}

// Define a URL for team training information
const TEAM_TRAINING_URL = 'https://ad-astra-process.com/team-training';

/**
 * Generates and downloads a PDF report based on assessment results
 */
const generatePdfReport = (results: any) => {
  // In a real implementation, this would generate a PDF with the results
  // For now, we'll just simulate the download with a placeholder
  telemetry.track('pdf_report_generated', {
    hasResults: !!results,
    timestamp: new Date().toISOString()
  });
  
  logger.info('User requested PDF report download');
  
  // Alert the user that this is a placeholder (remove in production)
  alert('In a production environment, this would download a PDF report of your assessment results');

  // In a real implementation, you would use a library like jsPDF, react-pdf, or call a backend service
  // to generate the PDF and initiate the download
};

/**
 * Shares assessment results via various channels
 */
const shareResults = async () => {
  telemetry.track('share_results_click', {
    source: 'detailed_results',
    timestamp: new Date().toISOString()
  });
  
  logger.info('User requested to share assessment results');
  
  // Create the share data
  const shareData = {
    title: 'My Process Optimization Assessment Results',
    text: 'Check out my process optimization assessment results from Ad Astra!',
    url: window.location.href,
  };

  // Check if the Web Share API is available
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      logger.info('Results shared successfully');
    } catch (error) {
      logger.error('Error sharing results', { 
        error: error instanceof Error ? error.message : String(error)
      });
      // Fallback for when sharing is cancelled or fails
      alert('Could not share results. You can copy the URL manually to share your results.');
    }
  } else {
    // Fallback for browsers that don't support the Web Share API
    alert('Sharing is not supported in your browser. You can copy the URL manually to share your results.');
    // In a more complete implementation, you might show a modal with sharing options or copy to clipboard functionality
  }
};

// Add a new function for email subscription
/**
 * Handles email subscription
 */
const handleEmailSubscription = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  
  // Get the form data
  const form = event.currentTarget;
  const emailInput = form.elements.namedItem('email') as HTMLInputElement;
  const email = emailInput?.value;
  
  if (!email) {
    alert('Please enter a valid email address');
    return;
  }
  
  // Track the subscription
  telemetry.track('email_subscription', {
    source: 'detailed_results',
    timestamp: new Date().toISOString()
  });
  
  logger.info('User subscribed to email updates', { email });
  
  // In a real implementation, you would call an API to subscribe the user
  // For now, we'll just simulate the subscription
  alert(`Thank you for subscribing with ${email}! You'll receive updates and tips for process optimization.`);
  
  // Reset the form
  form.reset();
};

/**
 * Exports process metrics data as CSV
 */
const exportMetricsData = () => {
  telemetry.track('export_metrics', {
    source: 'detailed_results',
    timestamp: new Date().toISOString()
  });
  
  logger.info('User exported metrics data');
  
  // Get the data from the store
  const { results } = useAssessmentStore.getState();
  
  if (!results?.insights) {
    alert('No data available to export');
    return;
  }
  
  // Prepare CSV content
  let csvContent = "Category,Score\n";
  results.insights.forEach(insight => {
    csvContent += `"${insight.category}",${insight.score}\n`;
  });
  
  // Create a blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'process_metrics.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exports recommendations as a plan document
 */
const exportRecommendationsPlan = () => {
  telemetry.track('export_recommendations_plan', {
    source: 'detailed_results',
    timestamp: new Date().toISOString()
  });
  
  logger.info('User exported recommendations plan');
  
  // Create a plain text version of the recommendations
  const { results } = useAssessmentStore.getState();
  
  if (!results?.recommendations || results.recommendations.length === 0) {
    alert('No recommendations available to export');
    return;
  }
  
  // Create a simple text document with recommendations
  let textContent = "# Process Optimization Recommendations\n\n";
  results.recommendations.forEach((rec, index) => {
    textContent += `## ${index + 1}. ${rec}\n\n`;
  });
  
  // Create a blob and download link
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'optimization_recommendations.txt');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const DetailedResultsSection: React.FC<StepComponentProps> = ({ onComplete }) => {
  const { results, isLoading, responses } = useAssessmentStore();

  // Track page view
  React.useEffect(() => {
    telemetry.track('detailed_results_viewed', {
      hasResults: !!results,
      timestamp: new Date().toISOString()
    });
  }, [results]);

  if (isLoading || !results) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // Industry average data for comparison
  const industryAverages = {
    'process': 65,
    'technology': 58,
    'team': 72,
    'social-media': 60,
    'documentation': 55,
    'automation': 62,
    'integration': 58
  };

  // Prepare data for process metrics chart
  const processMetricsData = useMemo(() => {
    if (!results?.insights) return [];

    return results.insights.map(insight => ({
      name: insight.category,
      value: insight.score,
      industry: industryAverages[insight.category] || 60, // Default to 60 if category not found
      description: insight.recommendations?.[0] || ''
    }));
  }, [results]);

  const { score, insights } = results;
  
  // Create dummy structured recommendations from the string array
  // In a real implementation, these should come properly structured from the API
  const displayRecommendations = useMemo(() => {
    if (!results.recommendations) return [];
    
    return results.recommendations.map((rec, index): RecommendationDisplay => {
      // Create a structured recommendation from the string
      // In a real app, you would have real data here
      return {
        title: `Recommendation ${index + 1}`,
        description: rec,
        impact: ['High', 'Medium', 'Low'][index % 3],
        effort: ['Low', 'Medium', 'High'][index % 3],
        timeline: ['Short-term', 'Medium-term', 'Long-term'][index % 3]
      };
    });
  }, [results.recommendations]);

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

  const handleTabChange = (value: string) => {
    telemetry.track('results_tab_changed', { tab: value });
  };

  const [selectedRecommendation, setSelectedRecommendation] = useState<{
    title: string;
    description: string;
    effort?: number | string;
    impact?: number | string;
    timeline?: string;
    details?: string;
  } | null>(null);

  // Add a dialogOpen state
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBookConsultation = () => {
    telemetry.track('consultation_booked', {
      hasResults: !!results,
      timestamp: new Date().toISOString()
    });
    
    logger.info('User booked a consultation', {
      hasResults: !!results
    });
    
    // Open Google Calendar with UTM parameters for tracking
    const consultationUrl = `${CALENDAR_URL}?utm_source=app&utm_medium=results_page&utm_campaign=process_assessment`;
    window.open(consultationUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Overall Score Card - Enhanced with gradient */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="col-span-2 space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight">
                    Process Optimization Score
                  </h2>
                  <p className="text-blue-100 text-lg">
                    {results.score >= 80 
                      ? "Your processes are well-optimized! Here are some areas to maintain your excellence."
                      : results.score >= 60
                      ? "Your processes are good, but there are opportunities for significant improvement."
                      : "Your processes need attention. We've identified key areas for optimization."}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-4">
                    {displayRecommendations.slice(0, 3).map((rec, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
                        {rec.title}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-5xl font-bold">{results.score}</span>
                        <span className="text-xl">/100</span>
                      </div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="white"
                        strokeWidth="8"
                        strokeDasharray={`${results.score * 2.83} 283`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Key Improvement Areas</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {insights?.map((insight, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${insight.score > 70 ? 'bg-green-500' : insight.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <h4 className="font-medium capitalize">{insight.category === 'social-media' ? 'Social Media' : insight.category}</h4>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{insight.score}</span>
                      <span className="text-xs text-gray-500">Score</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content Tabs - Enhanced with icons and better spacing */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <Tabs defaultValue="metrics" className="w-full" onValueChange={(value) => {
              telemetry.track('view_assessment_tab', { tab: value });
            }}>
              <div className="bg-gradient-to-r from-gray-50 to-slate-100 border-b">
                <div className="flex overflow-x-auto">
                  <TabsList className="bg-transparent h-14 w-full justify-start rounded-none px-6">
                    <TabsTrigger 
                      value="metrics" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full text-sm font-medium data-[state=active]:text-blue-700 data-[state=active]:bg-transparent"
                    >
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Process Metrics
                      </div>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="benchmarks" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full text-sm font-medium data-[state=active]:text-blue-700 data-[state=active]:bg-transparent"
                    >
                      <div className="flex items-center gap-2">
                        <LineChart className="h-4 w-4" />
                        Industry Benchmarks
                      </div>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="recommendations" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full text-sm font-medium data-[state=active]:text-blue-700 data-[state=active]:bg-transparent"
                    >
                      <div className="flex items-center gap-2">
                        <ListChecks className="h-4 w-4" />
                        Optimization Recommendations
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
              <TabsContent value="metrics" className="p-0 border-0">
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Process Metrics</h3>
                      <p className="text-gray-500">Detailed breakdown of your process optimization scoring</p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2" onClick={exportMetricsData}>
                      <Download className="h-4 w-4" />
                      Export Data
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <ProcessOptimizationChart 
                      data={processMetricsData} 
                      title="Process Optimization Metrics" 
                      hasIndustryComparison={true}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {insights?.map((insight, index) => (
                      <Card key={index} className="overflow-hidden border border-gray-200 transition-all hover:shadow-md">
                        <CardHeader className="p-4 bg-gray-50 border-b">
                          <CardTitle className="text-lg font-medium capitalize">
                            {insight.category === 'social-media' ? 'Social Media' : insight.category}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-3xl font-bold">{insight.score}</div>
                            <Badge variant={insight.score > 70 ? 'default' : insight.score > 40 ? 'secondary' : 'destructive'}>
                              {insight.score > 70 ? 'Good' : insight.score > 40 ? 'Needs Improvement' : 'Critical'}
                            </Badge>
                          </div>
                          
                          <Progress 
                            value={insight.score} 
                            max={100}
                            className={cn(
                              "h-2 mt-2",
                              insight.score > 70 ? "bg-green-100" : insight.score > 40 ? "bg-yellow-100" : "bg-red-100"
                            )}
                          />
                          
                          <ul className="mt-4 space-y-2">
                            {insight.recommendations.slice(0, 2).map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="benchmarks" className="p-0 border-0">
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Industry Benchmarks</h3>
                      <p className="text-gray-500">Compare your performance with industry standards</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <IndustryBenchmarkChart 
                      showImprovementPotential={true}
                      showDownloadOptions={true}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="p-0 border-0">
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Optimization Recommendations</h3>
                      <p className="text-gray-500">Actionable steps to improve your processes</p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2" onClick={exportRecommendationsPlan}>
                      <Download className="h-4 w-4" />
                      Export Plan
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {displayRecommendations.map((rec, index) => (
                      <Card key={index} className="overflow-hidden border border-gray-200 hover:shadow-md transition-all">
                        <CardHeader className="p-5 flex flex-row items-start gap-4 pb-2">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <LightbulbIcon className="h-5 w-5 text-blue-700" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-semibold">{rec.title}</CardTitle>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-5 pt-2">
                          <p className="text-gray-600 mb-4">{rec.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-500 mb-1">Implementation Effort</div>
                              <div className="flex items-center">
                                {Array(5).fill(0).map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`w-6 h-1.5 rounded mr-1 ${typeof rec.effort === 'number' && i < rec.effort ? 'bg-blue-600' : 'bg-gray-200'}`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm font-medium">
                                {typeof rec.effort === 'number' ? (
                                  rec.effort <= 2 ? 'Low' : rec.effort <= 4 ? 'Medium' : 'High'
                                ) : 'Medium'}
                              </span>
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-500 mb-1">Impact</div>
                              <div className="flex items-center">
                                {Array(5).fill(0).map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`w-6 h-1.5 rounded mr-1 ${typeof rec.impact === 'number' && i < rec.impact ? 'bg-green-600' : 'bg-gray-200'}`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm font-medium">
                                {typeof rec.impact === 'number' ? (
                                  rec.impact <= 2 ? 'Low' : rec.impact <= 4 ? 'Medium' : 'High'
                                ) : 'High'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-gray-600">
                                {rec.timeline || 'Short-term'}
                              </span>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              onClick={() => {
                                telemetry.track('recommendation_click', { 
                                  recommendation: rec.title,
                                  source: 'detailed_results',
                                  timestamp: new Date().toISOString()
                                });
                                // Set the selected recommendation for the modal
                                setSelectedRecommendation({
                                  ...rec,
                                  effort: typeof rec.effort === 'string' ? parseInt(rec.effort, 10) || undefined : rec.effort,
                                  impact: typeof rec.impact === 'string' ? parseInt(rec.impact, 10) || undefined : rec.impact,
                                  details: `
                                    This recommendation will help you optimize your processes by implementing 
                                    best practices and automation strategies. By following this guidance, you can 
                                    expect to see improvements in efficiency, quality, and overall performance.
                                    
                                    Implementation steps:
                                    1. Assess your current process workflow
                                    2. Identify bottlenecks and inefficiencies
                                    3. Apply the recommended changes
                                    4. Measure results and adjust as needed
                                    
                                    Our team can provide additional support to help you implement these recommendations
                                    effectively. Book a consultation for personalized guidance.
                                  `.trim().replace(/\s+/g, ' ')
                                });
                                // Open the dialog
                                setDialogOpen(true);
                              }}
                            >
                              Learn More <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>

        {/* Next Steps Section - New addition */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-50 to-blue-50">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Next Steps</h3>
              <p className="text-gray-600 mb-6">Ready to transform your business processes?</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-gray-200 hover:shadow-md transition-all bg-white">
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Schedule a Consultation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-600 text-sm mb-4">
                      Book a free 30-minute call with our process optimization experts.
                    </p>
                    <div className="mt-4">
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
                        onClick={handleBookConsultation}
                      >
                        Schedule a Consultation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-200 hover:shadow-md transition-all bg-white">
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      Download Full Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-600 text-sm mb-4">
                      Get a comprehensive PDF report with detailed optimization roadmap.
                    </p>
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => {
                      telemetry.track('download_report_click', {
                        source: 'detailed_results',
                        timestamp: new Date().toISOString()
                      });
                      
                      // Get results from the store
                      const { results } = useAssessmentStore.getState();
                      
                      // Generate and download the PDF
                      generatePdfReport(results);
                    }}>
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-200 hover:shadow-md transition-all bg-white">
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      Team Training
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-600 text-sm mb-4">
                      Explore our training programs for your team to implement these improvements.
                    </p>
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => {
                      telemetry.track('team_training_click', {
                        source: 'detailed_results',
                        timestamp: new Date().toISOString()
                      });
                      logger.info('User clicked team training button');
                      // Open team training page in a new tab
                      window.open(TEAM_TRAINING_URL, '_blank', 'noopener,noreferrer');
                    }}>
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Share Results Button */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-50 to-blue-50">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Share Results</h3>
              <p className="text-gray-600 mb-6">Share your results with others</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-gray-200 hover:shadow-md transition-all bg-white">
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      Share via URL
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-600 text-sm mb-4">
                      Copy the URL to share your results with others.
                    </p>
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50" onClick={shareResults}>
                      Share Results
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stay Updated Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-50 to-blue-50">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Stay Updated</h3>
              <p className="text-gray-600 mb-6">Receive optimization tips and updates</p>
              
              <Card className="border border-gray-200 hover:shadow-md transition-all bg-white">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Subscribe for Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-600 text-sm mb-4">
                    Get the latest optimization tips and strategies delivered to your inbox.
                  </p>
                  <form onSubmit={handleEmailSubscription} className="flex flex-col space-y-4">
                    <div className="flex flex-col md:flex-row gap-3">
                      <input 
                        type="email" 
                        name="email"
                        placeholder="Your email address"
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      />
                      <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                        Subscribe
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </Card>
        </motion.div>

        {/* Recommendation Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <span className="hidden">Open Dialog</span>
          </DialogTrigger>
          {selectedRecommendation && (
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold">{selectedRecommendation.title}</DialogTitle>
                <DialogDescription className="text-base text-gray-700 mt-2">
                  {selectedRecommendation.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 mb-4 mt-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Implementation Effort</div>
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, i) => (
                      <span 
                        key={i} 
                        className={`w-6 h-1.5 rounded mr-1 ${
                          typeof selectedRecommendation.effort === 'number' && 
                          i < selectedRecommendation.effort 
                            ? 'bg-blue-600' 
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {typeof selectedRecommendation.effort === 'number' ? (
                      selectedRecommendation.effort <= 2 ? 'Low' : 
                      selectedRecommendation.effort <= 4 ? 'Medium' : 'High'
                    ) : 'Medium'}
                  </span>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Impact</div>
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, i) => (
                      <span 
                        key={i} 
                        className={`w-6 h-1.5 rounded mr-1 ${
                          typeof selectedRecommendation.impact === 'number' && 
                          i < selectedRecommendation.impact 
                            ? 'bg-green-600' 
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {typeof selectedRecommendation.impact === 'number' ? (
                      selectedRecommendation.impact <= 2 ? 'Low' : 
                      selectedRecommendation.impact <= 4 ? 'Medium' : 'High'
                    ) : 'High'}
                  </span>
                </div>
              </div>
              
              <div className="text-gray-700 mt-2 whitespace-pre-line">
                <h4 className="font-semibold mb-2">Implementation Details</h4>
                <p className="text-sm">{selectedRecommendation.details}</p>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-600">
                    {selectedRecommendation.timeline || 'Short-term'}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <DialogClose asChild>
                    <Button variant="ghost">Close</Button>
                  </DialogClose>
                  
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      telemetry.track('book_consultation_from_recommendation', { 
                        recommendation: selectedRecommendation.title 
                      });
                      // Use the same handler for consistency
                      handleBookConsultation();
                    }}
                  >
                    Get Help
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </motion.div>
    </div>
  );
};

export default DetailedResultsSection; 