import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const hasCalibration = false; // This should be replaced with actual state management

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {!hasCalibration ? (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center'
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No calibration data available
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Complete the calibration process to start tracking your posture
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/calibration')}
          >
            Start Calibration
          </Button>
        </Box>
      ) : (
        <Box>
          {/* Add dashboard content here when calibration is complete */}
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;