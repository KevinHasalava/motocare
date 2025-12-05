import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api`;


const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    
    
    return { headers: { Authorization: `Bearer ${token}` } };
};


// --- Booking CRUD Functions ---
const BOOKINGS_URL = `${API_BASE_URL}/bookings`;

export const createBooking = (bookingData) => {
    return axios.post(BOOKINGS_URL, bookingData, getAuthHeaders());
};

export const getBookingsByUser = (userId) => {
    return axios.get(`${BOOKINGS_URL}/user/${userId}`, getAuthHeaders());
};

export const updateBooking = (bookingId, updateData) => {
    return axios.put(`${BOOKINGS_URL}/update-with-job/${bookingId}`, updateData, getAuthHeaders());
};

export const deleteBooking = (bookingId) => {
    return axios.delete(`${BOOKINGS_URL}/delete-with-job/${bookingId}`, getAuthHeaders());
};





export const getVehiclesForUser = (userId) => {

    return axios.get(`${BOOKINGS_URL}/vehicles/${userId}`, getAuthHeaders());
};

export const getAllServices = () => {
    return axios.get(`${API_BASE_URL}/services`, getAuthHeaders());
};

export const getAllJobs = () => {
    return axios.get(`${API_BASE_URL}/jobs`, getAuthHeaders());
};

export const getAllUsers = () => {
    return axios.get(`${API_BASE_URL}/users`, getAuthHeaders());
};