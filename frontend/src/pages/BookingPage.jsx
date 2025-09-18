import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Typography, Button, Alert, Box,
  Stepper, Step, StepLabel, Card, CardContent,
  Grid, IconButton, CssBaseline, GlobalStyles
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import dayjs from "dayjs";
import { DateCalendar, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/material/styles";

// 👉 Reuse your theme + header/footer + mock data
import { theme, backgroundKeyframes, mockData } from "../utils/theme";
import Header from "../components/Header";
import Footer from "../components/Footer";
import handleBookServiceClick from "../pages/VehiclePage";
import { Link } from "react-router-dom";
import VehiclePage from "../pages/VehiclePage";

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
      setVehicle(null); setService(null); setDate(dayjs()); setTime(null);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
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

          {/* 🟢 Header */}
          <Header
            navItems={mockData.navItems}
            onBookNowClick={handleBookServiceClick}
            theme={theme}
          />

          {/* 🟣 Booking Steps - Main Content */}
          <Box component="main" sx={{ flexGrow: 1, pt: "80px", pb: 8 }}>
            <Container maxWidth="md" sx={{ mt: 8 }}>
              <Typography variant="h4" gutterBottom align="center">Book a Service</Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
              </Stepper>

              {/* Step 1 - Vehicles */}
              {activeStep === 0 && (
                <Grid container spacing={2}>
                  {vehicles.map((v) => (
                    <Grid item xs={12} sm={6} md={4} key={v._id}>
                      <Card
                        sx={{ cursor: "pointer", border: vehicle?._id === v._id ? "2px solid blue" : "" }}
                        onClick={() => setVehicle(v)}
                      >
                        <CardContent>
                          <Typography variant="h6">{v.vehicleNumber}</Typography>
                          <Typography>{v.brand}</Typography>
                          <Typography color="text.secondary">{v.model}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  <Grid item xs={12} sm={6} md={4} component={Link} to={"/VehiclePage"}>
                    <Card sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <IconButton color="primary" size="large"><AddCircleIcon fontSize="large" /></IconButton>
                        <Typography>Add Vehicle</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Box sx={{ width: "100%", mt: 3, textAlign: "right" }}>
                    <Button variant="contained" disabled={!vehicle} onClick={() => setActiveStep(1)}>Next</Button>
                  </Box>
                </Grid>
              )}

              {/* Step 2 - Services */}
              {activeStep === 1 && (
                <>
                  <Grid container spacing={2}>
                    {services.map((s) => (
                      <Grid item xs={12} sm={6} md={4} key={s._id}>
                        <Card
                          sx={{ cursor: "pointer", border: service?._id === s._id ? "2px solid blue" : "" }}
                          onClick={() => setService(s)}
                        >
                          <CardContent>
                            <Typography variant="h6">{s.name}</Typography>
                            <Typography color="text.secondary">{s.price} Rs</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ width: "100%", mt: 3, display: "flex", justifyContent: "space-between" }}>
                    <Button variant="outlined" onClick={() => setActiveStep(0)}>Back</Button>
                    <Button variant="contained" disabled={!service} onClick={() => setActiveStep(2)}>Next</Button>
                  </Box>
                </>
              )}

              {/* Step 3 - Date & Time */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Select Date</Typography>
                  <DateCalendar value={date} onChange={(newDate) => setDate(newDate)} />
                  <Typography variant="h6" sx={{ mt: 2 }}>Select Time</Typography>
                  <TimePicker
                    label="Select time"
                    value={time}
                    onChange={(newTime) => setTime(newTime)}
                    sx={{ mt: 2 }}
                  />
                  <Box sx={{ width: "100%", mt: 3, display: "flex", justifyContent: "space-between" }}>
                    <Button variant="outlined" onClick={() => setActiveStep(1)}>Back</Button>
                    <Button variant="contained" disabled={!date || !time} onClick={() => setActiveStep(3)}>Next</Button>
                  </Box>
                </Box>
              )}

              {/* Step 4 - Confirmation */}
              {activeStep === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Confirm Your Booking</Typography>
                  <Card>
                    <CardContent>
                      <Typography>🚗 Vehicle: {vehicle?.vehicleNumber} - {vehicle?.brand}</Typography>
                      <Typography>🔧 Service: {service?.name} ({service?.price} Rs)</Typography>
                      <Typography>📅 Date: {date.format("YYYY-MM-DD")}</Typography>
                      <Typography>⏰ Time: {time.format("HH:mm")}</Typography>
                    </CardContent>
                  </Card>
                  <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                    <Button variant="outlined" onClick={() => setActiveStep(2)}>Back</Button>
                    <Button variant="contained" color="success" onClick={handleBooking}>
                      Confirm Booking
                    </Button>
                  </Box>
                </Box>
              )}
            </Container>
          </Box>

          {/* 🔵 Footer */}
          <Footer />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default BookingPage;