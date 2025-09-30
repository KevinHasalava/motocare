import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    Container, Typography, Box, Paper, Grid, Button, Chip, Stack,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Select, MenuItem, FormControl, InputLabel, Card, CardContent,
    Accordion, AccordionSummary, AccordionDetails, Alert,
    Tab, Tabs, LinearProgress
} from "@mui/material";
import {
    Build as BuildIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    PlayArrow as PlayArrowIcon,
    Notes as NotesIcon,
    Event as EventIcon,
    Person as PersonIcon,
    DirectionsCar as CarIcon,
    ExpandMore as ExpandMoreIcon,
    Timer as TimerIcon,
    AccessTime as AccessTimeIcon
} from "@mui/icons-material";
import dayjs from "dayjs";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../utils/theme";
import HeaderWrapper from "../components/HeaderWrapper";
import Footer from "../components/Footer";

const MechanicPortal = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tabValue, setTabValue] = useState(0);
    const [user, setUser] = useState(null);
    
    // Modal states
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [noteDialogOpen, setNoteDialogOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [workNote, setWorkNote] = useState("");
    const [workHours, setWorkHours] = useState("");

    // Initialize user from localStorage
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Filter jobs based on tab selection
    const filterJobs = useCallback((tabIndex) => {
        const now = dayjs();
        
        switch (tabIndex) {
            case 0: // Today's Jobs
                return jobs.filter(job => 
                    dayjs(job.booking?.date).format('YYYY-MM-DD') === now.format('YYYY-MM-DD')
                );
            case 1: // Active Jobs (Ongoing)
                return jobs.filter(job => job.status === 'Ongoing');
            case 2: // Upcoming Jobs
                return jobs.filter(job => 
                    dayjs(job.booking?.date).isAfter(now) && job.status === 'Booked'
                );
            case 3: // Completed Jobs
                return jobs.filter(job => job.status === 'Completed');
            default:
                return jobs;
        }
    }, [jobs]);

    const fetchJobs = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        
        if (user.userType !== 'mechanic') {
            setError("Access denied. Mechanic login required.");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/jobs/mechanic/${user._id}`);
            setJobs(response.data);
        } catch (err) {
            setError("Failed to load jobs. Please try again later.");
            console.error("Fetch jobs error:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchJobs();
        }
    }, [user, fetchJobs]);

    useEffect(() => {
        setFilteredJobs(filterJobs(tabValue));
    }, [jobs, tabValue, filterJobs]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleStatusUpdate = async () => {
        if (!selectedJob || !newStatus) return;

        try {
            await axios.put(`http://localhost:5000/api/jobs/${selectedJob._id}`, {
                status: newStatus,
                workHours: workHours || selectedJob.workHours,
                notes: workNote || selectedJob.notes
            });
            
            setStatusDialogOpen(false);
            setSelectedJob(null);
            setNewStatus("");
            setWorkHours("");
            setWorkNote("");
            fetchJobs();
        } catch (err) {
            console.error("Status update error:", err);
            alert("Failed to update job status");
        }
    };

    const handleAddNote = async () => {
        if (!selectedJob || !workNote.trim()) return;

        try {
            const updatedNotes = selectedJob.notes 
                ? `${selectedJob.notes}\n\n[${dayjs().format('DD/MM/YYYY HH:mm')}]: ${workNote}`
                : `[${dayjs().format('DD/MM/YYYY HH:mm')}]: ${workNote}`;

            await axios.put(`http://localhost:5000/api/jobs/${selectedJob._id}`, {
                notes: updatedNotes
            });
            
            setNoteDialogOpen(false);
            setSelectedJob(null);
            setWorkNote("");
            fetchJobs();
        } catch (err) {
            console.error("Note update error:", err);
            alert("Failed to add note");
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Booked': '#2196f3',
            'Ongoing': '#ff9800',
            'Completed': '#4caf50',
            'Cancelled': '#f44336'
        };
        return colors[status] || '#757575';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Booked': return <EventIcon />;
            case 'Ongoing': return <PlayArrowIcon />;
            case 'Completed': return <CheckCircleIcon />;
            default: return <ScheduleIcon />;
        }
    };

    const isPastJob = (date) => {
        return dayjs(date).isBefore(dayjs().subtract(1, 'hour'));
    };

    if (!user) {
        return (
            <ThemeProvider theme={theme}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f172a' }}>
                    <HeaderWrapper />
                    <Container component="main" maxWidth="md" sx={{ mt: 12, mb: 4, flexGrow: 1 }}>
                        <Typography variant="h6" color="white" align="center">
                            Loading...
                        </Typography>
                    </Container>
                    <Footer />
                </Box>
            </ThemeProvider>
        );
    }

    if (user.userType !== 'mechanic') {
        return (
            <ThemeProvider theme={theme}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f172a' }}>
                    <HeaderWrapper />
                    <Container component="main" maxWidth="md" sx={{ mt: 12, mb: 4, flexGrow: 1 }}>
                        <Alert severity="error" sx={{ mb: 3 }}>
                            Access denied. This portal is only available for mechanics.
                        </Alert>
                    </Container>
                    <Footer />
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f172a' }}>
                <HeaderWrapper />
                
                <Container component="main" maxWidth="xl" sx={{ mt: 12, mb: 4, flexGrow: 1, px: { xs: 2, sm: 3 } }}>
                    {/* Header Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 700, 
                            color: 'white', 
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <BuildIcon sx={{ fontSize: '2rem', color: '#ff9800' }} />
                            Mechanic Portal
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 400 }}>
                            Welcome back, {user.name}! Manage your assigned jobs and track your work.
                        </Typography>
                    </Box>

                    {/* Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={6} sm={3}>
                            <Card sx={{ 
                                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {filterJobs(0).length}
                                    </Typography>
                                    <Typography variant="body2">Today's Jobs</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Card sx={{ 
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {filterJobs(1).length}
                                    </Typography>
                                    <Typography variant="body2">Ongoing</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Card sx={{ 
                                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {filterJobs(2).length}
                                    </Typography>
                                    <Typography variant="body2">Upcoming</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Card sx={{ 
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {filterJobs(3).length}
                                    </Typography>
                                    <Typography variant="body2">Completed</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Tab Navigation */}
                    <Paper sx={{ mb: 3, background: '#1e293b' }}>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleTabChange}
                            sx={{
                                '& .MuiTab-root': { 
                                    color: '#94a3b8',
                                    '&.Mui-selected': { color: '#f59e0b' }
                                },
                                '& .MuiTabs-indicator': { backgroundColor: '#f59e0b' }
                            }}
                        >
                            <Tab label="Today's Jobs" />
                            <Tab label="Active Jobs" />
                            <Tab label="Upcoming Jobs" />
                            <Tab label="Completed Jobs" />
                        </Tabs>
                    </Paper>

                    {/* Loading State */}
                    {loading && (
                        <Box sx={{ mb: 3 }}>
                            <LinearProgress sx={{ backgroundColor: '#374151' }} />
                            <Typography sx={{ color: '#94a3b8', mt: 2, textAlign: 'center' }}>
                                Loading your jobs...
                            </Typography>
                        </Box>
                    )}

                    {/* Error State */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Jobs List */}
                    {!loading && !error && (
                        filteredJobs.length === 0 ? (
                            <Paper sx={{ p: 4, textAlign: 'center', background: '#1e293b' }}>
                                <BuildIcon sx={{ fontSize: 60, color: '#6b7280', mb: 2 }} />
                                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                                    No jobs found
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                    {tabValue === 0 && "No jobs scheduled for today"}
                                    {tabValue === 1 && "No ongoing jobs at the moment"}
                                    {tabValue === 2 && "No upcoming jobs scheduled"}
                                    {tabValue === 3 && "No completed jobs yet"}
                                </Typography>
                            </Paper>
                        ) : (
                            <Grid container spacing={3}>
                                {filteredJobs.map((job) => {
                                    const isPast = isPastJob(job.booking?.date);
                                    const statusColor = getStatusColor(job.status);
                                    
                                    return (
                                        <Grid item xs={12} md={6} lg={4} key={job._id}>
                                            <Card sx={{
                                                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                                                border: `2px solid ${statusColor}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 10px 30px ${statusColor}30`
                                                }
                                            }}>
                                                <CardContent sx={{ p: 3 }}>
                                                    {/* Header */}
                                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                                        <Typography variant="h6" sx={{ 
                                                            color: 'white', 
                                                            fontWeight: 600,
                                                            flex: 1
                                                        }}>
                                                            Job #{job.jobId}
                                                        </Typography>
                                                        <Chip 
                                                            icon={getStatusIcon(job.status)}
                                                            label={job.status}
                                                            sx={{ 
                                                                bgcolor: statusColor,
                                                                color: 'white',
                                                                fontWeight: 600
                                                            }}
                                                        />
                                                    </Stack>

                                                    {/* Service Details */}
                                                    <Box sx={{ 
                                                        p: 2, 
                                                        bgcolor: 'rgba(99, 102, 241, 0.1)', 
                                                        borderRadius: 1,
                                                        mb: 2,
                                                        border: '1px solid rgba(99, 102, 241, 0.3)'
                                                    }}>
                                                        <Typography variant="body1" sx={{ 
                                                            color: '#a5b4fc', 
                                                            fontWeight: 600,
                                                            mb: 1
                                                        }}>
                                                            {job.booking?.service?.name}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                                            Duration: {job.booking?.service?.duration || 'N/A'} mins
                                                        </Typography>
                                                    </Box>

                                                    {/* Vehicle & Customer Info */}
                                                    <Stack spacing={1.5} sx={{ mb: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <CarIcon sx={{ color: '#6b7280', fontSize: '1rem' }} />
                                                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                                                {job.booking?.vehicle?.brand} {job.booking?.vehicle?.model}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <PersonIcon sx={{ color: '#6b7280', fontSize: '1rem' }} />
                                                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                                                {job.booking?.user?.name}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <AccessTimeIcon sx={{ color: '#6b7280', fontSize: '1rem' }} />
                                                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                                                {dayjs(job.booking?.date).format('ddd, D MMM YYYY, h:mm A')}
                                                            </Typography>
                                                        </Box>
                                                        {job.workHours && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <TimerIcon sx={{ color: '#6b7280', fontSize: '1rem' }} />
                                                                <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 600 }}>
                                                                    Work Hours: {job.workHours}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Stack>

                                                    {/* Notes Section */}
                                                    {job.notes && (
                                                        <Accordion sx={{ 
                                                            mb: 2, 
                                                            bgcolor: 'rgba(0,0,0,0.2)',
                                                            '&:before': { display: 'none' }
                                                        }}>
                                                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                                                                <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                                                                    Work Notes
                                                                </Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <Typography sx={{ 
                                                                    color: '#d1d5db', 
                                                                    fontSize: '0.875rem',
                                                                    whiteSpace: 'pre-line'
                                                                }}>
                                                                    {job.notes}
                                                                </Typography>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    )}

                                                    {/* Action Buttons */}
                                                    <Stack direction="row" spacing={1}>
                                                        {job.status !== 'Completed' && !isPast && (
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                startIcon={<CheckCircleIcon />}
                                                                onClick={() => {
                                                                    setSelectedJob(job);
                                                                    setNewStatus(job.status);
                                                                    setWorkHours(job.workHours || '');
                                                                    setStatusDialogOpen(true);
                                                                }}
                                                                sx={{
                                                                    flex: 1,
                                                                    bgcolor: '#f59e0b',
                                                                    '&:hover': { bgcolor: '#d97706' }
                                                                }}
                                                            >
                                                                Update Status
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<NotesIcon />}
                                                            onClick={() => {
                                                                setSelectedJob(job);
                                                                setWorkNote('');
                                                                setNoteDialogOpen(true);
                                                            }}
                                                            sx={{
                                                                flex: 1,
                                                                borderColor: '#6366f1',
                                                                color: '#6366f1',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                                                                    borderColor: '#6366f1'
                                                                }
                                                            }}
                                                        >
                                                            Add Note
                                                        </Button>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        )
                    )}
                </Container>

                <Footer />

                {/* Status Update Dialog */}
                <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ background: '#1e293b', color: 'white' }}>
                        Update Job Status - Job #{selectedJob?.jobId}
                    </DialogTitle>
                    <DialogContent sx={{ background: '#0f172a', pt: 3 }}>
                        <Stack spacing={3}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#94a3b8' }}>Status</InputLabel>
                                <Select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    label="Status"
                                    sx={{ color: 'white' }}
                                >
                                    <MenuItem value="Booked">Booked</MenuItem>
                                    <MenuItem value="Ongoing">Ongoing</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Work Hours"
                                value={workHours}
                                onChange={(e) => setWorkHours(e.target.value)}
                                placeholder="e.g., 2.5 hours"
                                fullWidth
                                sx={{
                                    '& .MuiInputLabel-root': { color: '#94a3b8' },
                                    '& .MuiOutlinedInput-root': { color: 'white' }
                                }}
                            />
                            <TextField
                                label="Work Notes (Optional)"
                                value={workNote}
                                onChange={(e) => setWorkNote(e.target.value)}
                                multiline
                                rows={3}
                                placeholder="Add any work notes..."
                                fullWidth
                                sx={{
                                    '& .MuiInputLabel-root': { color: '#94a3b8' },
                                    '& .MuiOutlinedInput-root': { color: 'white' }
                                }}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ background: '#0f172a', p: 3 }}>
                        <Button onClick={() => setStatusDialogOpen(false)} sx={{ color: '#94a3b8' }}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleStatusUpdate} 
                            variant="contained"
                            sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' } }}
                        >
                            Update Job
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add Note Dialog */}
                <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ background: '#1e293b', color: 'white' }}>
                        Add Work Note - Job #{selectedJob?.jobId}
                    </DialogTitle>
                    <DialogContent sx={{ background: '#0f172a', pt: 3 }}>
                        <TextField
                            label="Work Note"
                            value={workNote}
                            onChange={(e) => setWorkNote(e.target.value)}
                            multiline
                            rows={4}
                            placeholder="Add your work note here..."
                            fullWidth
                            autoFocus
                            sx={{
                                '& .MuiInputLabel-root': { color: '#94a3b8' },
                                '& .MuiOutlinedInput-root': { color: 'white' }
                            }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ background: '#0f172a', p: 3 }}>
                        <Button onClick={() => setNoteDialogOpen(false)} sx={{ color: '#94a3b8' }}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleAddNote} 
                            variant="contained"
                            disabled={!workNote.trim()}
                            sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#5338f7' } }}
                        >
                            Add Note
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
};

export default MechanicPortal;