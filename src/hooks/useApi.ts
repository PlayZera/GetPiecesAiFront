import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService, AuthService } from '../api/api';
import { MockAuthService } from '../services/mockAuth';

// Query Keys
export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  AUTH: 'auth',
} as const;

// Hook para buscar todos os produtos
export const useProducts = (page: number, limit: number, token: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, page, limit, token],
    queryFn: async () => {
      const response = await ProductService.getAllProducts(page, limit, token);
      return response.data;
    },
    enabled: !!token, // Só executa se tiver token
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para buscar um produto específico
export const useProduct = (id: string, token?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, id, token],
    queryFn: async () => {
      const response = await ProductService.getProduct(id, token);
      return response.data;
    },
    enabled: !!id && !!token, // Só executa se tiver id e token
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para login
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials?: { email: string; password: string }) => {
      const isDev = import.meta.env.VITE_DEV_MODE === 'true';
      
      if (isDev && credentials) {
        // Usa mock em modo de desenvolvimento
        const response = await MockAuthService.login(credentials);
        return response;
      } else {
        // Usa API real
        const response = await AuthService.login();
        return response.data;
      }
    },
    onSuccess: (data: any) => {
      // Armazena o token no localStorage
      const token = data.access_token;
      localStorage.setItem('authToken', token);
      
      // Se for mock, armazena também dados do usuário
      if (data.user) {
        localStorage.setItem('userData', JSON.stringify(data.user));
      }
      
      // Invalida queries relacionadas à autenticação
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
    },
    onError: (error) => {
      console.error('Erro no login:', error);
      // Remove tokens inválidos
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      sessionStorage.removeItem('authToken');
    },
  });
};

// Hook para logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      AuthService.logout();
      // Limpa também dados do mock
      localStorage.removeItem('userData');
      return true;
    },
    onSuccess: () => {
      // Limpa todas as queries do cache
      queryClient.clear();
    },
  });
};

// Hook para verificar se o usuário está autenticado
export const useAuth = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  
  // Verifica se o token mock é válido (se existe userData)
  const isValidMockToken = token && userData && MockAuthService.validateToken(token);
  
  // Se for token mock inválido, limpa dados
  if (token && userData && !isValidMockToken) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }
  
  const user = userData ? JSON.parse(userData) : null;
  
  return {
    isAuthenticated: !!token && (!userData || isValidMockToken),
    token,
    user,
  };
};