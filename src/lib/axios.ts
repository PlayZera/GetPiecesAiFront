import axios from 'axios';

// Determina a URL base da API baseada no ambiente
const getApiBaseUrl = () => {
  // Se em produção, usa a variável de ambiente ou a URL do Railway
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || 'https://get-pieces-api-production.up.railway.app';
  }
  // Em desenvolvimento, usa localhost ou variável de ambiente
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000, // Aumentado para 30s devido à latência da Railway
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Configurações adicionais para CORS
  withCredentials: false,
});

// Interceptor de requisição para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    // Adiciona token automaticamente se disponível
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar erros de autenticação e CORS
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log do erro para debugging
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });

    if (error.response?.status === 401) {
      // Remove tokens inválidos
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      // Redireciona para login
      window.location.href = '/login';
    }
    
    // Tratamento específico para erros de CORS
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      console.error('CORS Error detected. Please check API CORS configuration.');
    }
    
    return Promise.reject(error);
  }
);

export default api;