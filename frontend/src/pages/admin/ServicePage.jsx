import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Container, Typography, Box, Button, Paper, Grid, TextField, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Stack, CircularProgress, Alert,
    FormControl, InputLabel, Select, MenuItem, Chip, Card, CardContent, InputAdornment,
    Divider, Tooltip, Badge
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API_URL from "../../config/api";
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import BuildIcon from '@mui/icons-material/Build';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";


const vehicleTypes = ['Car', 'Van', 'SUV', 'Motorcycle', 'Three Wheel'];

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterVehicleType, setFilterVehicleType] = useState('all');

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
            const res = await axios.get(`${API_URL}/api/services`);
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
                await axios.put(`${API_URL}/api/services/${currentServiceId}`, serviceData);
                setSuccess('Service updated successfully!');
            } else {
                await axios.post(`${API_URL}/api/services`, serviceData);
                setSuccess('Service added successfully!');
            }
            fetchServices();
            handleClose();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please check your input.');
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await axios.delete(`${API_URL}/api/services/${id}`);
                setSuccess('Service deleted successfully!');
                fetchServices();
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError('Failed to delete service.');
            }
        }
    };

    // Filter services based on search and vehicle type
    const filteredServices = services.filter((service) => {
        const matchesSearch = [
            service.name,
            service.description,
            service.vehicleType,
            service.price.toString()
        ].join(' ').toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesVehicleType = filterVehicleType === 'all' || service.vehicleType === filterVehicleType;
        
        return matchesSearch && matchesVehicleType;
    });

    // Calculate statistics
    const totalServices = services.length;
    const avgPrice = services.length > 0 
        ? (services.reduce((sum, s) => sum + s.price, 0) / services.length).toFixed(2)
        : 0;
    const avgDuration = services.length > 0
        ? Math.round(services.reduce((sum, s) => sum + s.duration, 0) / services.length)
        : 0;
    const vehicleTypeCount = services.reduce((acc, s) => {
        acc[s.vehicleType] = (acc[s.vehicleType] || 0) + 1;
        return acc;
    }, {});


    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#111827" }}>
            <AdminHeader />

            <Box component="main" sx={{ flexGrow: 1, pt: 10, pb: 4 }}>
                <Container maxWidth="xl">
                    <Paper
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            background: "radial-gradient(circle at top, #1e3a8a 0%, #111827 70%)",
                            boxShadow: "0 10px 30px rgba(99,102,241,0.25)",
                        }}
                    >
                        {/* Header */}
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                mb: 3,
                                background: "linear-gradient(90deg,#6366f1,#a855f7)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            🔧 Manage Services
                        </Typography>

                        {/* Alerts */}
                        {error && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>
                                {success}
                            </Alert>
                        )}

                        {/* Statistics Cards */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ 
                                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                                    color: "white",
                                    borderRadius: 3
                                }}>
                                    <CardContent>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <BuildIcon sx={{ fontSize: 40 }} />
                                            <Box>
                                                <Typography variant="h4" fontWeight="bold">{totalServices}</Typography>
                                                <Typography variant="body2">Total Services</Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ 
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    color: "white",
                                    borderRadius: 3
                                }}>
                                    <CardContent>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <AttachMoneyIcon sx={{ fontSize: 40 }} />
                                            <Box>
                                                <Typography variant="h4" fontWeight="bold">LKR {avgPrice}</Typography>
                                                <Typography variant="body2">Avg Price</Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ 
                                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                    color: "white",
                                    borderRadius: 3
                                }}>
                                    <CardContent>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <AccessTimeIcon sx={{ fontSize: 40 }} />
                                            <Box>
                                                <Typography variant="h4" fontWeight="bold">{avgDuration}</Typography>
                                                <Typography variant="body2">Avg Duration (mins)</Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ 
                                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                    color: "white",
                                    borderRadius: 3
                                }}>
                                    <CardContent>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <DirectionsCarIcon sx={{ fontSize: 40 }} />
                                            <Box>
                                                <Typography variant="h4" fontWeight="bold">{Object.keys(vehicleTypeCount).length}</Typography>
                                                <Typography variant="body2">Vehicle Types</Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Action Buttons and Filters */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
                            <Button
                                startIcon={<AddCircleIcon />}
                                onClick={() => handleOpen()}
                                sx={{
                                    background: "linear-gradient(90deg,#6366f1,#a855f7)",
                                    color: "white",
                                    borderRadius: "50px",
                                    px: 3,
                                    py: 1.2,
                                    fontWeight: 600,
                                }}
                            >
                                Add New Service
                            </Button>

                            {/* Search and Filter */}
                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                <TextField
                                    select
                                    value={filterVehicleType}
                                    onChange={(e) => setFilterVehicleType(e.target.value)}
                                    sx={{
                                        minWidth: "150px",
                                        background: "rgba(255,255,255,0.06)",
                                        borderRadius: "30px",
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "30px",
                                            color: "white",
                                        },
                                        "& .MuiInputLabel-root": { color: "#9ca3af" },
                                        "& .MuiSelect-icon": { color: "#9ca3af" },
                                    }}
                                    variant="outlined"
                                    size="small"
                                    label="Vehicle Type"
                                    InputLabelProps={{
                                        sx: { color: "#9ca3af" }
                                    }}
                                >
                                    <MenuItem value="all">All Types</MenuItem>
                                    {vehicleTypes.map(type => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    variant="outlined"
                                    placeholder="Search services..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    sx={{
                                        minWidth: { xs: "100%", sm: "300px" },
                                        background: "rgba(255,255,255,0.06)",
                                        borderRadius: "30px",
                                        input: { color: "white" },
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "30px",
                                            color: "white",
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: "#9ca3af" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Loading State */}
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                <CircularProgress sx={{ color: "#6366f1" }} />
                            </Box>
                        )}

                        {/* Services Grid */}
                        {!loading && (
                            <Grid container spacing={3}>
                                {filteredServices.length > 0 ? (
                                    filteredServices.map((service) => (
                                        <Grid item xs={12} sm={6} md={4} key={service._id}>
                                            <Card
                                                sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    background: "rgba(255,255,255,0.04)",
                                                    borderRadius: 3,
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    transition: "all 0.3s ease",
                                                    "&:hover": {
                                                        transform: "translateY(-5px)",
                                                        boxShadow: "0 10px 30px rgba(99,102,241,0.3)",
                                                        border: "1px solid rgba(99,102,241,0.5)",
                                                    }
                                                }}
                                            >
                                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                        <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
                                                            {service.name}
                                                        </Typography>
                                                        <Chip 
                                                            label={service.vehicleType} 
                                                            size="small"
                                                            sx={{
                                                                background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                                                                color: "white",
                                                                fontWeight: 600
                                                            }}
                                                        />
                                                    </Stack>
                                                    
                                                    <Typography variant="body2" sx={{ color: "#9ca3af", mb: 2, minHeight: 40 }}>
                                                        {service.description}
                                                    </Typography>
                                                    
                                                    <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />
                                                    
                                                    <Stack spacing={1}>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <AttachMoneyIcon sx={{ color: "#10b981", fontSize: 20 }} />
                                                            <Typography variant="h6" sx={{ color: "#10b981", fontWeight: 700 }}>
                                                                LKR {service.price.toFixed(2)}
                                                            </Typography>
                                                        </Stack>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <AccessTimeIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
                                                            <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                                                                Duration: {service.duration} minutes
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                    
                                                    <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                                                        <Tooltip title="Edit Service">
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleOpen(service)}
                                                                sx={{
                                                                    color: "#60a5fa",
                                                                    background: "rgba(96, 165, 250, 0.1)",
                                                                    "&:hover": {
                                                                        background: "rgba(96, 165, 250, 0.2)",
                                                                    }
                                                                }}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete Service">
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleDelete(service._id)}
                                                                sx={{
                                                                    color: "#f87171",
                                                                    background: "rgba(248, 113, 113, 0.1)",
                                                                    "&:hover": {
                                                                        background: "rgba(248, 113, 113, 0.2)",
                                                                    }
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))
                                ) : (
                                    <Grid item xs={12}>
                                        <Box sx={{ textAlign: 'center', py: 8 }}>
                                            <BuildIcon sx={{ fontSize: 80, color: "#4b5563", mb: 2 }} />
                                            <Typography variant="h6" sx={{ color: "#9ca3af" }}>
                                                No services found
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
                                                {searchQuery || filterVehicleType !== 'all' 
                                                    ? 'Try adjusting your search or filters'
                                                    : 'Add your first service to get started'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    </Paper>
                </Container>
            </Box>

            <AdminFooter />

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
        </Box>
    );
};

export default ServicesPage;