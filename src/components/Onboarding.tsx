import React, { useState } from 'react';
import { Box, Button, Typography, Stepper, Step, StepLabel, Paper } from '@mui/material';
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
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Connect your posture sensor device
            </Typography>
            <Button
              variant="contained"
              onClick={handleConnect}
              disabled={isConnected}
              sx={{ mt: 2 }}
            >
              {isConnected ? 'Connected' : 'Connect Device'}
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
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 4 }}>
        {renderStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0 || activeStep === steps.length - 1} // Disable back on first and last step
            onClick={handleBack}
          >
            Back
          </Button>
          {/* The "Next" button is handled within the step content now for step 1 */}
          {activeStep !== 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === 0 && !isConnected }
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