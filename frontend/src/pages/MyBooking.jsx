import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    Container, Typography, Alert, Box, Paper, Grid, Button,
    Dialog, DialogTitle, DialogContent, CircularProgress, Stack, Chip, alpha, Stepper, Step, StepLabel
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
import StepVehicleSelect from "../components/booking/StepVehicleSelect";
import StepServiceSelect from "../components/booking/StepServiceSelect";
import StepDateTime from "../components/booking/StepDateTime";
import StepConfirm from "../components/booking/StepConfirm";

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventBusyIcon from '@mui/icons-material/EventBusy';

const editSteps = ['Select Vehicle', 'Select Service', 'Change Time & Mechanic', 'Confirm Changes'];

const MyBookingsPage = () => {
    const [myBookings, setMyBookings] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [services, setServices] = useState([]);
    const [vehicles, setVehicles] = useState([]); // User's vehicle list for Step 1

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal and Edit State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeEditStep, setActiveEditStep] = useState(0);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // A complete state for the editing form, mirroring the main booking flow
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
            // Fetch all data concurrently
            const [bookingsRes, jobsRes, mechanicsRes, servicesRes, vehiclesRes] = await Promise.all([
                axios.get(`${API_URL}/api/bookings/user/${user._id}`),
                axios.get(`${API_URL}/api/jobs`),
                axios.get(`${API_URL}/api/users`),
                axios.get(`${API_URL}/api/services`),
                axios.get(`${API_URL}/api/bookings/vehicles/${user._id}`)
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
    }, [user?._id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // This function now correctly initializes the state for the 4-step edit modal
    const handleEditClick = (booking) => {
        setSelectedBooking(booking);
        // Initialize state for the modal based on the selected booking
        setEditVehicle(booking.vehicle);
        setEditService(booking.service);
        setEditDate(dayjs(booking.date));
        setEditTime(dayjs(booking.date));
        setEditMechanic(booking.mechanic);
        setActiveEditStep(0); // Start the stepper from the first step
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setSelectedBooking(null);
    };

    // The final update API call, triggered from Step 4 (Confirm)
    const handleUpdateBooking = async () => {
        if (!editVehicle || !editService || !editDate || !editTime) {
            alert("Something is missing. Please go back and check your selections.");
            return;
        }
        try{
            await axios.put(`${API_URL}/api/bookings/update-with-job/${selectedBooking._id}`, {
                // We send the new data from the edit state
                vehicle: editVehicle._id,
                service: editService._id,
                date: editDate.format("YYYY-MM-DD"),
                time: editTime.format("HH:mm"),
                mechanic: editMechanic?._id,
            });
            handleEditModalClose();
            fetchData(); // Refresh data to show the changes
        } catch (err) {
            alert("Failed to update booking: " + (err.response?.data?.message || err.message));
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await axios.delete(`${API_URL}/api/bookings/delete-with-job/${bookingId}`);
                fetchData();
            } catch (err) {
                alert("Failed to cancel booking: " + (err.response?.data?.message || err.message));
            }
        }
    };

    // This logic correctly filters out the job being edited so its own time slot doesn't block itself.
    // This now works because of the backend fix.
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
                        {loading && <CircularProgress />}
                        {error && <Alert severity="error">{error}</Alert>}
                        {!loading && !error && (
                            myBookings.length === 0 ? (
                                <Paper sx={{ p: 4, textAlign: 'center', background: alpha("#000", 0.2) }}>
                                    <EventBusyIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                                    <Typography variant="h6" sx={{ color: 'white' }}>No Bookings Found</Typography>
                                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/booking')}>Book a Service</Button>
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {myBookings.map((booking) => (
                                        <Grid item xs={12} md={6} lg={4} key={booking._id}>
                                            <Paper sx={{ p: 2.5, height: '100%', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white' }}>
                                                <Stack spacing={1}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{booking.service?.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{booking.vehicle?.brand} {booking.vehicle?.model}</Typography>
                                                    <Chip label={dayjs(booking.date).format('ddd, D MMM YYYY, h:mm A')} />
                                                    <Typography variant="body2" color="text.secondary">Mechanic: {booking.mechanic?.name || 'Any Available'}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                                    <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEditClick(booking)} size="small">Edit</Button>
                                                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleCancelBooking(booking._id)} size="small">Cancel</Button>
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            )
                        )}
                         </Container>
                    <Footer />
                </Box>

                {/* Edit Booking Modal with Full 4-Step Process */}
                <Dialog open={isEditModalOpen} onClose={handleEditModalClose} fullWidth maxWidth="lg">
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
                                    onConfirm={handleUpdateBooking} // Final update call
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