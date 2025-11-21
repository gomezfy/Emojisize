# 🔧 Solução de Problemas - ERR_BAD_REQUEST

## ❌ Erro: "Aplicação não iniciada ERR_BAD_REQUEST"

Este erro geralmente indica um problema com as variáveis de ambiente ou configuração no VertraWeb.

---

## ✅ Checklist de Configuração no VertraWeb

### **1. Verifique as Variáveis de Ambiente**

No painel do VertraWeb, certifique-se de ter **EXATAMENTE** estas variáveis:

```bash
# Obrigatórias
NODE_ENV=production
PORT=5000
SESSION_SECRET=(um valor aleatório de 32+ caracteres)
CALLBACK_URL=https://emojisize.vertraweb.app

# OAuth (obrigatórias)
DISCORD_CLIENT_ID=seu_client_id_aqui
DISCORD_CLIENT_SECRET=seu_client_secret_aqui
GITHUB_CLIENT_ID=seu_client_id_aqui
GITHUB_CLIENT_SECRET=seu_client_secret_aqui

# Opcional
ADMIN_USERS=seu_username
```

### **⚠️ IMPORTANTE: Remova barras `/` no final!**

❌ **ERRADO:**
```
CALLBACK_URL=https://emojisize.vertraweb.app/
```

✅ **CORRETO:**
```
CALLBACK_URL=https://emojisize.vertraweb.app
```

---

## 🔍 Problemas Comuns

### **Problema 1: SESSION_SECRET não configurado**
**Sintoma:** Servidor não inicia ou erro 500
**Solução:** Gere uma chave forte:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copie o resultado e cole em `SESSION_SECRET`

### **Problema 2: Porta incorreta**
**Sintoma:** ERR_BAD_REQUEST ou timeout
**Solução:** Configure `PORT=5000` (ou a porta que o VertraWeb usa)

### **Problema 3: NODE_ENV incorreto**
**Sintoma:** Problemas com sessões ou cookies
**Solução:** Use exatamente `NODE_ENV=production` (sem aspas, sem espaços)

### **Problema 4: CALLBACK_URL com barra final**
**Sintoma:** OAuth não funciona, double slash `//`
**Solução:** Remova a barra `/` do final da URL

### **Problema 5: Credenciais OAuth faltando**
**Sintoma:** Avisos no log, login não funciona
**Solução:** Configure todas as 4 variáveis OAuth (DISCORD e GITHUB)

---

## 🚀 Como Aplicar as Correções

1. **Acesse o painel do VertraWeb**
2. **Vá em Configurações/Environment Variables**
3. **Edite cada variável** conforme o checklist acima
4. **Salve as mudanças**
5. **Reinicie o servidor** (botão Restart/Redeploy)

---

## 📝 Logs de Diagnóstico

Se o erro persistir, verifique os logs do servidor no VertraWeb:

**Procure por:**
- ❌ Erros de sintaxe
- ❌ "Cannot find module"
- ❌ "EADDRINUSE" (porta em uso)
- ❌ Problemas de permissão

**Deve aparecer:**
- ✅ "✨ Emoji Size rodando em..."
- ✅ "🔐 Sistema de autenticação OAuth ativo"

---

## 🆘 Se Nada Funcionar

1. **Verifique se fez upload do projeto mais recente**
2. **Confirme que o arquivo `package.json` existe**
3. **Teste localmente primeiro** (se possível)
4. **Entre em contato com o suporte do VertraWeb**

---

## ✅ Teste Final

Depois de configurar tudo:

1. Acesse: `https://emojisize.vertraweb.app/login`
2. Deve aparecer a página de login
3. Clique em "Entrar com Discord"
4. Deve redirecionar para o Discord
5. Após autorizar, deve voltar para o site logado

Se tudo funcionar: **Parabéns! 🎉**
