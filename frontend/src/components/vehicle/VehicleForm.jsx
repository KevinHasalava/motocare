// frontend/src/components/vehicle/VehicleForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, TextField, MenuItem, Button, Stack,
  Grid, InputAdornment, Box, Fade, alpha, Zoom, Divider, Chip
} from '@mui/material';
import {
  AddCircleOutline as AddIcon, Edit as EditIcon,
  ConfirmationNumber as VehicleNumberIcon, DirectionsCar as TypeIcon,
  BrandingWatermark as BrandIcon, Category as ModelIcon, Event as YearIcon,
  Save as SaveIcon, Cancel as CancelIcon, AutoAwesome as SparkleIcon
} from '@mui/icons-material';
import { addVehicle, updateVehicle } from '../../api/vehicleService';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const initialFormState = {
  vehicleNumber: '',
  type: '',
  brand: '',
  model: '',
  year: null,
};

const VehicleForm = ({ onVehicleAdded, editingVehicle, onUpdateComplete, theme }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [hoveredField, setHoveredField] = useState(null);

  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        ...editingVehicle,
        year: editingVehicle.year ? dayjs(new Date(editingVehicle.year, 0, 1)) : null
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editingVehicle]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleYearChange = (newYear) => {
    setFormData({ ...formData, year: newYear });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedUser) {
      alert("❌ Please log in to add vehicles");
      return;
    }

    const dataToSend = {
      ...formData,
      year: formData.year ? formData.year.year() : "",
      owner: loggedUser._id,
      ownerName: loggedUser.name
    };

    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle._id, dataToSend);
        onUpdateComplete();
      } else {
        await addVehicle(dataToSend);
        onVehicleAdded();
      }
      setFormData(initialFormState);
    } catch (err) {
      console.error("Vehicle Save Error:", err);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    onUpdateComplete();
  };

  const vehicleTypes = [
    { value: 'Car', icon: '🚗', color: '#3b82f6' },
    { value: 'Three Wheel', icon: '🛺', color: '#f59e0b' },
    { value: 'Bike', icon: '🏍️', color: '#ef4444' },
    { value: 'Van', icon: '🚐', color: '#10b981' }
  ];

  return (
    <Fade in timeout={600}>
      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4, position: 'relative' }}>
        {/* Floating Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            left: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            opacity: 0.1,
            filter: 'blur(40px)',
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            right: -20,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            opacity: 0.1,
            filter: 'blur(40px)',
            animation: 'float 6s ease-in-out infinite 2s',
          }}
        />

        <Card 
          sx={{ 
            borderRadius: '24px',
            background: '#0a0e1a',
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Animated Header Bar */}
          <Box
            sx={{
              height: 4,
              background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c, #667eea)',
              backgroundSize: '200% 100%',
              animation: 'gradient 4s linear infinite',
            }}
          />

          <CardContent sx={{ p: 0 }}>
            {/* Header Section */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                p: 4,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={3}>
                <Box
                  sx={{
                    position: 'relative',
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      opacity: 0.2,
                      animation: 'pulse 3s ease-in-out infinite',
                    }}
                  />
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {editingVehicle ? 
                      <EditIcon sx={{ color: 'white', fontSize: 32 }} /> : 
                      <AddIcon sx={{ color: 'white', fontSize: 32 }} />
                    }
                  </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Typography 
                      variant="h3" 
                      sx={{
                        fontWeight: 800,
                        fontSize: '2rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
                    </Typography>
                    <SparkleIcon sx={{ color: '#fbbf24', fontSize: 24 }} />
                  </Stack>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.95rem' }}>
                    {editingVehicle ? 
                      'Modify your vehicle details below' : 
                      'Fill in the details to register your vehicle'
                    }
                  </Typography>
                </Box>

                {editingVehicle && (
                  <Chip
                    label="EDIT MODE"
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                      color: 'white',
                      fontWeight: 700,
                      letterSpacing: 1,
                      px: 2,
                    }}
                  />
                )}
              </Stack>
            </Box>

            {/* Form Section */}
            <Box sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                {/* Vehicle Type Selection - Visual Cards */}
                {!editingVehicle && (
                  <Box sx={{ mb: 4 }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2, fontWeight: 600 }}>
                      Select Vehicle Type
                    </Typography>
                    <Grid container spacing={2}>
                      {vehicleTypes.map((type) => (
                        <Grid item xs={6} sm={3} key={type.value}>
                          <Box
                            onClick={() => setFormData({ ...formData, type: type.value })}
                            sx={{
                              p: 2,
                              borderRadius: '16px',
                              border: '2px solid',
                              borderColor: formData.type === type.value ? type.color : 'rgba(255, 255, 255, 0.1)',
                              background: formData.type === type.value 
                                ? alpha(type.color, 0.1) 
                                : 'rgba(255, 255, 255, 0.02)',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              textAlign: 'center',
                              '&:hover': {
                                borderColor: type.color,
                                background: alpha(type.color, 0.05),
                                transform: 'translateY(-4px)',
                              }
                            }}
                          >
                            <Typography sx={{ fontSize: 32, mb: 1 }}>{type.icon}</Typography>
                            <Typography sx={{ 
                              color: formData.type === type.value ? type.color : 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.875rem',
                              fontWeight: 600
                            }}>
                              {type.value}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Form Fields */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      onMouseEnter={() => setHoveredField('vehicleNumber')}
                      onMouseLeave={() => setHoveredField(null)}
                      sx={{
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: -2,
                          borderRadius: '12px',
                          padding: '2px',
                          background: hoveredField === 'vehicleNumber' 
                            ? 'linear-gradient(135deg, #667eea, #764ba2)'
                            : 'transparent',
                          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          maskComposite: 'exclude',
                          opacity: 0.5,
                          transition: 'all 0.3s ease',
                        }
                      }}
                    >
                      <TextField
                        name="vehicleNumber"
                        label="Vehicle Number"
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                        fullWidth
                        required
                        disabled={!!editingVehicle}
                        InputProps={{ 
                          startAdornment: (
                            <InputAdornment position="start">
                              <VehicleNumberIcon sx={{ color: '#667eea' }} />
                            </InputAdornment>
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.1)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#667eea',
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.5)',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: 'rgba(255, 255, 255, 0.9)',
                          }
                        }}
                      />
                    </Box>
                  </Grid>

                  {editingVehicle && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        name="type"
                        label="Vehicle Type"
                        value={formData.type}
                        onChange={handleChange}
                        fullWidth
                        required
                        InputProps={{ 
                          startAdornment: (
                            <InputAdornment position="start">
                              <TypeIcon sx={{ color: '#764ba2' }} />
                            </InputAdornment>
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.1)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#764ba2',
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.5)',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: 'rgba(255, 255, 255, 0.9)',
                          }
                        }}
                      >
                        {vehicleTypes.map(type => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.icon} {type.value}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <Box
                      onMouseEnter={() => setHoveredField('brand')}
                      onMouseLeave={() => setHoveredField(null)}
                      sx={{
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: -2,
                          borderRadius: '12px',
                          padding: '2px',
                          background: hoveredField === 'brand' 
                            ? 'linear-gradient(135deg, #f093fb, #f5576c)'
                            : 'transparent',
                          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          maskComposite: 'exclude',
                          opacity: 0.5,
                          transition: 'all 0.3s ease',
                        }
                      }}
                    >
                      <TextField
                        name="brand"
                        label="Brand"
                        value={formData.brand}
                        onChange={handleChange}
                        fullWidth
                        required
                        InputProps={{ 
                          startAdornment: (
                            <InputAdornment position="start">
                              <BrandIcon sx={{ color: '#f093fb' }} />
                            </InputAdornment>
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.1)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#f093fb',
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.5)',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: 'rgba(255, 255, 255, 0.9)',
                          }
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="model"
                      label="Model"
                      value={formData.model}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{ 
                        startAdornment: (
                          <InputAdornment position="start">
                            <ModelIcon sx={{ color: '#f5576c' }} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#f5576c',
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.5)',
                        },
                        '& .MuiOutlinedInput-input': {
                          color: 'rgba(255, 255, 255, 0.9)',
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={editingVehicle ? 6 : 12}>
                    <DatePicker
                      label="Year"
                      views={['year']}
                      value={formData.year}
                      onChange={handleYearChange}
                      minDate={dayjs('1990-01-01')}
                      maxDate={dayjs('2025-12-31')}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          required
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <YearIcon sx={{ color: '#fbbf24' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: 'rgba(255, 255, 255, 0.02)',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#fbbf24',
                              }
                            },
                            '& .MuiInputLabel-root': {
                              color: 'rgba(255, 255, 255, 0.5)',
                            },
                            '& .MuiOutlinedInput-input': {
                              color: 'rgba(255, 255, 255, 0.9)',
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth
                    size="large"
                    startIcon={editingVehicle ? <SaveIcon /> : <AddIcon />}
                    sx={{ 
                      py: 2,
                      px: 4,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      letterSpacing: 0.5,
                      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)',
                      }
                    }}
                  >
                    {editingVehicle ? 'Save Changes' : 'Add Vehicle'}
                  </Button>
                  
                  {editingVehicle && (
                    <Button 
                      type="button" 
                      variant="outlined" 
                      onClick={handleCancel} 
                      fullWidth
                      size="large"
                      startIcon={<CancelIcon />}
                      sx={{ 
                        py: 2,
                        px: 4,
                        borderRadius: '12px',
                        borderColor: 'rgba(239, 68, 68, 0.5)',
                        color: '#ef4444',
                        fontSize: '1rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        letterSpacing: 0.5,
                        '&:hover': {
                          borderColor: '#ef4444',
                          background: 'rgba(239, 68, 68, 0.1)',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Stack>
              </form>
            </Box>
          </CardContent>
        </Card>

        {/* Add animations */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(1.05); }
          }
        `}</style>
      </Box>
    </Fade>
  );
};

export default VehicleForm;