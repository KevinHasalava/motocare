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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  // Simple validation function for vehicle form
  const validate = (field = null) => {
    let tempErrors = { ...errors };
    let isValid = true;

    const checkRequired = (name, message) => {
      if (!formData[name] || (typeof formData[name] === 'string' && !formData[name].trim())) {
        tempErrors[name] = message;
        return false;
      } else {
        delete tempErrors[name];
        return true;
      }
    };

    // Vehicle Number Validation
    if (field === 'vehicleNumber' || field === null) {
      if (checkRequired('vehicleNumber', 'Vehicle Number is required.')) {
        // Sri Lankan vehicle number format: XX-XXXX or XXX-XXXX
        const vehicleNumberRegex = /^([A-Za-z]{2,3}-\d{4})$/;
        if (formData.vehicleNumber && !vehicleNumberRegex.test(formData.vehicleNumber)) {
          tempErrors.vehicleNumber = 'Format: AB-1234 or ABC-1234 (e.g., WP-1234)';
          isValid = false;
        }
      } else { 
        isValid = false; 
      }
    }

    // Vehicle Type Validation
    if (field === 'type' || field === null) {
      if (!checkRequired('type', 'Vehicle Type is required.')) { 
        isValid = false; 
      }
    }

    // Brand Validation
    if (field === 'brand' || field === null) {
      if (checkRequired('brand', 'Brand is required.')) {
        // Only letters and spaces allowed for brand
        if (formData.brand && !/^[A-Za-z\s]+$/.test(formData.brand.trim())) {
          tempErrors.brand = 'Brand must contain only letters and spaces';
          isValid = false;
        }
      } else { 
        isValid = false; 
      }
    }

    // Model Validation
    if (field === 'model' || field === null) {
      if (checkRequired('model', 'Model is required.')) {
        // Letters, numbers, spaces, and common symbols allowed for model
        if (formData.model && !/^[A-Za-z0-9\s\-\.]+$/.test(formData.model.trim())) {
          tempErrors.model = 'Model can contain letters, numbers, spaces, hyphens, and dots';
          isValid = false;
        }
      } else { 
        isValid = false; 
      }
    }

    // Year Validation
    if (field === 'year' || field === null) {
      if (checkRequired('year', 'Year is required.')) {
        if (formData.year) {
          const currentYear = new Date().getFullYear();
          const yearValue = formData.year.year ? formData.year.year() : formData.year;
          
          if (yearValue < 1990 || yearValue > currentYear) {
            tempErrors.year = `Year must be between 1990 and ${currentYear}`;
            isValid = false;
          }
        }
      } else { 
        isValid = false; 
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Input formatting and filtering
    if (name === 'vehicleNumber') {
      // Format vehicle number as user types (XX-XXXX or XXX-XXXX)
      newValue = value.replace(/[^A-Za-z0-9-]/g, '').toUpperCase();
      
      // Auto-format with hyphen
      if (newValue.length >= 2 && !newValue.includes('-')) {
        const letters = newValue.match(/^[A-Z]{2,3}/)?.[0] || '';
        const numbers = newValue.slice(letters.length).replace(/[^0-9]/g, '');
        if (numbers.length > 0) {
          newValue = `${letters}-${numbers.slice(0, 4)}`;
        } else {
          newValue = letters;
        }
      } else if (newValue.includes('-')) {
        const parts = newValue.split('-');
        const letters = parts[0].slice(0, 3); // Max 3 letters
        const numbers = (parts[1] || '').replace(/[^0-9]/g, '').slice(0, 4); // Max 4 numbers
        newValue = numbers ? `${letters}-${numbers}` : letters;
      }
      
      // Limit total length
      if (newValue.length > 8) {
        newValue = newValue.slice(0, 8);
      }
    }

    if (name === 'brand') {
      // Only allow letters and spaces for brand
      newValue = value.replace(/[^A-Za-z\s]/g, '');
    }

    if (name === 'model') {
      // Allow letters, numbers, spaces, hyphens, and dots for model
      newValue = value.replace(/[^A-Za-z0-9\s\-\.]/g, '');
    }

    setFormData({ ...formData, [name]: newValue });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Add onBlur handler for validation when user leaves a field
  const handleInputBlur = (e) => {
    const { name } = e.target;
    // Only validate specific fields on blur to avoid premature errors
    if (['vehicleNumber', 'type', 'brand', 'model', 'year'].includes(name)) {
      validate(name);
    }
  };

  const handleYearChange = (newYear) => {
    setFormData({ ...formData, year: newYear });
    
    // Clear year error when user selects a year
    if (errors.year) {
      setErrors(prev => ({ ...prev, year: '' }));
    }
    
    // Validate year immediately after selection
    setTimeout(() => {
      validate('year');
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    if (!validate(null)) {
      console.log('Validation failed');
      return;
    }

    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedUser) {
      alert("❌ Please log in to add vehicles");
      return;
    }

    setLoading(true);
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
      setErrors({}); // Clear errors on success
    } catch (err) {
      console.error("Vehicle Save Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setErrors({}); // Clear errors on cancel
    onUpdateComplete();
  };

  const vehicleTypes = [
    { value: 'Car', icon: '🚗', color: '#3b82f6' },
    { value: 'Three Wheel', icon: '🛺', color: '#f59e0b' },
    { value: 'Motorcycle', icon: '🏍️', color: '#ef4444' },
    { value: 'Van', icon: '🚐', color: '#10b981' },
    { value: 'SUV', icon: '🚙', color: '#b9b310ff' }

  ];

  return (
    <Fade in timeout={600}>
      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4, position: 'relative' }}>
        <Card 
          sx={{ 
            borderRadius: '24px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Brand Header Bar */}
          <Box
            sx={{
              height: 4,
              background: '#D32F2F',
            }}
          />

          <CardContent sx={{ p: 0 }}>
            {/* Header Section */}
            <Box
              sx={{
                background: '#F8F9FB',
                borderBottom: '1px solid #E5E7EB',
                p: 4,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={3}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '16px',
                    background: '#D32F2F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 18px rgba(211, 47, 47, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  {editingVehicle ? 
                    <EditIcon sx={{ color: 'white', fontSize: 32 }} /> : 
                    <AddIcon sx={{ color: 'white', fontSize: 32 }} />
                  }
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                    <Typography 
                      variant="h4" 
                      sx={{
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 800,
                        fontSize: '1.75rem',
                        color: '#111827',
                      }}
                    >
                      {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
                    </Typography>
                    <SparkleIcon sx={{ color: '#D32F2F', fontSize: 22 }} />
                  </Stack>
                  <Typography sx={{ color: '#6B7280', fontSize: '0.95rem' }}>
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
                      background: '#D32F2F',
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
                    <Typography sx={{ color: '#111827', mb: 2, fontWeight: 700 }}>
                      Select Vehicle Type *
                    </Typography>
                    <Grid container spacing={2}>
                      {vehicleTypes.map((type) => (
                        <Grid item xs={6} sm={3} key={type.value}>
                          <Box
                            onClick={() => {
                              setFormData({ ...formData, type: type.value });
                              // Clear type error when user selects a type
                              if (errors.type) {
                                setErrors(prev => ({ ...prev, type: '' }));
                              }
                            }}
                            sx={{
                              p: 2,
                              borderRadius: '16px',
                              border: '2px solid',
                              borderColor: errors.type 
                                ? '#f44336' 
                                : formData.type === type.value 
                                  ? type.color 
                                  : '#E5E7EB',
                              background: formData.type === type.value 
                                ? alpha(type.color, 0.08) 
                                : '#F8F9FB',
                              cursor: 'pointer',
                              transition: 'all 0.25s ease',
                              textAlign: 'center',
                              '&:hover': {
                                borderColor: type.color,
                                background: alpha(type.color, 0.05),
                                transform: 'translateY(-2px)',
                              }
                            }}
                          >
                            <Typography sx={{ fontSize: 32, mb: 1 }}>{type.icon}</Typography>
                            <Typography sx={{ 
                              color: formData.type === type.value ? type.color : '#374151',
                              fontSize: '0.875rem',
                              fontWeight: 600
                            }}>
                              {type.value}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    {errors.type && (
                      <Typography 
                        sx={{ 
                          color: '#f44336', 
                          fontSize: '0.75rem', 
                          mt: 1,
                          textAlign: 'center' 
                        }}
                      >
                        {errors.type}
                      </Typography>
                    )}
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
                        onBlur={handleInputBlur}
                        error={!!errors.vehicleNumber}
                        helperText={errors.vehicleNumber}
                        fullWidth
                        required
                        disabled={!!editingVehicle}
                        InputProps={{ 
                          startAdornment: (
                            <InputAdornment position="start">
                              <VehicleNumberIcon sx={{ color: '#D32F2F' }} />
                            </InputAdornment>
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: '#FFFFFF',
                            '& fieldset': { borderColor: '#E5E7EB' },
                            '&:hover fieldset': { borderColor: '#D1D5DB' },
                            '&.Mui-focused fieldset': { borderColor: '#D32F2F' }
                          },
                          '& .MuiInputLabel-root': { color: '#6B7280' },
                          '& .MuiOutlinedInput-input': { color: '#111827' }
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
                        onBlur={handleInputBlur}
                        error={!!errors.type}
                        helperText={errors.type}
                        fullWidth
                        required
                        InputProps={{ 
                          startAdornment: (
                            <InputAdornment position="start">
                              <TypeIcon sx={{ color: '#D32F2F' }} />
                            </InputAdornment>
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: '#FFFFFF',
                            '& fieldset': { borderColor: '#E5E7EB' },
                            '&:hover fieldset': { borderColor: '#D1D5DB' },
                            '&.Mui-focused fieldset': { borderColor: '#D32F2F' }
                          },
                          '& .MuiInputLabel-root': { color: '#6B7280' },
                          '& .MuiOutlinedInput-input': { color: '#111827' }
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
                      sx={{ position: 'relative' }}
                    >
                      <TextField
                        name="brand"
                        label="Brand"
                        value={formData.brand}
                        onChange={handleChange}
                        onBlur={handleInputBlur}
                        error={!!errors.brand}
                        helperText={errors.brand}
                        fullWidth
                        required
                        InputProps={{ 
                          startAdornment: (
                            <InputAdornment position="start">
                              <BrandIcon sx={{ color: '#D32F2F' }} />
                            </InputAdornment>
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: '#FFFFFF',
                            '& fieldset': { borderColor: '#E5E7EB' },
                            '&:hover fieldset': { borderColor: '#D1D5DB' },
                            '&.Mui-focused fieldset': { borderColor: '#D32F2F' }
                          },
                          '& .MuiInputLabel-root': { color: '#6B7280' },
                          '& .MuiOutlinedInput-input': { color: '#111827' }
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
                      onBlur={handleInputBlur}
                      error={!!errors.model}
                      helperText={errors.model}
                      fullWidth
                      required
                      InputProps={{ 
                        startAdornment: (
                          <InputAdornment position="start">
                            <ModelIcon sx={{ color: '#D32F2F' }} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          background: '#FFFFFF',
                          '& fieldset': { borderColor: '#E5E7EB' },
                          '&:hover fieldset': { borderColor: '#D1D5DB' },
                          '&.Mui-focused fieldset': { borderColor: '#D32F2F' }
                        },
                        '& .MuiInputLabel-root': { color: '#6B7280' },
                        '& .MuiOutlinedInput-input': { color: '#111827' }
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
                          error={!!errors.year}
                          helperText={errors.year}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <YearIcon sx={{ color: '#D32F2F' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: '#FFFFFF',
                              '& fieldset': { borderColor: '#E5E7EB' },
                              '&:hover fieldset': { borderColor: '#D1D5DB' },
                              '&.Mui-focused fieldset': { borderColor: '#D32F2F' }
                            },
                            '& .MuiInputLabel-root': { color: '#6B7280' },
                            '& .MuiOutlinedInput-input': { color: '#111827' }
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
                    disabled={loading}
                    startIcon={editingVehicle ? <SaveIcon /> : <AddIcon />}
                    sx={{ 
                      py: 1.8,
                      px: 4,
                      borderRadius: '12px',
                      background: '#D32F2F',
                      fontSize: '1rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      letterSpacing: 0.5,
                      boxShadow: '0 4px 14px rgba(211, 47, 47, 0.35)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: '#B71C1C',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(211, 47, 47, 0.45)',
                      },
                      '&:disabled': {
                        background: '#F3F4F6',
                        color: '#9CA3AF',
                      }
                    }}
                  >
                    {loading ? 'Saving...' : (editingVehicle ? 'Save Changes' : 'Add Vehicle')}
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
                        py: 1.8,
                        px: 4,
                        borderRadius: '12px',
                        borderColor: '#E5E7EB',
                        color: '#374151',
                        fontSize: '1rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        letterSpacing: 0.5,
                        '&:hover': {
                          borderColor: '#D1D5DB',
                          background: '#F9FAFB',
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