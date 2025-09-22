import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Typography, Alert, Box,
  Stepper, Step, StepLabel, CssBaseline, GlobalStyles,
  Paper, alpha, Dialog, DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import StepVehicleSelect from "../components/booking/StepVehicleSelect";
import StepServiceSelect from "../components/booking/StepServiceSelect";
import StepDateTime from "../components/booking/StepDateTime";
import StepConfirm from "../components/booking/StepConfirm";

import { theme, backgroundKeyframes, mockData, gradientText } from "../utils/theme";
import Header from "../components/Header";
import Footer from "../components/Footer";
import handleBookServiceClick from "../pages/VehiclePage";

const steps = ["Select Vehicle", "Select Service", "Choose Date, Time & Mechanic", "Confirm"];

const BookingPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [vehicle, setVehicle] = useState(null);
  const [service, setService] = useState(null);
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(null);
  const [mechanic, setMechanic] = useState(null);

  const [activeStep, setActiveStep] = useState(0);

  const [error, setError] = useState("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [newJobId, setNewJobId] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // data load functions...
  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/bookings/vehicles/${user._id}`)
        .then((res) => setVehicles(res.data))
        .catch(() => setError("Failed to load vehicles"));
    }
  }, [user]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/services")
      .then((res) => setServices(res.data))
      .catch(() => setError("Failed to load services"));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then((res) => {
        const filtered = res.data.filter(u => u.userType === "mechanic");
        setMechanics(filtered);
      })
      .catch(() => setError("Failed to load mechanics"));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/jobs")
      .then((res) => setBookings(res.data))
      .catch(() => console.error("Failed to load bookings"));
  }, []);

  const handleBooking = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/bookings", {
        user: user._id,
        vehicle: vehicle._id,
        service: service._id,
        date: date.format("YYYY-MM-DD"),
        time: time.format("HH:mm"),
        mechanic: mechanic ? mechanic._id : null
      });

      // Extract JobID from response
      const createdJobId = res.data?.job?.jobId;
      if (createdJobId) {
        setNewJobId(createdJobId);
        setSuccessDialogOpen(true); // show dialog
      }

      // reset booking flow
      setActiveStep(0);
      setVehicle(null); setService(null); setDate(dayjs()); setTime(null); setMechanic(null);

    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  const handleDialogClose = () => {
    setSuccessDialogOpen(false);
    navigate("/my-bookings"); // redirect when closed
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <GlobalStyles styles={backgroundKeyframes} />

        <Box sx={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
          <Header navItems={mockData.navItems} onBookNowClick={handleBookServiceClick} theme={theme} />
          <Box component="main" sx={{ flexGrow:1, pt:"80px", pb:8 }}>
            <Container maxWidth="lg" sx={{ mt: 8 }}>
              <Paper sx={{ p:3, mb:4, background:'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))' }}>
                <Typography variant="h4" sx={gradientText}>Book a Service</Typography>
              </Paper>

              {error && <Alert severity="error">{error}</Alert>}

              <Stepper activeStep={activeStep} sx={{ mb:4 }}>
                {steps.map((label)=>(
                  <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
              </Stepper>

              {activeStep === 0 && <StepVehicleSelect vehicles={vehicles} vehicle={vehicle} setVehicle={setVehicle} onNext={handleNext}  />}
              {activeStep === 1 && <StepServiceSelect services={services} service={service} setService={setService} onNext={handleNext} onBack={handleBack} selectedVehicle={vehicle}/>}
              {activeStep === 2 && <StepDateTime date={date} setDate={setDate} time={time} setTime={setTime} mechanic={mechanic} setMechanic={setMechanic} mechanics={mechanics} bookings={bookings} onNext={handleNext} onBack={handleBack}/>}
              {activeStep === 3 && <StepConfirm vehicle={vehicle} service={service} date={date} time={time} mechanic={mechanic} onBack={handleBack} onConfirm={handleBooking} />}
            </Container>
          </Box>
          <Footer />
        </Box>

        {/* Custom Dialog shown after confirm */}
        <Dialog open={successDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Booking Confirmed 🎉</DialogTitle>
          <DialogContent>
            <Typography>Your booking was created successfully.</Typography>
            {newJobId && (
              <Typography sx={{ mt:1, fontWeight:600 }}>Your Job ID: {newJobId}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} variant="contained">Go to My Bookings</Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default BookingPage;