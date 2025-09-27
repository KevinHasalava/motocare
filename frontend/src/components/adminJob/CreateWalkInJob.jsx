import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    Box, Paper, Typography, TextField, Button, Grid, MenuItem, Alert, CircularProgress, 
    FormControl, InputLabel, Select, Autocomplete 
} from '@mui/material';
import { createWalkInJob } from '../../api/job'; 
import { fetchServices, fetchMechanics, fetchVehiclesByEmail } from '../../api/data'; 

// --- Constants (Defined in Component Scope for inputProps access) ---
const currentYear = new Date().getFullYear();

const initialState = {
    // Customer Details
    customerName: '',
    customerEmail: '',
    customerPhoneNumber: '',
    // Vehicle Details
    vehicleNumber: '',
    type: '',
    brand: '',
    model: '',
    year: '',
    // Job Details
    serviceId: '', 
    serviceName: '', 
    date: '',
    time: '',
    mechanic: 'AUTO_ASSIGN', 
};

// ... other constants (vehicleTypes, phonePrefixes) remain the same ...
const vehicleTypes = ['Car', 'Van', 'SUV', 'Motorcycle', 'Three Wheel'];
const phonePrefixes = ['070', '071', '072', '074', '075', '076', '077', '078', '011', '021', '023', '024', '025', '026', '027', '031', '032', '033', '034', '035', '036', '037', '038', '041', '045', '047', '051', '052', '054', '055', '057', '063', '065', '066'];


const CreateWalkInJob = () => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    
    // API Data States
    const [services, setServices] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [userVehicles, setUserVehicles] = useState([]); 
    
    // 💡 NEW STATE: To disable vehicle fields when an existing vehicle is selected
    const [isVehicleFound, setIsVehicleFound] = useState(false); 

    // Ref to hold the form element for Autofill check
    const formRef = useRef(null); 

    // --- Data Fetching: Services and Mechanics ---
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [serviceData, mechanicData] = await Promise.all([
                    fetchServices(), 
                    fetchMechanics()
                ]);
                setServices(serviceData);
                setMechanics(mechanicData);
            } catch (err) {
                setErrorMsg("Failed to load initial data (Services/Mechanics). Check backend /api/data routes.");
            }
        };
        loadInitialData();
    }, []);
    
    // --- 💡 NEW: Autofill Check Effect ---
    // This runs once after mount to check for browser-autofilled values and force validation
    useEffect(() => {
        // Simple setTimeout to wait for the browser to finish its autofill process
        setTimeout(() => {
            // We only need to force validation on fields that might be autofilled (Customer details)
            validate('customerName');
            validate('customerEmail');
            validate('customerPhoneNumber');
        }, 100); 
    }, []);


    // --- Vehicle Fetching Effect (Triggers on Email change) ---
    const handleEmailSearch = useCallback(async (email) => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setUserVehicles([]);
            return;
        }
        
        try {
            const data = await fetchVehiclesByEmail(email);
            if (data.userExists && data.vehicles.length > 0) {
                setUserVehicles(data.vehicles);
            } else {
                setUserVehicles([]);
            }
        } catch (err) {
            console.error("Vehicle search failed:", err);
        }
    }, []);

    // Debounced email search (waits for user to stop typing)
    useEffect(() => {
        const handler = setTimeout(() => {
            if (formData.customerEmail && !errors.customerEmail) {
                handleEmailSearch(formData.customerEmail);
            }
        }, 800); 
        return () => clearTimeout(handler);
    }, [formData.customerEmail, errors.customerEmail, handleEmailSearch]);


    // --- Strict Frontend Validation Logic (No Changes to actual rules) ---
    const validate = (field = null) => {
        let tempErrors = { ...errors };
        let isValid = true;
        
        const requiredFields = ['customerName', 'customerEmail', 'vehicleNumber', 'type', 'brand', 'model', 'year', 'serviceId', 'date', 'time'];
        
        const checkRequired = (name, message) => {
            if (requiredFields.includes(name) && !formData[name]) {
                tempErrors[name] = message;
                return false;
            } else {
                delete tempErrors[name];
                return true;
            }
        };

        // 1. Customer Name Validation
        if (field === 'customerName' || field === null) {
            if (checkRequired('customerName', 'Customer Name is required.')) {
                if (formData.customerName && !/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/.test(formData.customerName)) {
                    tempErrors.customerName = 'Only letters, numbers, and single spaces are allowed.';
                    isValid = false;
                }
            } else { isValid = false; }
        }

        // 2. Email Validation
        if (field === 'customerEmail' || field === null) {
            if (checkRequired('customerEmail', 'Email is required.')) {
                if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
                    tempErrors.customerEmail = 'Email is not valid.';
                    isValid = false;
                }
            } else { isValid = false; }
        }
        
        // 3. Phone Number Validation
        if (field === 'customerPhoneNumber' || field === null) {
            const phone = formData.customerPhoneNumber;
            if (phone) {
                if (!/^0\d{9}$/.test(phone)) {
                    tempErrors.customerPhoneNumber = 'Must be exactly 10 digits starting with 0.';
                    isValid = false;
                } else if (!phonePrefixes.some(prefix => phone.startsWith(prefix))) {
                    tempErrors.customerPhoneNumber = 'Invalid mobile or landline prefix.';
                    isValid = false;
                } else {
                    delete tempErrors.customerPhoneNumber;
                }
            } else {
                delete tempErrors.customerPhoneNumber;
            }
        }

        // 4. Vehicle Number Validation
        if (field === 'vehicleNumber' || field === null) {
            if (checkRequired('vehicleNumber', 'Vehicle Number is required.')) {
                if (formData.vehicleNumber && !/^([A-Za-z]{2,3}-\d{4})$/.test(formData.vehicleNumber)) {
                    tempErrors.vehicleNumber = 'Format: LL-NNNN or LLL-NNNN (e.g., WP-1234).';
                    isValid = false;
                }
            } else { isValid = false; }
        }
        
        // 5. Vehicle Type, Brand, Model Validation
        if (field === 'type' || field === null) { if (!checkRequired('type', 'Vehicle Type is required.')) { isValid = false; } }
        if (field === 'brand' || field === null) { if (!checkRequired('brand', 'Brand is required.')) { isValid = false; } }
        if (field === 'model' || field === null) { if (!checkRequired('model', 'Model is required.')) { isValid = false; } }

        // 6. Year Validation
        if (field === 'year' || field === null) {
            if (checkRequired('year', 'Year is required.')) {
                if (formData.year && (formData.year.length !== 4 || parseInt(formData.year) > currentYear || parseInt(formData.year) < 1980)) {
                    tempErrors.year = `Invalid year (1980-${currentYear}).`;
                    isValid = false;
                }
            } else { isValid = false; }
        }
        
        // 7. Service ID Validation
        if (field === 'serviceId' || field === null) { if (!checkRequired('serviceId', 'Service Type is required.')) { isValid = false; } }

        // 8. Date/Time Validation
        if (field === 'date' || field === 'time' || field === null) {
            if (!checkRequired('date', 'Date is required.')) { isValid = false; }
            if (!checkRequired('time', 'Time is required.')) { isValid = false; }
            
            if (formData.date && formData.time) {
                const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
                if (selectedDateTime < new Date()) {
                     tempErrors.date = 'Cannot book for a past date/time.';
                     isValid = false;
                }
            }
        }

        setErrors(tempErrors);
        return isValid;
    };

    // --- Input Change Handler with Formatting ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Reset vehicle found state if cashier is manually editing vehicle details
        if (isVehicleFound && ['vehicleNumber', 'type', 'brand', 'model', 'year'].includes(name)) {
            setIsVehicleFound(false);
        }

        // 1. Phone Number Formatting
        if (name === 'customerPhoneNumber') {
            newValue = value.replace(/[^0-9]/g, '').slice(0, 10);
        }
        
        // 2. Vehicle Number Formatting
        if (name === 'vehicleNumber') {
            newValue = value.replace(/[^A-Za-z0-9-]/g, '').toUpperCase();
            
            let letters = newValue.match(/^[A-Z]{2,3}/)?.[0] || '';
            let numbers = newValue.match(/\d{1,4}$/)?.[0] || '';
            
            if (letters.length > 0 && newValue.indexOf('-') === -1) {
                const combined = newValue.slice(letters.length);
                if (combined) {
                    numbers = combined.slice(0, 4);
                    newValue = `${letters}-${numbers}`;
                } else {
                    newValue = letters;
                }
            } else if (newValue.indexOf('-') > -1) {
                const parts = newValue.split('-');
                if (parts.length > 1) {
                    parts[1] = parts[1].slice(0, 4);
                    newValue = parts.join('-');
                }
            }
        }
        
        setFormData(prev => ({ ...prev, [name]: newValue }));
        validate(name); 
    };

    // --- Vehicle Selector Handler (UX Enhancement) ---
    const handleVehicleSelect = (e) => {
        const selectedNum = e.target.value;
        const selectedVehicle = userVehicles.find(v => v.vehicleNumber === selectedNum);
        
        if(selectedVehicle) {
            // 💡 Set isVehicleFound to true to disable editing
            setIsVehicleFound(true); 
            setFormData(prev => ({
                ...prev,
                vehicleNumber: selectedNum,
                type: selectedVehicle.type,
                brand: selectedVehicle.brand,
                model: selectedVehicle.model,
                year: String(selectedVehicle.year)
            }));
            // Clear vehicle-related errors as the data is from the database
            setErrors(prev => ({
                ...prev,
                vehicleNumber: '', type: '', brand: '', model: '', year: ''
            }));
        } else {
            // Reset to manual entry mode
            setIsVehicleFound(false); 
            setFormData(prev => ({
                ...prev,
                vehicleNumber: '', type: '', brand: '', model: '', year: ''
            }));
        }
    }


    const handleServiceChange = (event, value) => {
        if (value) {
            setFormData(prev => ({ 
                ...prev, 
                serviceName: value.name, 
                serviceId: value._id 
            }));
            setErrors(prev => ({ ...prev, serviceId: '' }));
        } else {
            setFormData(prev => ({ ...prev, serviceName: '', serviceId: '' }));
        }
    };
    
    // --- Submission Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');
        
        if (!validate(null)) { 
            setErrorMsg('Please correct the validation errors in the form.');
            return;
        }

        setLoading(true);

        const dataToSend = {
            ...formData,
            year: parseInt(formData.year),
            service: formData.serviceId, 
            mechanic: formData.mechanic === 'AUTO_ASSIGN' ? null : formData.mechanic, 
        };

        try {
            const response = await createWalkInJob(dataToSend);
            setSuccessMsg(response.message || 'Job created successfully!');
            setFormData(initialState); 
            setUserVehicles([]); 
            setIsVehicleFound(false); // Reset
        } catch (err) {
            console.error(err);
            setErrorMsg(err.message || 'Failed to create job due to a server error.');
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];
    
    return (
        <Paper 
            elevation={6} 
            sx={{ 
                p: 4, 
                maxWidth: 900, 
                margin: '2rem auto',
                borderRadius: '20px', 
                backgroundColor: '#f5f5f5' 
            }}
        >
            <Typography variant="h4" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
                Manual Walk-In Job Creation 🛠️
            </Typography>
            <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
                Admin/Cashier interface for new customers and vehicles.
            </Typography>

            {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

            {/* 💡 Set ref for the Autofill check */}
            <Box component="form" onSubmit={handleSubmit} ref={formRef}>
                
                {/* --- Section 1: Customer Details --- */}
                <Typography variant="h6" sx={{ mt: 2, mb: 1, borderBottom: '2px solid #ccc', pb: 0.5 }}>1. Customer Details (Find or Create)</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Customer Name"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleInputChange}
                            error={!!errors.customerName}
                            helperText={errors.customerName}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Customer Email"
                            name="customerEmail"
                            value={formData.customerEmail}
                            onChange={handleInputChange}
                            error={!!errors.customerEmail}
                            helperText={errors.customerEmail || "Used to check for existing records."}
                            variant="outlined"
                            type="email"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}> 
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="customerPhoneNumber"
                            value={formData.customerPhoneNumber}
                            onChange={handleInputChange}
                            error={!!errors.customerPhoneNumber}
                            helperText={errors.customerPhoneNumber || "10 digits, starting with 0."}
                            variant="outlined"
                            type="tel"
                            inputProps={{ maxLength: 10 }}
                        />
                    </Grid>
                </Grid>

                {/* --- Section 2: Vehicle Details --- */}
                <Typography variant="h6" sx={{ mt: 4, mb: 1, borderBottom: '2px solid #ccc', pb: 0.5 }}>2. Vehicle Details (Find or Create)</Typography>
                
                {/* Existing Vehicles Alert and Selector */}
                {userVehicles.length > 0 && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Customer **already has {userVehicles.length} registered vehicle(s)**. Use the selector to auto-fill details.
                    </Alert>
                )}
                
                {userVehicles.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <FormControl fullWidth>
                            <InputLabel>Select Existing Vehicle</InputLabel>
                            <Select
                                label="Select Existing Vehicle"
                                value={isVehicleFound ? formData.vehicleNumber : ""} // Show selected number if found, otherwise show blank for manual entry
                                onChange={handleVehicleSelect}
                            >
                                <MenuItem value="">*Enter New/Different Vehicle*</MenuItem>
                                {userVehicles.map((v) => (
                                    <MenuItem key={v._id} value={v.vehicleNumber}>
                                        {v.vehicleNumber} ({v.brand} {v.model})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}
                
                {/* New/Manual Vehicle Entry Fields */}
                {isVehicleFound && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Vehicle details are **auto-filled and locked** from the system.
                    </Alert>
                )}
                
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Vehicle Number"
                            name="vehicleNumber"
                            value={formData.vehicleNumber}
                            onChange={handleInputChange}
                            error={!!errors.vehicleNumber}
                            helperText={errors.vehicleNumber || "Format: LL-NNNN or LLL-NNNN. Hyphen is automatic."}
                            variant="outlined"
                            // 💡 Disabled if found
                            disabled={isVehicleFound} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.type} disabled={isVehicleFound}>
                            <InputLabel>Vehicle Type</InputLabel>
                            <Select
                                label="Vehicle Type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                            >
                                {vehicleTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                            <Typography variant="caption" color="error">{errors.type}</Typography>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Brand"
                            name="brand"
                            value={formData.brand}
                            onChange={handleInputChange}
                            error={!!errors.brand}
                            helperText={errors.brand}
                            variant="outlined"
                            disabled={isVehicleFound}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Model"
                            name="model"
                            value={formData.model}
                            onChange={handleInputChange}
                            error={!!errors.model}
                            helperText={errors.model}
                            variant="outlined"
                            disabled={isVehicleFound}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Year"
                            name="year"
                            value={formData.year}
                            onChange={handleInputChange}
                            error={!!errors.year}
                            helperText={errors.year}
                            variant="outlined"
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ 
                                maxLength: 4, 
                                min: 1980, 
                                max: currentYear 
                            }}
                            disabled={isVehicleFound}
                        />
                    </Grid>
                </Grid>

                {/* --- Section 3: Job Details --- */}
                <Typography variant="h6" sx={{ mt: 4, mb: 1, borderBottom: '2px solid #ccc', pb: 0.5 }}>3. Service and Time Slot</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            options={services}
                            getOptionLabel={(option) => option.name || ""}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            value={services.find(s => s._id === formData.serviceId) || null}
                            onChange={handleServiceChange}
                            inputValue={formData.serviceName}
                            onInputChange={(event, newInputValue) => {
                                setFormData(prev => ({ ...prev, serviceName: newInputValue }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Service Type (Type to filter)"
                                    error={!!errors.serviceId}
                                    helperText={errors.serviceId}
                                    required
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors.mechanic}>
                            <InputLabel>Assign Mechanic</InputLabel>
                            <Select
                                label="Assign Mechanic"
                                name="mechanic"
                                value={formData.mechanic}
                                onChange={handleInputChange}
                            >
                                {mechanics.map((m) => (
                                    <MenuItem key={m._id || 'AUTO_ASSIGN'} value={m._id || 'AUTO_ASSIGN'}>
                                        {m.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Typography variant="caption" color="error">{errors.mechanic}</Typography>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            error={!!errors.date}
                            helperText={errors.date}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: today }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Time Slot"
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            error={!!errors.time}
                            helperText={errors.time}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 5, py: 1.5, borderRadius: '15px' }} 
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                    {loading ? 'Creating Job...' : 'Create Walk-In Job'}
                </Button>

            </Box>
        </Paper>
    );
};

export default CreateWalkInJob;