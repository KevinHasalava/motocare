import axios from 'axios';

// Set the base URL for the Job API routes
const API_URL = 'http://localhost:5000/api/jobs'; 

/**
 * 1. Create a Walk-In Job (Manual Job)
 * POST /api/jobs/walkin
 */
export const createWalkInJob = async (jobData) => {
    try {
        const response = await axios.post(`${API_URL}/walkin`, jobData);
        return response.data;
    } catch (error) {
        // Returns specific backend error messages (e.g., "Mechanic not available")
        throw error.response.data;
    }
};

/**
 * 2. Get All Jobs (For Admin Dashboard)
 * GET /api/jobs
 */
export const getAllJobs = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

/**
 * 3. Update Job Status (For Admin/Mechanic)
 * PUT /api/jobs/:id/status
 */
export const updateJobStatus = async (jobId, newStatus) => {
    try {
        const response = await axios.put(`${API_URL}/${jobId}/status`, { status: newStatus });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

/**
 * 4. Delete Job (Used for manual job cleanup)
 * DELETE /api/jobs/:id
 */
export const deleteJob = async (jobId) => {
    try {
        const response = await axios.delete(`${API_URL}/${jobId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

/**
 * 5. Get Jobs by Mechanic ID
 * GET /api/jobs/mechanic/:mechanicId
 */
export const getJobsByMechanic = async (mechanicId) => {
    try {
        const response = await axios.get(`${API_URL}/mechanic/${mechanicId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};