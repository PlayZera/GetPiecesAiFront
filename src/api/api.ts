import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { Produto } from '../models/produto.inteface'
import type { RespostaApi, RespostaAutenticacao } from '../models/respostaApi.interface'
import type { ProdutosPagina } from '../models/produtosPagina.interface'

const API_BASE_URL = import.meta.env.VITE_API_DE_PRODUTOS_URL
const DEFAULT_USERNAME = import.meta.env.VITE_PORTAL_USER
const DEFAULT_PASSWORD = import.meta.env.VITE_PORTAL_KEYPASS

// Criação da instância com interceptores
const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use((config:AxiosRequestConfig) => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

  if (token) {
    config.headers.Authorization = token;
  }
  return config;

})

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

  getProduct: (id: string, token?: string): Promise<AxiosResponse<RespostaApi<Produto>>> => {
    const config: AxiosRequestConfig = {}

    if (token) {
      config.headers = token;
    }
    
    return instance.get(`/products/${id}`, config)
  },

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