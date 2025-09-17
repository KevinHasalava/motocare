// src/components/InventoryCom/StatsCards.jsx
import React from "react";
import PropTypes from "prop-types";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import InventoryIcon from '@mui/icons-material/Inventory';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const StatsCard = ({ title, value, color, icon: IconComponent }) => (
  <Card
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 3,
      boxShadow: 3,
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'scale(1.02)',
      },
      minHeight: 120, // Ensure consistent card size
    }}
  >
    <CardContent sx={{ flex: '1 0 auto', textAlign: 'center' }}>
      <Typography variant="h5" component="div" sx={{ mb: 1, fontWeight: 'bold', color }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconComponent sx={{ mr: 1, fontSize: 18, color }} /> {title}
      </Typography>
    </CardContent>
  </Card>
);

const StatsCards = ({ stats }) => {
  // Use a default object to prevent errors if stats is undefined
  const { totalItems = 0, lowStockCount = 0, totalInventoryValue = 0 } = stats || {};

  return (
    <Box sx={{ flexGrow: 1, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Items"
            value={totalItems}
            color="primary.main"
            icon={InventoryIcon}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Low Stock"
            value={lowStockCount}
            color="error.main"
            icon={LowPriorityIcon}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Value"
            value={`$${(totalInventoryValue || 0).toFixed(2)}`}
            color="success.main"
            icon={MonetizationOnIcon}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

StatsCards.propTypes = {
  stats: PropTypes.shape({
    totalItems: PropTypes.number.isRequired,
    lowStockCount: PropTypes.number.isRequired,
    totalInventoryValue: PropTypes.number.isRequired,
  }).isRequired,
};

export default StatsCards;