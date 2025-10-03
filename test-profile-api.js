// Test script to verify the profile API endpoint
const axios = require('axios');

const testProfileAPI = async () => {
    try {
        console.log('Testing profile API endpoint...');
        
        // You'll need to get a valid token from localStorage in the browser
        // For now, let's test if the endpoint responds
        const response = await axios.get('http://localhost:5000/api/users/profile', {
            headers: {
                'Authorization': 'Bearer invalid-token-for-testing'
            }
        });
        
        console.log('Response:', response.data);
    } catch (error) {
        console.log('Expected error (401 Unauthorized):', error.response?.status);
        console.log('Error message:', error.response?.data?.message);
        
        if (error.response?.status === 401) {
            console.log('✅ Profile endpoint is responding correctly (authentication required)');
        } else {
            console.log('❌ Unexpected error:', error.message);
        }
    }
};

testProfileAPI();