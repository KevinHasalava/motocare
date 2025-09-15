import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vehicles';

// Add vehicle
export const addVehicle = async (vehicleData) => {
  return await axios.post(API_URL, vehicleData);
};

// Get all vehicles
export const getVehicles = async () => {
  return await axios.get(API_URL);
};

// Update vehicle
export const updateVehicle = async (id, vehicleData) => {
  return await axios.put(`${API_URL}/${id}`, vehicleData);
};

// Delete vehicle
export const deleteVehicle = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
