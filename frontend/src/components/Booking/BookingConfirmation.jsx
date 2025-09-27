// import React from "react";
// import {
//   Typography, Box, Paper, Button, Stack, Fade, alpha
// } from "@mui/material";
// import {
//   DirectionsCar as CarIcon, CalendarMonth as CalendarIcon,
//   Engineering as MechanicIcon, Build as ServiceIcon
// } from '@mui/icons-material';
// import { theme } from "../../utils/theme";

// const BookingConfirmation = ({
//   selectedVehicle, selectedService, selectedDate,
//   selectedTime, selectedMechanic, onBack, onConfirm
// }) => {

//   // 👉 Combine date + time
//   const handleConfirm = () => {
//     if (!selectedDate || !selectedTime) return;

//     // Format date (YYYY-MM-DD) + time (HH:mm)
//     const datePart = selectedDate.toISOString().split("T")[0]; 
//     const startTime = new Date(`${datePart}T${selectedTime}:00`);

//     // Call parent confirm with proper object
//    onConfirm({
//     vehicle: selectedVehicle?._id,
//     service: selectedService?._id,
//     mechanic: selectedMechanic?._id,
//     date: datePart,             // send date in YYYY-MM-DD
//     time: selectedTime          // e.g. "10:30"
//   });
//   };

//   return (
//     <Fade in>
//       <Box>
//         <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: theme.palette.text.primary }}>
//           Confirm Your Booking
//         </Typography>

//         <Paper
//           sx={{
//             p: 4,
//             borderRadius: 3,
//             background: theme.palette.background.paper,
//             border: '1px solid',
//             borderColor: alpha(theme.palette.primary.main, 0.2),
//             maxWidth: 600,
//             mx: 'auto',
//           }}
//         >
//           <Stack spacing={3}>
//             <Box>
//               <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>Vehicle</Typography>
//               <Stack direction="row" spacing={2} alignItems="center">
//                 <CarIcon sx={{ color: theme.palette.primary.main }} />
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                   {selectedVehicle?.vehicleNumber} - {selectedVehicle?.brand} {selectedVehicle?.model}
//                 </Typography>
//               </Stack>
//             </Box>

//             <Box>
//               <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>Service</Typography>
//               <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
//                 <Stack direction="row" spacing={2} alignItems="center">
//                   <ServiceIcon sx={{ color: theme.palette.info.main }} />
//                   <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                     {selectedService?.name}
//                   </Typography>
//                 </Stack>
//                 <Typography variant="h6" sx={{ color: theme.palette.success.main, fontWeight: 700 }}>
//                   Rs. {selectedService?.price}
//                 </Typography>
//               </Stack>
//             </Box>

//             <Box>
//               <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>Date & Time</Typography>
//               <Stack direction="row" spacing={2} alignItems="center">
//                 <CalendarIcon sx={{ color: theme.palette.secondary.main }} />
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                   {selectedDate?.toLocaleDateString()} at {selectedTime}
//                 </Typography>
//               </Stack>
//             </Box>

//             {selectedMechanic && (
//               <Box>
//                 <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>Mechanic</Typography>
//                 <Stack direction="row" spacing={2} alignItems="center">
//                   <MechanicIcon sx={{ color: theme.palette.primary.main }} />
//                   <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                     {selectedMechanic.name}
//                   </Typography>
//                 </Stack>
//               </Box>
//             )}
//           </Stack>

//           <Box sx={{ 
//             mt: 4, 
//             pt: 3, 
//             borderTop: '1px solid',
//             borderColor: alpha(theme.palette.text.primary, 0.1),
//           }}>
//             <Button
//               fullWidth
//               variant="contained"
//               size="large"
//               onClick={onConfirm}
//               sx={{
//                 py: 2,
//                 borderRadius: 2,
//                 fontSize: '1.1rem',
//                 fontWeight: 700,
//                 background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
//                 '&:hover': {
//                   transform: 'translateY(-2px)',
//                   boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
//                 },
//               }}
//             >
//               Confirm Booking
//             </Button>
//           </Box>
//         </Paper>

//         <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
//           <Button
//             variant="text"
//             onClick={onBack}
//             sx={{
//               color: theme.palette.text.secondary,
//               '&:hover': {
//                 color: theme.palette.text.primary,
//               },
//             }}
//           >
//             Back to scheduling
//           </Button>
//         </Box>
//       </Box>
//     </Fade>
//   );
// };

// export default BookingConfirmation;