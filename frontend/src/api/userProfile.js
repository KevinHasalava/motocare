import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/users";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

// Get user profile
export const getUserProfile = () => {
    return axios.get(`${API_BASE_URL}/profile`, getAuthHeaders());
};

// Update user profile
export const updateUserProfile = (profileData) => {
    return axios.put(`${API_BASE_URL}/profile`, profileData, getAuthHeaders());
};