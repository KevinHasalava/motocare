import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Import useNavigate
import { 
    Box, Paper, Typography, CircularProgress, Alert, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Button, Chip, MenuItem, Select, IconButton, Tooltip, FormControl
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
    DeleteOutline, EditOutlined, RefreshOutlined, CheckCircleOutline, 
    HistoryToggleOffOutlined, CancelOutlined, PlayCircleOutline
} from '@mui/icons-material';
import { getAllJobs, updateJobStatus, deleteJob } from '../../api/job'; 

// --- Styled Components ---
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

    const navigate = useNavigate(); // 👈 Initialize useNavigate

    // --- Data Fetching ---
    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            const data = await getAllJobs();
            // Sort by creation date descending
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

    // --- Status Update Handler ---
    const handleStatusChange = async (jobId, newStatus) => {
        // Find job ID for confirmation message
        const job = jobs.find(j => j._id === jobId);
        if (!window.confirm(`Are you sure you want to change the status of ${job?.jobId || jobId} to ${newStatus}?`)) {
            return;
        }

        setStatusUpdatingId(jobId);
        try {
            await updateJobStatus(jobId, newStatus);
            // Update the local state
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

    // --- Delete Handler ---
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

    // Utility function to format date/time
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
                    <Box>
                        <Tooltip title="Refresh Data">
                            <IconButton color="inherit" onClick={fetchJobs} disabled={loading}>
                                <RefreshOutlined />
                            </IconButton>
                        </Tooltip>
                        <Button 
                            variant="contained" 
                            size="small"
                            onClick={() => navigate('/admin/walkinjob')} // 👈 Navigate to Create Walk-In Job
                            sx={{ ml: 2, backgroundColor: '#3498db', '&:hover': { backgroundColor: '#2980b9' } }}
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
                                {jobs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                            <Typography color="textSecondary">No jobs found.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    jobs.map((job) => (
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
                                                        onClick={() => navigate(`/admin/jobs/edit/${job._id}`)} // 👈 Navigation added to view page
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