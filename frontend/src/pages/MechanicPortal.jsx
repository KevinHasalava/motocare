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
                    dayjs(job.booking?.date || job.date).format('YYYY-MM-DD') === now.format('YYYY-MM-DD')
                );
            case 1: // Active Jobs (Ongoing)
                return jobs.filter(job => job.status === 'Ongoing');
            case 2: // Upcoming Jobs
                return jobs.filter(job => 
                    dayjs(job.booking?.date || job.date).isAfter(now) && job.status === 'Booked'
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
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F8F9FB' }}>
                    <HeaderWrapper />
                    <Container component="main" maxWidth="md" sx={{ mt: 12, mb: 4, flexGrow: 1 }}>
                        <Typography variant="h6" color="text.secondary" align="center">
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
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F8F9FB' }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F8F9FB' }}>
                <HeaderWrapper />
                
                <Container component="main" maxWidth="xl" sx={{ mt: 12, mb: 4, flexGrow: 1, px: { xs: 2, sm: 3 } }}>
                    {/* Header Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 800, 
                            color: '#111827', 
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            fontFamily: '"Outfit", sans-serif',
                        }}>
                            <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: '#D32F2F', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(211,47,47,0.3)' }}>
                                <BuildIcon sx={{ fontSize: '1.4rem', color: 'white' }} />
                            </Box>
                            Mechanic Portal
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#6B7280', fontWeight: 400 }}>
                            Welcome back, {user.name}! Manage your assigned jobs and track your work.
                        </Typography>
                    </Box>

                    {/* Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {[
                          { label: "Today's Jobs", count: filterJobs(0).length, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
                          { label: 'Ongoing', count: filterJobs(1).length, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
                          { label: 'Upcoming', count: filterJobs(2).length, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
                          { label: 'Completed', count: filterJobs(3).length, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
                        ].map(({ label, count, color, bg, border }) => (
                          <Grid item xs={6} sm={3} key={label}>
                            <Card sx={{ background: bg, border: `1px solid ${border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center', borderRadius: '14px' }}>
                              <CardContent>
                                <Typography variant="h4" sx={{ fontWeight: 800, color, fontFamily: '"Outfit", sans-serif' }}>
                                  {count}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600 }}>{label}</Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                    </Grid>

                    {/* Tab Navigation */}
                    <Paper sx={{ mb: 3, background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: '14px', overflow: 'hidden' }}>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleTabChange}
                            sx={{
                                '& .MuiTab-root': { 
                                    color: '#6B7280',
                                    fontWeight: 600,
                                    '&.Mui-selected': { color: '#D32F2F' }
                                },
                                '& .MuiTabs-indicator': { backgroundColor: '#D32F2F' }
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
                            <LinearProgress sx={{ '& .MuiLinearProgress-bar': { backgroundColor: '#D32F2F' } }} />
                            <Typography sx={{ color: '#6B7280', mt: 2, textAlign: 'center' }}>
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
                            <Paper sx={{ p: 4, textAlign: 'center', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                <BuildIcon sx={{ fontSize: 60, color: '#D1D5DB', mb: 2 }} />
                                <Typography variant="h6" sx={{ color: '#111827', mb: 1, fontWeight: 700 }}>
                                    No jobs found
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6B7280' }}>
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
                                                background: '#FFFFFF',
                                                border: `2px solid ${statusColor}`,
                                                borderRadius: '14px',
                                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 12px 32px ${statusColor}30`
                                                }
                                            }}>
                                                <CardContent sx={{ p: 3 }}>
                                                    {/* Header */}
                                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                                        <Typography variant="h6" sx={{ 
                                                            color: '#111827', 
                                                            fontWeight: 700,
                                                            flex: 1,
                                                            fontFamily: '"Outfit", sans-serif',
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
                                                        bgcolor: '#F8F9FB', 
                                                        borderRadius: '10px',
                                                        mb: 2,
                                                        border: '1px solid #E5E7EB'
                                                    }}>
                                                        <Typography variant="body1" sx={{ 
                                                            color: '#D32F2F', 
                                                            fontWeight: 700,
                                                            mb: 0.5
                                                        }}>
                                                            {job.service?.name || 'Service not specified'}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                                            Duration: {job.service?.duration || 'N/A'} mins
                                                        </Typography>
                                                    </Box>

                                                    {/* Vehicle & Customer Info */}
                                                    <Stack spacing={1.5} sx={{ mb: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <CarIcon sx={{ color: '#9CA3AF', fontSize: '1rem' }} />
                                                            <Typography variant="body2" sx={{ color: '#374151' }}>
                                                                {job.vehicle?.vehicleNumber || 'Vehicle number not available'} - {job.vehicle?.brand} {job.vehicle?.model}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <PersonIcon sx={{ color: '#9CA3AF', fontSize: '1rem' }} />
                                                            <Typography variant="body2" sx={{ color: '#374151' }}>
                                                                {job.user?.name || 'Customer name not available'}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <AccessTimeIcon sx={{ color: '#9CA3AF', fontSize: '1rem' }} />
                                                            <Typography variant="body2" sx={{ color: '#374151' }}>
                                                                {dayjs(job.booking?.date || job.date).format('ddd, D MMM YYYY, h:mm A')}
                                                            </Typography>
                                                        </Box>
                                                        {job.workHours && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <TimerIcon sx={{ color: '#9CA3AF', fontSize: '1rem' }} />
                                                                <Typography variant="body2" sx={{ color: '#059669', fontWeight: 600 }}>
                                                                    Work Hours: {job.workHours}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Stack>

                                                    {/* Notes Section */}
                                                    {job.notes && (
                                                        <Accordion sx={{ 
                                                            mb: 2, 
                                                            bgcolor: '#F8F9FB',
                                                            border: '1px solid #E5E7EB',
                                                            borderRadius: '10px !important',
                                                            '&:before': { display: 'none' }
                                                        }}>
                                                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#6B7280' }} />}>
                                                                <Typography sx={{ color: '#374151', fontSize: '0.875rem', fontWeight: 600 }}>
                                                                    Work Notes
                                                                </Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <Typography sx={{ 
                                                                    color: '#6B7280', 
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
                                                                borderColor: '#D32F2F',
                                                                color: '#D32F2F',
                                                                '&:hover': {
                                                                    bgcolor: '#FFF5F5',
                                                                    borderColor: '#D32F2F'
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
                <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                    <DialogTitle sx={{ background: '#FFFFFF', color: '#111827', borderBottom: '1px solid #E5E7EB', fontFamily: '"Outfit", sans-serif', fontWeight: 800 }}>
                        Update Job Status — Job #{selectedJob?.jobId}
                    </DialogTitle>
                    <DialogContent sx={{ background: '#FFFFFF', pt: 3 }}>
                        <Stack spacing={3}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    label="Status"
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
                            />
                            <TextField
                                label="Work Notes (Optional)"
                                value={workNote}
                                onChange={(e) => setWorkNote(e.target.value)}
                                multiline
                                rows={3}
                                placeholder="Add any work notes..."
                                fullWidth
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ background: '#FFFFFF', borderTop: '1px solid #E5E7EB', p: 2 }}>
                        <Button onClick={() => setStatusDialogOpen(false)} sx={{ color: '#6B7280' }}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleStatusUpdate} 
                            variant="contained"
                            sx={{ bgcolor: '#D32F2F', '&:hover': { bgcolor: '#B71C1C' }, borderRadius: '8px' }}
                        >
                            Update Job
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add Note Dialog */}
                <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                    <DialogTitle sx={{ background: '#FFFFFF', color: '#111827', borderBottom: '1px solid #E5E7EB', fontFamily: '"Outfit", sans-serif', fontWeight: 800 }}>
                        Add Work Note — Job #{selectedJob?.jobId}
                    </DialogTitle>
                    <DialogContent sx={{ background: '#FFFFFF', pt: 3 }}>
                        <TextField
                            label="Work Note"
                            value={workNote}
                            onChange={(e) => setWorkNote(e.target.value)}
                            multiline
                            rows={4}
                            placeholder="Add your work note here..."
                            fullWidth
                            autoFocus
                        />
                    </DialogContent>
                    <DialogActions sx={{ background: '#FFFFFF', borderTop: '1px solid #E5E7EB', p: 2 }}>
                        <Button onClick={() => setNoteDialogOpen(false)} sx={{ color: '#6B7280' }}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleAddNote} 
                            variant="contained"
                            disabled={!workNote.trim()}
                            sx={{ bgcolor: '#D32F2F', '&:hover': { bgcolor: '#B71C1C' }, borderRadius: '8px' }}
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