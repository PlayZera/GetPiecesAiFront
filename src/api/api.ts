import api from '../lib/axios';

const DEFAULT_USERNAME = import.meta.env.VITE_PORTAL_USER;
const DEFAULT_PASSWORD = import.meta.env.VITE_PORTAL_KEYPASS;

export const ProductService = {

  getProduct: (id: string, token?: string) => { 
    return api.get(`/products/${id}&token=${token}`)
  },

  getAllProducts: (page: number, limit: number, token: string) => {
    return api.get('/products', {
      params: {
        page: page,
        itensByPage: limit,
        token: token,
      },
    })
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