import React from 'react';
import {
  Box, Button, Card, CardContent, Grid, Paper,
  Stack, Typography, Chip, Fade, alpha
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const StepConfirm = ({ vehicle, service, date, time, onBack, onConfirm }) => {
  const getVehicleIcon = (type) => {
    const icons = {
      'car': '🚗',
      'motorcycle': '🏍️',
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
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: '1px solid',
                borderColor: alpha('#fff', 0.1),
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  p: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                  }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: alpha('#fff', 0.2),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircleIcon sx={{ color: 'white', fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                      Confirm Your Booking
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.9) }}>
                      Please review your booking details
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  {/* Vehicle Details */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      background: alpha('#667eea', 0.05),
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: alpha('#667eea', 0.2),
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ fontSize: 32 }}>
                        {getVehicleIcon(vehicle?.type)}
                      </Box>
                      <Box flex={1}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                          Vehicle
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                          {vehicle?.brand} {vehicle?.model}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {vehicle?.vehicleNumber}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                  
                  {/* Service Details */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      background: alpha('#a855f7', 0.05),
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: alpha('#a855f7', 0.2),
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: alpha('#a855f7', 0.2),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <BuildIcon sx={{ color: '#a855f7' }} />
                      </Box>
                      <Box flex={1}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                          Service
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                          {service?.name}
                        </Typography>
                        <Chip
                          label={`₹${service?.price}`}
                          size="small"
                          sx={{
                            mt: 1,
                            background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Stack>
                  </Paper>
                  
                  {/* Date & Time */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          background: alpha('#10b981', 0.05),
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: alpha('#10b981', 0.2),
                          height: '100%',
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <CalendarMonthIcon sx={{ color: '#10b981', fontSize: 28 }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Date
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                              {date.format("DD MMM YYYY")}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          background: alpha('#3b82f6', 0.05),
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: alpha('#3b82f6', 0.2),
                          height: '100%',
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <AccessTimeIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Time
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                              {time?.format("HH:mm")}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>
                </Stack>
                
                {/* Action Buttons */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant="outlined" 
                    onClick={onBack}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderColor: alpha('#fff', 0.3),
                      color: 'white',
                      '&:hover': {
                        borderColor: alpha('#fff', 0.5),
                        background: alpha('#fff', 0.1),
                      }
                    }}
                  >
                    Back
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={onConfirm}
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #14b8a6 0%, #10b981 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)',
                      }
                    }}
                  >
                    Confirm Booking
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default StepConfirm;