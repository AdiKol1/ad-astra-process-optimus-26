import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Award, TrendingUp, Star, Zap, BarChart, Clock, LucideIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AssessmentStep } from '@/types/assessment/steps';
import { telemetry } from '@/utils/monitoring/telemetry';

interface ProgressRewardProps {
  step: AssessmentStep;
  completedStepsCount: number;
  totalSteps: number;
}

// Reward messages by step
const REWARD_MESSAGES: Record<AssessmentStep, { title: string; description: string }> = {
  'initial': {
    title: 'Journey Started!',
    description: 'You\'ve taken the first step toward process optimization!'
  },
  'lead-capture': {
    title: 'Personal Connection Established!',
    description: 'We\'ll tailor recommendations specifically for you.'
  },
  'process': {
    title: 'Process Analysis Complete!',
    description: 'Great job documenting your current processes.'
  },
  'technology': {
    title: 'Tech Stack Analyzed!',
    description: 'We\'re identifying the perfect technology fit for you.'
  },
  'team': {
    title: 'Team Assessment Finished!',
    description: 'Your team\'s strengths will be key to your optimization strategy.'
  },
  'social-media': {
    title: 'Social Media Assessment Completed!',
    description: 'We\'ve analyzed your social media strategy and presence.'
  },
  'detailed-results': {
    title: 'Results Generated!',
    description: 'We\'ve analyzed your data and prepared recommendations.'
  },
  'complete': {
    title: 'Assessment Completed!',
    description: 'Congratulations on completing your optimization assessment!'
  }
};

// Achievement badges by completed steps count
const ACHIEVEMENT_BADGES: Record<number, { icon: LucideIcon; title: string; color: string }> = {
  1: { 
    icon: CheckCircle, 
    title: 'Explorer',
    color: 'bg-blue-100 text-blue-600'
  },
  2: { 
    icon: TrendingUp, 
    title: 'Progress Maker',
    color: 'bg-green-100 text-green-600' 
  },
  3: { 
    icon: Zap, 
    title: 'Momentum Builder',
    color: 'bg-purple-100 text-purple-600'
  },
  4: { 
    icon: BarChart, 
    title: 'Data Champion',
    color: 'bg-orange-100 text-orange-600'
  },
  5: { 
    icon: Star, 
    title: 'Process Pro',
    color: 'bg-yellow-100 text-yellow-600'
  },
  6: { 
    icon: Award, 
    title: 'Optimization Master',
    color: 'bg-red-100 text-red-600'
  },
  7: { 
    icon: Award, 
    title: 'Transformation Leader',
    color: 'bg-indigo-100 text-indigo-600'
  }
};

// Stats to show for each step
const STEP_STATS: Record<AssessmentStep, { icon: LucideIcon; stat: string; label: string }> = {
  'initial': { 
    icon: Clock, 
    stat: '5 min', 
    label: 'Average completion time' 
  },
  'lead-capture': { 
    icon: CheckCircle, 
    stat: '14%', 
    label: 'Progress toward optimization' 
  },
  'process': { 
    icon: TrendingUp, 
    stat: '28%', 
    label: 'Progress toward optimization' 
  },
  'technology': { 
    icon: Zap, 
    stat: '42%', 
    label: 'Progress toward optimization' 
  },
  'team': { 
    icon: BarChart, 
    stat: '57%', 
    label: 'Progress toward optimization' 
  },
  'social-media': {
    icon: Star,
    stat: '71%',
    label: 'Progress toward optimization'
  },
  'detailed-results': { 
    icon: Star, 
    stat: '85%', 
    label: 'Progress toward optimization' 
  },
  'complete': { 
    icon: Award, 
    stat: '100%', 
    label: 'Assessment complete!' 
  }
};

export const ProgressReward: React.FC<ProgressRewardProps> = ({
  step,
  completedStepsCount,
  totalSteps
}) => {
  const showStepCompletionToast = useCallback(() => {
    // Don't show toast for initial step
    if (step === 'initial') return;
    
    const stepMessage = REWARD_MESSAGES[step];
    const stepStat = STEP_STATS[step];
    const StepIcon = stepStat.icon;
    
    // Track reward display in telemetry
    telemetry.track('micro_reward_displayed', {
      step,
      completedStepsCount,
      rewardType: 'completion',
      timestamp: new Date().toISOString()
    });
    
    // Create the description element
    const descriptionElement = (
      <div className="flex items-center justify-between w-full">
        <p>{stepMessage.description}</p>
        <div className="flex items-center bg-blue-50 rounded-full px-2 py-1 text-xs font-medium text-blue-700 ml-2">
          <StepIcon className="h-3 w-3 mr-1" />
          <span>{stepStat.stat}</span>
        </div>
      </div>
    );
    
    toast({
      title: stepMessage.title,
      description: stepMessage.description, // Using plain string to avoid type error
      variant: 'default'
    });
  }, [step, completedStepsCount]);
  
  const showAchievementToast = useCallback(() => {
    // Show achievement badges at specific milestones
    const badge = ACHIEVEMENT_BADGES[completedStepsCount];
    if (!badge) return;
    
    const BadgeIcon = badge.icon;
    
    // Add slight delay after step completion toast
    setTimeout(() => {
      // Track achievement display in telemetry
      telemetry.track('micro_reward_displayed', {
        step,
        completedStepsCount,
        rewardType: 'achievement',
        achievementTitle: badge.title,
        timestamp: new Date().toISOString()
      });
      
      // Create description content
      const descriptionText = `You've reached a new milestone in your optimization journey. ${completedStepsCount === totalSteps ? 'Congratulations on completing the assessment!' : ''}`;
      
      toast({
        title: `Achievement Unlocked: ${badge.title}!`,
        description: descriptionText, // Using plain string to avoid type error
        variant: 'default'
      });
    }, 1500);
  }, [completedStepsCount, step, totalSteps]);
  
  useEffect(() => {
    // Show toast when component mounts (when step changes)
    showStepCompletionToast();
    
    // Only show achievement toast if we've completed at least one step
    if (completedStepsCount > 0) {
      showAchievementToast();
    }
  }, [showStepCompletionToast, showAchievementToast, completedStepsCount]);
  
  return null; // This component doesn't render anything directly
};

// Component for inline rewards/badges that can be displayed within the assessment flow
export const InlineReward: React.FC<{
  title: string;
  description?: string;
  icon: LucideIcon;
  color: string;
}> = ({ title, description, icon: Icon, color }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border rounded-lg p-4 shadow-sm my-4"
      >
        <div className="flex items-start">
          <div className={cn("p-3 rounded-full mr-3", color)}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{title}</h4>
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}; 