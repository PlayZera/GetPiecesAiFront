import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Produto } from '../models/produto.inteface';
import type { RespostaApi, RespostaAutenticacao } from '../models/respostaApi.interface';
import type { ProdutosPagina } from '../models/produtosPagina.interface';

const API_BASE_URL = import.meta.env.VITE_API_DE_PRODUTOS_URL;
const DEFAULT_USERNAME = import.meta.env.VITE_PORTAL_USER;
const DEFAULT_PASSWORD = import.meta.env.VITE_PORTAL_KEYPASS;

const instance = axios.create({
  baseURL: 'https://get-pieces-api-production.up.railway.app',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use(config => {
  if (config.url && config.url.startsWith('http://')) {
    config.url = config.url.replace('http://', 'https://');
  }
  
  if (config.baseURL && config.baseURL.startsWith('http://')) {
    config.baseURL = config.baseURL.replace('http://', 'https://');
  }
  
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const ProductService = {

  getProduct: (id: string, token?: string): Promise<AxiosResponse<RespostaApi<Produto>>> => { return instance.get(`/products/${id}&token=${token}`)},

  getAllProducts: (page:number, limit:number, token:string): Promise<AxiosResponse<RespostaApi<ProdutosPagina[]>>> => {
    return instance.get('/products', {
      params: {
        page: page,
        itensByPage: limit,
        token: token,
      },
    })
  },
}

export const AuthService = {
  login: (): Promise<AxiosResponse<RespostaAutenticacao>> => {
    const formData = new URLSearchParams()
    formData.append('username', DEFAULT_USERNAME)
    formData.append('password', DEFAULT_PASSWORD)

    return instance.post('/token', formData, {
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
    delete instance.defaults.headers.common['Authorization']
  },
}

export default instance