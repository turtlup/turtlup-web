
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PostureStats from './pages/PostureStats';
import Calibration from './pages/Calibration';
import Settings from './pages/Settings';
import React, { useState, useEffect } from 'react';
import {CssBaseline, ThemeProvider, createTheme} from '@mui/material';
import { bluetoothService, IMUDataWithId } from './services/BluetoothService';


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#006ED3',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 800,
    },
    h3: {
      fontWeight: 800,
    },
    h4: {
      fontWeight: 800,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 110, 211, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(0, 110, 211, 0.12)',
            },
          },
        },
      },
    },
  },
});

const App: React.FC = () => {

  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [imuData, setImuData] = useState<IMUDataWithId[]>([]);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    bluetoothService.on('imuData', (data: IMUDataWithId) => {
      setImuData((prev) => {
        const newData = [...prev];
        newData.push(data);
        // Limit to the last 100 entries for performance
        if (newData.length > 100) {
          newData.shift();
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
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stats" element={<PostureStats />} />
            <Route path="/calibration" element={<Calibration />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;