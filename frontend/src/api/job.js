import axios from 'axios';

// Set the base URL for the Job API routes
const API_URL = 'http://localhost:5000/api/jobs'; 

// ---------------------------------------------------------------------
//  1. JOB CREATION
// ---------------------------------------------------------------------

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

// ---------------------------------------------------------------------
//  2. JOB RETRIEVAL & MANAGEMENT
// ---------------------------------------------------------------------

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

/**
 * 6. Get Active Jobs by Date and Mechanic (For conflict check in CreateWalkInJob.jsx)
 * GET /api/jobs/schedule?date=...&mechanicId=...
 */
export const fetchJobsByDateAndMechanic = async ({ date, mechanicId }) => {
    try {
        const response = await axios.get(`${API_URL}/schedule`, {
            params: { date, mechanicId }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// ---------------------------------------------------------------------
// 3. JOB VIEW/EDIT FUNCTIONS
// ---------------------------------------------------------------------

/**
 * 7. Fetch Single Job Details (For View/Edit)
 * GET /api/jobs/:id
 */
export const fetchJobDetails = async (jobId) => {
    try {
        // This hits the backend controller function getJobDetails
        const response = await axios.get(`${API_URL}/${jobId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

/**
 * 8. Update Job Details (Full Edit)
 * PUT /api/jobs/:id
 */
export const updateJob = async (jobId, updateData) => {
    try {
        // This hits the backend controller function updateJob
        const response = await axios.put(`${API_URL}/${jobId}`, updateData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

/**
 * 10. Auto Complete Past Jobs
 * POST /api/jobs/auto-complete-past
 */
export const autoCompletePastJobs = async () => {
    try {
        const response = await axios.post(`${API_URL}/auto-complete-past`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

/**
 * 9. Download Job Details PDF (For Admin/Mechanic)
 * GET /api/jobs/:id/download-pdf
 * * @param {string} jobId - The MongoDB _id of the job
 * @returns {Promise<Object>} - The Axios response object containing the PDF Blob
 */
export const downloadJobPdf = async (jobId) => {
    try {
        // Ensure the token is included in the request headers
        const token = localStorage.getItem('token');
        
        const response = await axios.get(
            `${API_URL}/${jobId}/download-pdf`, 
            {
                responseType: 'blob', // CRITICAL: Expect a binary file stream (PDF)
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                }
            }
        );
        return response; // response.data is the Blob
    } catch (error) {
        // Handle error where the server sends an error message (often as JSON/Text)
        if (error.response && error.response.data instanceof Blob) {
             // Read the error blob as text to extract the JSON error message
             const errorText = await error.response.data.text();
             let errorMessage = 'Server error while fetching PDF.';
             try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorMessage;
             } catch (e) {
                 // Ignore if not valid JSON
             }
             throw new Error(errorMessage);
        }
        // Handle standard non-blob errors
        throw error;
    }
};
