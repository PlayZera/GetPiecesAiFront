import axios from 'axios';

const API_BASE_URL = import.meta.env.API_DE_PRODUTOS_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Adicione headers de autenticação se necessário:
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Endpoints específicos
export const ProductService = {
  getProduct: (id) => api.get(`/produtos/${id}?token=${import.meta.env.TOKEN}`),
  searchProducts: (query) => api.get('/produtos', { params: { q: query } }),
};

export const AuthService = {
  login: (credentials) => api.post('/token', {username: import.meta.env.PORTAL_USER,
                                              password: import.meta.env.PORTAL_KEYPASS}),
};