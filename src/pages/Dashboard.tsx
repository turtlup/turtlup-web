import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePosture } from '../context/PostureContext';
import BodyModel from '../components/BodyModel';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    referencePosture,
    currentImuData,
    isGoodPosture
  } = usePosture();

  // Check if calibration has been performed
  const hasCalibration = referencePosture !== null;

  // Determine posture status
  const postureStatus = React.useMemo(() => {
    if (!currentImuData || !hasCalibration) return 'unknown';
    return isGoodPosture(currentImuData) ? 'good' : 'bad';
  }, [currentImuData, hasCalibration, isGoodPosture]);

  const getPostureStatusDetails = () => {
    switch (postureStatus) {
      case 'good':
        return {
          message: 'Your posture looks good!',
          color: 'success.main',
          backgroundColor: 'rgba(76, 175, 80, 0.1)'
        };
      case 'bad':
        return {
          message: 'Poor posture detected. Please sit up straight.',
          color: 'error.main',
          backgroundColor: 'rgba(244, 67, 54, 0.1)'
        };
      default:
        return {
          message: 'Waiting for posture data...',
          color: 'text.secondary',
          backgroundColor: 'rgba(0, 0, 0, 0.05)'
        };
    }
  };

  const statusDetails = getPostureStatusDetails();

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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: statusDetails.backgroundColor,
                transition: 'background-color 0.5s ease-in-out'
              }}
            >
              <Typography
                variant="h5"
                align="center"
                color={statusDetails.color}
                sx={{ mb: 2, fontWeight: 'bold' }}
              >
                {statusDetails.message}
              </Typography>

              <Box sx={{ width: '100%', height: 400, display: 'flex', justifyContent: 'center' }}>
                {currentImuData && (
                  <BodyModel
                    imuData={currentImuData}
                    width={300}
                    height={400}
                    goodPosture={postureStatus === 'good'}
                  />
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Posture Statistics
              </Typography>
              <Typography variant="body1">
                View your detailed posture statistics and history.
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => navigate('/stats')}
              >
                View Details
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;