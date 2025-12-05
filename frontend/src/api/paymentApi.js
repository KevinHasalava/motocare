import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with auth token
const createAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

// Vehicle search functions
export const searchVehicles = async (query) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/payments/vehicles/search?query=${encodeURIComponent(query)}`,
            createAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getJobByVehicle = async (vehicleNumber) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/payments/vehicles/${encodeURIComponent(vehicleNumber)}/job`,
            createAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Inventory search functions
export const searchInventoryItems = async (query) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/payments/inventory/search?query=${encodeURIComponent(query)}`,
            createAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getInventoryItem = async (itemId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/payments/inventory/${itemId}`,
            createAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Payment calculation and processing
export const calculatePayment = async (paymentData) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/payments/calculate`,
            paymentData,
            createAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createPayment = async (paymentData) => {
    try {
        console.log('Creating payment with data:', paymentData);
        const response = await axios.post(
            `${API_BASE_URL}/payments/create`,
            paymentData,
            createAuthHeaders()
        );
        console.log('Payment API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Payment API error:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        // Throw a more detailed error object
        if (error.response?.data) {
            throw error.response.data;
        } else if (error.message) {
            throw new Error(error.message);
        } else {
            throw new Error('Network error occurred');
        }
    }
};

export const updatePayment = async (paymentId, paymentData) => {
    try {
        console.log('Updating payment:', paymentId, 'with data:', paymentData);
        const response = await axios.put(
            `${API_BASE_URL}/payments/${paymentId}`,
            paymentData,
            createAuthHeaders()
        );
        console.log('Update payment API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Update payment API error:', error);
        if (error.response?.data) {
            throw error.response.data;
        } else if (error.message) {
            throw new Error(error.message);
        } else {
            throw new Error('Network error occurred');
        }
    }
};

export const deletePayment = async (paymentId) => {
    try {
        console.log('Deleting payment:', paymentId);
        const response = await axios.delete(
            `${API_BASE_URL}/payments/${paymentId}`,
            createAuthHeaders()
        );
        console.log('Delete payment API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Delete payment API error:', error);
        if (error.response?.data) {
            throw error.response.data;
        } else if (error.message) {
            throw new Error(error.message);
        } else {
            throw new Error('Network error occurred');
        }
    }
};

// Payment retrieval functions
export const getPayment = async (paymentId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/payments/${paymentId}`,
            createAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getPaymentByInvoiceId = async (invoiceId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/payments/invoice/${invoiceId}`,
            createAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getAllPayments = async (page = 1, limit = 10, filters = {}) => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        });

        const response = await axios.get(
            `${API_BASE_URL}/payments/all?${params.toString()}`,
            createAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get payments for current user
export const getUserPayments = async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/payments/user/my-payments`,
            createAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Upload payment slip
export const uploadPaymentSlip = async (formData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_BASE_URL}/payments/upload-slip`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get payments with slips for cashier verification
export const getPaymentsWithSlips = async (status = '', page = 1, limit = 10) => {
    try {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (status) {
            params.append('status', status);
        }

        const response = await axios.get(
            `${API_BASE_URL}/payments/slips/pending?${params.toString()}`,
            createAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Verify payment slip (approve/reject)
export const verifyPaymentSlip = async (paymentId, action, verificationNotes = '') => {
    try {
        console.log('Verifying payment slip:', { paymentId, action, verificationNotes });
        const response = await axios.put(
            `${API_BASE_URL}/payments/${paymentId}/verify-slip`,
            { action, verificationNotes },
            createAuthHeaders()
        );
        console.log('Verify payment slip API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Verify payment slip API error:', error);
        if (error.response?.data) {
            throw error.response.data;
        } else if (error.message) {
            throw new Error(error.message);
        } else {
            throw new Error('Network error occurred');
        }
    }
};