import React from "react";
import {
  Typography, Box, Card, CardContent, Grid,
  Button, Fade, Zoom, alpha
} from "@mui/material";
import {
  DirectionsCar as CarIcon, Add as AddIcon,
  CheckCircle as CheckIcon, NavigateNext as NextIcon
} from '@mui/icons-material';
import { theme } from "../../utils/theme";

const VehicleSelection = ({ 
  vehicles, 
  selectedVehicle, 
  setSelectedVehicle, 
  setShowAddVehicle, 
  onNext 
}) => {
  return (
    <Fade in>
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: theme.palette.text.primary }}>
          Select Your Vehicle
        </Typography>
        <Grid container spacing={3}>
          {vehicles.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle._id}>
              <Zoom in style={{ transitionDelay: '100ms' }}>
                <Card
                  onClick={() => setSelectedVehicle(vehicle)}
                  sx={{
                    cursor: 'pointer',
                    background: selectedVehicle?._id === vehicle._id 
                      ? alpha(theme.palette.primary.main, 0.1)
                      : theme.palette.background.paper,
                    border: '2px solid',
                    borderColor: selectedVehicle?._id === vehicle._id 
                      ? theme.palette.primary.main 
                      : 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CarIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {vehicle.vehicleNumber}
                        </Typography>
                        <Typography sx={{ color: theme.palette.text.secondary }}>
                          {vehicle.brand} {vehicle.model}
                        </Typography>
                      </Box>
                    </Box>
                    {selectedVehicle?._id === vehicle._id && (
                      <CheckIcon sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        right: 16, 
                        color: theme.palette.success.main 
                      }} />
                    )}
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
          
          {/* Add Vehicle Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Zoom in style={{ transitionDelay: '200ms' }}>
              <Card
                onClick={() => setShowAddVehicle(true)}
                sx={{
                  cursor: 'pointer',
                  background: alpha(theme.palette.secondary.main, 0.05),
                  border: '2px dashed',
                  borderColor: alpha(theme.palette.secondary.main, 0.3),
                  transition: 'all 0.3s ease',
                  height: '100%',
                  minHeight: 140,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: theme.palette.secondary.main,
                    background: alpha(theme.palette.secondary.main, 0.1),
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <AddIcon sx={{ fontSize: 48, color: theme.palette.secondary.main, mb: 1 }} />
                  <Typography sx={{ color: theme.palette.text.secondary }}>
                    Add New Vehicle
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<NextIcon />}
            disabled={!selectedVehicle}
            onClick={onNext}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            Continue to Services
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default VehicleSelection;