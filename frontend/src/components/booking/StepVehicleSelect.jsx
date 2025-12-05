import React from 'react';
import {
  Box, Button, Card, CardContent, Grid, IconButton,
  Stack, Typography, Zoom, Fade, alpha
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NumbersIcon from '@mui/icons-material/Numbers';
import CategoryIcon from '@mui/icons-material/Category';
import { Link } from 'react-router-dom';

const StepVehicleSelect = ({ vehicles, vehicle, setVehicle, onNext }) => {
  const getVehicleIcon = (type) => {
    const icons = {
      'car': '🚗',
      'motorcycle': '🏍️',
      'three wheel': '🛺',
      'truck': '🚛',
      'bus': '🚌',
      'van': '🚐',
      'suv': '🚙'
    };
    return icons[type?.toLowerCase()] || '🚗';
  };

  return (
    <Fade in timeout={600}>
      <Box>
        <Grid container spacing={3}>
          {vehicles.map((v, index) => (
            <Grid item xs={12} sm={6} md={4} key={v._id}>
              <Zoom in timeout={300 + index * 100}>
                <Card
                  sx={{
                    cursor: "pointer",
                    height: '100%',
                    background: vehicle?._id === v._id 
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: vehicle?._id === v._id ? 'primary.main' : alpha('#fff', 0.1),
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    }
                  }}
                  onClick={() => setVehicle(v)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box sx={{ fontSize: 48 }}>
                        {getVehicleIcon(v.type)}
                      </Box>
                      {vehicle?._id === v._id && (
                        <CheckCircleIcon sx={{ color: 'primary.main' }} />
                      )}
                    </Stack>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: 'white',
                      }}
                    >
                      {v.brand} {v.model}
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <NumbersIcon sx={{ fontSize: 16, color: 'primary.light' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {v.vehicleNumber}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CategoryIcon sx={{ fontSize: 16, color: 'secondary.light' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Type: {v.type}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
          
          <Grid item xs={12} sm={6} md={4}>
            <Link to="/VehiclePage" style={{ textDecoration: 'none' }}>
              <Card 
                sx={{ 
                  height: '100%',
                  minHeight: 200,
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '2px dashed',
                  borderColor: alpha('#10b981', 0.3),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: alpha('#10b981', 0.6),
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <IconButton 
                    sx={{ 
                      background: alpha('#10b981', 0.1),
                      mb: 2,
                      '&:hover': { background: alpha('#10b981', 0.2) }
                    }}
                  >
                    <AddCircleIcon sx={{ fontSize: 48, color: '#10b981' }} />
                  </IconButton>
                  <Typography sx={{ color: '#10b981', fontWeight: 600 }}>
                    Add New Vehicle
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, textAlign: 'right' }}>
          <Button 
            variant="contained" 
            disabled={!vehicle} 
            onClick={onNext}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              }
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default StepVehicleSelect;