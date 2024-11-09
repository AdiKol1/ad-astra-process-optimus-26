import { processDetailsQuestions } from './questions/processDetails';
import { technologyQuestions } from './questions/technology';
import { processesQuestions } from './questions/processes';
import { teamQuestions } from './questions/team';
import { challengesQuestions } from './questions/challenges';
import { budgetAndTimelineQuestions } from './questions/budgetAndTimeline';
import { goalsQuestions } from './questions/goals';

export const assessmentQuestions = {
  processDetails: processDetailsQuestions,
  technology: technologyQuestions,
  processes: processesQuestions,
  team: teamQuestions,
  challenges: challengesQuestions,
  budgetAndTimeline: budgetAndTimelineQuestions,
  goals: goalsQuestions
};