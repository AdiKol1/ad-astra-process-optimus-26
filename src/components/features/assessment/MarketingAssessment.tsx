import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../../../contexts/AssessmentContext';
import { Card, Button, Checkbox, FormControlLabel, FormGroup, Typography, Box } from '@mui/material';

const marketingChallenges = [
  'Inconsistent lead tracking',
  'Manual data entry and reporting',
  'Poor visibility into marketing ROI',
  'Difficulty measuring campaign performance',
  'Lack of marketing automation',
  'Disconnected marketing tools',
  'Inefficient lead nurturing process'
];

const toolStackOptions = [
  'Spreadsheets/Manual tracking',
  'Email marketing platform',
  'CRM system',
  'Marketing automation platform',
  'Analytics tools',
  'Social media management tools',
  'Content management system'
];

const MarketingAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentData, updateResponses, calculateScores } = useAssessment();
  
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>(
    assessmentData?.responses?.marketingChallenges || []
  );
  const [selectedTools, setSelectedTools] = useState<string[]>(
    assessmentData?.responses?.toolStack || []
  );

  const handleChallengeChange = (challenge: string) => {
    setSelectedChallenges(prev => 
      prev.includes(challenge) 
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    );
  };

  const handleToolChange = (tool: string) => {
    setSelectedTools(prev => 
      prev.includes(tool) 
        ? prev.filter(t => t !== tool)
        : [...prev, tool]
    );
  };

  const handleContinue = () => {
    updateResponses({
      marketingChallenges: selectedChallenges,
      toolStack: selectedTools
    });
    calculateScores();
    navigate('/assessment/timeline');
  };

  const handleBack = () => {
    updateResponses({
      marketingChallenges: selectedChallenges,
      toolStack: selectedTools
    });
    calculateScores();
    navigate('/assessment/process');
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Card sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Marketing Assessment
        </Typography>
        
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          What marketing challenges does your team face?
        </Typography>
        <FormGroup>
          {marketingChallenges.map((challenge) => (
            <FormControlLabel
              key={challenge}
              control={
                <Checkbox
                  checked={selectedChallenges.includes(challenge)}
                  onChange={() => handleChallengeChange(challenge)}
                />
              }
              label={challenge}
            />
          ))}
        </FormGroup>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          What tools do you currently use for marketing?
        </Typography>
        <FormGroup>
          {toolStackOptions.map((tool) => (
            <FormControlLabel
              key={tool}
              control={
                <Checkbox
                  checked={selectedTools.includes(tool)}
                  onChange={() => handleToolChange(tool)}
                />
              }
              label={tool}
            />
          ))}
        </FormGroup>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            size="large"
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleContinue}
            size="large"
            disabled={selectedChallenges.length === 0 || selectedTools.length === 0}
          >
            Continue
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default MarketingAssessment;
