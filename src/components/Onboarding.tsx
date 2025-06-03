import React, { useState } from 'react';
import { Box, Button, Typography, Stepper, Step, StepLabel, Paper, useTheme } from '@mui/material';
import { bluetoothService } from '../services/BluetoothService';
import BodyModel from './BodyModel';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  'Connect Device',
  'Sit in Neutral Position',
  'Calibrate Sensors',
  'Complete'
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [imuData, setImuData] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const theme = useTheme();

  React.useEffect(() => {
    bluetoothService.on('connected', () => {
      console.log("Bluetooth connected event triggered.");
      setIsConnected(true);
    });
    bluetoothService.on('imuData', (data) => setImuData((prev) => {
      // In a real scenario, you'd update the specific IMU data
      // For visualization, we'll just add the data for now or update if ID exists
      const newData = [...prev];
      const index = newData.findIndex(imu => imu.id === data.id);
      if (index > -1) {
        newData[index] = data;
      } else {
        newData.push(data);
      }
      return newData;
    }));
    bluetoothService.on('disconnected', () => {
      console.log("Bluetooth disconnected event triggered.");
      setIsConnected(false);
    });

    return () => {
      bluetoothService.removeAllListeners();
    };
  }, []);

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
      await bluetoothService.connect();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  // Placeholder for calibration logic
  const startCalibration = () => {
    console.log("Starting calibration...");
    // In a real app, you would send a command to the device here
    // sendCommand('CALIBRATE_NEUTRAL_POSITION');
    // After sending command and potentially receiving confirmation,
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
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Sit in a neutral position
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Keep your back straight and shoulders relaxed and click the button below when ready.
            </Typography>
            <BodyModel
              imuData={imuData}
              width={300}
              height={400}
            />
            <Button
              variant="contained"
              onClick={startCalibration}
              disabled={!isConnected} // Only enable if device is connected
              sx={{ mt: 3 }}
            >
              Ready to Calibrate
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Calibrating sensors...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please remain still while we calibrate your sensors
            </Typography>
            {/* Potentially show progress or data here */}
          </Box>
        );
      case 3:
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
      height: 698,
      mt: 0,
    }}>

      {/* Content section for Stepper, content, and buttons */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pb: theme.spacing(2.5) }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{
          mb: 4,
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
          mt: 4,
          mb: 4,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          '& .MuiTypography-h6': {
            fontSize: '1.5rem',
            mb: 3
          },
          '& .MuiTypography-body1': {
            fontSize: '1rem'
          }
        }}>
          {renderStepContent(activeStep)}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 4 }}>
          <Button
            disabled={activeStep === 0 || activeStep === steps.length - 1}
            onClick={handleBack}
            size="medium"
            variant="text"
            sx={{ p: 0 }}
          >
            Back
          </Button>
          {activeStep !== 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === 0 && !isConnected}
              size="medium"
              // sx={{ p: 0 }} // Removed padding here as well
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default Onboarding;