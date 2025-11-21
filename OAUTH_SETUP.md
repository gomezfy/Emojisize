# 🔐 Configuração OAuth para VertraCloud

## ⚠️ IMPORTANTE: Primeiro, obtenha a URL do seu projeto

Antes de configurar o OAuth, você precisa:
1. Criar um projeto no **VertraCloud**: https://vertracloud.app
2. Anotar a URL do seu projeto (será algo como: `seu-projeto.vertracloud.app`)
3. Depois, volte aqui e use essa URL nas configurações abaixo

---

## Pré-requisitos

Antes de hospedar no VertraCloud, você precisa configurar aplicações OAuth no Discord e GitHub.

## 1️⃣ Criar Aplicação Discord

1. Acesse: https://discord.com/developers/applications
2. Clique em **"New Application"**
3. Dê um nome (ex: "Emoji Size")
4. Vá para **OAuth2** → **General**
5. Copie o **Client ID**
6. Clique em **"Reset Secret"** e copie o **Client Secret**
7. Em **Redirects**, adicione a URL do seu projeto VertraCloud:
   ```
   https://SEU-PROJETO.vertracloud.app/auth/discord/callback
   ```
   ⚠️ **Substitua** `SEU-PROJETO` pelo nome real do seu projeto!
8. Salve as mudanças

## 2️⃣ Criar Aplicação GitHub

1. Acesse: https://github.com/settings/developers
2. Clique em **"New OAuth App"**
3. Preencha:
   - **Application name**: Emoji Size
   - **Homepage URL**: `https://SEU-PROJETO.vertracloud.app`
   - **Authorization callback URL**: `https://SEU-PROJETO.vertracloud.app/auth/github/callback`
   
   ⚠️ **Substitua** `SEU-PROJETO` pelo nome real do seu projeto!
4. Clique em **"Register application"**
5. Copie o **Client ID**
6. Clique em **"Generate a new client secret"** e copie

## 3️⃣ Configurar Variáveis de Ambiente no VertraCloud

No painel do VertraCloud, adicione as seguintes variáveis de ambiente:

```bash
# URL do seu site (use a URL real do seu projeto VertraCloud)
CALLBACK_URL=https://SEU-PROJETO.vertracloud.app

# Gere um segredo forte (execute no terminal):
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=seu_segredo_aqui

# Discord OAuth
DISCORD_CLIENT_ID=seu_client_id_discord
DISCORD_CLIENT_SECRET=seu_client_secret_discord

# GitHub OAuth  
GITHUB_CLIENT_ID=seu_client_id_github
GITHUB_CLIENT_SECRET=seu_client_secret_github

# Opcional: Lista de admins (usernames ou IDs)
ADMIN_USERS=seu_username,outro_username

# Ambiente de produção
NODE_ENV=production
PORT=5000
```

## 4️⃣ Teste Local (Opcional)

Para testar localmente antes de hospedar:

1. Copie `.env.example` para `.env`
2. Preencha com suas credenciais
3. Use `http://localhost:5000` como CALLBACK_URL
4. Configure as mesmas URLs de callback no Discord e GitHub para localhost
5. Execute: `npm start`

## 🔒 Segurança

- **NUNCA** comite o arquivo `.env` no git
- **NUNCA** compartilhe seus Client Secrets
- Gere um SESSION_SECRET forte e único
- Use HTTPS em produção (VertraCloud já fornece)
- Mantenha as credenciais seguras no painel do VertraCloud

## ❓ Troubleshooting

**Erro: "discord_not_configured"**
- Verifique se DISCORD_CLIENT_ID e DISCORD_CLIENT_SECRET estão definidos
- Verifique se a URL de callback está correta

**Erro: "auth_failed"**
- Verifique se as credenciais estão corretas
- Verifique se a URL de callback no provedor corresponde exatamente à configurada

**Redirecionamento infinito**
- Verifique se CALLBACK_URL está definido corretamente
- Certifique-se de que está usando HTTPS em produção
