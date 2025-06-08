import React, { useState } from 'react';
import { Box, Button, Typography, Stepper, Step, StepLabel, Paper, useTheme } from '@mui/material';
import { usePosture } from '../context/PostureContext';
import BodyModel from './BodyModel';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  'Connect Device',
  'Sit in Neutral Position',
  'Complete'
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  // Use the PostureContext instead of managing state locally
  const {
    currentImuData,
    isConnected,
    connectDevice,
    setReferencePosture
  } = usePosture();

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onComplete();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleConnect = async () => {
    try {
      await connectDevice(); // Use context method instead
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  // Update the startCalibration function
  const startCalibration = () => {
    console.log("Starting calibration...");

    // Save the most recent IMU data as the reference posture
    if (currentImuData) {
      setReferencePosture(currentImuData);
      console.log("Reference posture saved:", currentImuData);
    }

    handleNext(); // Move to the next step (Calibrate Sensors)
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Connect your posture sensor device
            </Typography>
            <Button
              variant="contained"
              onClick={handleConnect}
              disabled={isConnected}
              sx={{ mt: 2, px: 6, py: 2, fontSize: '1rem' }}
            >
              {isConnected ? 'CONNECTED' : 'CONNECT DEVICE'}
            </Button>
            {isConnected && (
              <Typography variant="body1" color="success.main" sx={{ mt: 2 }}>
                Connected!
              </Typography>
            )}
          </Box>
        );
      case 1:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Sit in a neutral position
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Keep your back straight and shoulders relaxed and click the button below when ready.
            </Typography>
            {/* Only render BodyModel if we have data */}
            {currentImuData && (
              <Box sx={{
                width: '100%',
                height: 300,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2
              }}>
                <BodyModel
                  width={200}
                  height={300}
                />
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Calibration Complete!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You're all set to start monitoring your posture
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Paper elevation={0} sx={{
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 200px)', // Adjust height to account for header and margins
      mt: 0,
      overflow: 'hidden'
    }}>

      {/* Content section for Stepper, content, and buttons */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{
          mb: 3,
          justifyContent: 'center',
          '& .MuiStepLabel-label': { fontSize: '0.9rem' },
          '& .MuiStepIcon-root': {
            width: 28,
            height: 28,
            '& .MuiStepIcon-text': { fontSize: '0.7rem' }
          }
        }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {/* Container for step content, takes remaining space */}
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto',
          py: 2,
          '& .MuiTypography-h6': {
            fontSize: '1.5rem',
            mb: 2
          },
          '& .MuiTypography-body1': {
            fontSize: '1rem'
          }
        }}>
          {renderStepContent(activeStep)}
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          mt: 2,
          flexShrink: 0
        }}>
          <Button
            disabled={activeStep === 0 || activeStep === steps.length - 1}
            onClick={handleBack}
            size="medium"
            variant="text"
            sx={{ p: 0 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={activeStep === 1 ? startCalibration : handleNext}
            disabled={activeStep === 0 && !isConnected}
            size="medium"
          >
            {activeStep === 1 ? 'Calibrate' : activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default Onboarding;