# Resolução do Erro 405 - Method Not Allowed

## Problema Identificado
O erro **405 Method Not Allowed** indica que o endpoint `/products` existe, mas não aceita o método HTTP sendo usado (GET).

## Status Atual
- ✅ CORS resolvido (requisição chega ao servidor)
- ❌ Método HTTP incorreto para o endpoint `/products`

## Possíveis Causas e Soluções

### 1. API Espera POST em vez de GET
Muitas APIs modernas usam POST para endpoints de listagem com filtros:

```javascript
// Em vez de GET /products?page=1&limit=10
// Usar POST /products com body:
{
  "page": 1,
  "itensByPage": 10,
  "token": "..."
}
```

### 2. Endpoint Incorreto
O endpoint pode ter um prefixo:
- `/api/products`
- `/v1/products` 
- `/products/list`
- `/products/search`

### 3. Autenticação no Header
A API pode esperar o token no header Authorization:
```javascript
headers: {
  'Authorization': 'Bearer TOKEN_AQUI'
}
```

## Como Verificar a Documentação da API

### 1. Acessar Documentação
Tente acessar:
- https://get-pieces-api-production.up.railway.app/docs
- https://get-pieces-api-production.up.railway.app/swagger
- https://get-pieces-api-production.up.railway.app/api-docs

### 2. Usar Script de Teste
Execute o script `src/utils/api-endpoint-test.js` no console do browser para testar automaticamente diferentes combinações.

### 3. Verificar Response Headers
O erro 405 deve retornar um header `Allow` indicando os métodos aceitos:
```
Allow: POST, OPTIONS
```

## Implementação Atual (ProductService)

O código foi atualizado para tentar automaticamente:

1. **Diferentes Endpoints:**
   - `/products`
   - `/api/products`
   - `/v1/products`
   - `/products/list`

2. **Diferentes Métodos:**
   - GET com Authorization header
   - POST com dados no body
   - GET com token na query
   - GET simples para testar existência

3. **Logs Detalhados:**
   - Mostra qual combinação está sendo testada
   - Identifica tipos específicos de erro (404, 405, 401)
   - Para de tentar métodos se endpoint não existe (404)

## Monitoramento

O componente `ApiDiagnostic` agora mostra:
- ✅ Qual método/endpoint funcionou
- ❌ Detalhes específicos dos erros
- 🔍 Logs no console para debugging

## Próximos Passos

1. **Testar a aplicação** - O código agora tenta automaticamente diferentes combinações
2. **Verificar console** - Logs detalhados mostram o que está sendo tentado
3. **Consultar documentação** - Usar os links acima para ver a API oficial
4. **Ajustar conforme necessário** - Baseado nos logs e documentação

## Exemplo de Log Esperado

```
🔍 Tentando buscar produtos... {page: 1, limit: 100, token: "eyJ1c2VySWQ..."}
🔍 Tentando: GET com Bearer token em /products
❌ Falhou: /products (GET com Bearer token) - 405: Method Not Allowed
🚫 Endpoint /products existe mas método HTTP incorreto
🔍 Tentando: POST com body em /api/products
✅ Sucesso: /api/products retornou 200
```

Este log mostrará exatamente qual combinação funciona!