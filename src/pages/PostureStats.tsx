import React, { useMemo } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { usePosture } from '../context/PostureContext';

const PostureStats: React.FC = () => {
  const { imuDataHistory, referencePosture, isGoodPosture } = usePosture();

  // Calculate statistics from history
  const stats = useMemo(() => {
    if (!imuDataHistory.length || !referencePosture) {
      return {
        totalSamples: 0,
        goodPostureCount: 0,
        goodPosturePercentage: 0
      };
    }

    // Count how many readings show good posture
    const goodPostureCount = imuDataHistory.filter(data => data).length;

    return {
      totalSamples: imuDataHistory.length,
      goodPostureCount: goodPostureCount,
      goodPosturePercentage: (goodPostureCount / imuDataHistory.length * 100).toFixed(1)
    };
  }, [imuDataHistory, referencePosture, isGoodPosture]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Posture Statistics
      </Typography>

      {referencePosture ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Total Readings
              </Typography>
              <Typography variant="h3" color="primary">
                {stats.totalSamples}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Good Posture
              </Typography>
              <Typography variant="h3" color="success.main">
                {stats.goodPostureCount}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Good Posture %
              </Typography>
              <Typography variant="h3" color={Number(stats.goodPosturePercentage) > 50 ? 'success.main' : 'error.main'}>
                {stats.goodPosturePercentage}%
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Posture statistics will be displayed here after calibration is complete.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PostureStats;