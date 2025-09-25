import React from 'react';
import {
  Box, Button, Card, CardContent, Grid, Stack,
  Typography, Chip, Zoom, Fade, alpha, Paper
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NoCrashIcon from '@mui/icons-material/NoCrash'; // අලුතින් එකතු කළ icon එක
import { theme } from '../../utils/theme';


// ❗️ 1. 'selectedVehicle' නමින් අලුත් prop එකක් මෙතනට එකතු කරන්න
const StepServiceSelect = ({ services, service, setService, onNext, onBack, selectedVehicle }) => {

  // ❗️ 2. වාහනයේ වර්ගය අනුව services list එක filter කිරීම
  const filteredServices = selectedVehicle
    ? services.filter(s => s.vehicleType === selectedVehicle.type)
    : []; // වාහනයක් තෝරා නොමැති නම්, හිස් list එකක් පෙන්වන්න

  return (
    <Fade in timeout={600}>
      <Box>
        <Grid container spacing={3}>
          {/* ❗️ 3. Filter කළ විට services නොමැති නම්, පණිවිඩයක් පෙන්වීම */}
          {filteredServices.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center', background: alpha('#000', 0.2) }}>
                <NoCrashIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
                  No Services Available
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  There are no specific services listed for the selected vehicle type: '{selectedVehicle?.type || 'N/A'}'.
                </Typography>
              </Paper>
            </Grid>
          ) : (
            // ❗️ 4. Filter කරන ලද 'filteredServices' list එක මෙතනදී map කිරීම
            filteredServices.map((s, index) => (
              <Grid item xs={12} sm={6} md={4} key={s._id}>
                <Zoom in timeout={300 + index * 100}>
                  <Card
                    sx={{
                      // ... (මෙහි style attributes වෙනස් නොවේ)
                      cursor: "pointer",
                      height: '100%',
                      background: service?._id === s._id
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
                        : 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: '2px solid',
                      borderColor: service?._id === s._id ? 'primary.main' : alpha('#fff', 0.1),
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                      }
                    }}
                    onClick={() => setService(s)}
                  >
                    <CardContent sx={{ p: 3, position: 'relative' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)' }}>
                          <BuildIcon sx={{ color: 'white' }} />
                        </Box>
                        {service?._id === s._id && <CheckCircleIcon sx={{ color: 'primary.main' }} />}
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                        {s.name}
                      </Typography>
                      {/* ❗️ 5. පැහැදිලි බව සඳහා වාහන වර්ගය මෙහි පෙන්වීම */}
                      <Chip label={s.vehicleType} color="primary" size="small" sx={{ mb: 2, backgroundColor: alpha(theme.palette.primary.main, 0.2), color: theme.palette.primary.light }} />
                      {s.description && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, minHeight: '40px' }}>
                          {s.description}
                        </Typography>
                        
                      )}
                      <Chip label={`Rs. ${s.price.toFixed(2)}`} sx={{ background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', color: 'white', fontWeight: 700, fontSize: '1rem' }} />
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))
          )}
        </Grid>

        {/* Navigation buttons වෙනස් නොවේ */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={onBack} sx={{ px: 4, py: 1.5, borderColor: alpha('#fff', 0.3), color: 'white', '&:hover': { borderColor: alpha('#fff', 0.5), background: alpha('#fff', 0.1), } }}>
            Back
          </Button>
          <Button variant="contained" disabled={!service} onClick={onNext} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', px: 4, py: 1.5, fontSize: '1rem', fontWeight: 600, '&:hover': { background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' } }}>
            Next
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default StepServiceSelect;