import axios from 'axios';

const API = axios.create({ baseURL: '/api' }); 

const SUPPLIER_BASE_URL = '/suppliers'; // API.get('/suppliers') ලෙස යැවීමට

/**
 * Fetches all available suppliers.
 */
export const getSuppliers = async () => {
    // Calls http://localhost:5000/api/suppliers via proxy
    return await API.get(SUPPLIER_BASE_URL);
};

export const getSupplierById = async (id) => {
    return await API.get(`${SUPPLIER_BASE_URL}/${id}`);
};

export const createSupplier = async (supplierData) => {
    return await API.post(SUPPLIER_BASE_URL, supplierData);
};

export const updateSupplier = async (id, supplierData) => {
    return await API.put(`${SUPPLIER_BASE_URL}/${id}`, supplierData);
};

export const deleteSupplier = async (id) => {
    return await API.delete(`${SUPPLIER_BASE_URL}/${id}`);
};