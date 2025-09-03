// frontend/src/pages/VehiclePage.jsx (Redesigned)
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, GlobalStyles, CssBaseline, ThemeProvider } from '@mui/material';
import { getVehicles } from '../../api/vehicleService';
import VehicleForm from '../vehicle/VehicleForm';
import VehicleList from '../vehicle/VehicleList';
import { theme, backgroundKeyframes, gradientText } from '../../utils/theme'; // Import your full theme

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
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form for better UX
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={backgroundKeyframes} />

      {/* Animated Background Blobs (copied from Landing.jsx) */}
      <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
        <Box sx={{ position: 'absolute', top: '10%', left: '10%', width: 384, height: 384, bgcolor: 'primary.main', borderRadius: '50%', filter: 'blur(100px)', animation: 'pulse 8s infinite ease-in-out' }} />
        <Box sx={{ position: 'absolute', bottom: '10%', right: '10%', width: 384, height: 384, bgcolor: 'secondary.main', borderRadius: '50%', filter: 'blur(100px)', animation: 'pulse 8s infinite 2s ease-in-out' }} />
      </Box>

      <Box sx={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{ mb: 6, fontSize: { xs: '2.5rem', md: '3.75rem' } }}
          >
            <Box component="span" sx={gradientText}>Vehicle</Box> Management
          </Typography>

          <VehicleForm
            onVehicleAdded={loadVehicles}
            editingVehicle={editingVehicle}
            onUpdateComplete={handleUpdateComplete}
            theme={theme} // Pass theme for gradients
          />
          
          <VehicleList
            vehicles={vehicles}
            onVehicleDeleted={loadVehicles}
            onEdit={handleEdit}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default VehiclePage;