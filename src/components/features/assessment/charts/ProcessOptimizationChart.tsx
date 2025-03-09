import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ChevronDown, InfoIcon } from 'lucide-react';
import { telemetry } from '@/utils/monitoring/telemetry';

// Types
export interface ChartDataItem {
  name: string;
  value: number;
  score?: number;
  benchmark?: number;
  industry?: number;
  color?: string;
  description?: string;
}

export interface ChartTooltipProps {
  title: string;
  description?: string;
}

interface ProcessOptimizationChartProps {
  data: ChartDataItem[];
  title?: string;
  description?: string;
  hasIndustryComparison?: boolean;
  hasScorePrediction?: boolean;
  chartType?: 'bar' | 'radar' | 'pie' | 'all';
  height?: number;
}

// Define chart colors
const CHART_COLORS = {
  primary: '#3b82f6', // blue-500
  secondary: '#10b981', // emerald-500 - brighter for optimization targets
  tertiary: '#f59e0b', // amber-500
  quaternary: '#6366f1', // indigo-500
  comparison: '#94a3b8', // slate-400
  industry: '#d946ef', // fuchsia-500 for industry average
  socialMedia: '#ec4899', // pink-500 for social media
};

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ title, description }) => (
  <div className="rounded-md bg-black/80 p-2 text-xs text-white shadow-md">
    <p className="font-semibold">{title}</p>
    {description && <p className="mt-1 max-w-[200px]">{description}</p>}
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-md bg-white p-3 shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900">{data.name}</p>
        <div className="mt-2 space-y-1">
          {payload.map((entry: any, index: number) => {
            // Highlight optimization potential with a special styling
            const isOptimizationTarget = entry.name === "Potential After Optimization";
            return (
              <p 
                key={`tooltip-${index}`} 
                className={`text-sm ${isOptimizationTarget ? 'font-semibold border-l-2 pl-1 border-green-500' : ''}`} 
                style={{ color: entry.color }}
              >
                <span className="font-medium">{entry.name}:</span> {entry.value}%
                {isOptimizationTarget && entry.value > 0 && data.value > 0 && (
                  <span className="ml-1 text-green-600 text-xs">
                    (+{Math.round(((entry.value - data.value) / data.value) * 100)}%)
                  </span>
                )}
              </p>
            );
          })}
        </div>
        {data.description && (
          <p className="mt-2 text-xs text-gray-600 max-w-[220px]">{data.description}</p>
        )}
      </div>
    );
  }

  return null;
};

export const ProcessOptimizationChart: React.FC<ProcessOptimizationChartProps> = ({
  data,
  title = 'Process Optimization Metrics',
  description,
  hasIndustryComparison = true,
  hasScorePrediction = false,
  chartType = 'all',
  height = 400,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Format data for pie chart
  const pieData = data.map(item => ({
    name: item.name,
    value: item.value,
    color: item.color || CHART_COLORS.primary,
  }));

  // Track chart interactions
  const trackChartInteraction = (action: string, details?: Record<string, any>) => {
    telemetry.track('chart_interaction', {
      action,
      chartType: chartType === 'all' ? ['bar', 'radar', 'pie'][activeTabIndex] : chartType,
      ...details,
    });
  };

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    trackChartInteraction('tab_change', { tabIndex: index });
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

  // Filter to show only main data in collapsed view
  const visibleData = expanded ? data : data.slice(0, 5);

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={visibleData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={30}
        onMouseEnter={() => trackChartInteraction('hover_bar_chart')}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          height={80} 
          tick={{ fontSize: 12 }} 
        />
        <YAxis 
          domain={[0, 100]} 
          tickFormatter={(value) => `${value}%`}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          dataKey="value" 
          name="Your Current Score" 
          fill={CHART_COLORS.primary} 
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
          onMouseEnter={() => trackChartInteraction('hover_bar_your_score')}
        />
        {hasIndustryComparison && (
          <Bar 
            dataKey="industry" 
            name="Industry Average" 
            fill={CHART_COLORS.industry}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationBegin={200}
            onMouseEnter={() => trackChartInteraction('hover_bar_industry')}
          />
        )}
        {hasScorePrediction && (
          <Bar 
            dataKey="benchmark" 
            name="Potential After Optimization" 
            fill={CHART_COLORS.secondary}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationBegin={300}
            strokeWidth={1}
            stroke="#047857"
            onMouseEnter={() => trackChartInteraction('hover_bar_benchmark')}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderRadarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart 
        cx="50%" 
        cy="50%" 
        outerRadius="70%" 
        data={visibleData}
        onMouseEnter={() => trackChartInteraction('hover_radar_chart')}
      >
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 100]} 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${value}%`}
        />
        <Radar 
          name="Your Current Score" 
          dataKey="value" 
          stroke={CHART_COLORS.primary} 
          fill={CHART_COLORS.primary} 
          fillOpacity={0.5}
          animationDuration={1500}
          onMouseEnter={() => trackChartInteraction('hover_radar_your_score')}
        />
        {hasIndustryComparison && (
          <Radar 
            name="Industry Average" 
            dataKey="industry" 
            stroke={CHART_COLORS.industry} 
            fill={CHART_COLORS.industry} 
            fillOpacity={0.4}
            animationDuration={1500}
            onMouseEnter={() => trackChartInteraction('hover_radar_industry')}
          />
        )}
        {hasScorePrediction && (
          <Radar 
            name="Potential After Optimization" 
            dataKey="benchmark" 
            stroke={CHART_COLORS.secondary} 
            fill={CHART_COLORS.secondary} 
            fillOpacity={0.5}
            strokeWidth={2}
            animationDuration={1800}
            animationBegin={300}
            onMouseEnter={() => trackChartInteraction('hover_radar_benchmark')}
          />
        )}
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart 
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        onMouseEnter={() => trackChartInteraction('hover_pie_chart')}
      >
        <Pie
          data={visibleData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          animationDuration={1500}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
          onMouseEnter={(_, index) => trackChartInteraction('hover_pie_segment', { segment: visibleData[index].name })}
        >
          {visibleData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]} 
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  // Render the appropriate chart based on chartType
  const renderChart = () => {
    if (chartType === 'bar') return renderBarChart();
    if (chartType === 'radar') return renderRadarChart();
    if (chartType === 'pie') return renderPieChart();

    // For 'all', use the Tabs component
    return (
      <Tabs 
        defaultValue="bar" 
        className="w-full"
        onValueChange={(value) => {
          handleTabChange(['bar', 'radar', 'pie'].indexOf(value));
        }}
      >
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="radar">Radar Chart</TabsTrigger>
          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bar" className="pt-4">
          {renderBarChart()}
        </TabsContent>
        
        <TabsContent value="radar" className="pt-4">
          {renderRadarChart()}
        </TabsContent>
        
        <TabsContent value="pie" className="pt-4">
          {renderPieChart()}
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
          </div>
          {data.length > 5 && (
            <button
              onClick={() => {
                setExpanded(!expanded);
                trackChartInteraction('toggle_expand', { expanded: !expanded });
              }}
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {expanded ? 'Show Less' : 'Show All'}
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform ${
                  expanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>
      </motion.div>

      <Card className="p-4 sm:p-6">
        <motion.div variants={itemVariants} className="w-full">
          {renderChart()}
        </motion.div>
        
        {hasIndustryComparison && (
          <motion.div 
            variants={itemVariants}
            className="mt-4 flex items-center space-x-2 text-xs text-gray-500"
          >
            <InfoIcon className="h-4 w-4" />
            <p>Industry comparison based on data from 500+ companies in your sector.</p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}; 