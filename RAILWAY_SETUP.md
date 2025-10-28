# Railway Deployment Configuration

## Variáveis de Ambiente Necessárias no Railway

Para configurar corretamente a aplicação no Railway, defina as seguintes variáveis de ambiente:

### 1. API Configuration
```
VITE_API_BASE_URL=https://get-pieces-api-production.up.railway.app
```

### 2. Authentication
```
VITE_PORTAL_USER=admin
VITE_PORTAL_KEYPASS=admin123
```

### 3. Environment Settings
```
VITE_DEV_MODE=false
VITE_CACHE_STALE_TIME=5
VITE_CACHE_GC_TIME=10
```

## Como Configurar no Railway

1. Acesse o painel do Railway
2. Vá para o projeto GetPiecesAiFront
3. Clique na aba "Variables"
4. Adicione cada variável listada acima

## Troubleshooting CORS

Se ainda houver problemas de CORS, verifique se a API em:
`https://get-pieces-api-production.up.railway.app`

Está configurada com os seguintes headers:
- `Access-Control-Allow-Origin: *` (ou especificamente `https://getpiecesaifront-production.up.railway.app`)
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Verificação de HTTPS

Certifique-se que ambos os serviços estejam usando HTTPS:
- Frontend: `https://getpiecesaifront-production.up.railway.app`
- Backend: `https://get-pieces-api-production.up.railway.app`