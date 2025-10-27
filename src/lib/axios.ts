import axios from 'axios';

const apiURL = import.meta.env.VITE_API_DE_PRODUTOS_URL;

const api = axios.create({
  baseURL: 'https://get-pieces-api-production.up.railway.app',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
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

// Interceptor de resposta para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove tokens inválidos
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      // Redireciona para login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;