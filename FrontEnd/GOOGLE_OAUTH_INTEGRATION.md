# Integração Google OAuth no E-commerce

## Visão Geral
Este projeto agora inclui autenticação Google OAuth integrada ao sistema de e-commerce Next.js, migrada da implementação PHP existente.

## Arquivos Criados/Modificados

### 1. API Routes
- `app/api/auth/google/route.ts` - Gerencia OAuth Google (início e callback)

### 2. Páginas
- `app/auth/callback/google/page.tsx` - Processa retorno do Google OAuth

### 3. Contexto de Autenticação
- `context/auth-context.tsx` - Atualizado para usar Google OAuth real

### 4. Configuração
- `lib/google-oauth.ts` - Configurações e utilitários OAuth
- `.env.local.example` - Adicionadas variáveis Google OAuth

## Configuração

### 1. Google Cloud Console
1. Acesse https://console.cloud.google.com/
2. Crie um novo projeto ou selecione existente
3. Ative a API do Google+ API
4. Vá para "Credenciais" → "Criar credenciais" → "ID do cliente OAuth"
5. Configure:
   - Tipo: Aplicativo Web
   - URIs de redirecionamento autorizados: `http://localhost:3000/auth/callback/google`
   - Para produção: `https://seudominio.com/auth/callback/google`

### 2. Variáveis de Ambiente
Adicione ao `.env.local`:
```env
GOOGLE_CLIENT_ID=seu_client_id_do_google
GOOGLE_CLIENT_SECRET=seu_client_secret_do_google
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback/google
```

### 3. Migração das Credenciais PHP
As credenciais do seu sistema PHP podem ser reutilizadas:
- `client_id`: Mesmo valor do `config.php`
- `client_secret`: Mesmo valor do `config.php`
- `redirect_uri`: Atualizar para `/auth/callback/google`

## Fluxo de Autenticação

```
Usuário clica "Continuar com Google"
    ↓
Redirecionamento para /api/auth/google
    ↓
Google OAuth (consentimento)
    ↓
Retorno para /auth/callback/google
    ↓
Troca código por token
    ↓
Obtém dados do usuário
    ↓
Armazena no localStorage
    ↓
Redirecionamento para /
```

## Funcionalidades

### Login
- Botão "Continuar com Google" na página `/login`
- Redirecionamento automático para Google OAuth
- Processamento seguro do callback

### Logout
- Botão "Sair da conta" limpa localStorage
- Redirecionamento para página de login

### Persistência
- Dados do usuário armazenados em localStorage
- Recuperação automática ao recarregar página

## Segurança

✅ **Validação de ambiente**: Verifica se variáveis estão configuradas
✅ **Troca segura de tokens**: Código por access token via POST
✅ **Scopes limitados**: Apenas perfil e email
✅ **Redirect URI fixo**: Previne ataques de redirecionamento
✅ **Armazenamento local**: Tokens não expostos ao servidor

## Teste

1. Configure as variáveis de ambiente
2. Execute `npm run dev`
3. Acesse `http://localhost:3000/login`
4. Clique em "Continuar com Google"
5. Faça login com conta Google
6. Deve redirecionar para a loja logado

## Produção

Para produção:
1. Atualize `GOOGLE_REDIRECT_URI` para seu domínio
2. Configure redirect URI no Google Cloud Console
3. Considere usar JWT ou sessão segura em vez de localStorage
4. Implemente refresh token para sessões longas

## Comparação com PHP

| Aspecto | PHP Original | Next.js Novo |
|---------|-------------|--------------|
| Linguagem | PHP | TypeScript |
| Framework | Nenhum | Next.js |
| Armazenamento | Sessão PHP | localStorage |
| Segurança | Sessão server-side | Client-side |
| Escalabilidade | Limitada | Vercel/Netlify ready |
| Integração | Separada | Integrada ao e-commerce |

## Próximos Passos

- [ ] Configurar credenciais Google
- [ ] Testar fluxo completo
- [ ] Implementar persistência server-side (opcional)
- [ ] Adicionar proteção de rotas autenticadas
- [ ] Implementar refresh token