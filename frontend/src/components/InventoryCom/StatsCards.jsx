import React from 'react';
import { Box, Card, CardContent, Typography, Grid, useTheme } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const StatsCards = ({ stats }) => {
  const { totalItems = 0, lowStockCount = 0, totalInventoryValue = 0 } = stats || {};
  const theme = useTheme();

  const cardSx = (color) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    boxShadow: 3,
    bgcolor: theme.palette.mode === 'light' ? `${color}.light` : theme.palette.grey[800],
    borderLeft: `4px solid ${theme.palette[color].main}`,
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)',
      bgcolor: theme.palette.mode === 'light' ? `${color}.light` : theme.palette.grey[700],
    },
    minHeight: 120,
    color: theme.palette.text.primary,
  });

  const getSecondaryTextColor = () =>
    theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary;

  return (
    <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
      {/* Total Items */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={cardSx('primary')}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InventoryIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ color: getSecondaryTextColor() }}>
                  Total Items
                </Typography>
                <Typography variant="h4" color="primary">{totalItems}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Low Stock */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={cardSx('warning')}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningAmberIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ color: getSecondaryTextColor() }}>
                  Low Stock
                </Typography>
                <Typography variant="h4" color="warning">{lowStockCount}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Value */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={cardSx('success')}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoneyIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ color: getSecondaryTextColor() }}>
                  Total Value
                </Typography>
                <Typography variant="h4" color="success">Rs. {Number(totalInventoryValue || 0).toFixed(2)}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatsCards;
