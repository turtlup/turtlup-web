import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Switch, Divider } from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <List sx={{ mt: 3 }}>
        <ListItem>
          <ListItemText
            primary="Bluetooth Notifications"
            secondary="Receive notifications when device connection status changes"
          />
          <Switch edge="end" />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemText
            primary="Posture Alerts"
            secondary="Get notified when poor posture is detected"
          />
          <Switch edge="end" />
        </ListItem>

        <Divider />
      </List>
    </Box>
  );
};

export default Settings;