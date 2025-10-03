// Backend server startup script
const path = require('path');
const { spawn } = require('child_process');

// Change to backend directory
const backendDir = path.join(__dirname, 'backend');
process.chdir(backendDir);

console.log('Starting backend server from:', process.cwd());

// Start the server
require('./backend/server.js');