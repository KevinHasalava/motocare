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
        const response = await axios.post(
            `${API_BASE_URL}/payments/create`,
            paymentData,
            createAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
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