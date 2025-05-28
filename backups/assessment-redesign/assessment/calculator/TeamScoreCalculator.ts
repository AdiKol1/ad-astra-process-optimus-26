import { SectionScore } from '../../../../types/assessment';
import { CalculationProps } from './types';

export const calculateTeamScore = ({ responses }: CalculationProps): SectionScore => {
  const teamSize = Number(responses.teamSize) || 0;
  const departments = responses.departments || [];
  const roleBreakdown = responses.roleBreakdown || {};
  const hoursPerWeek = Number(responses.hoursPerWeek) || 0;

  const teamSizeScore = Math.min(1, teamSize / 50);
  const departmentScore = departments.length / 7;
  const roleScore = Object.keys(roleBreakdown).length / 3;
  const utilizationScore = Math.min(1, hoursPerWeek / 40);

  return {
    score: (teamSizeScore * 0.2 + departmentScore * 0.3 + roleScore * 0.3 + utilizationScore * 0.2),
    confidence: 0.9,
    areas: [
      {
        name: 'Team Size & Structure',
        score: teamSizeScore,
        insights: [`Team size: ${teamSize} members across ${departments.length} departments`]
      },
      {
        name: 'Role Distribution',
        score: roleScore,
        insights: [`${Object.keys(roleBreakdown).length} distinct roles identified`]
      },
      {
        name: 'Resource Utilization',
        score: utilizationScore,
        insights: [`Average ${hoursPerWeek} working hours per week`]
      }
    ]
  };
};