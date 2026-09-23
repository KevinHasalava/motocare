// frontend/src/components/vehicle/VehicleList.jsx
import React from 'react';
import {
  Box, Typography, Paper, IconButton, Stack, Tooltip,
  Chip, Card, CardContent, Grid, Fade, Zoom, alpha
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon,
  DirectionsCar as CarIcon, SearchOff as NoResultsIcon,
  CalendarMonth as YearIcon, Category as TypeIcon,
  Tag as NumberIcon, DirectionsCarFilled as ModelIcon
} from '@mui/icons-material';
import { deleteVehicle } from '../../api/vehicleService';
import { gradientText } from '../../utils/theme';

const VehicleList = ({ vehicles, onVehicleDeleted, onEdit }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const myVehicles = vehicles.filter(v => v.owner === user?._id);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      await deleteVehicle(id);
      onVehicleDeleted();
    }
  };

  const getVehicleIcon = (type) => {
    const icons = {
      'car': '🚗',
      'three wheel': '🛺',
      'motorcycle': '🏍️',
      'van': '🚐',
      'suv': '🚙'
    };
    return icons[type?.toLowerCase()] || '🚗';
  };

  const getTypeColor = (type) => {
    const colors = {
      'car': 'primary',
      'motorcycle': 'warning',
      'truck': 'info',
      'bus': 'secondary',
      'van': 'success',
      'suv': 'error'
    };
    return colors[type?.toLowerCase()] || 'default';
  };

  return (
    <Fade in timeout={600}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 0 } }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            background: '#FFFFFF',
            borderRadius: '16px',
            p: 3,
            mb: 4,
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: '#D32F2F',
            }
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '14px',
                background: '#D32F2F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(211, 47, 47, 0.3)',
              }}
            >
              <CarIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#111827',
                }}
              >
                My Vehicles
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', mt: 0.5 }}>
                Manage your registered vehicles
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <Chip
                label={`${myVehicles.length} vehicle${myVehicles.length !== 1 ? 's' : ''}`}
                sx={{
                  background: '#FEE2E2',
                  color: '#B91C1C',
                  fontWeight: 700,
                  borderRadius: '8px',
                }}
              />
            </Box>
          </Stack>
        </Paper>

        {/* Vehicles Grid */}
        {myVehicles.length > 0 ? (
          <Grid container spacing={3}>
            {myVehicles.map((vehicle, index) => (
              <Grid item xs={12} sm={6} md={4} key={vehicle._id}>
                <Zoom in timeout={300 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.1)',
                        '& .vehicle-actions': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                        '& .vehicle-icon': {
                          transform: 'scale(1.08) rotate(3deg)',
                        }
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Vehicle Icon and Number */}
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box
                          className="vehicle-icon"
                          sx={{
                            fontSize: 48,
                            transition: 'transform 0.3s ease',
                          }}
                        >
                          {getVehicleIcon(vehicle.type)}
                        </Box>
                        <Chip
                          size="small"
                          label={vehicle.type}
                          color={getTypeColor(vehicle.type)}
                          sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                        />
                      </Stack>

                      {/* Vehicle Details */}
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 700,
                            mb: 1,
                            color: '#111827',
                          }}
                        >
                          {vehicle.brand} {vehicle.model}
                        </Typography>

                        <Stack spacing={1.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <NumberIcon sx={{ fontSize: 18, color: '#D32F2F' }} />
                            <Typography variant="body2" sx={{ color: '#4B5563', fontWeight: 500 }}>
                              {vehicle.vehicleNumber}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <YearIcon sx={{ fontSize: 18, color: '#6B7280' }} />
                            <Typography variant="body2" sx={{ color: '#4B5563' }}>
                              Year: {vehicle.year}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>

                      {/* Action Buttons */}
                      <Stack
                        className="vehicle-actions"
                        direction="row"
                        spacing={1}
                        sx={{
                          mt: 3,
                          pt: 2,
                          borderTop: '1px solid #E5E7EB',
                          opacity: 0.9,
                          transform: 'translateY(0)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Tooltip title="Edit Vehicle" arrow>
                          <IconButton
                            onClick={() => onEdit(vehicle)}
                            sx={{
                              flex: 1,
                              borderRadius: 2,
                              background: '#F0FDF4',
                              border: '1px solid #BBF7D0',
                              color: '#16A34A',
                              '&:hover': {
                                background: '#DCFCE7',
                                transform: 'scale(1.05)',
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Vehicle" arrow>
                          <IconButton
                            onClick={() => handleDelete(vehicle._id)}
                            sx={{
                              flex: 1,
                              borderRadius: 2,
                              background: '#FEF2F2',
                              border: '1px solid #FECACA',
                              color: '#DC2626',
                              '&:hover': {
                                background: '#FEE2E2',
                                transform: 'scale(1.05)',
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        ) : (
          /* Empty State */
          <Fade in timeout={600}>
            <Paper
              sx={{
                p: 8,
                textAlign: 'center',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <NoResultsIcon sx={{ fontSize: 50, color: '#D32F2F' }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  mb: 1,
                  color: '#111827',
                }}
              >
                No Vehicles Yet
              </Typography>
              <Typography sx={{ color: '#6B7280', mb: 3 }}>
                Start by adding your first vehicle to manage your fleet
              </Typography>
              <Typography variant="h3" sx={{ opacity: 0.5 }}>
                🚗 🏍️ 🚛
              </Typography>
            </Paper>
          </Fade>
        )}

        {/* Add shimmer animation */}
        <style jsx global>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </Box>
    </Fade>
  );
};

export default VehicleList;