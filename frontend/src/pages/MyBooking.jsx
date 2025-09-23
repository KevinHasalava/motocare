import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    Container, Typography, Alert, Box, Paper, Button,
    Dialog, DialogTitle, DialogContent, CircularProgress, Stack, Chip, 
    Stepper, Step, StepLabel, GlobalStyles, CssBaseline, IconButton,
    Divider
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

// Components
import { theme, backgroundKeyframes, gradientText, mockData } from "../utils/theme";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StepVehicleSelect from "../components/booking/StepVehicleSelect";
import StepServiceSelect from "../components/booking/StepServiceSelect";
import StepDateTime from "../components/booking/StepDateTime";
import StepConfirm from "../components/booking/StepConfirm";

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';

const editSteps = ['Select Vehicle', 'Select Service', 'Change Time & Mechanic', 'Confirm Changes'];

const BookingStrip = ({ booking, onEdit, onCancel }) => {
    return (
        <Paper
            sx={{
                p: 3,
                mb: 2,
                background: 'rgba(30, 41, 59, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                }
            }}
        >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
                {/* Service Info */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                        {booking.service?.name}
                    </Typography>
                    <Stack direction="row" spacing={3} flexWrap="wrap">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DirectionsCarIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {booking.vehicle?.brand} {booking.vehicle?.model}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {dayjs(booking.date).format('ddd, D MMM YYYY')}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BuildIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {dayjs(booking.date).format('h:mm A')}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {booking.mechanic?.name || 'Any Available'}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => onEdit(booking)}
                        sx={{
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                                borderColor: 'primary.light',
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            }
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => onCancel(booking._id)}
                        sx={{
                            borderColor: 'error.main',
                            color: 'error.main',
                            '&:hover': {
                                borderColor: 'error.light',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            }
                        }}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
};

const MyBookingsPage = () => {
    const [myBookings, setMyBookings] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [services, setServices] = useState([]);
    const [vehicles, setVehicles] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal and Edit State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeEditStep, setActiveEditStep] = useState(0);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [editVehicle, setEditVehicle] = useState(null);
    const [editService, setEditService] = useState(null);
    const [editDate, setEditDate] = useState(null);
    const [editTime, setEditTime] = useState(null);
    const [editMechanic, setEditMechanic] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError("");
        if (!user) {
            setError("You must be logged in to view bookings.");
            setLoading(false);
            return;
        }
        try {
            const [bookingsRes, jobsRes, mechanicsRes, servicesRes, vehiclesRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/bookings/user/${user._id}`),
                axios.get("http://localhost:5000/api/jobs"),
                axios.get("http://localhost:5000/api/users"),
                axios.get("http://localhost:5000/api/services"),
                axios.get(`http://localhost:5000/api/bookings/vehicles/${user._id}`)
            ]);

            setMyBookings(bookingsRes.data);
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
        fetchData();
    }, [fetchData]);

    const handleEditClick = (booking) => {
        setSelectedBooking(booking);
        setEditVehicle(booking.vehicle);
        setEditService(booking.service);
        setEditDate(dayjs(booking.date));
        setEditTime(dayjs(booking.date));
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

    const handleCancelBooking = async (bookingId) => {
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

    const handleBookServiceClick = () => {
        navigate('/booking');
    };

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CssBaseline />
                <GlobalStyles styles={backgroundKeyframes} />

                {/* Animated Background */}
                <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
                    <Box sx={{ 
                        position: 'absolute', 
                        top: '10%', 
                        left: '10%', 
                        width: 384, 
                        height: 384, 
                        bgcolor: 'primary.main', 
                        borderRadius: '50%', 
                        filter: 'blur(100px)', 
                        animation: 'pulse 8s infinite ease-in-out' 
                    }} />
                    <Box sx={{ 
                        position: 'absolute', 
                        bottom: '10%', 
                        right: '10%', 
                        width: 384, 
                        height: 384, 
                        bgcolor: 'secondary.main', 
                        borderRadius: '50%', 
                        filter: 'blur(100px)', 
                        animation: 'pulse 8s infinite 2s ease-in-out' 
                    }} />
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    position: 'relative',
                    overflowX: 'hidden',
                }}>
                    <Header
                        navItems={mockData.navItems}  // Using mockData.navItems
                        onBookNowClick={handleBookServiceClick}
                        theme={theme}
                    />

                    <Box component="main" sx={{ flexGrow: 1, pt: '80px', pb: 8 }}>
                        <Container maxWidth="lg">
                            <Typography
                                variant="h2"
                                component="h1"
                                align="center"
                                sx={{ mt: 4, mb: 6, fontSize: { xs: '2.5rem', md: '3.75rem' } }}
                            >
                                <Box component="span" sx={gradientText}>
                                    My
                                </Box> Bookings
                            </Typography>

                            {loading && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                                    <CircularProgress />
                                </Box>
                            )}

                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}

                            {!loading && !error && (
                                myBookings.length === 0 ? (
                                    <Paper sx={{ 
                                        p: 6, 
                                        textAlign: 'center', 
                                        background: 'rgba(30, 41, 59, 0.8)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                    }}>
                                        <EventBusyIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                                        <Typography variant="h5" sx={{ color: 'white', mb: 1 }}>
                                            No Bookings Found
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                                            You haven't made any bookings yet. Start by booking a service!
                                        </Typography>
                                        <Button 
                                            variant="contained" 
                                            size="large"
                                            onClick={() => navigate('/booking')}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            Book a Service
                                        </Button>
                                    </Paper>
                                ) : (
                                    <Box>
                                        {myBookings.map((booking) => (
                                            <BookingStrip
                                                key={booking._id}
                                                booking={booking}
                                                onEdit={handleEditClick}
                                                onCancel={handleCancelBooking}
                                            />
                                        ))}
                                    </Box>
                                )
                            )}
                        </Container>
                    </Box>

                    <Footer />
                </Box>

                {/* Edit Booking Modal */}
                <Dialog 
                    open={isEditModalOpen} 
                    onClose={handleEditModalClose} 
                    fullWidth 
                    maxWidth="lg"
                    PaperProps={{
                        sx: {
                            background: '#0f172a',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }
                    }}
                >
                    <DialogTitle sx={{ 
                        background: '#1e293b', 
                        color: 'white',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        Edit Booking
                    </DialogTitle>
                    <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <Stepper activeStep={activeEditStep} sx={{ my: 3 }}>
                            {editSteps.map(label => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
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
                                    selectedVehicle={editVehicle}
                                />
                            )}
                            {activeEditStep === 2 && (
                                <StepDateTime
                                    date={editDate}
                                    setDate={setEditDate}
                                    time={editTime}
                                    setTime={setEditTime}
                                    mechanic={editMechanic}
                                    setMechanic={setEditMechanic}
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