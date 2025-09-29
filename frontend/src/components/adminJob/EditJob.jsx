import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Paper, Typography, TextField, Button, Grid, MenuItem, Alert, CircularProgress, 
    FormControl, InputLabel, Select, Chip, FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
    PersonOutline, DirectionsCarOutlined, BuildOutlined, CalendarTodayOutlined, 
    EngineeringOutlined, SaveOutlined, ErrorOutline, VisibilityOutlined 
} from '@mui/icons-material';
import { fetchJobDetails, updateJob } from '../../api/job'; 
import { fetchServices, fetchMechanics } from '../../api/data'; 

// --- Styled Components (No change needed here) ---
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

const AdminHeader = styled(Box)(({ theme }) => ({
    backgroundColor: '#2c3e50',
    color: '#ffffff',
    padding: theme.spacing(2.5),
    borderBottom: '3px solid #3498db',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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

// --- Helper Functions (No change needed here) ---
const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

const formatTime = (dateString) => {
    if (!dateString) return '';
    // Use substring from the full ISO string (e.g., '2023-10-27T10:30:00.000Z')
    // We expect the time portion (HH:MM) to be extracted from job.timeSlot if possible, 
    // but for simplicity, we use the date object to ensure consistency.
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hourCycle: 'h23' 
    });
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Booked': return 'primary';
        case 'Ongoing': return 'warning';
        case 'Completed': return 'success';
        case 'Cancelled': return 'error';
        default: return 'default';
    }
};

// --- Main Component ---
const EditJob = ({ isViewMode = false }) => {
    const { id: jobId } = useParams();
    const navigate = useNavigate();
    
    const [jobData, setJobData] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [services, setServices] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [errors, setErrors] = useState({});

    // 🔑 NEW: Customer info is permanently read-only
    const isCustomerInfoDisabled = true;

    const currentMode = isViewMode ? 'View' : 'Edit';

    // Fetch Job Data and Supporting Data
    const loadJobAndData = useCallback(async () => {
        setLoading(true);
        try {
            const [jobResponse, serviceData, mechanicData] = await Promise.all([
                fetchJobDetails(jobId),
                fetchServices(), 
                fetchMechanics()
            ]);
            
            setServices(serviceData);
            setMechanics(mechanicData);
            setJobData(jobResponse);

            // Prepare form data from fetched job details
            setFormData({
                jobId: jobResponse.jobId,
                customerName: jobResponse.user?.name || '',
                customerEmail: jobResponse.user?.email || '',
                customerPhoneNumber: jobResponse.user?.phoneNumber || '',
                vehicleNumber: jobResponse.vehicle?.vehicleNumber || '',
                type: jobResponse.vehicle?.type || '',
                brand: jobResponse.vehicle?.brand || '',
                model: jobResponse.vehicle?.model || '',
                year: String(jobResponse.vehicle?.year || ''),
                service: jobResponse.service?._id || '',
                date: formatDate(jobResponse.date || jobResponse.startTime),
                time: formatTime(jobResponse.date || jobResponse.startTime),
                mechanic: jobResponse.mechanic?._id || 'AUTO_ASSIGN',
                status: jobResponse.status || 'Booked',
            });

        } catch (err) {
            setErrorMsg(`Failed to load job details for ID: ${jobId}. Error: ${err.message || 'Unknown error'}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    useEffect(() => {
        loadJobAndData();
    }, [loadJobAndData]);
    
    // Simple Validation (We only validate editable fields)
    const validate = () => {
        let tempErrors = {};
        let isValid = true;
        
        // Validate editable fields
        if (!formData.service) { tempErrors.service = 'Required'; isValid = false; }
        if (!formData.date) { tempErrors.date = 'Required'; isValid = false; }
        if (!formData.time) { tempErrors.time = 'Required'; isValid = false; }

        if (formData.date && formData.time) {
            const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
            if (selectedDateTime < new Date() && !isViewMode && formData.status === 'Booked') {
                 tempErrors.date = 'Cannot schedule a new booking in the past.';
                 isValid = false;
            }
        }
        
        setErrors(tempErrors);
        return isValid;
    };

    // Input Change Handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Submission Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');
        
        if (!validate()) { 
            setErrorMsg('Please correct the errors before saving.');
            return;
        }

        setSaving(true);

        // 🔑 UPDATED: Only send editable fields (service, schedule, status, mechanic)
        const dataToSend = {
            service: formData.service,
            date: formData.date,
            time: formData.time,
            mechanic: formData.mechanic,
            status: formData.status,
        };

        try {
            const response = await updateJob(jobId, dataToSend);
            setSuccessMsg(response.message || 'Job updated successfully!');
            // Re-fetch data to reflect changes
            await loadJobAndData(); 
        } catch (err) {
            console.error(err);
            setErrorMsg(err.message || 'Failed to update job due to a server error.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminContainer>
                <AdminPaper sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading Job Details...</Typography>
                </AdminPaper>
            </AdminContainer>
        );
    }

    if (errorMsg && !jobData) {
        return (
            <AdminContainer>
                <Alert severity="error" sx={{ maxWidth: 800, margin: '20px auto' }}>
                    <Typography fontWeight={600}>Error Loading Job:</Typography>
                    {errorMsg}
                    <Button onClick={() => navigate('/admin/jobs')} sx={{ mt: 1 }}>
                        Back to Dashboard
                    </Button>
                </Alert>
            </AdminContainer>
        );
    }
    
    // Get Service and Mechanic name for display
    const selectedService = services.find(s => s._id === formData.service);
    const selectedMechanic = mechanics.find(m => m._id === formData.mechanic);

    return (
        <AdminContainer>
            <AdminPaper>
                <AdminHeader>
                    <Typography variant="h5" fontWeight={600}>
                        {currentMode} Job: {jobData.jobId || jobId}
                    </Typography>
                    <Chip 
                        icon={<VisibilityOutlined />}
                        label={`Status: ${formData.status}`} 
                        color={getStatusColor(formData.status)}
                        sx={{ fontSize: '1rem', height: 32 }}
                    />
                </AdminHeader>

                <Box sx={{ p: 3 }}>
                    {successMsg && (
                        <Alert severity="success" onClose={() => setSuccessMsg('')} sx={{ mb: 2 }}>
                            {successMsg}
                        </Alert>
                    )}
                    
                    {errorMsg && jobData && (
                        <Alert severity="error" onClose={() => setErrorMsg('')} sx={{ mb: 2 }}>
                            {errorMsg}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        {/* Customer Information Section */}
                        <SectionHeader>
                            <PersonOutline sx={{ mr: 1, color: '#6c757d' }} />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Customer Information (Read-Only)
                            </Typography>
                            <Chip 
                                label="Locked" 
                                size="small" 
                                color="default"
                                sx={{ ml: 'auto' }}
                            />
                        </SectionHeader>
                        <FormSection>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Customer Name"
                                        name="customerName"
                                        value={formData.customerName || ''}
                                        onChange={handleInputChange}
                                        error={!!errors.customerName}
                                        helperText={errors.customerName}
                                        disabled={isCustomerInfoDisabled} // 🔑 Permanently disabled
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Email Address"
                                        name="customerEmail"
                                        value={formData.customerEmail || ''}
                                        onChange={handleInputChange}
                                        error={!!errors.customerEmail}
                                        helperText={errors.customerEmail}
                                        disabled={isCustomerInfoDisabled} // 🔑 Permanently disabled
                                        type="email"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}> 
                                    {/* 🔑 Phone Number is back and disabled */}
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Phone Number"
                                        name="customerPhoneNumber"
                                        value={formData.customerPhoneNumber || ''}
                                        onChange={handleInputChange}
                                        error={!!errors.customerPhoneNumber}
                                        helperText={errors.customerPhoneNumber}
                                        disabled={isCustomerInfoDisabled} // 🔑 Permanently disabled
                                        type="tel"
                                    />
                                </Grid>
                            </Grid>
                        </FormSection>

                        {/* Vehicle Details Section (Read-Only) */}
                        <SectionHeader>
                            <DirectionsCarOutlined sx={{ mr: 1, color: '#6c757d' }} />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Vehicle Details (Read-Only)
                            </Typography>
                        </SectionHeader>
                        <FormSection>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth size="small" label="Vehicle Number" name="vehicleNumber"
                                        value={formData.vehicleNumber || ''} disabled 
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth size="small" label="Vehicle Type" name="type"
                                        value={formData.type || ''} disabled 
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth size="small" label="Brand" name="brand"
                                        value={formData.brand || ''} disabled 
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth size="small" label="Model/Year" name="model"
                                        value={`${formData.model || ''} (${formData.year || ''})`} disabled 
                                    />
                                </Grid>
                            </Grid>
                            <FormHelperText sx={{ mt: 2 }}>
                                Note: To change customer or vehicle details, you must modify the User/Vehicle records separately.
                            </FormHelperText>
                        </FormSection>

                        {/* Service & Schedule Section */}
                        <SectionHeader>
                            <BuildOutlined sx={{ mr: 1, color: '#6c757d' }} />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Service, Schedule & Status
                            </Typography>
                        </SectionHeader>
                        <FormSection>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth size="small" error={!!errors.service} disabled={isViewMode || saving} required>
                                        <InputLabel>Service Type</InputLabel>
                                        <Select
                                            label="Service Type"
                                            name="service"
                                            value={formData.service || ''}
                                            onChange={handleInputChange}
                                        >
                                            {services.map((s) => (
                                                <MenuItem key={s._id} value={s._id}>
                                                    {s.name} (Duration: {s.duration} mins)
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.service && <FormHelperText>{errors.service}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth size="small" disabled={isViewMode || saving}>
                                        <InputLabel>Assign Mechanic</InputLabel>
                                        <Select
                                            label="Assign Mechanic"
                                            name="mechanic"
                                            value={formData.mechanic || 'AUTO_ASSIGN'}
                                            onChange={handleInputChange}
                                        >
                                            {mechanics.map((m) => (
                                                <MenuItem key={m._id || 'AUTO_ASSIGN'} value={m._id || 'AUTO_ASSIGN'}>
                                                    {m.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth size="small" disabled={isViewMode || saving}>
                                        <InputLabel>Job Status</InputLabel>
                                        <Select
                                            label="Job Status"
                                            name="status"
                                            value={formData.status || 'Booked'}
                                            onChange={handleInputChange}
                                        >
                                            {['Booked', 'Ongoing', 'Completed', 'Cancelled'].map((s) => (
                                                <MenuItem key={s} value={s}>{s}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Date"
                                        name="date"
                                        type="date"
                                        value={formData.date || ''}
                                        onChange={handleInputChange}
                                        error={!!errors.date}
                                        helperText={errors.date}
                                        InputLabelProps={{ shrink: true }}
                                        disabled={isViewMode || saving}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Time"
                                        name="time"
                                        type="time"
                                        value={formData.time || ''}
                                        onChange={handleInputChange}
                                        error={!!errors.time}
                                        helperText={errors.time}
                                        InputLabelProps={{ shrink: true }}
                                        disabled={isViewMode || saving}
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </FormSection>

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/admin/jobs')}
                                disabled={saving}
                            >
                                Back to Job List
                            </Button>
                            
                            {!isViewMode && (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={saving || !jobData}
                                    startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveOutlined />}
                                    sx={{
                                        backgroundColor: '#2ecc71',
                                        '&:hover': {
                                            backgroundColor: '#27ae60',
                                        }
                                    }}
                                >
                                    {saving ? 'Save Changes' : 'Save Changes'}
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Box>
            </AdminPaper>
        </AdminContainer>
    );
};

export default EditJob;