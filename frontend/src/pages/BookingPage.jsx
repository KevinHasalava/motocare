import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Typography, Alert, Box,
  Stepper, Step, StepLabel, CssBaseline, GlobalStyles,
  Paper, alpha
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/material/styles";

// Components
import StepVehicleSelect from "../components/booking/StepVehicleSelect";
import StepServiceSelect from "../components/booking/StepServiceSelect";
import StepDateTime from "../components/booking/StepDateTime";
import StepConfirm from "../components/booking/StepConfirm";

// Theme and Layout
import { theme, backgroundKeyframes, mockData, gradientText } from "../utils/theme";
import Header from "../components/Header";
import Footer from "../components/Footer";
import handleBookServiceClick from "../pages/VehiclePage";

const steps = ["Select Vehicle", "Select Service", "Choose Date & Time", "Confirm"];

const BookingPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [mechanics, setMechanics] = useState([]);

  const [vehicle, setVehicle] = useState(null);
  const [service, setService] = useState(null);
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(null);

  const [activeStep, setActiveStep] = useState(0);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // Load user vehicles
  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/bookings/vehicles/${user._id}`)
        .then((res) => setVehicles(res.data))
        .catch(() => setError("Failed to load vehicles"));
    }
  }, [user]);

  // Load services
  useEffect(() => {
    axios.get("http://localhost:5000/api/services")
      .then((res) => setServices(res.data))
      .catch(() => setError("Failed to load services"));
  }, []);

  // Load mechanics (optional)
  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then((res) => {
        const filtered = res.data.filter(u => u.userType === "mechanic");
        setMechanics(filtered);
      })
      .catch(() => setError("Failed to load mechanics"));
  }, []);

  const handleBooking = async () => {
    try {
      await axios.post("http://localhost:5000/api/bookings", {
        user: user._id,
        vehicle: vehicle._id,
        service: service._id,
        date: date.format("YYYY-MM-DD"),
        time: time.format("HH:mm"),
        mechanic: null
      });
      setSuccess("✅ Booking created successfully!");
      setActiveStep(0);
      setVehicle(null); 
      setService(null); 
      setDate(dayjs()); 
      setTime(null);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <GlobalStyles styles={backgroundKeyframes} />

        <Box sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "relative",
          overflowX: "hidden",
        }}>

          {/* Header */}
          <Header
            navItems={mockData.navItems}
            onBookNowClick={handleBookServiceClick}
            theme={theme}
          />

          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1, pt: "80px", pb: 8 }}>
            <Container maxWidth="lg" sx={{ mt: 8 }}>
              {/* Header Section */}
              <Paper
                elevation={0}
                sx={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  p: 3,
                  mb: 4,
                  border: '1px solid',
                  borderColor: alpha('#fff', 0.1),
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Typography 
                  variant="h4" 
                  sx={{
                    ...gradientText,
                    fontWeight: 800,
                    textAlign: 'center',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Book a Service
                </Typography>
              </Paper>

              {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

              <Stepper 
                activeStep={activeStep} 
                sx={{ 
                  mb: 4,
                  '& .MuiStepLabel-root .Mui-completed': {
                    color: 'primary.main',
                  },
                  '& .MuiStepLabel-root .Mui-active': {
                    color: 'secondary.main',
                  },
                }}
              >
                {steps.map((label) => (
                  <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
              </Stepper>

              {/* Step Components */}
              {activeStep === 0 && (
                <StepVehicleSelect
                  vehicles={vehicles}
                  vehicle={vehicle}
                  setVehicle={setVehicle}
                  onNext={handleNext}
                />
              )}

              {activeStep === 1 && (
                <StepServiceSelect
                  services={services}
                  service={service}
                  setService={setService}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {activeStep === 2 && (
                <StepDateTime
                  date={date}
                  setDate={setDate}
                  time={time}
                  setTime={setTime}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {activeStep === 3 && (
                <StepConfirm
                  vehicle={vehicle}
                  service={service}
                  date={date}
                  time={time}
                  onBack={handleBack}
                  onConfirm={handleBooking}
                />
              )}
            </Container>
          </Box>

          {/* Footer */}
          <Footer />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default BookingPage;