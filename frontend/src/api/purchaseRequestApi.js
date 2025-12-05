import axios from 'axios';

const API = axios.create({ 
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
API.interceptors.response.use(
  response => response,
  error => {
    const customError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data
    };
    return Promise.reject(customError);
  }
);

export const getAllPurchaseRequests = () => API.get('/purchase-requests');

export const getPurchaseRequestById = (id) => API.get(`/purchase-requests/${id}`);

export const createPurchaseRequest = (requestData) => API.post('/purchase-requests', requestData);

export const updatePurchaseRequest = (id, updateData) => API.patch(`/purchase-requests/${id}`, updateData);

export const getLowStockParts = () => API.get('/purchase-requests/low-stock-parts');