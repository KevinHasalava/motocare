import axios from 'axios';

const API_URL = 'http://localhost:5000/api/suppliers';

export const getSuppliers = async () => {
    return await axios.get(API_URL);
};

export const getSupplierById = async (id) => {
    return await axios.get(`${API_URL}/${id}`);
};

export const createSupplier = async (supplierData) => {
    return await axios.post(API_URL, supplierData);
};

export const updateSupplier = async (id, supplierData) => {
    return await axios.put(`${API_URL}/${id}`, supplierData);
};

export const deleteSupplier = async (id) => {
    return await axios.delete(`${API_URL}/${id}`);
};