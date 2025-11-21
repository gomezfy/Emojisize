# ✅ Verificação Exata das URLs OAuth

## 🔴 Erro: "redirect_uri de OAuth2 inválido"

Isso acontece quando a URL configurada no Discord/GitHub **não está EXATAMENTE igual** à URL que o servidor envia.

---

## 📋 URLs EXATAS para Configurar

### **Discord Developer Portal**

1. Acesse: https://discord.com/developers/applications
2. Selecione sua aplicação
3. Vá em **OAuth2** → **General**
4. Na seção **Redirects**, adicione **EXATAMENTE**:

```
https://emojisize.vertraweb.app/auth/discord/callback
```

⚠️ **ATENÇÃO:**
- ✅ Deve ter `https://` (com S)
- ✅ Não pode ter `www.`
- ✅ Não pode ter `/` no final
- ✅ Deve ser exatamente `emojisize.vertraweb.app`
- ✅ O caminho é `/auth/discord/callback`

### **GitHub Developer Settings**

1. Acesse: https://github.com/settings/developers
2. Selecione seu OAuth App
3. Em **Authorization callback URL**, coloque **EXATAMENTE**:

```
https://emojisize.vertraweb.app/auth/github/callback
```

---

## 🔧 Configuração no VertraWeb

No painel do VertraWeb, a variável `CALLBACK_URL` deve ser:

```
CALLBACK_URL=https://emojisize.vertraweb.app
```

⚠️ **SEM a barra `/` no final!**

❌ **ERRADO:**
```
CALLBACK_URL=https://emojisize.vertraweb.app/
```

✅ **CORRETO:**
```
CALLBACK_URL=https://emojisize.vertraweb.app
```

---

## 🔍 Como Verificar se Está Correto

### **No Discord:**

1. Vá em https://discord.com/developers/applications
2. Selecione sua aplicação
3. Vá em **OAuth2** → **General**
4. Na lista de **Redirects**, deve aparecer **EXATAMENTE**:
   - `https://emojisize.vertraweb.app/auth/discord/callback`

5. **IMPORTANTE:** Se tiver outras URLs na lista (como localhost), está OK. Mas essa deve estar lá!

### **No GitHub:**

1. Vá em https://github.com/settings/developers
2. Selecione seu OAuth App
3. O campo **Authorization callback URL** deve ter **EXATAMENTE**:
   - `https://emojisize.vertraweb.app/auth/github/callback`

---

## ⚙️ Passo a Passo Completo

### **1. Limpar Configurações Antigas**

No Discord:
- Remova qualquer URL que tenha `localhost`, `replit.dev`, ou outras
- Deixe apenas `https://emojisize.vertraweb.app/auth/discord/callback`

No GitHub:
- Remova qualquer URL antiga
- Deixe apenas `https://emojisize.vertraweb.app/auth/github/callback`

### **2. No VertraWeb**

Verifique se a variável está **SEM barra no final**:
```
CALLBACK_URL=https://emojisize.vertraweb.app
```

### **3. Reiniciar o Servidor**

Depois de alterar qualquer configuração:
1. Salve as mudanças
2. Reinicie o servidor no VertraWeb
3. Aguarde 30 segundos
4. Teste novamente

---

## 🧪 Teste Final

1. Acesse: `https://emojisize.vertraweb.app/login`
2. Clique em **"Entrar com Discord"**
3. Você será redirecionado para: `https://discord.com/oauth2/authorize?...`
4. Após autorizar no Discord, você deve voltar para: `https://emojisize.vertraweb.app/auth/discord/callback`
5. E então ser redirecionado para a página principal logado

---

## ❓ Se o Erro Persistir

### **Verifique os Logs no VertraWeb**

Procure por mensagens como:
- `⚠️ Discord OAuth não configurado`
- Isso significa que as credenciais não foram carregadas

### **Certifique-se de que TODAS essas variáveis existem:**

```bash
CALLBACK_URL=https://emojisize.vertraweb.app
DISCORD_CLIENT_ID=(seu client id)
DISCORD_CLIENT_SECRET=(seu client secret)
GITHUB_CLIENT_ID=(seu client id)
GITHUB_CLIENT_SECRET=(seu client secret)
SESSION_SECRET=(valor aleatório longo)
NODE_ENV=production
PORT=5000
```

### **Copie as Credenciais Novamente**

Às vezes ajuda copiar e colar as credenciais novamente:
1. No Discord, vá em **OAuth2** → **General**
2. Copie o **Client ID** novamente
3. Gere um novo **Client Secret** (clique em Reset Secret)
4. Cole no VertraWeb
5. Salve e reinicie

---

## 📸 Capturas de Tela Ajudam

Se ainda não funcionar, tire prints de:
- [ ] Lista de Redirects no Discord
- [ ] Variáveis de ambiente no VertraWeb
- [ ] Mensagem de erro completa

E me envie para eu te ajudar!
