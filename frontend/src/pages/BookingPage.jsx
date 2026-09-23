import React, { useEffect, useState, useRef } from "react";
import {
    Container, Typography, Alert, Box,
    Stepper, Step, StepLabel, CssBaseline, GlobalStyles,
    Paper, alpha, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Grid, Divider
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";

import {
    getVehiclesForUser,
    getAllServices,
    getAllUsers,
    getAllJobs,
    createBooking
} from '../api/booking'; 
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import StepVehicleSelect from "../components/Booking/StepVehicleSelect";
import StepServiceSelect from "../components/Booking/StepServiceSelect";
import StepDateTime from "../components/Booking/StepDateTime";
import StepConfirm from "../components/Booking/StepConfirm";

import { theme, backgroundKeyframes } from "../utils/theme";
import Header from "../components/Header";
import Footer from "../components/Footer";

const steps = ["Select Vehicle", "Select Service", "Choose Date, Time & Mechanic", "Confirm"];

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Booking Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <Box p={3}>
                <Alert severity="error">Something went wrong in the booking process. Please try again.</Alert>
                <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>Reload Page</Button>
            </Box>;
        }
        return this.props.children;
    }
}

const BookingPage = () => {
    // ... (useState, useEffect, and other functions remain exactly the same) ...
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
    const [isLoading, setIsLoading] = useState(false); 

    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    // const dialogContentRef = useRef(null); 
    
    const termsAndConditions = [
        "Vehicle must arrive 10 minutes prior to booking time.",
        "Cancellation should be informed at least 2 hours in advance.",
        "Workshop is not responsible for left belongings in the vehicle.",
        "Payment should be settled after service completion."
    ];

    useEffect(() => {
        if (user) {
            getVehiclesForUser(user._id)
                .then((res) => setVehicles(res.data))
                .catch(() => setError("Failed to load vehicles"));
        }
    }, [user]);

    useEffect(() => {
        getAllServices()
            .then((res) => setServices(res.data))
            .catch(() => setError("Failed to load services"));
    }, []);

    useEffect(() => {
        getAllUsers()
            .then((res) => {
                const filtered = res.data.filter(u => u.userType === "mechanic");
                setMechanics(filtered);
            })
            .catch(() => setError("Failed to load mechanics"));
    }, []);

    useEffect(() => {
        getAllJobs()
            .then((res) => setBookings(res.data))
            .catch(() => console.error("Failed to load bookings"));
    }, []);

    const handleBooking = async () => {
        setError("");
        setIsLoading(true);

        try {
            const bookingData = {
                user: user._id,
                vehicle: vehicle._id,
                service: service._id,
                date: date.format("YYYY-MM-DD"),
                time: time.format("HH:mm"),
                mechanic: mechanic ? mechanic._id : null
            };
            
            const res = await createBooking(bookingData);

            const createdJobId = res.data?.job?.jobId;
            if (createdJobId) {
                setNewJobId(createdJobId);
                setSuccessDialogOpen(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Booking failed");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleNavigateToBookings = () => {
        setSuccessDialogOpen(false);
        setActiveStep(0);
        setVehicle(null);
        setService(null);
        setDate(dayjs());
        setTime(null);
        setMechanic(null);
        navigate("/my-bookings");
    };

    // 👈
    const handleDownloadPdf = async () => {
        // PDF html content
        const getPdfContent = () => {
            // Helper function for creating rows, to avoid repetition
            const createRow = (label, value) => `
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #eee;">
                    <span style="color: #666;">${label}</span>
                    <span style="font-weight: 600; color: #333;">${value}</span>
                </div>`;
            
            const termsList = termsAndConditions.map(term => `<li>${term}</li>`).join('');

            return `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; padding: 40px 20px; width: 210mm;">
    <div style="max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
        
        <!-- Header with gradient background -->
        <div style="background: linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%); color: white; padding: 40px; text-align: center;">
            <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 100px; margin-bottom: 20px;">
                <span style="font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">✓ BOOKING CONFIRMED</span>
            </div>
            <h1 style="margin: 0; font-size: 36px; font-weight: 700; margin-bottom: 8px;">Thank You!</h1>
            <p style="margin: 0; font-size: 18px; opacity: 0.9;">Your service has been scheduled</p>
            <div style="margin-top: 24px; background: rgba(255, 255, 255, 0.2); padding: 16px 24px; border-radius: 12px; display: inline-block;">
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">JOB ID</p>
                <p style="margin: 0; font-size: 24px; font-weight: 600;">${newJobId || 'N/A'}</p>
            </div>
        </div>

        <!-- Main content -->
        <div style="padding: 40px;">
            
            <!-- Booking Summary -->
            <div style="margin-bottom: 40px;">
                <h3 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 24px 0; display: flex; align-items: center;">
                    <span style="background: #D32F2F; width: 4px; height: 24px; border-radius: 2px; margin-right: 12px;"></span>
                    Booking Details
                </h3>
                <div style="background: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        ${createRow('Service Type', service?.name || 'N/A')}
                        ${createRow('Date & Time', `${date.format("DD MMM YYYY")} at ${time?.format("hh:mm A")}`)}
                        ${createRow('Vehicle', `${vehicle?.brand || ''} ${vehicle?.model || ''} (${vehicle?.vehicleNumber || 'N/A'})`)}
                        ${createRow('Assigned Mechanic', mechanic?.name || 'Any Available Mechanic')}
                        ${createRow('Estimated Duration', `${service?.duration || 0} mins`)}
                    </div>
                </div>
            </div>

            <!-- Terms & Conditions -->
            <div>
                <h3 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 24px 0; display: flex; align-items: center;">
                    <span style="background: #D32F2F; width: 4px; height: 24px; border-radius: 2px; margin-right: 12px;"></span>
                    Terms & Conditions
                </h3>
                <div style="background: #fef3c7; border-radius: 12px; padding: 24px; border: 1px solid #fde68a;">
                    <ul style="margin: 0; padding-left: 20px; color: #92400e; line-height: 1.8;">
                        ${termsList}
                    </ul>
                </div>
            </div>

            <!-- Action buttons (optional) -->
            <div style="margin-top: 40px; padding-top: 40px; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="color: #64748b; font-size: 14px; margin: 0;">
                    Need help? Contact us at support@example.com or call 1-800-XXX-XXXX
                </p>
            </div>
        </div>
    </div>
</div>
            `;
        };
        
        const contentHtml = getPdfContent();
        
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px'; 
        container.style.background = 'white';
        container.innerHTML = contentHtml;
        document.body.appendChild(container);

        try {
            // remove dive and pdf eka iwath karana eka
            const canvas = await html2canvas(container, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Booking_Confirmation_${newJobId}.pdf`);
        } catch (error) {
            console.error("PDF Generation failed:", error);
            setError("Failed to generate PDF.");
        } finally {
            document.body.removeChild(container);
            handleNavigateToBookings();
        }
    };
    // ======================================================================


    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    // JSX (UI) Part
    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CssBaseline />
                <GlobalStyles styles={backgroundKeyframes} />
                <Box sx={{
                    display: "flex", flexDirection: "column", minHeight: "100vh",
                    background: '#F8F9FB',
                    position: 'relative',
                }}>
                    <Header theme={theme} />
                    <Box component="main" sx={{ flexGrow: 1, pt: "80px", pb: 8, position: 'relative', zIndex: 1 }}>
                        <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
                            {/* Page heading */}
                            <Box sx={{
                                mb: 5,
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
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: '"Outfit", sans-serif',
                                        fontWeight: 800,
                                        fontSize: { xs: '1.6rem', md: '2rem' },
                                        color: '#111827',
                                        mb: 0.5,
                                    }}
                                >
                                    Book a Service
                                </Typography>
                                <Typography sx={{
                                    fontFamily: '"Inter", sans-serif',
                                    color: '#6B7280', fontSize: '0.95rem',
                                }}>
                                    Complete the steps below to schedule your vehicle service
                                </Typography>
                            </Box>

                            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

                            {/* Stepper */}
                            <Box sx={{
                                mb: 5, p: 3, borderRadius: '16px',
                                background: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                            }}>
                                <Stepper activeStep={activeStep}>
                                    {steps.map((label) => (
                                        <Step key={label}><StepLabel>{label}</StepLabel></Step>
                                    ))}
                                </Stepper>
                            </Box>

                            {activeStep === 0 && <StepVehicleSelect vehicles={vehicles} vehicle={vehicle} setVehicle={setVehicle} onNext={handleNext} />}
                            {activeStep === 1 && <StepServiceSelect services={services} service={service} setService={setService} onNext={handleNext} onBack={handleBack} selectedVehicle={vehicle} />}
                            {activeStep === 2 && <StepDateTime date={date} setDate={setDate} time={time} setTime={setTime} mechanic={mechanic} setMechanic={setMechanic} mechanics={mechanics} bookings={bookings} serviceDuration={service?.duration} onNext={handleNext} onBack={handleBack} />}
                            {activeStep === 3 && <StepConfirm vehicle={vehicle} service={service} date={date} time={time} mechanic={mechanic} onBack={handleBack} onConfirm={handleBooking} />}
                        </Container>
                    </Box>
                    <Footer />
                </Box>

                <Dialog open={isLoading} PaperProps={{ sx: {
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    color: "#111827", p: 4, borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                }}}>
                    {/* ... Loading dialog content ... */}
                </Dialog>
                
                {/* 👈 Success Dialog*/}
                <Dialog
                    open={successDialogOpen}
                    onClose={handleNavigateToBookings}
                    fullWidth maxWidth="xs"
                    PaperProps={{ sx: {
                        background: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        '&::before': {
                            content: '""', position: 'absolute', top: 0, left: 0, right: 0,
                            height: '3px', background: '#D32F2F',
                        }
                    }}}
                >
                    <DialogTitle sx={{ textAlign: 'center', pb: 0, pt: 4 }}>
                        <Box sx={{
                            width: 64, height: 64, borderRadius: '50%',
                            background: '#D32F2F',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mx: 'auto', mb: 2,
                            boxShadow: '0 8px 24px rgba(211, 47, 47, 0.3)',
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
                            </svg>
                        </Box>
                        <Typography variant="h5" sx={{
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 800, color: '#111827',
                        }}>
                            BOOKING CONFIRMED!
                        </Typography>
                    </DialogTitle>
                    
                    <DialogContent sx={{ p: 4, pt: 2, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{
                            fontFamily: '"Inter", sans-serif',
                            color: '#374151', fontWeight: 600, mb: 2,
                        }}>
                            Your Booking was successful.
                        </Typography>
                        <Typography variant="body1" sx={{
                            fontFamily: '"Inter", sans-serif',
                            color: '#6B7280', mt: 2,
                        }}>
                            Job ID:
                        </Typography>
                        <Typography variant="h5" sx={{
                            fontFamily: '"Outfit", sans-serif',
                            color: '#D32F2F', fontWeight: 800, letterSpacing: '0.05em',
                        }}>
                            {newJobId || 'N/A'}
                        </Typography>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
                        <Button 
                            onClick={handleDownloadPdf} 
                            variant="outlined" 
                            disabled={isLoading}
                            sx={{
                                borderRadius: '10px', color: '#374151', borderColor: '#E5E7EB',
                                fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none',
                                '&:hover': { background: '#F9FAFB', borderColor: '#D1D5DB' },
                            }}
                        >
                            Download Confirmation PDF
                        </Button>
                        <Button
                            onClick={handleNavigateToBookings}
                            variant="contained"
                            sx={{
                                borderRadius: '10px',
                                background: '#D32F2F',
                                fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none',
                                boxShadow: '0 4px 14px rgba(211, 47, 47, 0.35)',
                                '&:hover': { background: '#B71C1C' },
                            }}
                        >
                            Go to My Bookings
                        </Button>
                    </DialogActions>
                </Dialog>
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default BookingPage;