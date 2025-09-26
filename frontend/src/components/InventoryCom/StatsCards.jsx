import React from 'react';
import { Box, Card, CardContent, Typography, Grid, useTheme } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const StatsCards = ({ stats }) => {
  const { totalItems = 0, lowStockCount = 0, totalInventoryValue = 0 } = stats || {};
  
  // Get the current theme context
  const theme = useTheme();

  const cardSx = (color) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    boxShadow: 3,
    // Set background color based on light/dark mode
    bgcolor: theme.palette.mode === 'light' ? `${color}.light` : theme.palette.grey[800],
    borderLeft: `4px solid ${theme.palette[color].main}`,
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)',
      // Set hover color based on light/dark mode
      bgcolor: theme.palette.mode === 'light' ? `${color}.light` : theme.palette.grey[700],
    },
    minHeight: 120,
    color: theme.palette.text.primary, // Ensure primary text color is used for general card text
  });

  // Helper function for text color based on mode
  const getSecondaryTextColor = () => 
    theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary;

  return (
    <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
      {/* 1. Total Items Card (Primary) */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={cardSx('primary')}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InventoryIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography 
                  variant="h6" 
                  // Use dynamic color for label to ensure visibility in dark mode
                  sx={{ color: getSecondaryTextColor() }}
                >
                  Total Items
                </Typography>
                <Typography variant="h4" color="primary">{totalItems}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 2. Low Stock Card (Warning) */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={cardSx('warning')}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningAmberIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography 
                  variant="h6" 
                  // Use dynamic color for label
                  sx={{ color: getSecondaryTextColor() }}
                >
                  Low Stock
                </Typography>
                <Typography variant="h4" color="warning">{lowStockCount}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 3. Total Value Card (Success) */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={cardSx('success')}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoneyIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography 
                  variant="h6" 
                  // Use dynamic color for label
                  sx={{ color: getSecondaryTextColor() }}
                >
                  Total Value
                </Typography>
                <Typography variant="h4" color="success">Rs. {(totalInventoryValue || 0).toFixed(2)}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatsCards;