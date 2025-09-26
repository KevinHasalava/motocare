import React, { useState } from "react";
import {
  Typography, Box, Card, CardContent, Grid,
  Button, TextField, InputAdornment, Fade, Zoom, alpha
} from "@mui/material";
import {
  Search as SearchIcon, CheckCircle as CheckIcon,
  LocalOffer as PriceIcon, Build as ServiceIcon,
  NavigateNext as NextIcon
} from '@mui/icons-material';
import { theme } from "../../utils/theme";

const ServiceSelection = ({ 
  services, 
  selectedService, 
  setSelectedService, 
  onBack, 
  onNext 
}) => {
  const [serviceSearch, setServiceSearch] = useState("");
  
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  return (
    <Fade in>
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: theme.palette.text.primary }}>
          Choose Your Service
        </Typography>
        
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search services..."
          value={serviceSearch}
          onChange={(e) => setServiceSearch(e.target.value)}
          sx={{ mb: 3, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={3}>
          {filteredServices.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service._id}>
              <Zoom in>
                <Card
                  onClick={() => setSelectedService(service)}
                  sx={{
                    cursor: 'pointer',
                    background: selectedService?._id === service._id 
                      ? alpha(theme.palette.primary.main, 0.1)
                      : theme.palette.background.paper,
                    border: '2px solid',
                    borderColor: selectedService?._id === service._id 
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
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box>
                        <ServiceIcon sx={{ fontSize: 32, color: theme.palette.info.main, mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {service.name}
                        </Typography>
                        <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.9rem' }}>
                          {service.description || 'Professional service'}
                        </Typography>
                      </Box>
                      {selectedService?._id === service._id && (
                        <CheckIcon sx={{ color: theme.palette.success.main }} />
                      )}
                    </Box>
                    <Box sx={{ 
                      mt: 2, 
                      pt: 2, 
                      borderTop: '1px solid',
                      borderColor: alpha(theme.palette.text.primary, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PriceIcon sx={{ color: theme.palette.success.main, mr: 1, fontSize: 20 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                          Rs. {service.price}
                        </Typography>
                      </Box>
                      <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
                        ~{service.duration || '2 hrs'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onBack}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            size="large"
            endIcon={<NextIcon />}
            disabled={!selectedService}
            onClick={onNext}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            Select Date & Time
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default ServiceSelection;