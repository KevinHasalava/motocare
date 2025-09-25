import axios from 'axios';

const API_URL = 'http://localhost:5000/api/inventory';

export const getInventoryItems = async () => {
    return await axios.get(API_URL);
};

export const getInventoryItemById = async (id) => {
    return await axios.get(`${API_URL}/${id}`);
};

export const createInventoryItem = async (itemData) => {
    return await axios.post(API_URL, itemData);
};

export const updateInventoryItem = async (id, itemData) => {
    return await axios.put(`${API_URL}/${id}`, itemData);
};

export const deleteInventoryItem = async (id) => {
    return await axios.delete(`${API_URL}/${id}`);
};