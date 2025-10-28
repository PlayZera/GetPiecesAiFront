// Script para testar conectividade com a API
// Execute no console do navegador para debugar problemas de CORS

const testApiConnection = async () => {
  const apiUrl = 'https://get-pieces-api-production.up.railway.app';
  
  console.log('🔍 Testando conectividade com a API...');
  console.log('URL da API:', apiUrl);
  
  try {
    // Teste 1: Verificar se a API responde
    console.log('\n📡 Teste 1: Verificando se a API responde...');
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      console.log('✅ API está respondendo:', response.status);
    } else {
      console.log('❌ API retornou erro:', response.status);
    }
  } catch (error) {
    console.log('❌ Erro ao conectar com a API:', error.message);
  }
  
  try {
    // Teste 2: Verificar endpoint de produtos
    console.log('\n📦 Teste 2: Verificando endpoint de produtos...');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc2MTYxNzc3M30.MGJFPSZOd8n4ZEOmsZqH1WvrCXjeET_feF7DtMyC3VM';
    
    const productsResponse = await fetch(`${apiUrl}/products?page=1&itensByPage=10&token=${token}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (productsResponse.ok) {
      const data = await productsResponse.json();
      console.log('✅ Produtos carregados com sucesso:', data);
    } else {
      console.log('❌ Erro ao carregar produtos:', productsResponse.status);
      const errorText = await productsResponse.text();
      console.log('Erro:', errorText);
    }
  } catch (error) {
    console.log('❌ Erro ao carregar produtos:', error.message);
    
    if (error.message.includes('CORS')) {
      console.log('\n🚨 PROBLEMA DE CORS DETECTADO!');
      console.log('Soluções possíveis:');
      console.log('1. Configurar CORS no backend para aceitar origem: https://getpiecesaifront-production.up.railway.app');
      console.log('2. Verificar se ambos os serviços estão usando HTTPS');
      console.log('3. Verificar se os headers CORS estão configurados corretamente');
    }
  }
};

// Função para verificar variáveis de ambiente
const checkEnvironmentVariables = () => {
  console.log('\n🔧 Verificando variáveis de ambiente...');
  
  const vars = {
    'VITE_API_BASE_URL': import.meta.env.VITE_API_BASE_URL,
    'VITE_DEV_MODE': import.meta.env.VITE_DEV_MODE,
    'VITE_PORTAL_USER': import.meta.env.VITE_PORTAL_USER,
    'PROD': import.meta.env.PROD,
    'MODE': import.meta.env.MODE
  };
  
  console.table(vars);
};

// Execute os testes
console.log('🚀 Iniciando diagnóstico da API...');
checkEnvironmentVariables();
testApiConnection();