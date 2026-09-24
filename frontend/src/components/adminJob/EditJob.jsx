import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Paper, Typography, TextField, Button, Grid, MenuItem, Alert, CircularProgress, 
    FormControl, InputLabel, Select, Chip, FormHelperText, alpha, Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
    PersonOutline, DirectionsCarOutlined, BuildOutlined, CalendarTodayOutlined, 
    EngineeringOutlined, SaveOutlined, ErrorOutline, VisibilityOutlined, GetApp, AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { fetchJobDetails, updateJob, downloadJobPdf, fetchJobsByDateAndMechanic } from '../../api/job';
import { fetchServices, fetchMechanics } from '../../api/data'; 
import HeaderWrapper from '../HeaderWrapper';

// --- Styled Components (Unchanged) ---
const AdminContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#F8F9FB',
    minHeight: '100vh',
    padding: theme.spacing(3),
}));

const AdminPaper = styled(Paper)(({ theme }) => ({
    maxWidth: 1200,
    margin: '0 auto',
    borderRadius: '16px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
}));

// AdminHeader style updated to light premium automotive design
const AdminHeader = styled(Box)(({ theme }) => ({
    backgroundColor: '#FFFFFF',
    color: '#111827',
    padding: theme.spacing(3),
    borderBottom: '2px solid #D32F2F',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap', // Added for responsiveness
}));

const SectionHeader = styled(Box)(({ theme }) => ({
    backgroundColor: '#F9FAFB',
    padding: theme.spacing(1.5, 2),
    borderBottom: '1px solid #E5E7EB',
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

// --- Helper Functions (Unchanged) ---
const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hourCycle: 'h23' 
    });
};

// --- Time Slot Generator ---
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
    const [downloading, setDownloading] = useState(false); // 💡 New state for PDF download
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [services, setServices] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [errors, setErrors] = useState({});
    const [existingJobs, setExistingJobs] = useState([]);
    const [jobConflict, setJobConflict] = useState(false);

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

    // 💡 NEW: PDF Download Handler
    const handleDownloadPdf = async () => {
        setDownloading(true);
        setErrorMsg('');
        setSuccessMsg('');

        if (!jobData || !jobData.jobId) {
             setErrorMsg('Cannot download PDF: Job details are missing.');
             setDownloading(false);
             return;
        }

        try {
            // Call the API function to fetch the PDF (see #2 below)
            const response = await downloadJobPdf(jobId); 
            
            // Create a blob from the response data (assuming the backend sends a file stream)
            const blob = new Blob([response.data], { type: 'application/pdf' });
            
            // Create a link element, set the download attributes, and click it
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `JobReport_${jobData.jobId}.pdf`; // Use the proper jobId
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setSuccessMsg(`Successfully downloaded PDF for Job ${jobData.jobId}.`);
            
        } catch (err) {
            // Check for potential error response text from backend
             const errorMessage = err.response && err.response.data && err.response.data.message 
                                 ? err.response.data.message 
                                 : err.message || 'Failed to download PDF due to an unknown error.';
            setErrorMsg(`Download failed: ${errorMessage}`);
            console.error(err);
        } finally {
            setDownloading(false);
        }
    };
    // End of NEW: PDF Download Handler

    useEffect(() => {
        loadJobAndData();
    }, [loadJobAndData]);

    // Effect to fetch existing jobs for the selected date/mechanic (for conflict detection)
    useEffect(() => {
        const fetchJobData = async () => {
            if (!formData.date || formData.mechanic === 'AUTO_ASSIGN' || isViewMode) {
                setExistingJobs([]);
                setJobConflict(false);
                return;
            }

            try {
                const jobs = await fetchJobsByDateAndMechanic({ 
                    date: formData.date, 
                    mechanicId: formData.mechanic 
                });
                // Filter out the current job being edited from conflicts
                const otherJobs = jobs.filter(job => job._id !== jobId);
                setExistingJobs(otherJobs);
                validateSchedule(formData.date, formData.time, formData.service, otherJobs);
            } catch (err) {
                console.error("Failed to fetch existing jobs:", err);
                setExistingJobs([]);
                setJobConflict(false);
            }
        };

        fetchJobData();
    }, [formData.date, formData.mechanic, formData.service, jobId, isViewMode]);
    
    // Helper to check time overlap
    const doTimesOverlap = useCallback((start1, end1, start2, end2) => {
        return start1 < end2 && end1 > start2;
    }, []);

    // Core function to check for scheduling conflicts
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
    
    // Simple Validation (Unchanged)
    const validate = () => {
        let tempErrors = {};
        let isValid = true;
        
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

    // Input Change Handler (Unchanged)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Submission Handler (Unchanged)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');
        
        if (!validate()) { 
            setErrorMsg('Please correct the errors before saving.');
            return;
        }

        setSaving(true);

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
    
    const selectedService = services.find(s => s._id === formData.service);
    const selectedMechanic = mechanics.find(m => m._id === formData.mechanic);

    return (
        <AdminContainer>
            <HeaderWrapper />
            <AdminPaper>
                <AdminHeader sx={{ mt: 8 }}>
                    {/* Left side: Title and Job ID */}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: '#111827' }}>
                            {currentMode} Job: {jobData.jobId || jobId}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            Internal ID: {jobId}
                        </Typography>
                    </Box>

                    {/* Right side: Status Chip and Download Button */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: { xs: 1, md: 0 } }}>
                        <Chip 
                            icon={<VisibilityOutlined />}
                            label={`Status: ${formData.status}`} 
                            color={getStatusColor(formData.status)}
                            sx={{ fontSize: '1rem', height: 32 }}
                        />
                         {/* Download PDF Button */}
                        <Button
                            variant="contained"
                            onClick={handleDownloadPdf}
                            disabled={downloading}
                            startIcon={downloading ? <CircularProgress size={18} color="inherit" /> : <GetApp />}
                            sx={{
                                backgroundColor: '#D32F2F',
                                borderRadius: '10px',
                                fontWeight: 700,
                                px: 2.5,
                                py: 1,
                                boxShadow: '0 4px 14px rgba(211,47,47,0.3)',
                                '&:hover': { backgroundColor: '#B71C1C' },
                            }}
                        >
                            {downloading ? 'Preparing PDF...' : 'Download PDF'}
                        </Button>
                    </Box>
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
                        {/* ... (Customer Information Section - Unchanged) ... */}
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
                                        disabled={isCustomerInfoDisabled} 
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
                                        disabled={isCustomerInfoDisabled} 
                                        type="email"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}> 
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Phone Number"
                                        name="customerPhoneNumber"
                                        value={formData.customerPhoneNumber || ''}
                                        onChange={handleInputChange}
                                        error={!!errors.customerPhoneNumber}
                                        helperText={errors.customerPhoneNumber}
                                        disabled={isCustomerInfoDisabled} 
                                        type="tel"
                                    />
                                </Grid>
                            </Grid>
                        </FormSection>

                        {/* ... (Vehicle Details Section - Unchanged) ... */}
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

                        {/* ... (Service & Schedule Section - Unchanged) ... */}
                        <SectionHeader>
                            <BuildOutlined sx={{ mr: 1, color: '#6c757d' }} />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Service, Schedule & Status
                            </Typography>
                        </SectionHeader>
                        <FormSection>
                            {jobConflict && formData.mechanic !== 'AUTO_ASSIGN' && !isViewMode && (
                                <Alert severity="warning" sx={{ mb: 2 }}>
                                    <Typography fontWeight={600}>Scheduling Conflict!</Typography>
                                    The selected mechanic is already booked during this time slot. Please choose a different time or mechanic.
                                </Alert>
                            )}
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
                                {/* Time Slots Grid - NEW */}
                                <Grid item xs={12} md={12}>
                                    {formData.date && formData.mechanic !== undefined && !isViewMode && (
                                        <Paper sx={{ p: 2, maxHeight: 500, overflow: "auto" }}>
                                            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                                <AccessTimeIcon />
                                                <Typography>
                                                    Select Time {!formData.date && " (Select date first)"}
                                                </Typography>
                                            </Stack>
                                            
                                            <Grid container spacing={1}>
                                                {ALL_TIME_SLOTS.map((slot) => {
                                                    const isBooked = existingJobs.some(job => {
                                                        const jobStart = new Date(job.startTime);
                                                        const jobEnd = new Date(job.endTime);
                                                        const slotStart = new Date(`${formData.date}T${slot}:00`);
                                                        const slotEnd = new Date(slotStart.getTime() + 15 * 60000); // 15 minutes later
                                                        
                                                        // Check if this slot overlaps with any booked job
                                                        return slotStart < jobEnd && slotEnd > jobStart;
                                                    });
                                                    
                                                    const isSelected = formData.time === slot;
                                                    const isPast = new Date(`${formData.date}T${slot}:00`) < new Date();
                                                    const isAvailable = !isBooked && !isPast;
                                                    
                                                    return (
                                                        <Grid item xs={6} key={slot}>
                                                            <Button
                                                                fullWidth
                                                                variant={isSelected ? "contained" : "outlined"}
                                                                disabled={!formData.date || !isAvailable || saving}
                                                                onClick={() => {
                                                                    if (isAvailable) {
                                                                        setFormData(prev => ({ ...prev, time: slot }));
                                                                        // Trigger validation
                                                                        if (formData.service) {
                                                                            validateSchedule(formData.date, slot, formData.service);
                                                                        }
                                                                    }
                                                                }}
                                                                sx={{
                                                                    borderColor: !formData.date ? "#64748b" : isAvailable ? "#10b981" : "#ef4444",
                                                                    color: isSelected ? "white" : (isAvailable ? "#10b981" : "#ef4444"),
                                                                    backgroundColor: isSelected && isAvailable ? "#10b981" : "transparent",
                                                                    "&:hover": {
                                                                        backgroundColor: isAvailable && !isSelected ? alpha("#10b981", 0.1) : undefined
                                                                    },
                                                                    "&.Mui-disabled": {
                                                                        borderColor: !formData.date ? "#64748b" : "#ef4444",
                                                                        color: !formData.date ? "#64748b" : "#ef4444"
                                                                    }
                                                                }}
                                                            >
                                                                {slot}
                                                            </Button>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                            
                                            {formData.time && (
                                                <Typography variant="body2" sx={{ mt: 2, color: "#10b981", fontWeight: 500, textAlign: "center" }}>
                                                    Selected: {formData.time}
                                                </Typography>
                                            )}
                                        </Paper>
                                    )}
                                </Grid>
                            </Grid>
                        </FormSection>


                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/admin/jobs')}
                                disabled={saving || downloading}
                            >
                                Back to Job List
                            </Button>
                            
                            {!isViewMode && (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={saving || !jobData || downloading || jobConflict}
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