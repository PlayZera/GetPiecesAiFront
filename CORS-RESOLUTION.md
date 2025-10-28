# Resolução de Problemas CORS - Railway

## Problemas Identificados
1. **Cross-Origin Request Blocked**: Bloqueio de requisições entre domínios
2. **Mixed Content Error**: Frontend HTTPS tentando acessar API HTTP
3. **CORS Policy**: Configurações de CORS insuficientes

## Soluções Implementadas

### 1. Configuração do Axios (src/lib/axios.ts)
```typescript
// Função para detectar ambiente e usar HTTPS em produção
function getApiBaseUrl(): string {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (import.meta.env.PROD && configuredUrl && !configuredUrl.startsWith('https://')) {
    return configuredUrl.replace('http://', 'https://');
  }
  
  return configuredUrl || 'http://localhost:3001';
}

// Timeout aumentado para 30 segundos
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
```

### 2. Variáveis de Ambiente
- **Desenvolvimento (.env)**: `http://localhost:3001`
- **Produção (.env.production)**: `https://get-pieces-api-production.up.railway.app`

### 3. Configuração do Vite (vite.config.ts)
```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://get-pieces-api-production.up.railway.app',
      changeOrigin: true,
      secure: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    },
  },
}
```

### 4. Componente de Diagnóstico
Criado `src/components/ApiDiagnostic.tsx` para monitoramento em tempo real:
- Testa conectividade da API
- Detecta erros de CORS
- Exibe status visual
- Mostra configurações do ambiente

## Instruções de Deploy no Railway

1. **Push das alterações para o repositório**
2. **Railway detectará automaticamente as mudanças**
3. **Verificar se as variáveis de ambiente estão configuradas:**
   - `VITE_API_BASE_URL=https://get-pieces-api-production.up.railway.app`
   - `VITE_PORTAL_USER=admin`
   - `VITE_PORTAL_KEYPASS=admin123`
   - `VITE_DEV_MODE=false`

## Testes Pós-Deploy

1. **Acesse a aplicação no Railway**
2. **Verifique o componente de diagnóstico (ambiente de desenvolvimento)**
3. **Teste login e navegação**
4. **Monitore o console do browser para erros de CORS**

## URLs Importantes
- **Frontend**: https://getpiecesaifront-production.up.railway.app
- **API**: https://get-pieces-api-production.up.railway.app

## Próximos Passos
Se ainda houver problemas de CORS, configure no backend da API:
```javascript
app.use(cors({
  origin: ['https://getpiecesaifront-production.up.railway.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```