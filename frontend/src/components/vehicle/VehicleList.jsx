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
      'motorcycle': '🏍️',
      'truck': '🚛',
      'bus': '🚌',
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
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            p: 3,
            mb: 4,
            border: '1px solid',
            borderColor: alpha('#fff', 0.1),
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
              animation: 'shimmer 3s ease-in-out infinite',
            }
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
              }}
            >
              <CarIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  ...gradientText,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                }}
              >
                My Vehicles
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Manage your registered vehicles
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <Chip
                label={`${myVehicles.length} vehicle${myVehicles.length !== 1 ? 's' : ''}`}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 600,
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
                      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: alpha('#fff', 0.1),
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                        '& .vehicle-actions': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                        '& .vehicle-icon': {
                          transform: 'scale(1.1) rotate(5deg)',
                        }
                      },
                    }}
                  >
                    {/* Decorative Background */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${alpha('#6366f1', 0.1)} 0%, ${alpha('#a855f7', 0.1)} 100%)`,
                        filter: 'blur(40px)',
                      }}
                    />

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
                            fontWeight: 700,
                            mb: 1,
                            background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {vehicle.brand} {vehicle.model}
                        </Typography>

                        <Stack spacing={1.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <NumberIcon sx={{ fontSize: 18, color: 'primary.light' }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {vehicle.vehicleNumber}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <YearIcon sx={{ fontSize: 18, color: 'secondary.light' }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
                          borderTop: '1px solid',
                          borderColor: alpha('#fff', 0.1),
                          opacity: 0.7,
                          transform: 'translateY(10px)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Tooltip title="Edit Vehicle" arrow>
                          <IconButton
                            onClick={() => onEdit(vehicle)}
                            sx={{
                              flex: 1,
                              borderRadius: 2,
                              background: alpha('#10b981', 0.1),
                              border: '1px solid',
                              borderColor: alpha('#10b981', 0.3),
                              color: '#10b981',
                              '&:hover': {
                                background: alpha('#10b981', 0.2),
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
                              background: alpha('#ef4444', 0.1),
                              border: '1px solid',
                              borderColor: alpha('#ef4444', 0.3),
                              color: '#ef4444',
                              '&:hover': {
                                background: alpha('#ef4444', 0.2),
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
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: '1px solid',
                borderColor: alpha('#fff', 0.1),
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <NoResultsIcon sx={{ fontSize: 60, color: 'primary.light' }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  ...gradientText
                }}
              >
                No Vehicles Yet
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Start by adding your first vehicle to manage your fleet
              </Typography>
              <Typography variant="h3" sx={{ opacity: 0.3 }}>
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