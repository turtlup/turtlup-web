import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, useTheme, styled } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 300;

// Styled component for the white title box with blue text
const TitleBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  color: theme.palette.primary.main,
  padding: theme.spacing(2),
  paddingLeft: theme.spacing(4), // Adjust left padding
  display: 'flex',
  alignItems: 'center',
  minHeight: '80px', // Match app bar height if needed
  // No border radius on this box
}));

// Styled component for the navigation list container with specific styles
const NavListBox = styled(Box)(({ theme }) => ({
  mt: theme.spacing(3), // Add top margin to separate from title box
  mx: theme.spacing(1.25), // Adjust horizontal margin (10px on each side)
  // mb: theme.spacing(2.5), // Removed bottom margin from NavListBox itself
  backgroundColor: theme.palette.primary.main, // Blue background for this box
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  // justifyContent: 'center', // Removed: Vertical centering of content now depends on flexGrow
  gap: theme.spacing(5), // Gap between list items (40px assuming 8px spacing)
  flexShrink: 0,
  flexGrow: 1, // Make the box grow to fill available vertical space
  width: '250px', // Explicit width set to 220px
  // height: '823px', // Removed explicit height
  padding: theme.spacing(2, 2.5), // Reduced padding (16px top/bottom, 20px left/right)
  borderRadius: '30px', // Apply border radius
  marginBottom: theme.spacing(2.5), // Add bottom margin (20px) below the expanding box
}));

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Posture Stats', icon: <AssessmentIcon />, path: '/stats' },
    { text: 'Calibration', icon: <TuneIcon />, path: '/calibration' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.default, // Default background for the main drawer paper
            borderRight: 'none',
            display: 'flex', // Enable flexbox for vertical layout
            flexDirection: 'column', // Arrange children in a column
          },
        }}
      >
        <TitleBox>
          <Typography variant="h3" sx={{ fontWeight: 800, flexGrow: 1 }}>
            TurtlUp
          </Typography>
          {/* Optional: Add a logo here */}
        </TitleBox>
        {/* Container to take up remaining space and vertically align content */}
        <Box sx={{
           flexGrow: 1, // Take up remaining vertical space
           display: 'flex', // Enable flexbox
           flexDirection: 'column', // Arrange content in a column
           justifyContent: 'flex-start', // Align content (NavListBox) to the top
           alignItems: 'center', // Horizontally center content (the NavListBox)
           // mb: theme.spacing(2.5), // Removed bottom margin from wrapping box
        }}>
          {/* Navigation list container with blue background, margins, and specific layout */}
          <NavListBox>
            <List sx={{ width: '100%' }}> {/* Ensure list takes full width of its container */}
              {menuItems.map((item) => (
                <ListItem
                  button
                  disableGutters // Disable default list item gutters
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    margin: theme.spacing(1, 0), // Vertical margin
                    padding: theme.spacing(1, 2), // Explicit padding (top/bottom 1 unit, left/right 2 units)
                    borderRadius: theme.shape.borderRadius, // Rounded corners
                    color: theme.palette.common.white,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.10)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </NavListBox>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', mt: theme.spacing(3), mb: theme.spacing(2.5) }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;