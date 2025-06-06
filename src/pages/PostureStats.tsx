import React, { useMemo } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { usePosture } from '../context/PostureContext';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const PostureStats: React.FC = () => {
  const { imuDataHistory, referencePosture, isGoodPosture } = usePosture();

  // Calculate statistics from history
  const stats = useMemo(() => {
    if (!imuDataHistory.length || !referencePosture) {
      return {
        totalSamples: 0,
        goodPostureCount: 0,
        goodPosturePercentage: 0,
        badPostureCount: 0,
        badPosturePercentage: 0
      };
    }

    // Count how many readings show good posture
    const goodPostureCount = imuDataHistory.filter(data => data).length;
    const badPostureCount = imuDataHistory.length - goodPostureCount;

    return {
      totalSamples: imuDataHistory.length,
      goodPostureCount: goodPostureCount,
      goodPosturePercentage: (goodPostureCount / imuDataHistory.length * 100).toFixed(1),
      badPostureCount: badPostureCount,
      badPosturePercentage: ((imuDataHistory.length - goodPostureCount) / imuDataHistory.length * 100).toFixed(1)
    };
  }, [imuDataHistory, referencePosture, isGoodPosture]);

  // Prepare pie chart data
  const chartData = {
    labels: ['Good Posture', 'Bad Posture'],
    datasets: [
      {
        data: [stats.goodPosturePercentage || 70, stats.badPosturePercentage || 30], // Use mock data if no real data
        backgroundColor: [
          '#006ed3',  // Light teal for good posture
          'rgba(255, 0, 55, 0.6)',  // Light red for bad posture
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: '"Montserrat", "Helvetica", "Arial", sans-serif',
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Posture Statistics
      </Typography>

      {referencePosture ? (
        <>
          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Last Hour Posture Distribution
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <Pie data={chartData} options={chartOptions} />
            </Box>
          </Paper>

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
        </>
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