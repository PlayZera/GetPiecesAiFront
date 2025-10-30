import api from '../lib/axios';

const DEFAULT_USERNAME = import.meta.env.VITE_PORTAL_USER;
const DEFAULT_PASSWORD = import.meta.env.VITE_PORTAL_KEYPASS;

export const ProductService = {

  getProduct: (id: string, token?: string) => { 
    // Tentar primeiro com token no header
    if (token) {
      return api.get(`/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
    // Fallback para token na query
    return api.get(`/products/${id}?token=${token}`)
  },

  getAllProducts: async (page: number, limit: number, token: string) => {
    console.log('🔍 Tentando buscar produtos...', { page, limit, token: token.substring(0, 20) + '...' });
    
    const endpoints = [
      '/products',
      '/api/products', 
      '/v1/products',
      '/products/list'
    ];

    const methods = [
      // Método 1: GET com Authorization header
      { 
        name: 'GET com Bearer token',
        fn: (endpoint: string) => api.get(endpoint, {
          params: { page, itensByPage: limit, token: token },
          headers: { 'Authorization': `Bearer ${token}` }
        })
      },
      
      // Método 2: POST com dados no body
      { 
        name: 'POST com body',
        fn: (endpoint: string) => api.post(endpoint, {
          page,
          itensByPage: limit,
          token
        })
      },
      
      // Método 3: GET com token na query
      { 
        name: 'GET com query token',
        fn: (endpoint: string) => api.get(endpoint, {
          params: { page, itensByPage: limit, token }
        })
      },

      // Método 4: GET sem paginação (para testar se endpoint existe)
      { 
        name: 'GET simples',
        fn: (endpoint: string) => api.get(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      }
    ];

    // Tentar cada combinação de endpoint + método
    for (const endpoint of endpoints) {
      for (const method of methods) {
        try {
          console.log(`🔍 Tentando: ${method.name} em ${endpoint}`);
          const response = await method.fn(endpoint);
          console.log(`✅ Sucesso: ${endpoint} retornou ${response.status}`);
          return response;
        } catch (error: any) {
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message;
          
          console.log(`❌ Falhou: ${endpoint} (${method.name}) - ${status}: ${message}`);
          
          // Se retornou 401/403, o endpoint existe mas precisa de autenticação diferente
          if (status === 401 || status === 403) {
            console.log(`🔐 Endpoint ${endpoint} existe mas requer autenticação diferente`);
          }
          
          // Se retornou 405, o endpoint existe mas o método está errado
          if (status === 405) {
            console.log(`🚫 Endpoint ${endpoint} existe mas método HTTP incorreto`);
            // Para erro 405, não tentar outros métodos neste endpoint
            break;
          }
          
          // Se retornou 404, endpoint não existe
          if (status === 404) {
            console.log(`🚫 Endpoint ${endpoint} não encontrado`);
            // Para erro 404, não tentar outros métodos neste endpoint  
            break;
          }
          
          // Continuar tentando outros métodos
          continue;
        }
      }
    }
    
    // Se chegou até aqui, nenhum método funcionou
    throw new Error('❌ Nenhum endpoint/método de produtos funcionou. Verifique a documentação da API.');
  },
}

export const AuthService = {
  login: () => {
    const formData = new URLSearchParams()
    formData.append('username', DEFAULT_USERNAME)
    formData.append('password', DEFAULT_PASSWORD)

    return api.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  },

  /**
   * Remove o token de autenticação
   */
  logout: (): void => {
    localStorage.removeItem('authToken')
    sessionStorage.removeItem('authToken')
    delete api.defaults.headers.common['Authorization']
  },
}

export default api