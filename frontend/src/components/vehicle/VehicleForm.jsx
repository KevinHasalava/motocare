// frontend/src/components/vehicle/VehicleForm.jsx (Corrected Again)
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



// Moved outside the component to ensure it's a stable constant
const initialFormState = {
  ownerName: '',
  vehicleNumber: '',
  type: '',
  brand: '',
  model: '',
  year: '',
};

const VehicleForm = ({ onVehicleAdded, editingVehicle, onUpdateComplete, theme }) => {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (editingVehicle) {
      setFormData(editingVehicle);
    } else {
      setFormData(initialFormState);
    }
  }, [editingVehicle]); // Removed unnecessary dependency

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle._id, formData);
        console.log("Vehicle updated successfully!");
        onUpdateComplete();
      } else {
        await addVehicle(formData);
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
              <TextField
                type="number"
                name="year"
                label="Year"
                value={formData.year}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ startAdornment: <InputAdornment position="start"><YearIcon /></InputAdornment> }}
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0 8px 25px ${theme.palette.primary.dark}`
                }
              }}
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