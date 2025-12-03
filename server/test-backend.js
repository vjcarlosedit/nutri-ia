// Script simple para probar el backend
const http = require('http');

console.log('🧪 Probando backend...\n');

// Test 1: Health check
const healthTest = () => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('✅ Health check:', json);
          resolve(json);
        } catch (e) {
          console.log('❌ Health check falló:', data);
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
};

// Test 2: Registro
const registerTest = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      name: 'Test User',
      email: `test${Date.now()}@test.com`,
      password: 'test123'
    });

    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('✅ Registro exitoso:', json.user?.email);
            resolve(json);
          } else {
            console.log('❌ Registro falló:', json);
            reject(json);
          }
        } catch (e) {
          console.log('❌ Error parseando respuesta:', data);
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

// Ejecutar tests
(async () => {
  try {
    await healthTest();
    await new Promise(resolve => setTimeout(resolve, 500));
    await registerTest();
    console.log('\n✅ Todos los tests pasaron!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test falló:', error);
    process.exit(1);
  }
})();

