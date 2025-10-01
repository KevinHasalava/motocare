import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    Container, Typography, Alert, Box, Paper, Grid, Button,
    Dialog, DialogTitle, DialogContent, CircularProgress, Stack, Chip, alpha, Stepper, Step, StepLabel, Divider
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

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import EngineeringIcon from '@mui/icons-material/Engineering';


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
    }, [user?._id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEditClick = (booking) => {
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

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f172a' }}>
                    <Header />
                    <Container component="main" maxWidth="lg" sx={{ mt: 12, mb: 4, flexGrow: 1 }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'white' }}>My Bookings</Typography>
                        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
                        {error && <Alert severity="error">{error}</Alert>}
                        {!loading && !error && (
                            myBookings.length === 0 ? (
                                <Paper sx={{ p: 4, textAlign: 'center', background: alpha("#000", 0.2) }}>
                                    <EventBusyIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                                    <Typography variant="h6" sx={{ color: 'white' }}>No Bookings Found</Typography>
                                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/booking')}>Book a Service</Button>
                                </Paper>
                            ) : (
                               
                                <Stack spacing={2}>
                                    {myBookings.map((booking) => {
                                        // check future booking
                                        const isFutureBooking = dayjs(booking.date).isAfter(dayjs());
                                        
                                        return (
                                            <Paper 
                                                key={booking._id} 
                                                sx={{ 
                                                    p: 2, 
                                                    background: 'linear-gradient(135deg, #1e293b, #0f172a)', 
                                                    color: 'white', 
                                                    borderLeft: `4px solid ${isFutureBooking ? '#3b82f6' : '#4b5563'}`
                                                }}
                                            >
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs={12} sm={3} md={2}>
                                                        <Typography variant="body2" color="text.secondary">Job ID</Typography>
                                                        <Typography sx={{ fontWeight: 'bold' }}>{booking.job?.jobId || 'N/A'}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={3}>
                                                        <Typography variant="body2" color="text.secondary">Service & Vehicle</Typography>
                                                        <Typography sx={{ fontWeight: 600 }}>{booking.service?.name}</Typography>
                                                        <Typography variant="caption">{booking.vehicle?.brand} {booking.vehicle?.model}</Typography>
                                                    </Grid>
                                                     <Grid item xs={12} sm={3} md={3}>
                                                        <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                                                        <Typography>{dayjs(booking.date).format('ddd, D MMM YYYY, h:mm A')}</Typography>
                                                    </Grid>
                                                    <Grid item xs={6} sm={4} md={2}>
                                                        <Typography variant="body2" color="text.secondary" sx={{mb: 0.5}}>Status</Typography>
                                                        {getStatusChip(booking.job?.status || 'N/A')}
                                                    </Grid>
                                                    <Grid item xs={6} sm={8} md={2} sx={{ textAlign: 'right' }}>
                                                        {/* අනාගතයේ booking එකක් නම් පමණක් buttons පෙන්වීම */}
                                                        {isFutureBooking ? (
                                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEditClick(booking)} size="small">Edit</Button>
                                                                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleCancelBooking(booking._id)} size="small">Cancel</Button>
                                                            </Stack>
                                                        ) : (
                                                            <Chip label="Past Booking" size="small" variant="outlined" />
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        )
                                    })}
                                </Stack>
                            )
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