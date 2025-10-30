// Script para testar endpoints da API
// Cole este código no console do browser

const apiUrl = 'https://get-pieces-api-production.up.railway.app';
const token = 'eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJhZG1pbkBnZXRwaWVjZXMuY29tIiwiZXhwIjoxNzYxOTUwODg4OTIwfQ==';

console.log('🔍 Testando endpoints da API...');

// Teste 1: Verificar documentação da API
async function testApiDocs() {
  try {
    console.log('📚 Testando /docs...');
    const response = await fetch(`${apiUrl}/docs`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'text/html,application/json'
      }
    });
    
    console.log('✅ /docs status:', response.status);
    if (response.ok) {
      const text = await response.text();
      console.log('📄 Docs preview:', text.substring(0, 200) + '...');
    }
  } catch (error) {
    console.error('❌ /docs error:', error);
  }
}

// Teste 2: Verificar endpoints com OPTIONS
async function testOptionsMethod() {
  const endpoints = ['/products', '/products/', '/api/products', '/v1/products'];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`🔍 Testando OPTIONS ${endpoint}...`);
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'OPTIONS',
        mode: 'cors',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type,Authorization'
        }
      });
      
      console.log(`✅ ${endpoint} OPTIONS:`, response.status);
      console.log(`   Allow Methods:`, response.headers.get('Access-Control-Allow-Methods'));
      console.log(`   Allow Headers:`, response.headers.get('Access-Control-Allow-Headers'));
      
    } catch (error) {
      console.error(`❌ ${endpoint} OPTIONS error:`, error);
    }
  }
}

// Teste 3: Tentar diferentes formatos de requisição
async function testDifferentMethods() {
  const tests = [
    // GET com token na query
    {
      method: 'GET',
      endpoint: '/products',
      params: `?page=1&itensByPage=10&token=${token}`,
      headers: { 'Content-Type': 'application/json' }
    },
    // GET com token no header
    {
      method: 'GET', 
      endpoint: '/products',
      params: '?page=1&itensByPage=10',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    },
    // POST com dados no body
    {
      method: 'POST',
      endpoint: '/products',
      params: '',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: 1,
        itensByPage: 10,
        token: token
      })
    },
    // GET simples sem autenticação
    {
      method: 'GET',
      endpoint: '/products',
      params: '',
      headers: { 'Content-Type': 'application/json' }
    }
  ];

  for (const test of tests) {
    try {
      console.log(`🎯 Testando ${test.method} ${test.endpoint}${test.params}...`);
      
      const config = {
        method: test.method,
        mode: 'cors',
        headers: test.headers
      };
      
      if (test.body) {
        config.body = test.body;
      }
      
      const response = await fetch(`${apiUrl}${test.endpoint}${test.params}`, config);
      
      console.log(`✅ Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        try {
          const data = await response.json();
          console.log('📄 Data preview:', data);
          break; // Se funcionou, não precisa testar o resto
        } catch (e) {
          console.log('📄 Response (not JSON):', await response.text());
        }
      } else {
        console.log(`❌ Error response:`, await response.text());
      }
      
    } catch (error) {
      console.error(`❌ ${test.method} ${test.endpoint} error:`, error);
    }
    
    console.log('---');
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('🚀 Iniciando testes da API...');
  console.log('🌍 Origin:', window.location.origin);
  console.log('🎯 API:', apiUrl);
  console.log('🔑 Token:', token.substring(0, 20) + '...');
  console.log('====================================');
  
  await testApiDocs();
  console.log('====================================');
  
  await testOptionsMethod();
  console.log('====================================');
  
  await testDifferentMethods();
  console.log('====================================');
  
  console.log('✅ Testes concluídos!');
}

// Executar automaticamente
runAllTests();