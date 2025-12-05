// Phone validation utilities
export const validatePhoneNumber = (phone) => {
  if (!phone || phone.trim() === '') {
    return { isValid: true, error: '' }; // Optional field
  }

  // Remove any non-numeric characters
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  // Check if it starts with 0
  if (!cleanPhone.startsWith('0')) {
    return { isValid: false, error: 'Phone number must start with 0' };
  }

  // Check if it has exactly 10 digits
  if (cleanPhone.length !== 10) {
    return { isValid: false, error: 'Phone number must be exactly 10 digits' };
  }

  return { isValid: true, error: '', cleanValue: cleanPhone };
};

// Format phone number for display
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';

  // Remove non-numeric characters
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  // Format as 0XX XXX XXXX
  if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) {
    return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
  }

  return cleanPhone;
};

// Phone input handler that filters input
export const handlePhoneInput = (value) => {
  // Only allow numeric characters
  return value.replace(/[^0-9]/g, '');
};
