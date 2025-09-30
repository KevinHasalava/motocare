import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Paper, Typography, CircularProgress, Alert, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Button, Chip, MenuItem, Select, IconButton, Tooltip, FormControl, 
    TextField // 💡 NEW: TextField for Search Input
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
    DeleteOutline, EditOutlined, RefreshOutlined, CheckCircleOutline, 
    HistoryToggleOffOutlined, CancelOutlined, PlayCircleOutline, SearchOutlined // 💡 Search icon
} from '@mui/icons-material';
import { getAllJobs, updateJobStatus, deleteJob } from '../../api/job'; 

// --- Styled Components (Unchanged) ---
const AdminContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    padding: theme.spacing(2),
}));

const AdminPaper = styled(Paper)(({ theme }) => ({
    maxWidth: 1600,
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
    flexWrap: 'wrap', // Allow wrapping for responsiveness
}));

const StatusChip = ({ status }) => {
    const getChipProps = (status) => {
        switch (status) {
            case 'Booked': return { label: 'Booked', color: 'primary', icon: <HistoryToggleOffOutlined /> };
            case 'Ongoing': return { label: 'Ongoing', color: 'warning', icon: <PlayCircleOutline /> };
            case 'Completed': return { label: 'Completed', color: 'success', icon: <CheckCircleOutline /> };
            case 'Cancelled': return { label: 'Cancelled', color: 'error', icon: <CancelOutlined /> };
            default: return { label: status, color: 'default' };
        }
    };
    return <Chip size="small" sx={{ minWidth: 90 }} {...getChipProps(status)} />;
};

const JobDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [statusUpdatingId, setStatusUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    
    // 💡 NEW STATE: Search
    const [searchText, setSearchText] = useState('');

    const navigate = useNavigate();

    // --- Data Fetching ---
    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            const data = await getAllJobs();
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setJobs(data);
        } catch (err) {
            console.error(err);
            setErrorMsg('Failed to load job data. Check network connection or backend API.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    // --- Status Update Handler (Unchanged) ---
    const handleStatusChange = async (jobId, newStatus) => {
        const job = jobs.find(j => j._id === jobId);
        if (!window.confirm(`Are you sure you want to change the status of ${job?.jobId || jobId} to ${newStatus}?`)) {
            return;
        }

        setStatusUpdatingId(jobId);
        try {
            await updateJobStatus(jobId, newStatus);
            setJobs(prevJobs => 
                prevJobs.map(job => 
                    job._id === jobId ? { ...job, status: newStatus } : job
                )
            );
        } catch (err) {
            setErrorMsg(`Failed to update status for job ${jobId}.`);
            console.error(err);
        } finally {
            setStatusUpdatingId(null);
        }
    };

    // --- Delete Handler (Unchanged) ---
    const handleDeleteJob = async (jobId) => {
        if (!window.confirm(`Are you sure you want to delete job ID ${jobs.find(j => j._id === jobId)?.jobId}? This will also delete the associated booking.`)) {
            return;
        }
        
        setDeletingId(jobId);
        try {
            await deleteJob(jobId);
            setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
        } catch (err) {
            setErrorMsg(`Failed to delete job ${jobId}.`);
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    // Utility function to format date/time (Unchanged)
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // 💡 NEW: Filtering Logic
    const filteredJobs = jobs.filter(job => {
        if (!searchText) return true;
        const searchLower = searchText.toLowerCase();
        
        const jobId = String(job.jobId || '').toLowerCase();
        const vehicleNumber = String(job.vehicle?.vehicleNumber || '').toLowerCase();
        const customerName = String(job.user?.name || '').toLowerCase();

        return jobId.includes(searchLower) || 
               vehicleNumber.includes(searchLower) ||
               customerName.includes(searchLower);
    });

    if (loading) {
        return (
            <AdminContainer>
                <AdminPaper sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading Jobs...</Typography>
                </AdminPaper>
            </AdminContainer>
        );
    }

    return (
        <AdminContainer>
            <AdminPaper>
                <AdminHeader>
                    <Typography variant="h5" fontWeight={600}>
                        All Service Jobs Dashboard
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: { xs: 1, md: 0 } }}>
                        {/* 💡 NEW: Search Input Field */}
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search Job ID, Vehicle, or Customer"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchOutlined sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
                                sx: { 
                                    color: 'white', 
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2) !important' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5) !important' }
                                }
                            }}
                        />

                        <Tooltip title="Refresh Data">
                            <IconButton color="inherit" onClick={fetchJobs} disabled={loading}>
                                <RefreshOutlined />
                            </IconButton>
                        </Tooltip>
                        <Button 
                            variant="contained" 
                            size="small"
                            onClick={() => navigate('/admin/walkinjob')} 
                            sx={{ ml: 0, backgroundColor: '#3498db', '&:hover': { backgroundColor: '#2980b9' } }}
                        >
                            + New Walk-In Job
                        </Button>
                    </Box>
                </AdminHeader>

                <Box sx={{ p: 3 }}>
                    {errorMsg && (
                        <Alert severity="error" onClose={() => setErrorMsg('')} sx={{ mb: 2 }}>
                            {errorMsg}
                        </Alert>
                    )}

                    <TableContainer component={Paper} elevation={0} variant="outlined">
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ '& th': { fontWeight: 700, backgroundColor: '#f8f9fa' } }}>
                                    <TableCell>Job ID</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Vehicle</TableCell>
                                    <TableCell>Service</TableCell>
                                    <TableCell>Mechanic</TableCell>
                                    <TableCell>Time Slot</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* 💡 Using filteredJobs array */}
                                {filteredJobs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                            <Typography color="textSecondary">
                                                {searchText ? `No results found for "${searchText}".` : "No jobs found."}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredJobs.map((job) => (
                                        <TableRow hover key={job._id}>
                                            <TableCell sx={{ fontWeight: 600 }}>{job.jobId || job._id}</TableCell>
                                            <TableCell>{job.user?.name || 'N/A'}</TableCell>
                                            <TableCell>{job.vehicle?.vehicleNumber || 'N/A'}</TableCell>
                                            <TableCell>{job.service?.name || 'N/A'}</TableCell>
                                            <TableCell>{job.mechanic?.name || 'Unassigned'}</TableCell>
                                            <TableCell>{formatDateTime(job.date || job.startTime)}</TableCell>
                                            
                                            <TableCell align="center" sx={{ minWidth: 160 }}>
                                                <FormControl size="small" fullWidth>
                                                    <Select
                                                        value={job.status}
                                                        onChange={(e) => handleStatusChange(job._id, e.target.value)}
                                                        disabled={statusUpdatingId === job._id}
                                                        renderValue={(selected) => (
                                                            <StatusChip status={selected} />
                                                        )}
                                                        displayEmpty
                                                    >
                                                        {['Booked', 'Ongoing', 'Completed', 'Cancelled'].map(status => (
                                                            <MenuItem key={status} value={status}>
                                                                {status}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {statusUpdatingId === job._id && (
                                                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            <CircularProgress size={20} />
                                                        </Box>
                                                    )}
                                                </FormControl>
                                            </TableCell>
                                            
                                            <TableCell align="center">
                                                <Tooltip title="View/Edit Details">
                                                    <IconButton 
                                                        onClick={() => navigate(`/admin/jobs/edit/${job._id}`)} 
                                                        color="info"
                                                        size="small"
                                                    >
                                                        <EditOutlined fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Job">
                                                    <IconButton 
                                                        onClick={() => handleDeleteJob(job._id)} 
                                                        color="error" 
                                                        size="small"
                                                        disabled={deletingId === job._id}
                                                    >
                                                        {deletingId === job._id ? <CircularProgress size={16} color="error" /> : <DeleteOutline fontSize="small" />}
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </AdminPaper>
        </AdminContainer>
    );
};

export default JobDashboard;
//last working branch