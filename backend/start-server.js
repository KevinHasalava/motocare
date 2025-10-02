// Simple server startup script to ensure proper working directory
process.chdir('c:/Users/ASUS/OneDrive/Desktop/Moto-Care/backend');
console.log('Working directory set to:', process.cwd());
require('./server.js');