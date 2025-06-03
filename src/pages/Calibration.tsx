import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Onboarding from '../components/Onboarding';

const Calibration: React.FC = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Calibration
      </Typography>

      {!isOnboardingComplete ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <Box sx={{ mt: 3 }}>
          {/* Add calibration content here */}
          <Typography variant="body1" color="text.secondary">
            Calibration is complete. You can now view your posture data on the dashboard.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Calibration;