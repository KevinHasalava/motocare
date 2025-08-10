import React, { useState, useEffect } from 'react';
import {
  ThemeProvider, createTheme, CssBaseline, Box, Container, AppBar, Toolbar, Typography, Button, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemText, Grid, Paper, Stack, GlobalStyles, Fade
} from '@mui/material';
import {
  Event as CalendarIcon, AccessTime as ClockIcon, History as HistoryIcon, Build as WrenchIcon,
  ArrowForward as ArrowRightIcon, Phone as PhoneIcon, LocationOn as MapPinIcon, Mail as MailIcon,
  Menu as MenuIcon, DirectionsCar as CarIcon, Star as StarIcon, CheckCircle as CheckCircleIcon,
  FlashOn as ZapIcon, PlayArrow as PlayIcon
} from '@mui/icons-material';

// ===================================================================================
// 1. THEME & GLOBAL STYLES (මෙය වෙනස් කර නැත)
// ===================================================================================

const theme = createTheme({
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

const gradientText = {
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.info.main})`,
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  backgroundClip: 'text', color: 'transparent',
};

const backgroundKeyframes = `
  @keyframes pulse {
    0%, 100% { opacity: 0.2; transform: scale(0.95); }
    50% { opacity: 0.4; transform: scale(1.05); }
  }
`;

// ===================================================================================
// 2. CHILD COMPONENTS (වෙන් කරන ලද Components)
// ===================================================================================

// =================== Header Component ===================
const Header = ({ navItems, onBookNowClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsMenuOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250, p: 2, backgroundColor: 'background.default', height: '100%' }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton href={`#${item.toLowerCase()}`}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained" fullWidth startIcon={<CalendarIcon />} onClick={onBookNowClick}
        sx={{ mt: 2, py: 1.5, background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})` }}
      >
        Book Now
      </Button>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed" elevation={0}
        sx={{
          backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)',
          borderBottom: '1px solid', borderColor: 'rgba(51, 65, 85, 0.5)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 80 }}>
            {/* Logo */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <CarIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" component="h1" sx={{ ...gradientText, fontWeight: 'bold' }}>
                  Moto-Care
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'primary.light', fontWeight: 'semibold', letterSpacing: '0.1em' }}>
                  PRO
                </Typography>
              </Box>
            </Stack>

            {/* Desktop Navigation */}
            <Stack direction="row" spacing={4} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <Button key={item} href={`#${item.toLowerCase()}`}
                  sx={{
                    color: 'text.secondary', '&:hover': { color: 'primary.light', backgroundColor: 'transparent' },
                    position: 'relative',
                    '&::after': {
                      content: '""', position: 'absolute', width: 0, height: '2px', bottom: '-4px', left: 0,
                      background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      transition: 'width 0.3s ease',
                    },
                    '&:hover::after': { width: '100%' },
                  }}
                >
                  {item}
                </Button>
              ))}
              <Button
                onClick={onBookNowClick} variant="contained" startIcon={<CalendarIcon />}
                sx={{
                  px: 3, py: 1.5, background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.05)', boxShadow: `0 8px 25px ${theme.palette.primary.dark}` }
                }}
              >
                Book Now
              </Button>
            </Stack>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit" aria-label="open drawer" edge="end" onClick={toggleDrawer(true)}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer anchor="right" open={isMenuOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};


// =================== Hero Section Component ===================
const HeroSection = ({ isVisible, onBookNowClick, stats }) => (
  <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 10, textAlign: 'center' }}>
    <Fade in={isVisible} timeout={1000}>
      <Box>
        <Typography sx={{ color: 'primary.light', textTransform: 'uppercase', letterSpacing: '0.2em', mb: 2 }}>
          Next Generation Auto Care
        </Typography>
        <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '3rem', md: '4.5rem' }, mb: 3 }}>
          Experience the <Box component="span" sx={gradientText}>Future</Box>
          <br />
          of Vehicle Servicing
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mb: 6, lineHeight: 1.7 }}>
          Transform your vehicle maintenance experience with our cutting-edge digital platform. Smart scheduling, real-time updates, and premium service quality.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 8 }}>
          <Button
            onClick={onBookNowClick} size="large" endIcon={<ArrowRightIcon />}
            sx={{
              px: 4, py: 1.5, fontSize: '1.1rem',
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white', '&:hover': { transform: 'scale(1.05)', boxShadow: `0 8px 25px ${theme.palette.primary.dark}` }
            }}
          >
            Start Your Journey
          </Button>
          <Button variant="outlined" color="primary" size="large" startIcon={<PlayIcon />}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem', '&:hover': { transform: 'scale(1.05)', backgroundColor: 'rgba(99, 102, 241, 0.1)' } }}>
            Watch Demo
          </Button>
        </Stack>
        <Grid container spacing={4}>
          {stats.map((stat) => (
            <Grid item xs={6} md={3} key={stat.label}>
              {stat.icon}
              <Typography variant="h4" component="div" sx={{ fontWeight: 'black', mt: 1 }}>{stat.value}</Typography>
              <Typography color="text.secondary">{stat.label}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Fade>
  </Container>
);

// =================== Features Section Component ===================
const FeaturesSection = ({ isVisible, features }) => (
  <Box component="section" id="features" sx={{ py: 12 }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 10 }}>
        <Typography variant="h2" component="h2" sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
          Powerful <Box component="span" sx={gradientText}>Features</Box>
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
          Advanced technology meets exceptional service quality
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title}>
            <Fade in={isVisible} timeout={1000} style={{ transitionDelay: `${index * 150}ms` }}>
              <Paper
                elevation={4}
                sx={{
                  p: 4, height: '100%', border: '1px solid', borderColor: 'rgba(51, 65, 85, 0.5)',
                  backdropFilter: 'blur(10px)', transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)', borderColor: 'primary.main',
                    boxShadow: `0 10px 20px ${theme.palette.primary.dark}33`,
                  }
                }}
              >
                <Box sx={{
                  p: 1.5, borderRadius: 3, mb: 3, display: 'inline-block',
                  background: feature.gradient, transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.1)' }
                }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" sx={{ mb: 2 }}>{feature.title}</Typography>
                <Typography color="text.secondary">{feature.description}</Typography>
              </Paper>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

// =================== Process Section Component ===================
const ProcessSection = ({ isVisible, processSteps }) => (
  <Box component="section" id="process" sx={{ py: 12, backgroundColor: 'rgba(30, 41, 59, 0.3)' }}>
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mb: 10 }}>
        <Typography variant="h2" component="h2" sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
          Simple <Box component="span" sx={gradientText}>Process</Box>
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Three easy steps to premium vehicle care
        </Typography>
      </Box>
      <Stack spacing={4}>
        {processSteps.map((step, index) => (
          <Fade in={isVisible} timeout={1000} style={{ transitionDelay: `${index * 200}ms` }} key={step.title}>
            <Stack direction="row" spacing={4} alignItems="flex-start">
              <Stack alignItems="center">
                <Box sx={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 8px 25px ${theme.palette.primary.dark}4D`, zIndex: 1
                }}>
                  <Typography variant="h4" sx={{ fontWeight: 'black' }}>{index + 1}</Typography>
                </Box>
                {index < processSteps.length - 1 &&
                  <Box sx={{ width: '2px', height: '100px', mt: 2, background: `linear-gradient(to bottom, ${theme.palette.primary.main}, transparent)` }} />
                }
              </Stack>
              <Box sx={{ pt: 2 }}>
                <Typography variant="h5" component="h3" sx={{ mb: 1 }}>{step.title}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>{step.desc}</Typography>
              </Box>
            </Stack>
          </Fade>
        ))}
      </Stack>
    </Container>
  </Box>
);

// =================== CTA Section Component ===================
const CtaSection = ({ onBookNowClick }) => (
  <Box component="section" sx={{ py: 12 }}>
    <Container maxWidth="md">
      <Paper sx={{
        p: { xs: 4, md: 8 }, textAlign: 'center', borderRadius: 4, border: '1px solid',
        borderColor: 'primary.dark', background: `linear-gradient(to right, rgba(29, 78, 216, 0.2), rgba(126, 34, 206, 0.2))`
      }}>
        <Typography variant="h2" component="h2" sx={{ mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>
          Ready to <Box component="span" sx={gradientText}>Upgrade</Box> Your Experience?
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 5, maxWidth: '600px', mx: 'auto' }}>
          Join thousands of satisfied customers who've made the switch to intelligent vehicle care.
        </Typography>
        <Button
          onClick={onBookNowClick} size="large"
          sx={{
            px: 5, py: 2, fontSize: '1.2rem',
            background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white', '&:hover': { transform: 'scale(1.05)', boxShadow: `0 8px 25px ${theme.palette.primary.dark}` }
          }}
        >
          Book Your Service Today
        </Button>
      </Paper>
    </Container>
  </Box>
);

// =================== Footer Component ===================
const Footer = () => (
  <Box component="footer" id="contact" sx={{
    py: 8, px: 2, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)',
    borderTop: '1px solid', borderColor: 'rgba(51, 65, 85, 0.5)',
  }}>
    <Container maxWidth="lg">
      <Grid container spacing={6}>
        <Grid item xs={12} md={5}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <CarIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h5" component="h3" sx={{ ...gradientText, fontWeight: 'bold' }}>
              Moto-Care
            </Typography>
          </Stack>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Revolutionizing vehicle servicing with cutting-edge technology and unmatched customer experience.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3.5}>
          <Typography variant="h6" component="h4" sx={{ mb: 3 }}>Contact Information</Typography>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1.5}><MapPinIcon sx={{ color: 'primary.light' }} /><Typography color="text.secondary" variant="body2">Imaduwa, Galle District, Sri Lanka</Typography></Stack>
            <Stack direction="row" alignItems="center" spacing={1.5}><MailIcon sx={{ color: 'primary.light' }} /><Typography color="text.secondary" variant="body2">contact@motocare.lk</Typography></Stack>
            <Stack direction="row" alignItems="center" spacing={1.5}><PhoneIcon sx={{ color: 'primary.light' }} /><Typography color="text.secondary" variant="body2">(+94) XX XXX XXXX</Typography></Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={3.5}>
          <Typography variant="h6" component="h4" sx={{ mb: 3 }}>Our Services</Typography>
          <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1}><CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} /><Typography color="text.secondary" variant="body2">Comprehensive Diagnostics</Typography></Stack>
            <Stack direction="row" alignItems="center" spacing={1}><CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} /><Typography color="text.secondary" variant="body2">Scheduled Maintenance</Typography></Stack>
            <Stack direction="row" alignItems="center" spacing={1}><CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} /><Typography color="text.secondary" variant="body2">Emergency Repair Solutions</Typography></Stack>
            <Stack direction="row" alignItems="center" spacing={1}><CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} /><Typography color="text.secondary" variant="body2">Digital Service Records</Typography></Stack>
          </Stack>
        </Grid>
      </Grid>
      <Box sx={{ mt: 8, pt: 4, borderTop: 1, borderColor: 'rgba(51, 65, 85, 0.5)', textAlign: 'center' }}>
        <Typography color="text.secondary" variant="body2">
          © {new Date().getFullYear()} Moto-Care (Pvt) Ltd. All Rights Reserved.
        </Typography>
      </Box>
    </Container>
  </Box>
);

// ===================================================================================
// 3. MAIN PAGE COMPONENT (ප්‍රධාන Component එක)
//    මෙතනදී අපි වෙන්කළ components එකලස් කරනවා
// ===================================================================================

const ModernVehicleServicePageMUI = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Data for components (Props විදියට යැවීමට)
  const navItems = ['Features', 'Process', 'About', 'Contact'];
  const features = [
    { icon: <CalendarIcon sx={{ fontSize: 48 }} />, title: "Smart Scheduling", description: "AI-powered booking system that finds the perfect slot for your needs.", gradient: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` },
    { icon: <ClockIcon sx={{ fontSize: 48 }} />, title: "Real-time Updates", description: "Live notifications and progress tracking throughout your service.", gradient: `linear-gradient(to right, ${theme.palette.info.main}, ${theme.palette.primary.dark})` },
    { icon: <HistoryIcon sx={{ fontSize: 48 }} />, title: "Digital Records", description: "Complete service history accessible anytime, anywhere.", gradient: `linear-gradient(to right, ${theme.palette.secondary.main}, #ec4899)` },
    { icon: <WrenchIcon sx={{ fontSize: 48 }} />, title: "Smart Diagnostics", description: "Advanced tools ensure accurate diagnosis and efficient repairs.", gradient: `linear-gradient(to right, ${theme.palette.success.main}, ${theme.palette.success.dark})` },
  ];
  const processSteps = [
    { title: "Book Your Service", desc: "Select your service type and preferred time slot through our intelligent booking system." },
    { title: "Smart Drop-off", desc: "Quick vehicle inspection and digital check-in at our modern Imaduwa facility." },
    { title: "Real-time Tracking", desc: "Monitor progress with live updates and collect when ready." },
  ];
  const stats = [
    { label: "Happy Customers", value: "5,000+", icon: <StarIcon sx={{ color: 'primary.light' }} /> },
    { label: "Services Completed", value: "15,000+", icon: <CheckCircleIcon sx={{ color: 'primary.light' }} /> },
    { label: "Average Rating", value: "4.9/5", icon: <StarIcon sx={{ color: 'primary.light' }} /> },
    { label: "Response Time", value: "<2hrs", icon: <ZapIcon sx={{ color: 'primary.light' }} /> },
  ];

  // Handler function to pass as a prop
  const handleBookServiceClick = () => {
    console.log("Advanced booking system would be implemented here!");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={backgroundKeyframes} />

      {/* Background Animated Blobs */}
      <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
        <Box sx={{ position: 'absolute', top: '25%', left: '25%', width: 384, height: 384, bgcolor: 'primary.main', borderRadius: '50%', filter: 'blur(80px)', animation: 'pulse 8s infinite ease-in-out' }} />
        <Box sx={{ position: 'absolute', top: '33%', right: '25%', width: 384, height: 384, bgcolor: 'secondary.main', borderRadius: '50%', filter: 'blur(80px)', animation: 'pulse 8s infinite 2s ease-in-out' }} />
        <Box sx={{ position: 'absolute', bottom: '25%', left: '33%', width: 384, height: 384, bgcolor: 'info.main', borderRadius: '50%', filter: 'blur(80px)', animation: 'pulse 8s infinite 4s ease-in-out' }} />
      </Box>

      <Box sx={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
        
        {/* Assembling all the components */}
        <Header navItems={navItems} onBookNowClick={handleBookServiceClick} />
        
        <Box component="main">
          <HeroSection isVisible={isVisible} onBookNowClick={handleBookServiceClick} stats={stats} />
          <FeaturesSection isVisible={isVisible} features={features} />
          <ProcessSection isVisible={isVisible} processSteps={processSteps} />
          <CtaSection onBookNowClick={handleBookServiceClick} />
        </Box>
        
        <Footer />

      </Box>
    </ThemeProvider>
  );
};

export default ModernVehicleServicePageMUI;