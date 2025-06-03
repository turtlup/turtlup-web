import React from 'react';
import { Box, Typography } from '@mui/material';

const PostureStats: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Posture Statistics
      </Typography>
      <Box sx={{ mt: 3 }}>
        {/* Add posture statistics content here */}
        <Typography variant="body1" color="text.secondary">
          Posture statistics will be displayed here after calibration is complete.
        </Typography>
      </Box>
    </Box>
  );
};

export default PostureStats;