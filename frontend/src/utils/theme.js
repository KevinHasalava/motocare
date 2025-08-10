// frontend/src/utils/theme.js
import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366f1' },
    secondary: { main: '#a855f7' },
    background: { default: '#0f172a', paper: 'rgba(30, 41, 59, 0.5)' },
    text: { primary: '#f8fafc', secondary: '#94a3b8' },
    info: { main: '#06b6d4' },
    success: { main: '#22c55e' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 900 },
    h2: { fontWeight: 900 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: '12px', textTransform: 'none', fontWeight: 'bold' },
      },
    },
  },
});

export const gradientText = {
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.info.main})`,
  WebkitBackgroundClip: 'text', 
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text', 
  color: 'transparent',
};

export const backgroundKeyframes = `
  @keyframes pulse {
    0%, 100% { opacity: 0.2; transform: scale(0.95); }
    50% { opacity: 0.4; transform: scale(1.05); }
  }
`;

// Data for the landing page components
export const mockData = {
  navItems: ['Features', 'Process', 'About', 'Contact'],
  
  features: [
    { 
      title: "Smart Scheduling", 
      description: "AI-powered booking system that finds the perfect slot for your needs.", 
      gradient: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` 
    },
    { 
      title: "Real-time Updates", 
      description: "Live notifications and progress tracking throughout your service.", 
      gradient: `linear-gradient(to right, ${theme.palette.info.main}, ${theme.palette.primary.dark})` 
    },
    { 
      title: "Digital Records", 
      description: "Complete service history accessible anytime, anywhere.", 
      gradient: `linear-gradient(to right, ${theme.palette.secondary.main}, #ec4899)` 
    },
    { 
      title: "Smart Diagnostics", 
      description: "Advanced tools ensure accurate diagnosis and efficient repairs.", 
      gradient: `linear-gradient(to right, ${theme.palette.success.main}, ${theme.palette.success.dark})` 
    },
  ],
  
  processSteps: [
    { 
      title: "Book Your Service", 
      desc: "Select your service type and preferred time slot through our intelligent booking system." 
    },
    { 
      title: "Smart Drop-off", 
      desc: "Quick vehicle inspection and digital check-in at our modern Imaduwa facility." 
    },
    { 
      title: "Real-time Tracking", 
      desc: "Monitor progress with live updates and collect when ready." 
    },
  ],
  
  stats: [
    { label: "Happy Customers", value: "5,000+" },
    { label: "Services Completed", value: "15,000+" },
    { label: "Average Rating", value: "4.9/5" },
    { label: "Response Time", value: "<2hrs" },
  ]
};