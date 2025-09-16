// frontend/src/pages/VehiclePage.jsx (Corrected Layout)
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, GlobalStyles, CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { getVehicles } from '../api/vehicleService';
import VehicleForm from '../components/vehicle/VehicleForm';
import VehicleList from '../components/vehicle/VehicleList';
import { theme, backgroundKeyframes, gradientText, mockData } from '../utils/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const VehiclePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const loadVehicles = async () => {
    try {
      const res = await getVehicles();
      setVehicles(res.data);
    } catch (error) {
      console.error("Failed to load vehicles:", error);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleUpdateComplete = () => {
    setEditingVehicle(null);
    loadVehicles();
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBookServiceClick = () => {
    console.log("Book service clicked from Vehicle Page!");
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <GlobalStyles styles={backgroundKeyframes} />

        {/* Background Blobs */}
        <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
          <Box sx={{ position: 'absolute', top: '10%', left: '10%', width: 384, height: 384, bgcolor: 'primary.main', borderRadius: '50%', filter: 'blur(100px)', animation: 'pulse 8s infinite ease-in-out' }} />
          <Box sx={{ position: 'absolute', bottom: '10%', right: '10%', width: 384, height: 384, bgcolor: 'secondary.main', borderRadius: '50%', filter: 'blur(100px)', animation: 'pulse 8s infinite 2s ease-in-out' }} />
        </Box>

        {/* --- 1. Page එකේ ප්‍රධාන layout එකට Flexbox එකතු කළා --- */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          position: 'relative',
          overflowX: 'hidden',
        }}>

          <Header
            navItems={mockData.navItems}
            onBookNowClick={handleBookServiceClick}
            theme={theme}
          />

          {/* --- 2. ප්‍රධාන content එකට වෙනම <Box component="main"> එකක් හැදුවා --- */}
          <Box
            component="main"
            sx={{
              flexGrow: 1, // ඉතුරු සම්පූර්ණ ඉඩම ගන්නවා (මේකෙන් Footer එක පහළට තල්ලු වෙනවා)
              pt: '80px', // --- 3. Header එකේ උස (80px) ප්‍රමාණයට උඩින් ඉඩක් එකතු කළා ---
              pb: 8, // Footer එකත් එක්ක content එක mix නොවෙන්න පොඩි ඉඩක්
            }}
          >
            <Container maxWidth="lg">
              <Typography
                variant="h2"
                component="h1"
                align="center"
                sx={{ mt: 4, mb: 6, fontSize: { xs: '2.5rem', md: '3.75rem' } }}
              >
                <Box component="span" sx={gradientText}>Vehicle</Box> Management
              </Typography>

              <VehicleForm
                onVehicleAdded={loadVehicles}
                editingVehicle={editingVehicle}
                onUpdateComplete={handleUpdateComplete}
                theme={theme}
              />

              <VehicleList
                vehicles={vehicles}
                onVehicleDeleted={loadVehicles}
                onEdit={handleEdit}
              />
            </Container>
          </Box>
          
          <Footer />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default VehiclePage;