import React from "react";
import { Stack, Chip } from "@mui/material";

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { step: 1, label: 'Vehicle' },
    { step: 2, label: 'Service' },
    { step: 3, label: 'Schedule' },
    { step: 4, label: 'Confirm' }
  ];

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 4 }} justifyContent="center">
      {steps.map((item) => (
        <Chip
          key={item.step}
          label={item.label}
          color={currentStep >= item.step ? "primary" : "default"}
          variant={currentStep === item.step ? "filled" : "outlined"}
          sx={{
            px: 3,
            py: 2.5,
            fontSize: '1rem',
            fontWeight: currentStep === item.step ? 700 : 500,
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </Stack>
  );
};

export default StepIndicator;