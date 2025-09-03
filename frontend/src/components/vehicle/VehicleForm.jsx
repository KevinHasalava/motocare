// frontend/src/components/vehicle/VehicleForm.jsx (Corrected)
import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, TextField, MenuItem, Button, Stack,
  Grid, InputAdornment
} from '@mui/material';
import {
  AddCircleOutline as AddIcon, Edit as EditIcon, Person as PersonIcon,
  ConfirmationNumber as VehicleNumberIcon, DirectionsCar as TypeIcon,
  BrandingWatermark as BrandIcon, Category as ModelIcon, Event as YearIcon
} from '@mui/icons-material';
import { addVehicle, updateVehicle } from '../../api/vehicleService';
import { gradientText } from '../../utils/theme';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const initialFormState = {
  ownerName: '',
  vehicleNumber: '',
  type: '',
  brand: '',
  model: '',
  year: null,
};

const VehicleForm = ({ onVehicleAdded, editingVehicle, onUpdateComplete, theme }) => {
  const [formData, setFormData] = useState(initialFormState);

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

    const dataToSend = {
      ...formData,
      year: formData.year ? formData.year.year() : '',
    };

    try {
      if (editingVehicle) {
        // --- මෙතන formData වෙනුවට dataToSend ලෙස වෙනස් කළා ---
        await updateVehicle(editingVehicle._id, dataToSend);
        console.log("Vehicle updated successfully!");
        onUpdateComplete();
      } else {
        // --- මෙතනත් formData වෙනුවට dataToSend ලෙස වෙනස් කළා ---
        await addVehicle(dataToSend);
        console.log("Vehicle added successfully!");
        onVehicleAdded();
      }
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error saving vehicle:", error);
    }
  };
  
  const handleCancel = () => {
    setFormData(initialFormState);
    onUpdateComplete();
  };

  return (
    <Card sx={{
      maxWidth: 700,
      mx: 'auto',
      mb: 4,
      borderRadius: 4,
      border: '1px solid',
      borderColor: 'rgba(51, 65, 85, 0.5)',
      backdropFilter: 'blur(10px)',
      background: 'rgba(30, 41, 59, 0.5)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: { xs: 2, md: 4 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
          {editingVehicle ? <EditIcon sx={{ color: 'primary.main' }} /> : <AddIcon sx={{ color: 'primary.main' }} />}
          <Typography variant="h5" component="h2" sx={{...gradientText, fontWeight: 'bold'}}>
            {editingVehicle ? 'Edit Vehicle Details' : 'Add a New Vehicle'}
          </Typography>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="ownerName"
                label="Owner Name"
                value={formData.ownerName}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="vehicleNumber"
                label="Vehicle Number"
                value={formData.vehicleNumber}
                onChange={handleChange}
                fullWidth
                required
                disabled={!!editingVehicle}
                InputProps={{ startAdornment: <InputAdornment position="start"><VehicleNumberIcon /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="type"
                label="Vehicle Type"
                value={formData.type}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ startAdornment: <InputAdornment position="start"><TypeIcon /></InputAdornment> }}
              >
                <MenuItem value="Car">Car</MenuItem>
                <MenuItem value="Three Wheel">Three Wheel</MenuItem>
                <MenuItem value="Bike">Bike</MenuItem>
                <MenuItem value="Van">Van</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="brand"
                label="Brand"
                value={formData.brand}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ startAdornment: <InputAdornment position="start"><BrandIcon /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="model"
                label="Model"
                value={formData.model}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ startAdornment: <InputAdornment position="start"><ModelIcon /></InputAdornment> }}
              />
            </Grid>
           <Grid item xs={12} sm={6}>
              <DatePicker
                label="Year"
                views={['year']}
                value={formData.year}
                onChange={handleYearChange}
                minDate={dayjs('1990-01-01')} // අවම අවුරුද්ද 1900
                maxDate={dayjs('2025-12-31')} // උපරිම අවුරුද්ද 2025
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <YearIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                
                slotProps={{
                  popper: {
                    sx: {
                      backgroundColor: 'rgba(30, 41, 59, 0.5)',
                      backdropFilter: 'blur(8px)', 
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '12px',
                    }
                  }
                }}
                
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ py: 1.5, /* ... */ }}
            >
              {editingVehicle ? 'Save Changes' : 'Add Vehicle'}
            </Button>
            {editingVehicle && (
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Cancel
              </Button>
            )}
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;