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
import API_URL from "../config/api";

// ඔබගේ project එකේ components වලට අදාළ නිවැරදි path යොදන්න
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
                axios.get(`${API_URL}/api/bookings/user/${user._id}`),
                axios.get(`${API_URL}/api/jobs`),
                axios.get(`${API_URL}/api/users`),
                axios.get(`${API_URL}/api/services`),
                axios.get(`${API_URL}/api/bookings/vehicles/${user._id}`)
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
            await axios.put(`${API_URL}/api/bookings/update-with-job/${selectedBooking._id}`, {
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
                await axios.delete(`${API_URL}/api/bookings/delete-with-job/${bookingId}`);
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
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F8F9FB' }}>
                    <Header />

                    <Container component="main" maxWidth="xl" sx={{ mt: 12, mb: 4, flexGrow: 1, px: { xs: 2, sm: 3 } }}>
                        {/* Page heading */}
                        <Box sx={{
                            mb: 4,
                            p: { xs: 3, md: 4 },
                            borderRadius: '20px',
                            background: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                            position: 'relative', overflow: 'hidden',
                            '&::before': {
                                content: '""', position: 'absolute',
                                top: 0, left: 0, right: 0, height: '3px',
                                background: '#D32F2F',
                            }
                        }}>
                            <Typography variant="h4" sx={{ 
                                fontFamily: '"Outfit", sans-serif',
                                fontWeight: 800, 
                                color: '#111827', 
                                fontSize: { xs: '1.6rem', md: '2rem' },
                                mb: 0.5
                            }}>
                                My Bookings
                            </Typography>
                            <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280', fontSize: '0.95rem' }}>
                                Track, manage and review your vehicle service bookings
                            </Typography>
                        </Box>
                        
                        {loading && (
                            <Grid container spacing={3}>
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <Grid item xs={12} sm={6} lg={4} key={item}>
                                        <Paper sx={{ 
                                            p: 3, 
                                            height: 300,
                                            background: '#FFFFFF',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '16px',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
                                        }}>
                                            <Stack spacing={2}>
                                                <Box sx={{ 
                                                    height: 24, 
                                                    bgcolor: '#F3F4F6', 
                                                    borderRadius: 1,
                                                    animation: 'pulse 2s infinite'
                                                }} />
                                                <Box sx={{ 
                                                    height: 40, 
                                                    bgcolor: '#E5E7EB', 
                                                    borderRadius: 1,
                                                    animation: 'pulse 2s infinite'
                                                }} />
                                                <Box sx={{ 
                                                    height: 16, 
                                                    bgcolor: '#F3F4F6', 
                                                    borderRadius: 1,
                                                    animation: 'pulse 2s infinite'
                                                }} />
                                                <Box sx={{ 
                                                    height: 32, 
                                                    bgcolor: '#E5E7EB', 
                                                    borderRadius: 1,
                                                    animation: 'pulse 2s infinite'
                                                }} />
                                                <Stack direction="row" spacing={1}>
                                                    <Box sx={{ 
                                                        height: 32, 
                                                        flex: 1,
                                                        bgcolor: '#F3F4F6', 
                                                        borderRadius: 1,
                                                        animation: 'pulse 2s infinite'
                                                    }} />
                                                    <Box sx={{ 
                                                        height: 32, 
                                                        flex: 1,
                                                        bgcolor: '#F3F4F6', 
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
                                                borderColor: '#D32F2F',
                                                color: filter === 'all' ? 'white' : '#D32F2F',
                                                bgcolor: filter === 'all' ? '#D32F2F' : 'transparent',
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    bgcolor: filter === 'all' ? '#B71C1C' : '#FFF5F5',
                                                    borderColor: '#D32F2F',
                                                }
                                            }}
                                        >
                                            All Bookings ({counts.total})
                                        </Button>
                                        <Button
                                            variant={filter === 'active' ? 'contained' : 'outlined'}
                                            onClick={() => setFilter('active')}
                                            sx={{
                                                borderColor: '#10B981',
                                                color: filter === 'active' ? 'white' : '#059669',
                                                bgcolor: filter === 'active' ? '#10B981' : 'transparent',
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    bgcolor: filter === 'active' ? '#059669' : '#ECFDF5',
                                                    borderColor: '#10B981',
                                                }
                                            }}
                                        >
                                            🟢 Active ({counts.active})
                                        </Button>
                                        <Button
                                            variant={filter === 'completed' ? 'contained' : 'outlined'}
                                            onClick={() => setFilter('completed')}
                                            sx={{
                                                borderColor: '#9CA3AF',
                                                color: filter === 'completed' ? 'white' : '#4B5563',
                                                bgcolor: filter === 'completed' ? '#6B7280' : 'transparent',
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    bgcolor: filter === 'completed' ? '#4B5563' : '#F9FAFB',
                                                    borderColor: '#6B7280',
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
                                <Paper sx={{ p: 5, textAlign: 'center', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                    <EventBusyIcon sx={{ fontSize: 60, color: '#9CA3AF', mb: 2 }} />
                                    <Typography variant="h6" sx={{ color: '#111827', fontWeight: 700, mb: 1 }}>No Bookings Found</Typography>
                                    <Typography sx={{ color: '#6B7280', mb: 3 }}>You have not made any service bookings yet.</Typography>
                                    <Button variant="contained" sx={{ bgcolor: '#D32F2F', '&:hover': { bgcolor: '#B71C1C' }, borderRadius: '10px', textTransform: 'none', px: 3 }} onClick={() => navigate('/booking')}>Book a Service</Button>
                                </Paper>
                            ) : (() => {
                                const filteredBookings = getFilteredBookings();
                                
                                if (filteredBookings.length === 0) {
                                    return (
                                        <Paper sx={{ p: 5, textAlign: 'center', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                            <EventBusyIcon sx={{ fontSize: 60, color: '#9CA3AF', mb: 2 }} />
                                            <Typography variant="h6" sx={{ color: '#111827', fontWeight: 700, mb: 1 }}>
                                                No {filter} bookings found
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#6B7280' }}>
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
                                                        background: '#FFFFFF', 
                                                        color: '#111827',
                                                        border: isCompleted ? 
                                                            '1px solid #E5E7EB' : 
                                                            '1px solid #FCA5A5', 
                                                        borderRadius: '16px',
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                                        opacity: isCompleted ? 0.85 : 1,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)'
                                                        }
                                                    }}>
                                                        {/* Main Card Content */}
                                                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                                            {/* Header Section */}
                                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 2 }}>
                                                                <Typography variant="h6" sx={{ 
                                                                    fontFamily: '"Outfit", sans-serif',
                                                                    fontWeight: 700, 
                                                                    color: '#111827',
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
                                                                bgcolor: '#F8F9FB', 
                                                                borderRadius: '10px',
                                                                border: '1px solid #E5E7EB',
                                                                mb: 2
                                                            }}>
                                                                <Typography variant="body2" sx={{ 
                                                                    color: '#374151', 
                                                                    fontWeight: 600 
                                                                }}>
                                                                    <strong>Job ID:</strong> {jobId}
                                                                </Typography>
                                                            </Box>

                                                            {/* Details Section */}
                                                            <Stack spacing={1.5} sx={{ mb: 2, flexGrow: 1 }}>
                                                                {/* Vehicle Details */}
                                                                <Box>
                                                                    <Typography variant="body2" sx={{ 
                                                                        color: '#4B5563', 
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
                                                                            bgcolor: isCompleted ? '#F3F4F6' : '#EFF6FF',
                                                                            color: isCompleted ? '#4B5563' : '#1D4ED8',
                                                                            border: isCompleted ? '1px solid #E5E7EB' : '1px solid #BFDBFE',
                                                                            width: '100%',
                                                                            justifyContent: 'center',
                                                                            fontSize: '0.8rem',
                                                                            fontWeight: 500
                                                                        }}
                                                                    />
                                                                </Box>
                                                                
                                                                {/* Mechanic */}
                                                                <Box>
                                                                    <Typography variant="body2" sx={{ 
                                                                        color: '#4B5563', 
                                                                        fontSize: '0.875rem' 
                                                                    }}>
                                                                        <strong>Mechanic:</strong> {booking.mechanic?.name || 'Any Available'}
                                                                    </Typography>
                                                                </Box>
                                                                
                                                                {/* Service Price */}
                                                                {booking.service?.price && (
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{ 
                                                                            color: isCompleted ? '#6B7280' : '#D32F2F', 
                                                                            fontWeight: 700 
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

                <Dialog open={isEditModalOpen} onClose={handleEditModalClose} fullWidth maxWidth="lg" PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden' } }}>
                    {/* ... The entire modal content remains unchanged ... */}
                    <DialogTitle sx={{ background: '#FFFFFF', color: '#111827', borderBottom: '1px solid #E5E7EB', fontFamily: '"Outfit", sans-serif', fontWeight: 800 }}>Edit Booking</DialogTitle>
                     <DialogContent sx={{ background: '#F8F9FB', p: { xs: 1, sm: 2, md: 3 } }}>
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