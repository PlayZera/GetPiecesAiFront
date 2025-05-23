import axios from 'axios';
import { Produto } from '../models/produto.inteface';

const API_BASE_URL = import.meta.env.VITE_API_DE_PRODUTOS_URL as string;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response:any) => response.data,
  (error:any) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

export const ProductService = {
  getProduct: (id: string, token: string) => 
    api.get<ApiResponse<Produto>>(`/products/${id}?token=${token}`),
  
  searchProducts: (query: string, token: string) => 
    api.get<ApiResponse<Produto[]>>('/products', { params: { q: query, token } }),
  
  getAllProducts: (page: number = 1, limit: number = 100, token?: string) => 
    api.get<ProductsResponse>('/products', { params: { page, itensByPage: limit, token:token } }),
};

// Serviço de Autenticação
export const AuthService = {
  login: () => 
    api.post<Response>('/token', {
      username: import.meta.env.VITE_PORTAL_USER as string,
      password: import.meta.env.VITE_PORTAL_KEYPASS as string
    },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
};

export default api;