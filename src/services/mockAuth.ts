// Mock simples para autenticação
interface MockCredentials {
  email: string;
  password: string;
}

interface MockAuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// Credenciais mock válidas
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@getpieces.com',
    password: 'admin123',
    name: 'Administrador'
  },
  {
    id: '2',
    email: 'user@getpieces.com', 
    password: 'user123',
    name: 'Usuário Padrão'
  },
  {
    id: '3',
    email: 'demo@demo.com',
    password: 'demo',
    name: 'Demo User'
  }
];

export const MockAuthService = {
  login: async (credentials: MockCredentials): Promise<MockAuthResponse> => {
    // Simula delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }
    
    // Gera token mock (base64 do user id + timestamp)
    const tokenData = JSON.stringify({
      userId: user.id,
      email: user.email,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    });
    const token = btoa(tokenData);
    
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  },
  
  validateToken: (token: string): boolean => {
    try {
      const decoded = JSON.parse(atob(token));
      return decoded.exp > Date.now();
    } catch {
      return false;
    }
  },
  
  getUserFromToken: (token: string) => {
    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.exp <= Date.now()) return null;
      
      return {
        id: decoded.userId,
        email: decoded.email
      };
    } catch {
      return null;
    }
  }
};

export { MOCK_USERS };