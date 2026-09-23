import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // 🚨 Protect route -> only logged in users
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      alert("❌ Please log in to manage vehicles");
      navigate("/login");
    }
  }, [navigate]);

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
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          position: 'relative',
          overflowX: 'hidden',
          background: '#F8F9FB',
        }}>
          <Header
            navItems={mockData.navItems}
            onBookNowClick={handleBookServiceClick}
            theme={theme}
          />

          <Box
            component="main"
            sx={{ flexGrow: 1, pt: '80px', pb: 8 }}
          >
            <Container maxWidth="lg">
              <Box sx={{
                mt: 4, mb: 6,
                p: { xs: 3, md: 4 },
                borderRadius: '20px',
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                position: 'relative', overflow: 'hidden',
                textAlign: 'center',
                '&::before': {
                  content: '""', position: 'absolute',
                  top: 0, left: 0, right: 0, height: '3px',
                  background: '#D32F2F',
                }
              }}>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 900,
                    color: '#111827',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    mb: 1
                  }}
                >
                  Vehicle <Box component="span" sx={{ color: '#D32F2F' }}>Management</Box>
                </Typography>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280', fontSize: '0.95rem' }}>
                  Register, update, and manage your vehicle profiles for seamless service bookings
                </Typography>
              </Box>

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