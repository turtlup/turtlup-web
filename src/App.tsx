import React, { useState, useEffect } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Button, Typography, Box, Select, MenuItem, List, ListItem } from '@mui/material';
import { bluetoothService, IMUData } from './services/BluetoothService';
import Onboarding from './components/Onboarding';
import BodyModel from './components/BodyModel';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [imuData, setImuData] = useState<IMUData[]>([]);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    bluetoothService.on('imuData', (data: IMUData) => {
      setImuData((prev) => {
        const newData = [...prev];
        const index = newData.findIndex((imu) => imu.id === data.id);
        if (index >= 0) {
          newData[index] = data;
        } else {
          newData.push(data);
        }
        return newData;
      });
    });

    bluetoothService.on('log', (message: string) => {
      setLog((prev) => [...prev, message]);
    });

    return () => {
      bluetoothService.removeAllListeners();
    };
  }, []);

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
  };

  const connectToDevice = async () => {
    try {
      await bluetoothService.connect();
    } catch (error) {
      console.error("Connection attempt failed:", error);
    }
  };

  const sendCommand = (cmd: string) => {
    const encoder = new TextEncoder();
    bluetoothService.sendData(encoder.encode(cmd));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        {!isOnboardingComplete ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
              TurtlUp Web App
            </Typography>

            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box sx={{ flex: 1 }}>
                <BodyModel
                  imuData={imuData}
                  width={600}
                  height={800}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Bluetooth Log
                </Typography>
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {log.map((entry, i) => (
                    <ListItem key={i}>{entry}</ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;