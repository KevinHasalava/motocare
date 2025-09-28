import axios from 'axios';

const API_URL = 'http://localhost:5000/api/data'; // Base URL for the new data routes

/**
 * Fetches all available services.
 */
export const fetchServices = async () => {
    try {
        const response = await axios.get(`${API_URL}/services`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

/**
 * Fetches all users with userType='mechanic' plus the Auto Assign option.
 */
export const fetchMechanics = async () => {
    try {
        const response = await axios.get(`${API_URL}/mechanics`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

/**
 * Checks if a customer exists and fetches their registered vehicles.
 */
export const fetchVehiclesByEmail = async (email) => {
    try {
        // Encode the email in case it contains special characters (though it shouldn't)
        const encodedEmail = encodeURIComponent(email);
        const response = await axios.get(`${API_URL}/vehicles/${encodedEmail}`);
        // The backend returns: { userExists: boolean, vehicles: [...] }
        return response.data; 
    } catch (error) {
        throw error.response.data;
    }
};