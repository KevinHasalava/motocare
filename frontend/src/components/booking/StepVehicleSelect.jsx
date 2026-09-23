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
                      ? '#FEF2F2'
                      : '#FFFFFF',
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: vehicle?._id === v._id ? '#D32F2F' : '#E2E8F0',
                    boxShadow: vehicle?._id === v._id ? '0 10px 25px -5px rgba(211, 47, 47, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
                      borderColor: vehicle?._id === v._id ? '#D32F2F' : '#CBD5E1',
                    }
                  }}
                  onClick={() => setVehicle(v)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box sx={{ fontSize: 44 }}>
                        {getVehicleIcon(v.type)}
                      </Box>
                      {vehicle?._id === v._id && (
                        <CheckCircleIcon sx={{ color: '#D32F2F', fontSize: 28 }} />
                      )}
                    </Stack>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: '#0F172A',
                      }}
                    >
                      {v.brand} {v.model}
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <NumbersIcon sx={{ fontSize: 16, color: '#D32F2F' }} />
                        <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
                          {v.vehicleNumber}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CategoryIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                        <Typography variant="body2" sx={{ color: '#64748B' }}>
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
                  background: '#FFFFFF',
                  borderRadius: 3,
                  border: '2px dashed #CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: '#D32F2F',
                    background: '#FEF2F2',
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <IconButton 
                    sx={{ 
                      background: 'rgba(211, 47, 47, 0.08)',
                      mb: 2,
                      '&:hover': { background: 'rgba(211, 47, 47, 0.15)' }
                    }}
                  >
                    <AddCircleIcon sx={{ fontSize: 44, color: '#D32F2F' }} />
                  </IconButton>
                  <Typography sx={{ color: '#D32F2F', fontWeight: 700, fontSize: '0.95rem' }}>
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
              background: '#D32F2F',
              color: '#FFFFFF',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(211, 47, 47, 0.3)',
              '&:hover': {
                background: '#B71C1C',
                boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
              },
              '&.Mui-disabled': {
                background: '#E2E8F0',
                color: '#94A3B8',
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