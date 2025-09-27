// import React from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Typography, Button, IconButton, alpha
// } from "@mui/material";
// import { Close as CloseIcon } from '@mui/icons-material';
// import { theme } from "../../utils/theme";

// const AddVehicleDialog = ({ open, onClose }) => {
//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           background: theme.palette.background.paper,
//         }
//       }}
//     >
//       <DialogTitle sx={{ 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'space-between',
//         borderBottom: '1px solid',
//         borderColor: alpha(theme.palette.text.primary, 0.1),
//       }}>
//         <Typography variant="h6" sx={{ fontWeight: 700 }}>Add New Vehicle</Typography>
//         <IconButton onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent sx={{ mt: 2 }}>
//         {/* Add vehicle form would go here */}
//         <Typography sx={{ color: theme.palette.text.secondary }}>
//           Vehicle registration form will be implemented here
//         </Typography>
//       </DialogContent>
//       <DialogActions sx={{ p: 3 }}>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button variant="contained">Add Vehicle</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddVehicleDialog;