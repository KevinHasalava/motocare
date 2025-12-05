const http = require('http');

async function testLoginAPI() {
    try {
        console.log('🧪 Testing login API...');
        
        const postData = JSON.stringify({
            email: 'admin@garage.com',
            password: 'wrongpassword'
        });

        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/users/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (res.statusCode === 200) {
                        console.log('✅ Login successful!');
                        console.log('Response:', result);
                    } else {
                        console.log('❌ Login failed!');
                        console.log('Status:', res.statusCode);
                        console.log('Error:', result);
                    }
                } catch (e) {
                    console.log('❌ Failed to parse response:', data);
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request error:', error.message);
        });

        req.write(postData);
        req.end();
        
    } catch (error) {
        console.error('❌ Test error:', error.message);
    }
}

testLoginAPI();