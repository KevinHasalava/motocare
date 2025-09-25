import axios from "axios";

const API_URL = "http://localhost:5000/api/vehicles";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { "x-auth-token": token } };
};

// GET vehicles
export const getVehicles = () => axios.get(API_URL, getAuthHeaders());

// GET vehicle by ID
export const getMyVehicles = () => axios.get(`${API_URL}/my`, getAuthHeaders());

// ADD vehicle
export const addVehicle = (data) => axios.post(API_URL, data, getAuthHeaders());

// UPDATE
export const updateVehicle = (id, data) => axios.put(`${API_URL}/${id}`, data, getAuthHeaders());

// DELETE
export const deleteVehicle = (id) => axios.delete(`${API_URL}/${id}`, getAuthHeaders());