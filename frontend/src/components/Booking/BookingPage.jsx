import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Typography, Alert, Box,
  Fade, ThemeProvider, CssBaseline, alpha
} from "@mui/material";
import { theme } from "../../utils/theme";
import VehicleSelection from "./VehicleSelection";
import ServiceSelection from "./ServiceSelection";
import DateTimeSelection from "./DateTimeSelection";
import BookingConfirmation from "./BookingConfirmation";
import AddVehicleDialog from "./AddVehicleDialog";
import StepIndicator from "./StepIndicator";
import { backgroundStyles } from "./styles";

const BookingPage = () => {
  // State Management
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [mechanics, setMechanics] = useState([]);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState(null);

  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const user = JSON.parse(localStorage.getItem("user"));

  // Data Loading
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

  // Booking Handler
  const handleBooking = async () => {
    setError("");
    setSuccess("");

    if (!user) {
      setError("Please log in first");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/bookings", {
        user: user._id,
        vehicle: selectedVehicle._id,
        service: selectedService._id,
        date: selectedDate,
        time: selectedTime,
        mechanic: selectedMechanic?._id || null
      });

      setSuccess("✅ Booking created successfully!");
      setTimeout(() => {
        setSelectedVehicle(null);
        setSelectedService(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedMechanic(null);
        setCurrentStep(1);
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={backgroundStyles.mainContainer}>
        {/* Background Effects */}
        <Box sx={backgroundStyles.backgroundEffects}>
          <Box sx={backgroundStyles.gradient} />
          <Box sx={backgroundStyles.floatingOrb} />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Book Your Service
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: '1.1rem' }}>
              Select your vehicle, choose a service, and pick your preferred time
            </Typography>
          </Box>

          {/* Alerts */}
          {error && (
            <Fade in>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
            </Fade>
          )}
          {success && (
            <Fade in>
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>
            </Fade>
          )}

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} />

          {/* Step Components */}
          {currentStep === 1 && (
            <VehicleSelection
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              setSelectedVehicle={setSelectedVehicle}
              setShowAddVehicle={setShowAddVehicle}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <ServiceSelection
              services={services}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <DateTimeSelection
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              selectedMechanic={selectedMechanic}
              setSelectedMechanic={setSelectedMechanic}
              mechanics={mechanics}
              onBack={() => setCurrentStep(2)}
              onNext={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 4 && (
            <BookingConfirmation
              selectedVehicle={selectedVehicle}
              selectedService={selectedService}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedMechanic={selectedMechanic}
              onBack={() => setCurrentStep(3)}
              onConfirm={handleBooking}
            />
          )}
        </Container>

        {/* Add Vehicle Dialog */}
        <AddVehicleDialog
          open={showAddVehicle}
          onClose={() => setShowAddVehicle(false)}
        />

        {/* Animations */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </Box>
    </ThemeProvider>
  );
};

export default BookingPage;