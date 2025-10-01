import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    Container, Typography, Alert, Box, Paper, Grid, Button,
    Dialog, DialogTitle, DialogContent, Stack, Chip, alpha, Stepper, Step, StepLabel
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { theme } from "../utils/theme";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StepVehicleSelect from "../components/Booking/StepVehicleSelect";
import StepServiceSelect from "../components/Booking/StepServiceSelect";
import StepDateTime from "../components/Booking/StepDateTime";
import StepConfirm from "../components/Booking/StepConfirm";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import EngineeringIcon from '@mui/icons-material/Engineering';


// Add CSS for loading animation
const loadingStyles = `
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
`;

const editSteps = ['Select Vehicle', 'Select Service', 'Change Time & Mechanic', 'Confirm Changes'];

const getStatusChip = (status) => {
    const statusProps = {
        Pending: { icon: <PendingIcon />, color: "warning" },
        Confirmed: { icon: <CheckCircleIcon />, color: "primary" },
        'In Progress': { icon: <EngineeringIcon />, color: "info" },
        Completed: { icon: <CheckCircleIcon />, color: "success" },
        Cancelled: { icon: <CancelIcon />, color: "error" },
    };

    const props = statusProps[status] || { label: status, color: "default" };

    return <Chip icon={props.icon} label={status} color={props.color} size="small" />;
};


const MyBookingsPage = () => {
    const [myBookings, setMyBookings] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [services, setServices] = useState([]);
    const [vehicles, setVehicles] = useState([]); 

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeEditStep, setActiveEditStep] = useState(0);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [editVehicle, setEditVehicle] = useState(null);
    const [editService, setEditService] = useState(null);
    const [editDate, setEditDate] = useState(null);
    const [editTime, setEditTime] = useState(null);
    const [editMechanic, setEditMechanic] = useState(null);

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Initialize user on component mount
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error("Error parsing user data:", error);
                setError("Invalid user session. Please log in again.");
            }
        } else {
            setError("You must be logged in to view bookings.");
            setLoading(false);
        }
    }, []);

    // Helper function to check if booking is in the past
    const isBookingInPast = (bookingDate) => {
        const now = dayjs();
        const booking = dayjs(bookingDate);
        // Consider booking as past if it's more than 1 hour ago
        return booking.isBefore(now.subtract(1, 'hour'));
    };

    // Helper function to find job ID for a booking
    const findJobIdForBooking = (bookingId) => {
        const job = allJobs.find(job => job.booking?._id === bookingId || job.booking === bookingId);
        return job?.jobId || 'Not assigned';
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        const colors = {
            'Booked': '#2196f3',
            'Ongoing': '#ff9800', 
            'Completed': '#4caf50',
            'Cancelled': '#f44336'
        };
        return colors[status] || '#757575';
    };

    // Helper function to get booking status
    const getBookingStatus = (booking) => {
        const job = allJobs.find(job => job.booking?._id === booking._id || job.booking === booking._id);
        return job?.status || 'Booked';
    };

    // Helper function to check if booking can be modified
    const canModifyBooking = (booking) => {
        const status = getBookingStatus(booking);
        const isPast = isBookingInPast(booking.date);
        return !isPast && (status === 'Booked');
    };

    // Helper function to filter bookings based on current filter
    const getFilteredBookings = () => {
        if (filter === 'active') {
            return myBookings.filter(booking => {
                const status = getBookingStatus(booking);
                const isPast = isBookingInPast(booking.date);
                // Active: can be modified OR (not completed/cancelled AND not too far in past)
                return canModifyBooking(booking) || (!isPast && status !== 'Completed' && status !== 'Cancelled');
            });
        } else if (filter === 'completed') {
            return myBookings.filter(booking => {
                const status = getBookingStatus(booking);
                const isPast = isBookingInPast(booking.date);
                // Completed: explicitly completed/cancelled OR past bookings
                return status === 'Completed' || status === 'Cancelled' || isPast;
            });
        }
        return myBookings; // 'all'
    };

    // Helper function to get filter counts
    const getFilterCounts = () => {
        // Debug: Log all booking statuses
        console.log('All bookings with statuses:', myBookings.map(booking => ({
            id: booking._id,
            service: booking.service?.name,
            status: getBookingStatus(booking),
            isPast: isBookingInPast(booking.date),
            date: booking.date
        })));
        
        const activeCount = myBookings.filter(booking => {
            const status = getBookingStatus(booking);
            const isPast = isBookingInPast(booking.date);
            return canModifyBooking(booking) || (!isPast && status !== 'Completed' && status !== 'Cancelled');
        }).length;
        
        const completedCount = myBookings.filter(booking => {
            const status = getBookingStatus(booking);
            const isPast = isBookingInPast(booking.date);
            return status === 'Completed' || status === 'Cancelled' || isPast;
        }).length;
        
        console.log('Filter counts:', { total: myBookings.length, active: activeCount, completed: completedCount });
        
        return { total: myBookings.length, active: activeCount, completed: completedCount };
    };

    const fetchData = useCallback(async () => {
        if (!user) {
            return; // Don't fetch if user is not loaded yet
        }
        
        setLoading(true);
        setError("");
        
        try {
            const [bookingsRes, jobsRes, mechanicsRes, servicesRes, vehiclesRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/bookings/user/${user._id}`),
                axios.get("http://localhost:5000/api/jobs"),
                axios.get("http://localhost:5000/api/users"),
                axios.get("http://localhost:5000/api/services"),
                axios.get(`http://localhost:5000/api/bookings/vehicles/${user._id}`)
            ]);
            
            const sortedBookings = bookingsRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setMyBookings(sortedBookings);

            setAllJobs(jobsRes.data);
            setMechanics(mechanicsRes.data.filter(u => u.userType === "mechanic"));
            setServices(servicesRes.data);
            setVehicles(vehiclesRes.data);

        } catch (err) {
            setError("Failed to load booking data. Please try again later.");
            console.error("Fetch data error:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [fetchData, user]);

    const handleEditClick = (booking) => {
        // Check if booking can be modified
        if (!canModifyBooking(booking)) {
            const status = getBookingStatus(booking);
            const isPast = isBookingInPast(booking.date);
            
            if (isPast) {
                alert('Cannot edit past bookings. This booking has already occurred.');
            } else if (status !== 'Booked') {
                alert(`Cannot edit booking with status: ${status}. Only bookings with 'Booked' status can be modified.`);
            }
            return;
        }
        
        setSelectedBooking(booking);
        setEditVehicle(booking.vehicle);
        setEditService(booking.service);
        const bookingDateTime = dayjs(booking.date);
        setEditDate(bookingDateTime);
        setEditTime(bookingDateTime);
        setEditMechanic(booking.mechanic);
        setActiveEditStep(0);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setSelectedBooking(null);
    };

    const handleUpdateBooking = async () => {
        if (!editVehicle || !editService || !editDate || !editTime) {
            alert("Something is missing. Please go back and check your selections.");
            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/bookings/update-with-job/${selectedBooking._id}`, {
                vehicle: editVehicle._id,
                service: editService._id,
                date: editDate.format("YYYY-MM-DD"),
                time: editTime.format("HH:mm"),
                mechanic: editMechanic?._id,
            });
            handleEditModalClose();
            fetchData();
        } catch (err) {
            alert("Failed to update booking: " + (err.response?.data?.message || err.message));
        }
    };

    const handleCancelBooking = async (bookingId, bookingDate, booking) => {
        // Check if booking can be modified
        if (!canModifyBooking(booking)) {
            const status = getBookingStatus(booking);
            const isPast = isBookingInPast(bookingDate);
            
            if (isPast) {
                alert('Cannot cancel past bookings. This booking has already occurred.');
            } else if (status !== 'Booked') {
                alert(`Cannot cancel booking with status: ${status}. Only bookings with 'Booked' status can be cancelled.`);
            }
            return;
        }
        
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await axios.delete(`http://localhost:5000/api/bookings/delete-with-job/${bookingId}`);
                fetchData();
            } catch (err) {
                alert("Failed to cancel booking: " + (err.response?.data?.message || err.message));
            }
        }
    };

    const jobsForAvailabilityCheck = allJobs.filter(job =>
        job.booking?._id !== selectedBooking?._id
    );

    return (
        <ThemeProvider theme={theme}>
            <style dangerouslySetInnerHTML={{ __html: loadingStyles }} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f172a' }}>
                    <Header />


                         <Container component="main" maxWidth="xl" sx={{ mt: 12, mb: 4, flexGrow: 1, px: { xs: 2, sm: 3 } }}>
                        <Typography variant="h4" gutterBottom sx={{ 
                            fontWeight: 700, 
                            color: 'white', 
                            mb: 3,
                            fontSize: { xs: '1.75rem', sm: '2.125rem' }
                        }}>
                            My Bookings
                        </Typography>
                        
                        {loading && (
                            <Grid container spacing={3}>
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <Grid item xs={12} sm={6} lg={4} key={item}>
                                        <Paper sx={{ 
                                            p: 3, 
                                            height: 300,
                                            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                                            border: '2px solid #374151'
                                        }}>
                                            <Stack spacing={2}>
                                                <Box sx={{ 
                                                    height: 24, 
                                                    bgcolor: '#374151', 
                                                    borderRadius: 1,
                                                    animation: 'pulse 2s infinite'
                                                }} />
                                                <Box sx={{ 
                                                    height: 40, 
                                                    bgcolor: '#4b5563', 
                                                    borderRadius: 1,
                                                    animation: 'pulse 2s infinite'
                                                }} />
                                                <Box sx={{ 
                                                    height: 16, 
                                                    bgcolor: '#374151', 
                                                    borderRadius: 1,
                                                    animation: 'pulse 2s infinite'
                                                }} />
                                                <Box sx={{ 
                                                    height: 32, 
                                                    bgcolor: '#4b5563', 
                                                    borderRadius: 1,
                                                    animation: 'pulse 2s infinite'
                                                }} />
                                                <Stack direction="row" spacing={1}>
                                                    <Box sx={{ 
                                                        height: 32, 
                                                        flex: 1,
                                                        bgcolor: '#374151', 
                                                        borderRadius: 1,
                                                        animation: 'pulse 2s infinite'
                                                    }} />
                                                    <Box sx={{ 
                                                        height: 32, 
                                                        flex: 1,
                                                        bgcolor: '#374151', 
                                                        borderRadius: 1,
                                                        animation: 'pulse 2s infinite'
                                                    }} />
                                                </Stack>
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                                {error.includes("log in") && (
                                    <Box sx={{ mt: 2 }}>
                                        <Button 
                                            variant="contained" 
                                            onClick={() => navigate('/login')}
                                            sx={{ mr: 2 }}
                                        >
                                            Go to Login
                                        </Button>
                                        <Button 
                                            variant="outlined" 
                                            onClick={() => navigate('/register')}
                                        >
                                            Register
                                        </Button>
                                    </Box>
                                )}
                            </Alert>
                        )}
                        {/* Filter Buttons */}
                        {!loading && !error && myBookings.length > 0 && (() => {
                            const counts = getFilterCounts();
                            return (
                                <Box sx={{ mb: 4 }}>
                                    <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', gap: 2 }}>
                                        <Button
                                            variant={filter === 'all' ? 'contained' : 'outlined'}
                                            onClick={() => setFilter('all')}
                                            sx={{
                                                borderColor: '#6366f1',
                                                color: filter === 'all' ? 'white' : '#6366f1',
                                                bgcolor: filter === 'all' ? '#6366f1' : 'transparent',
                                                '&:hover': {
                                                    bgcolor: filter === 'all' ? '#5338f7' : 'rgba(99, 102, 241, 0.1)'
                                                }
                                            }}
                                        >
                                            All Bookings ({counts.total})
                                        </Button>
                                        <Button
                                            variant={filter === 'active' ? 'contained' : 'outlined'}
                                            onClick={() => setFilter('active')}
                                            sx={{
                                                borderColor: '#22c55e',
                                                color: filter === 'active' ? 'white' : '#22c55e',
                                                bgcolor: filter === 'active' ? '#22c55e' : 'transparent',
                                                '&:hover': {
                                                    bgcolor: filter === 'active' ? '#16a34a' : 'rgba(34, 197, 94, 0.1)'
                                                }
                                            }}
                                        >
                                            🟢 Active ({counts.active})
                                        </Button>
                                        <Button
                                            variant={filter === 'completed' ? 'contained' : 'outlined'}
                                            onClick={() => setFilter('completed')}
                                            sx={{
                                                borderColor: '#6b7280',
                                                color: filter === 'completed' ? 'white' : '#6b7280',
                                                bgcolor: filter === 'completed' ? '#6b7280' : 'transparent',
                                                '&:hover': {
                                                    bgcolor: filter === 'completed' ? '#5b6570' : 'rgba(107, 114, 128, 0.1)'
                                                }
                                            }}
                                        >
                                            ⚪ Completed ({counts.completed})
                                        </Button>
                                    </Stack>
                                </Box>
                            );
                        })()}

                        {!loading && !error && (
                            myBookings.length === 0 ? (
                                <Paper sx={{ p: 4, textAlign: 'center', background: alpha("#000", 0.2) }}>
                                    <EventBusyIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                                    <Typography variant="h6" sx={{ color: 'white' }}>No Bookings Found</Typography>
                                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/booking')}>Book a Service</Button>
                                </Paper>
                            ) : (() => {
                                const filteredBookings = getFilteredBookings();
                                
                                if (filteredBookings.length === 0) {
                                    return (
                                        <Paper sx={{ p: 4, textAlign: 'center', background: alpha("#000", 0.2) }}>
                                            <EventBusyIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                                            <Typography variant="h6" sx={{ color: 'white' }}>
                                                No {filter} bookings found
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#9ca3af', mt: 1 }}>
                                                Try selecting a different filter
                                            </Typography>
                                        </Paper>
                                    );
                                }
                                
                                return (
                                    <Grid container spacing={3}>
                                        {filteredBookings.map((booking) => {
                                            const jobId = findJobIdForBooking(booking._id);
                                            const status = getBookingStatus(booking);
                                            const isPast = isBookingInPast(booking.date);
                                            const canModify = canModifyBooking(booking);
                                            const statusColor = getStatusColor(status);
                                            const isCompleted = status === 'Completed' || status === 'Cancelled';
                                            
                                            return (
                                                <Grid item xs={12} sm={6} lg={4} key={booking._id} sx={{ display: 'flex' }}>
                                                    <Paper sx={{ 
                                                        p: 3, 
                                                        width: '100%',
                                                        minHeight: isCompleted ? '350px' : '400px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        background: isCompleted ? 
                                                            'linear-gradient(135deg, #374151, #1f2937)' : 
                                                            'linear-gradient(135deg, #1e293b, #0f172a)', 
                                                        color: isCompleted ? '#d1d5db' : 'white',
                                                        border: isCompleted ? 
                                                            '2px solid #6b7280' : 
                                                            '2px solid #22c55e',
                                                        borderRadius: 2,
                                                        opacity: isCompleted ? 0.8 : 1,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: isCompleted ? 'translateY(-2px)' : 'translateY(-4px)',
                                                            boxShadow: isCompleted ? 
                                                                '0 5px 15px rgba(107, 114, 128, 0.3)' : 
                                                                '0 10px 30px rgba(34, 197, 94, 0.3)'
                                                        }
                                                    }}>
                                                        {/* Main Card Content */}
                                                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                                            {/* Header Section */}
                                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 2 }}>
                                                                <Typography variant="h6" sx={{ 
                                                                    fontWeight: 600, 
                                                                    flex: 1, 
                                                                    lineHeight: 1.2,
                                                                    fontSize: '1.1rem',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                                }}>
                                                                    {booking.service?.name}
                                                                </Typography>
                                                                <Stack direction="column" alignItems="flex-end" spacing={0.5} sx={{ flexShrink: 0 }}>
                                                                    <Chip 
                                                                        label={status}
                                                                        size="small"
                                                                        sx={{ 
                                                                            bgcolor: statusColor,
                                                                            color: 'white',
                                                                            fontWeight: 600,
                                                                            minWidth: 70
                                                                        }}
                                                                    />
                                                                    {isPast && (
                                                                        <Chip 
                                                                            label="Past"
                                                                            size="small"
                                                                            sx={{ 
                                                                                bgcolor: '#6b7280',
                                                                                color: 'white',
                                                                                fontWeight: 600,
                                                                                minWidth: 70
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Stack>
                                                            </Stack>
                                                            
                                                            {/* Job ID Section */}
                                                            <Box sx={{ 
                                                                p: 1.5, 
                                                                bgcolor: isCompleted ? 'rgba(107, 114, 128, 0.2)' : 'rgba(99, 102, 241, 0.1)', 
                                                                borderRadius: 1,
                                                                border: isCompleted ? '1px solid rgba(107, 114, 128, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
                                                                mb: 2
                                                            }}>
                                                                <Typography variant="body2" sx={{ 
                                                                    color: isCompleted ? '#9ca3af' : '#a5b4fc', 
                                                                    fontWeight: 500 
                                                                }}>
                                                                    <strong>Job ID:</strong> {jobId}
                                                                </Typography>
                                                            </Box>

                                                            {/* Details Section */}
                                                            <Stack spacing={1.5} sx={{ mb: 2, flexGrow: 1 }}>
                                                                {/* Vehicle Details */}
                                                                <Box>
                                                                    <Typography variant="body2" sx={{ 
                                                                        color: isCompleted ? '#9ca3af' : '#94a3b8', 
                                                                        fontSize: '0.875rem' 
                                                                    }}>
                                                                        <strong>Vehicle:</strong> {booking.vehicle?.brand} {booking.vehicle?.model}
                                                                    </Typography>
                                                                </Box>
                                                                
                                                                {/* Date and Time */}
                                                                <Box>
                                                                    <Chip 
                                                                        label={dayjs(booking.date).format('ddd, D MMM YYYY, h:mm A')} 
                                                                        sx={{ 
                                                                            bgcolor: isCompleted ? '#6b7280' : '#0ea5e9',
                                                                            color: 'white',
                                                                            width: '100%',
                                                                            justifyContent: 'center',
                                                                            fontSize: '0.8rem'
                                                                        }}
                                                                    />
                                                                </Box>
                                                                
                                                                {/* Mechanic */}
                                                                <Box>
                                                                    <Typography variant="body2" sx={{ 
                                                                        color: isCompleted ? '#9ca3af' : '#94a3b8', 
                                                                        fontSize: '0.875rem' 
                                                                    }}>
                                                                        <strong>Mechanic:</strong> {booking.mechanic?.name || 'Any Available'}
                                                                    </Typography>
                                                                </Box>
                                                                
                                                                {/* Service Price */}
                                                                {booking.service?.price && (
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{ 
                                                                            color: isCompleted ? '#9ca3af' : '#22c55e', 
                                                                            fontWeight: 600 
                                                                        }}>
                                                                            <strong>Price:</strong> LKR {booking.service.price}
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                            </Stack>
                                                        </Box>
                                                        
                                                        {/* Action Buttons Section */}
                                                        <Box sx={{ mt: 'auto', pt: 2 }}>
                                                            {isCompleted ? (
                                                                <Button 
                                                                    variant="outlined" 
                                                                    disabled
                                                                    size="small"
                                                                    sx={{ 
                                                                        width: '100%',
                                                                        color: '#6b7280',
                                                                        borderColor: '#6b7280'
                                                                    }}
                                                                >
                                                                    {status === 'Completed' ? '✅ Completed' : '❌ Cancelled'}
                                                                </Button>
                                                            ) : canModify ? (
                                                                <Stack direction="row" spacing={1}>
                                                                    <Button 
                                                                        variant="outlined" 
                                                                        startIcon={<EditIcon />} 
                                                                        onClick={() => handleEditClick(booking)} 
                                                                        size="small"
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
                                                                        Edit
                                                                    </Button>
                                                                    <Button 
                                                                        variant="outlined" 
                                                                        color="error" 
                                                                        startIcon={<DeleteIcon />} 
                                                                        onClick={() => handleCancelBooking(booking._id, booking.date, booking)} 
                                                                        size="small"
                                                                        sx={{ flex: 1 }}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                </Stack>
                                                            ) : (
                                                                <Stack spacing={1}>
                                                                    <Button 
                                                                        variant="outlined" 
                                                                        disabled
                                                                        size="small"
                                                                        sx={{ 
                                                                            width: '100%',
                                                                            color: '#6b7280',
                                                                            borderColor: '#6b7280'
                                                                        }}
                                                                    >
                                                                        {isPast ? 'Past Booking' : `${status} - Cannot Modify`}
                                                                    </Button>
                                                                    {!isPast && status !== 'Booked' && (
                                                                        <Typography variant="caption" sx={{ 
                                                                            color: '#9ca3af', 
                                                                            textAlign: 'center',
                                                                            fontSize: '0.75rem'
                                                                        }}>
                                                                            Only 'Booked' status can be modified
                                                                        </Typography>
                                                                    )}
                                                                </Stack>
                                                            )}
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                );
                            })()
                        )}
                    </Container>
                    <Footer />
                </Box>

                <Dialog open={isEditModalOpen} onClose={handleEditModalClose} fullWidth maxWidth="lg">
                    {/* ... The entire modal content remains unchanged ... */}
                    <DialogTitle sx={{ background: '#1e293b', color: 'white' }}>Edit Booking</DialogTitle>
                     <DialogContent sx={{ background: '#0f172a', p: { xs: 1, sm: 2, md: 3 } }}>
                         <Stepper activeStep={activeEditStep} sx={{ my: 3 }}>
                             {editSteps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                         </Stepper>
                         <Box sx={{ mt: 4 }}>
                             {activeEditStep === 0 && (
                                 <StepVehicleSelect
                                     vehicles={vehicles}
                                     vehicle={editVehicle}
                                     setVehicle={setEditVehicle}
                                     onNext={() => setActiveEditStep(1)}
                                 />
                             )}
                             {activeEditStep === 1 && (
                                 <StepServiceSelect
                                     services={services}
                                     service={editService}
                                     setService={setEditService}
                                     onNext={() => setActiveEditStep(2)}
                                     onBack={() => setActiveEditStep(0)}
                                     selectedVehicle={editVehicle} />
                             )}
                             {activeEditStep === 2 && (
                                 <StepDateTime
                                     date={editDate} setDate={setEditDate}
                                     time={editTime} setTime={setEditTime}
                                     mechanic={editMechanic} setMechanic={setEditMechanic}
                                     mechanics={mechanics}
                                     bookings={jobsForAvailabilityCheck}
                                     serviceDuration={editService?.duration}
                                     onNext={() => setActiveEditStep(3)}
                                     onBack={() => setActiveEditStep(1)}
                                 />
                             )}
                             {activeEditStep === 3 && (
                                 <StepConfirm
                                     vehicle={editVehicle}
                                     service={editService}
                                     date={editDate}
                                     time={editTime}
                                     mechanic={editMechanic}
                                     onBack={() => setActiveEditStep(2)}
                                     onConfirm={handleUpdateBooking}
                                 />
                             )}
                         </Box>
                     </DialogContent>
                </Dialog>
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default MyBookingsPage;