import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Container, Typography, Box, Button, Paper, Grid, TextField, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Stack, CircularProgress, Alert,
    FormControl, InputLabel, Select, MenuItem, Chip
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const vehicleTypes = ['Car', 'Van', 'SUV', 'Motorcycle', 'Three Wheel'];

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for the Add/Edit Modal
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentServiceId, setCurrentServiceId] = useState(null);

    // State for the simplified form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [vehicleType, setVehicleType] = useState('');

    const fetchServices = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/services');
            setServices(res.data);
        } catch (err) {
            setError('Failed to fetch services.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const resetForm = () => {
        setName('');
        setDescription('');
        setDuration('');
        setPrice('');
        setVehicleType('');
        setCurrentServiceId(null);
        setIsEditing(false);
        setError('');
    };

    const handleOpen = (service = null) => {
        if (service) {
            // Editing existing service
            setIsEditing(true);
            setCurrentServiceId(service._id);
            setName(service.name);
            setDescription(service.description);
            setDuration(service.duration);
            setPrice(service.price);
            setVehicleType(service.vehicleType);
        } else {
            // Adding new service
            resetForm();
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const handleSubmit = async () => {
        const serviceData = { 
            name, 
            description, 
            duration: Number(duration), 
            price: Number(price), 
            vehicleType 
        };
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/services/${currentServiceId}`, serviceData);
            } else {
                await axios.post('http://localhost:5000/api/services', serviceData);
            }
            fetchServices();
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please check your input.');
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await axios.delete(`http://localhost:5000/api/services/${id}`);
                fetchServices();
            } catch (err) {
                setError('Failed to delete service.');
            }
        }
    };


    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" component="h1">Manage Services</Typography>
                    <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => handleOpen()}>
                        Add New Service
                    </Button>
                </Stack>

                {loading && <CircularProgress />}
                {!loading && error && <Alert severity="error">{error}</Alert>}

                <Grid container spacing={3}>
                    {services.map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service._id}>
                            <Paper variant="outlined" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Typography variant="h6" gutterBottom>{service.name}</Typography>
                                        <Chip label={service.vehicleType} color="primary" size="small" />
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">{service.description}</Typography>
                                    <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                                        LKR {service.price.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Duration: {service.duration} mins
                                    </Typography>
                                </Box>
                                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                    <IconButton size="small" onClick={() => handleOpen(service)}><EditIcon /></IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(service._id)}><DeleteIcon color="error" /></IconButton>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Add/Edit Service Dialog */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{isEditing ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ pt: 1 }}>
                        {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
                        <TextField label="Service Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                         <FormControl fullWidth>
                            <InputLabel>Vehicle Type</InputLabel>
                            <Select
                                value={vehicleType}
                                label="Vehicle Type"
                                onChange={(e) => setVehicleType(e.target.value)}
                            >
                                {vehicleTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={2} fullWidth />
                        <Stack direction="row" spacing={2}>
                           <TextField label="Price (LKR)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth />
                           <TextField label="Duration (mins)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} fullWidth />
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">{isEditing ? 'Update' : 'Save Service'}</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ServicesPage;