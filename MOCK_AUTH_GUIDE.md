# 🔐 Mock de Autenticação - GetPieces

## Funcionalidades Implementadas

### **Mock Service (`src/services/mockAuth.ts`)**
- ✅ Sistema de autenticação mock completo
- ✅ Validação de credenciais locais
- ✅ Geração de tokens JWT-like (base64)
- ✅ Validação de expiração de token (24h)
- ✅ Três usuários demo pré-configurados

### **Usuários Demo Disponíveis**

| Nome | Email | Senha | Perfil |
|------|-------|-------|--------|
| **Administrador** | `admin@getpieces.com` | `admin123` | Admin |
| **Usuário Padrão** | `user@getpieces.com` | `user123` | User |
| **Demo User** | `demo@demo.com` | `demo` | Demo |

### **Hooks Atualizados (`src/hooks/useApi.ts`)**
- ✅ `useLogin()` - Aceita credenciais e alterna entre mock/API real
- ✅ `useAuth()` - Gerencia dados do usuário e validação de token
- ✅ `useLogout()` - Limpa tokens e dados do usuário
- ✅ Detecção automática de modo desenvolvimento

### **Interface de Login Aprimorada**
- ✅ Formulário funcional com email/senha
- ✅ Estados de loading durante autenticação
- ✅ Tratamento de erros com mensagens amigáveis
- ✅ **Credenciais demo clicáveis** (modo dev)
- ✅ Preenchimento automático ao clicar nas credenciais

### **SideNavBar Personalizada**
- ✅ Exibe nome e email do usuário logado
- ✅ Fallback para "Usuário autenticado" se não houver dados
- ✅ Botão de logout integrado

## Como Usar

### **1. Configuração**
O mock está ativo quando `VITE_DEV_MODE=true` no arquivo `.env`

### **2. Login Manual**
Digite qualquer uma das credenciais da tabela acima

### **3. Login Rápido (Modo Dev)**
Na página de login, clique em qualquer credencial na seção amarela "Credenciais Demo" para preencher automaticamente

### **4. Funcionalidades**
- ✅ **Token Persistente**: Mantém login entre sessões
- ✅ **Expiração**: Token expira em 24 horas
- ✅ **Validação**: Verificação automática de token válido
- ✅ **Limpeza**: Logout remove todos os dados

## Fluxo de Autenticação

```
1. Usuário insere credenciais
2. Sistema verifica contra MOCK_USERS
3. Se válido: gera token + salva dados do usuário
4. Token usado automaticamente em requests
5. SideNavBar exibe info do usuário
6. Logout limpa tudo
```

## Integração API/Mock

O sistema detecta automaticamente:
- **Dev Mode** (`VITE_DEV_MODE=true`): Usa mock local
- **Prod Mode**: Usa API real (AuthService.login())

## Dados Armazenados

### **localStorage**
- `authToken`: Token de autenticação
- `userData`: Dados do usuário (nome, email)
- `darkMode`: Preferência de tema

### **Estrutura do Token Mock**
```json
{
  "userId": "1",
  "email": "admin@getpieces.com", 
  "exp": 1640995200000
}
```

## Vantagens

- 🚀 **Desenvolvimento Rápido**: Sem dependência de API
- 🔒 **Realista**: Simula fluxo real de autenticação
- 🎯 **Fácil Teste**: Credenciais pré-definidas
- 🔄 **Alternância**: Fácil switch entre mock/API
- 📱 **Responsivo**: Funciona em todos os dispositivos

O mock está pronto para uso e pode ser facilmente substituído pela API real quando necessário!