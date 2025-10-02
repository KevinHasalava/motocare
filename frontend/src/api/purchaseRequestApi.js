import axios from 'axios';

// Assuming your backend runs on /api/
const API = axios.create({ baseURL: '/api' }); 
export const getLowStockParts = () => API.get('/purchase-requests/low-stock-parts');

export const createPurchaseRequest = (requestData) => API.post('/purchase-requests', requestData);
