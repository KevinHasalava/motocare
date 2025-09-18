import axios from 'axios';

const API_URL = 'http://localhost:5001/api/stock';

export const getStockMovements = async () => {
    return await axios.get(API_URL);
};

export const createStockMovement = async (stockData) => {
    return await axios.post(API_URL, stockData);
};

export const updateStockMovement = async (id, stockData) => {
    return await axios.put(`${API_URL}/${id}`, stockData);
};

export const deleteStockMovement = async (id) => {
    return await axios.delete(`${API_URL}/${id}`);
};