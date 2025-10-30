// Script para testar CORS da API Railway
// Cole este código no console do browser na página do frontend

console.log('🔍 Testando conectividade com a API...');

const apiUrl = 'https://get-pieces-api-production.up.railway.app';

// Teste 1: Verificar se a API responde
async function testApiHealth() {
  try {
    console.log('📡 Testando conectividade básica...');
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit'
    });
    
    console.log('✅ API respondeu:', response.status);
    console.log('📋 Headers da resposta:', [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.text();
      console.log('📄 Resposta:', data);
    }
  } catch (error) {
    console.error('❌ Erro na conectividade:', error);
  }
}

// Teste 2: Verificar CORS específico
async function testCorsHeaders() {
  try {
    console.log('🌐 Testando headers CORS...');
    const response = await fetch(`${apiUrl}/products?page=1&itensByPage=10`, {
      method: 'OPTIONS',
      mode: 'cors',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    });
    
    console.log('✅ CORS preflight:', response.status);
    console.log('📋 Headers CORS:', {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
      'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
    });
  } catch (error) {
    console.error('❌ Erro no CORS:', error);
  }
}

// Teste 3: Verificar requisição real
async function testRealRequest() {
  try {
    console.log('🎯 Testando requisição real...');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc2MTg3NjM1Mn0.UybLmFG1Qi6CjnivWWRA_PGIG3xsrWezd0yvbu8rM-s';
    
    const response = await fetch(`${apiUrl}/products?page=1&itensByPage=10&token=${token}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Requisição real:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📄 Dados recebidos:', data);
    } else {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('🚀 Iniciando testes de CORS...');
  console.log('🌍 Origin atual:', window.location.origin);
  console.log('🎯 API alvo:', apiUrl);
  console.log('---');
  
  await testApiHealth();
  console.log('---');
  
  await testCorsHeaders();
  console.log('---');
  
  await testRealRequest();
  console.log('---');
  
  console.log('✅ Testes concluídos!');
}

// Executar os testes automaticamente
runAllTests();