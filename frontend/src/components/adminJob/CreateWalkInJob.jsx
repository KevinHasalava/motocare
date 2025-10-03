import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    Box, Paper, Typography, TextField, Button, Grid, MenuItem, Alert, CircularProgress, 
    FormControl, InputLabel, Select, Autocomplete, Chip, FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
    PersonOutline, DirectionsCarOutlined,
    BuildOutlined, AddCircleOutline
} from '@mui/icons-material';
import { createWalkInJob, fetchJobsByDateAndMechanic } from '../../api/job'; // Assuming you added this
import { fetchServices, fetchMechanics, fetchVehiclesByEmail } from '../../api/data'; 
import CashierHeader from '../CashierHeader';

// --- Styled Components (No changes) ---
const AdminContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    padding: theme.spacing(2),
}));

const AdminPaper = styled(Paper)(({ theme }) => ({
    maxWidth: 1200,
    margin: '0 auto',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    overflow: 'hidden',
}));

const AdminHeader    = styled(Box)(({ theme }) => ({
    backgroundColor: '#2c3e50',
    color: '#ffffff',
    padding: theme.spacing(2.5),
    borderBottom: '3px solid #3498db',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
    backgroundColor: '#f8f9fa',
    padding: theme.spacing(1.5, 2),
    borderBottom: '1px solid #dee2e6',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    '&:first-of-type': {
        marginTop: 0,
    }
}));

const FormSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
}));

// --- Time Slot Generator (NEW HELPER FUNCTION) ---
const generateTimeSlots = () => {
    const slots = [];
    // From 8:00 AM to 5:00 PM (17:00)
    for (let hour = 8; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
        }
    }
    return slots;
};

const ALL_TIME_SLOTS = generateTimeSlots();


// --- Constants (No changes) ---
const currentYear = new Date().getFullYear();
const initialState = {
    customerName: '',
    customerEmail: '',
    customerPhoneNumber: '',
    vehicleNumber: '',
    type: '',
    brand: '',
    model: '',
    year: '',
    serviceId: '', 
    serviceName: '', 
    date: '',
    time: '',
    mechanic: 'AUTO_ASSIGN', 
};

const vehicleTypes = ['Car', 'Van', 'SUV', 'Motorcycle', 'Three Wheel'];
const phonePrefixes = ['070', '071', '072', '074', '075', '076', '077', '078',
    '011', '021', '023', '024', '025', '026', '027', '031', '032', '033', '034',
    '035', '036', '037', '038', '041', '045', '047', '051', '052', '054', '055', '057', '063', '065', '066'];

const CreateWalkInJob = () => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [services, setServices] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [userVehicles, setUserVehicles] = useState([]); 
    const [isVehicleFound, setIsVehicleFound] = useState(false); 
    const [jobConflict, setJobConflict] = useState(false); 
    const [existingJobs, setExistingJobs] = useState([]); 
    const formRef = useRef(null); 

    // Helper to check time overlap
    const doTimesOverlap = useCallback((start1, end1, start2, end2) => {
        return start1 < end2 && end1 > start2;
    }, []);

    // ----------------- Data Fetching (Unchanged) -----------------
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
    
    // Vehicle Fetching Effect (Unchanged)
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

    // Debounced email search (Unchanged)
    useEffect(() => {
        const handler = setTimeout(() => {
            if (formData.customerEmail && !errors.customerEmail) {
                handleEmailSearch(formData.customerEmail);
            }
        }, 800); 
        return () => clearTimeout(handler);
    }, [formData.customerEmail, errors.customerEmail, handleEmailSearch]);
    
    // Effect to fetch existing jobs for the selected date/mechanic (Unchanged)
    useEffect(() => {
        const fetchJobData = async () => {
            if (!formData.date || formData.mechanic === 'AUTO_ASSIGN') {
                setExistingJobs([]); 
                setJobConflict(false);
                return;
            }

            try {
                const jobs = await fetchJobsByDateAndMechanic({ 
                    date: formData.date, 
                    mechanicId: formData.mechanic 
                });
                setExistingJobs(jobs);
                validateSchedule(formData.date, formData.time, formData.serviceId, jobs);
            } catch (err) {
                console.error("Failed to fetch existing jobs:", err);
                setExistingJobs([]); 
                setJobConflict(false);
            }
        };

        fetchJobData();
    }, [formData.date, formData.mechanic, formData.serviceId]);


    // Core function to check for scheduling conflicts (Unchanged)
    const validateSchedule = useCallback((date, time, serviceId, jobsToCheck = existingJobs) => {
        if (!date || !time || !serviceId) {
            setJobConflict(false);
            return false;
        }

        const selectedService = services.find(s => s._id === serviceId);
        const duration = selectedService?.duration || 60; 

        const proposedStartTime = new Date(`${date}T${time}:00`);
        const proposedEndTime = new Date(proposedStartTime.getTime() + duration * 60000);

        // 1. Check Business Hours (8:00 AM - 5:00 PM)
        const openHour = new Date(`${date}T08:00:00`);
        const closeHour = new Date(`${date}T17:00:00`);
        
        if (proposedStartTime < openHour || proposedEndTime > closeHour) {
            setErrors(prev => ({ ...prev, time: 'Booking allowed between 08:00 - 17:00' }));
            setJobConflict(true);
            return false;
        } else {
            setErrors(prev => { delete prev.time; return { ...prev }; });
        }

        // 2. Check Mechanic Conflict (Only if a specific mechanic is chosen)
        if (formData.mechanic !== 'AUTO_ASSIGN') {
            const hasConflict = jobsToCheck.some(job => {
                const jobStart = new Date(job.startTime);
                const jobEnd = new Date(job.endTime);
                
                return doTimesOverlap(proposedStartTime, proposedEndTime, jobStart, jobEnd);
            });

            setJobConflict(hasConflict);
            return !hasConflict;
        }

        setJobConflict(false);
        return true;
    }, [services, formData.mechanic, existingJobs, doTimesOverlap]);

    // Validation Logic (Unchanged)
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

        // Customer Name Validation
        if (field === 'customerName' || field === null) {
            if (checkRequired('customerName', 'Customer Name is required.')) {
                if (formData.customerName && !/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/.test(formData.customerName)) {
                    tempErrors.customerName = 'Only letters, numbers, and single spaces are allowed.';
                    isValid = false;
                }
            } else { isValid = false; }
        }

        // Email Validation
        if (field === 'customerEmail' || field === null) {
            if (checkRequired('customerEmail', 'Email is required.')) {
                if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
                    tempErrors.customerEmail = 'Email is not valid.';
                    isValid = false;
                }
            } else { isValid = false; }
        }
        
        // Phone Number Validation
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

        // Vehicle Number Validation
        if (field === 'vehicleNumber' || field === null) {
            if (checkRequired('vehicleNumber', 'Vehicle Number is required.')) {
                if (formData.vehicleNumber && !/^([A-Za-z]{2,3}-\d{4})$/.test(formData.vehicleNumber)) {
                    tempErrors.vehicleNumber = 'Format: LL-NNNN or LLL-NNNN (e.g., WP-1234).';
                    isValid = false;
                }
            } else { isValid = false; }
        }
        
        // Vehicle Type, Brand, Model Validation
        if (field === 'type' || field === null) { if (!checkRequired('type', 'Vehicle Type is required.')) { isValid = false; } }
        if (field === 'brand' || field === null) { if (!checkRequired('brand', 'Brand is required.')) { isValid = false; } }
        if (field === 'model' || field === null) { if (!checkRequired('model', 'Model is required.')) { isValid = false; } }

        // Year Validation
        if (field === 'year' || field === null) {
            if (checkRequired('year', 'Year is required.')) {
                if (formData.year && (formData.year.length !== 4 || parseInt(formData.year) > currentYear || parseInt(formData.year) < 1980)) {
                    tempErrors.year = `Invalid year (1980-${currentYear}).`;
                    isValid = false;
                }
            } else { isValid = false; }
        }
        
        // Service ID Validation
        if (field === 'serviceId' || field === null) { if (!checkRequired('serviceId', 'Service Type is required.')) { isValid = false; } }

        // Date/Time Validation
        if (field === 'date' || field === 'time' || field === null) {
            if (!checkRequired('date', 'Date is required.')) { isValid = false; }
            if (!checkRequired('time', 'Time is required.')) { isValid = false; }
            
            if (formData.date && formData.time) {
                const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
                if (selectedDateTime < new Date()) {
                     tempErrors.date = 'Cannot book for a past date/time.';
                     isValid = false;
                }
                
                if (formData.date && formData.time && formData.serviceId) {
                    const isScheduleValid = validateSchedule(formData.date, formData.time, formData.serviceId);
                    if (!isScheduleValid) {
                        if (jobConflict && formData.mechanic !== 'AUTO_ASSIGN') {
                             isValid = false;
                        } else if (tempErrors.time) {
                            isValid = false;
                        }
                    }
                }
            }
        }
        
        setErrors(tempErrors);
        return isValid;
    };


    // Input Change Handler (Unchanged)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (isVehicleFound && ['vehicleNumber', 'type', 'brand', 'model', 'year'].includes(name)) {
            setIsVehicleFound(false);
        }

        if (name === 'customerPhoneNumber') {
            newValue = value.replace(/[^0-9]/g, '').slice(0, 10);
        }
        
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
        
        if (['date', 'time', 'serviceId', 'mechanic'].includes(name) && formData.date && formData.time && formData.serviceId) {
            validateSchedule(
                name === 'date' ? newValue : formData.date,
                name === 'time' ? newValue : formData.time,
                name === 'serviceId' ? newValue : formData.serviceId,
            );
        }
        
        validate(name); 
    };

    // Vehicle Selector Handler (Unchanged)
    const handleVehicleSelect = (e) => {
        const selectedNum = e.target.value;
        const selectedVehicle = userVehicles.find(v => v.vehicleNumber === selectedNum);
        
        if(selectedVehicle) {
            setIsVehicleFound(true); 
            setFormData(prev => ({
                ...prev,
                vehicleNumber: selectedNum,
                type: selectedVehicle.type,
                brand: selectedVehicle.brand,
                model: selectedVehicle.model,
                year: String(selectedVehicle.year)
            }));
            setErrors(prev => ({
                ...prev,
                vehicleNumber: '', type: '', brand: '', model: '', year: ''
            }));
        } else {
            setIsVehicleFound(false); 
            setFormData(prev => ({
                ...prev,
                vehicleNumber: '', type: '', brand: '', model: '', year: ''
            }));
        }
    }

    // Service Change Handler (Unchanged)
    const handleServiceChange = (event, value) => {
        let newServiceId = '';
        let newServiceName = '';
        
        if (value) {
            newServiceId = value._id;
            newServiceName = value.name;
        }

        setFormData(prev => ({ 
            ...prev, 
            serviceName: newServiceName, 
            serviceId: newServiceId 
        }));
        setErrors(prev => ({ ...prev, serviceId: '' }));
        
        if (formData.date && formData.time) {
             validateSchedule(formData.date, formData.time, newServiceId);
        }
    };
    
    // Submission Handler (Unchanged)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');
        
        if (!validate(null) || jobConflict) { 
            setErrorMsg('Please correct the validation errors in the form and check for scheduling conflicts.');
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
            setIsVehicleFound(false);
        } catch (err) {
            console.error(err);
            setErrorMsg(err.message || 'Failed to create job due to a server error.');
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];
    const filteredServices = formData.type
        ? services.filter(s => s.vehicleType === formData.type)
        : [];

    return (
        <AdminContainer>
            <CashierHeader />
            {/* <AdminHeader/> */}
            <AdminPaper>
                <AdminHeader>
                    <Typography variant="h5" fontWeight={600} sx={{ mt: 4, opacity: 0.9 }}>
                        Walk-In Job Creation
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 4, opacity: 0.9 }}>
                        Create service jobs for walk-in customers
                    </Typography>
                </AdminHeader>

                <Box sx={{ p: 10 }}>
                    {successMsg && (
                        <Alert severity="success" onClose={() => setSuccessMsg('')} sx={{ mb: 2 }}>
                            {successMsg}
                        </Alert>
                    )}
                    
                    {errorMsg && (
                        <Alert severity="error" onClose={() => setErrorMsg('')} sx={{ mb: 2 }}>
                            {errorMsg}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} ref={formRef}>
                        {/* Customer Information Section */}
                        <SectionHeader>
                            <PersonOutline sx={{ mr: 1, color: '#6c757d' }} />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Customer Information
                            </Typography>
                        </SectionHeader>
                        <FormSection>
                            <Grid container spacing={2}>
                                {/* Customer fields remain xs={12} md={4} */}
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Customer Name"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        error={!!errors.customerName}
                                        helperText={errors.customerName}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Email Address"
                                        name="customerEmail"
                                        value={formData.customerEmail}
                                        onChange={handleInputChange}
                                        error={!!errors.customerEmail}
                                        helperText={errors.customerEmail || "Auto-searches existing records"}
                                        type="email"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Phone Number (Optional)"
                                        name="customerPhoneNumber"
                                        value={formData.customerPhoneNumber}
                                        onChange={handleInputChange}
                                        error={!!errors.customerPhoneNumber}
                                        helperText={errors.customerPhoneNumber}
                                        type="tel"
                                        inputProps={{ maxLength: 10 }}
                                    />
                                </Grid>
                            </Grid>
                        </FormSection>

                        {/* Vehicle Details Section */}
                        <SectionHeader>
                            <DirectionsCarOutlined sx={{ mr: 1, color: '#6c757d' }} />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Vehicle Details
                            </Typography>
                            {isVehicleFound && (
                                <Chip 
                                    label="Auto-filled" 
                                    size="small" 
                                    color="info"
                                    sx={{ ml: 'auto' }}
                                />
                            )}
                        </SectionHeader>
                        <FormSection>
                            {userVehicles.length > 0 && (
                                <>
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        Found {userVehicles.length} registered vehicle(s) for this customer
                                    </Alert>
                                    <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                                        <InputLabel>Select Existing Vehicle</InputLabel>
                                        <Select
                                            label="Select Existing Vehicle"
                                            value={isVehicleFound ? formData.vehicleNumber : ""}
                                            onChange={handleVehicleSelect}
                                        >
                                            <MenuItem value="">
                                                <em>Enter New Vehicle</em>
                                            </MenuItem>
                                            {userVehicles.map((v) => (
                                                <MenuItem key={v._id} value={v.vehicleNumber}>
                                                    {v.vehicleNumber} - {v.brand} {v.model} ({v.year})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </>
                            )}

                            <Grid container spacing={2}>
                                {/* Vehicle Number */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Vehicle Number"
                                        name="vehicleNumber"
                                        value={formData.vehicleNumber}
                                        onChange={handleInputChange}
                                        error={!!errors.vehicleNumber}
                                        helperText={errors.vehicleNumber}
                                        disabled={isVehicleFound}
                                        required
                                    />
                                </Grid>
                                {/* 🚀 Vehicle Type: Changed from md={6} to md={6} (same row as Vehicle No.) */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth size="small" error={!!errors.type} disabled={isVehicleFound} required>
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
                                        {errors.type && (
                                            <FormHelperText>{errors.type}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                {/* Brand, Model, Year remain md={4} */}
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Brand"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        error={!!errors.brand}
                                        helperText={errors.brand}
                                        disabled={isVehicleFound}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Model"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleInputChange}
                                        error={!!errors.model}
                                        helperText={errors.model}
                                        disabled={isVehicleFound}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Year"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        error={!!errors.year}
                                        helperText={errors.year}
                                        type="number"
                                        disabled={isVehicleFound}
                                        required
                                        InputProps={{
                                            inputProps: { 
                                                min: 1980, 
                                                max: currentYear 
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </FormSection>

                        {/* Service & Schedule Section (UPDATED) */}
                        <SectionHeader>
                            <BuildOutlined sx={{ mr: 1, color: '#6c757d' }} />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Service & Schedule
                            </Typography>
                        </SectionHeader>
                        <FormSection>
                            {jobConflict && formData.mechanic !== 'AUTO_ASSIGN' && (
                                <Alert severity="warning" sx={{ mb: 2 }}>
                                    <Typography fontWeight={600}>Scheduling Conflict!</Typography>
                                    The selected mechanic is already booked during this time slot. Please choose a different time or mechanic.
                                </Alert>
                            )}
                            <Grid container spacing={2}>
                                {/* 🚀 Service Autocomplete: Changed from md={6} to md={12} */}
                                <Grid item xs={12} md={12}>
                                    <Autocomplete
                                        fullWidth
                                        size="small"
                                        options={filteredServices}
                                        getOptionLabel={(option) => option.name || ""}
                                        isOptionEqualToValue={(option, value) => option._id === value._id}
                                        value={filteredServices.find(s => s._id === formData.serviceId) || null}
                                        onChange={handleServiceChange}
                                        inputValue={formData.serviceName}
                                        onInputChange={(event, newInputValue) => {
                                            setFormData(prev => ({ ...prev, serviceName: newInputValue }));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={formData.type ? `Service for ${formData.type}` : "Select Vehicle Type first"}
                                                error={!!errors.serviceId}
                                                helperText={errors.serviceId}
                                                required
                                            />
                                        )}
                                    />
                                </Grid>
                                {/* Assign Mechanic: Changed from md={6} to md={12} */}
                                <Grid item xs={12} md={12}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Assign Mechanic</InputLabel>
                                        <Select
                                            label="Assign Mechanic"
                                            name="mechanic"
                                            value={formData.mechanic}
                                            onChange={handleInputChange}
                                            error={jobConflict && formData.mechanic !== 'AUTO_ASSIGN'}
                                        >
                                            <MenuItem value="AUTO_ASSIGN">
                                                <em>Auto Assign (Recommended)</em>
                                            </MenuItem>
                                            {mechanics.map((m) => (
                                                <MenuItem key={m._id} value={m._id}>
                                                    {m.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {jobConflict && formData.mechanic !== 'AUTO_ASSIGN' && (
                                             <FormHelperText error>Conflict detected. Choose another mechanic or time.</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                {/* Date field (md={6}) */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Date"
                                        name="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        error={!!errors.date}
                                        helperText={errors.date}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ min: today }}
                                        required
                                    />
                                </Grid>
                                {/* 🚀 Time Select: Changed from TextField to Select with 15-min intervals (md={6}) */}
                                <Grid item xs={12} md={6}>
                                    <FormControl 
                                        fullWidth 
                                        size="small" 
                                        required
                                        error={!!errors.time || (jobConflict && formData.mechanic !== 'AUTO_ASSIGN')}
                                        disabled={!formData.date}
                                    >
                                        <InputLabel>Time</InputLabel>
                                        <Select
                                            label="Time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            MenuProps={{ 
                                                // Scroll to selected item for better UX
                                                anchorOrigin: { vertical: "bottom", horizontal: "left" },
                                                transformOrigin: { vertical: "top", horizontal: "left" },
                                                getContentAnchorEl: null,
                                            }}
                                        >
                                            {ALL_TIME_SLOTS.map((slot) => (
                                                <MenuItem key={slot} value={slot}>
                                                    {slot}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            {errors.time || (jobConflict && formData.mechanic !== 'AUTO_ASSIGN' ? "Conflict detected. Choose another time." : "")}
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </FormSection>

                        {/* Navigation (Disabled button on conflict) */}
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setFormData(initialState);
                                    setUserVehicles([]);
                                    setIsVehicleFound(false);
                                    setErrors({});
                                    setJobConflict(false); 
                                }}
                                disabled={loading}
                            >
                                Clear Form
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading || jobConflict}
                                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AddCircleOutline />}
                                sx={{
                                    backgroundColor: '#3498db',
                                    '&:hover': {
                                        backgroundColor: '#2980b9',
                                    }
                                }}
                            >
                                {loading ? 'Creating...' : 'Create Job'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </AdminPaper>
        </AdminContainer>
    );
};

export default CreateWalkInJob;