# Configuração CORS para Railway - Backend API

## Problema Identificado
O erro "CORS request did not succeed" indica que o **backend da API** não está configurado para aceitar requisições do frontend.

## Configuração Necessária no Backend

### Node.js/Express
```javascript
const cors = require('cors');

// Configuração CORS para Railway
const corsOptions = {
  origin: [
    'https://getpiecesaifront-production.up.railway.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['set-cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Middleware adicional para garantir headers CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://getpiecesaifront-production.up.railway.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
});
```

### Variáveis de Ambiente Railway (Backend)
Adicione no Railway (Backend API):
```
FRONTEND_URL=https://getpiecesaifront-production.up.railway.app
CORS_ORIGIN=https://getpiecesaifront-production.up.railway.app,http://localhost:3000,http://localhost:5173
NODE_ENV=production
```

### Python/FastAPI
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configuração CORS
origins = [
    "https://getpiecesaifront-production.up.railway.app",
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### PHP/Laravel
```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://getpiecesaifront-production.up.railway.app',
        'http://localhost:3000',
        'http://localhost:5173',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

## URLs Importantes
- **Frontend**: https://getpiecesaifront-production.up.railway.app
- **API**: https://get-pieces-api-production.up.railway.app

## Teste de CORS
Adicione esta rota de teste no backend:
```javascript
app.get('/cors-test', (req, res) => {
  res.json({
    message: 'CORS working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});
```

## Debugging
1. Acesse: https://get-pieces-api-production.up.railway.app/cors-test
2. Verifique os headers da resposta
3. Confirme se `Access-Control-Allow-Origin` está presente

## ⚠️ IMPORTANTE
O erro está no **BACKEND**, não no frontend. O backend precisa ser configurado para aceitar requisições do domínio do frontend.