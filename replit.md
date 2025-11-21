# Emoji Resizer Web

## Visão Geral
Aplicação web para redimensionar emojis para o Discord Developer Portal. O sistema permite upload de até 9 imagens, redimensiona automaticamente para 128x128 pixels e fornece download em formato ZIP.

## Estado Atual
- **Data**: 21 de Novembro de 2025
- **Status**: Projeto configurado e funcional com autenticação segura
- **Tecnologias**: Node.js, Express, bcryptjs, HTML/CSS/JavaScript vanilla, JSZip

## Arquitetura do Projeto
```
/
├── src/
│   └── server.js      # Servidor Express na porta 5000
├── public/
│   ├── index.html     # Interface web com drag & drop
│   ├── login.html     # Página de login com Discord/Username
│   └── logo.png       # Logo minimalista do PNGshrink
├── package.json       # Dependências do projeto
├── README.md          # Documentação do usuário
└── replit.md          # Documentação do projeto
```

## Funcionalidades
- ✅ Upload de imagens via drag & drop ou seleção
- ✅ Redimensionamento automático para múltiplos tamanhos (128x128, 256x256, 512x512, 1024x1024)
- ✅ Preview em tempo real das imagens processadas
- ✅ Barra de progresso durante o processamento
- ✅ Download individual ou em lote
- ✅ **Interface estilo X-Twitter**: Design minimalista, limpo e moderno 🎨
- ✅ **Sistema de Anúncios Recompensados**: Assista anúncios de 30 segundos para desbloquear 30 minutos de acesso
- ✅ Timer visual mostrando tempo restante de acesso
- ✅ Sistema de autenticação (Discord OAuth e Username/Senha)

## Configuração
- **Porta**: 5000 (configurada para Replit)
- **Bind**: 0.0.0.0 (permitir acesso externo)

## Segurança Implementada
- 🔐 **Helmet**: Headers de segurança HTTP (CSP, HSTS, XSS Protection)
- 🛡️ **Rate Limiting**: Proteção contra ataques de força bruta
  - Login: Máximo 5 tentativas em 15 minutos
  - Geral: Máximo 100 requisições por minuto
- ✅ **Validação de Inputs**: Sanitização e validação com express-validator
- 🔒 **Sessões Seguras**: Cookies httpOnly, sameSite strict, secret forte
- 📏 **Limites de Payload**: Máximo 10MB para uploads
- 🚫 **Content Security Policy**: Restrições de scripts e recursos externos
- 🔑 **Hash de Senhas**: bcrypt com 12 rounds (salt automático)
- 🎯 **Política de Senha Forte**: Mínimo 10 caracteres com maiúsculas, minúsculas, números e símbolos

## Variáveis de Ambiente
- `SESSION_SECRET`: Chave secreta para sessões (recomendado: mínimo 32 caracteres)
- `NODE_ENV`: Ambiente de execução (development/production)
- `GOOGLE_ADSENSE_ID` (Opcional): ID do Google AdSense para monetização com anúncios reais
- `ADMIN_USERS`: Lista de usernames ou IDs do Discord separados por vírgula que têm acesso ilimitado sem anúncios (Ex: `gomezfy_,OutroAdmin`)

## Sistema de Anúncios Recompensados
O aplicativo implementa um sistema inovador de monetização:

### Como Funciona
1. **Acesso Inicial**: Usuário faz login e encontra o conteúdo bloqueado
2. **Modal de Anúncio**: Sistema solicita que assista a um anúncio de 30 segundos
3. **Recompensa**: Após assistir, o usuário ganha 30 minutos de acesso completo
4. **Timer Visual**: Contador regressivo mostra tempo restante
5. **Renovação**: Quando o tempo expira, sistema solicita novo anúncio

### Configuração Google AdSense (Opcional)
Para substituir o anúncio de demonstração por anúncios reais do Google:

1. Crie uma conta no [Google AdSense](https://www.google.com/adsense/)
2. Configure Rewarded Ad Units no painel do AdSense
3. Adicione seu Publisher ID ao código HTML (linha com `data-ad-client`)
4. Os anúncios reais começarão a aparecer automaticamente

### Endpoints API
- `GET /api/access-status` - Verifica se o usuário tem acesso e quanto tempo resta
- `POST /api/grant-access` - Concede 30 minutos de acesso após assistir anúncio

## Deploy para Produção (VertraCloud)
O projeto está pronto para deploy na VertraCloud! Veja o arquivo `README-DEPLOY.md` para instruções completas.

### Arquivos de Deploy Criados
- ✅ `README-DEPLOY.md` - Guia completo de deploy para VertraCloud
- ✅ `.env.example` - Template de variáveis de ambiente
- ✅ `package.json` atualizado com versão do Node.js

### Passos Rápidos
1. Acesse [VertraCloud](https://vertracloud.app)
2. Crie um novo projeto Node.js
3. Faça upload ou conecte via Git
4. Configure variáveis de ambiente (SESSION_SECRET, PORT, NODE_ENV)
5. Deploy automático!

## Mudanças Recentes
- 21/11/2025: **Redesign completo no estilo X-Twitter** 🎨
  - Interface minimalista e moderna inspirada no Twitter/X
  - Fundo preto (#000) com elementos em azul (#1d9bf0)
  - Design limpo e responsivo
  - Tipografia aprimorada com fontes do sistema
  - Melhor experiência de usuário com transições suaves
  - Páginas de login e principal completamente redesenhadas
  - Componentes modernos: cards, botões arredondados, tabs estilizadas
- 21/11/2025: Sistema de Autenticação com Senhas implementado 🔐
  - bcryptjs instalado para hash seguro (12 rounds com salt automático)
  - Política de senha forte: mínimo 10 caracteres com maiúsculas, minúsculas, números e símbolos
  - Estrutura users.json atualizada: `{usernameLower, usernameDisplay, passwordHash, createdAt, lastLoginAt}`
  - Funções helper: registerUser() para criar contas e authenticateUser() para login
  - Rotas separadas: /auth/register (registro) e /auth/login (autenticação)
  - Interface com tabs: "Entrar" e "Criar Conta" na mesma página
  - Validador de senha em tempo real: indicador de força (fraco/médio/forte)
  - Mensagens de erro específicas: distingue entre erros de username e senha
  - Validação dupla: cliente (UX) e servidor (segurança)
  - Administradores mantêm acesso ilimitado sem necessidade de senha
- 21/11/2025: Sistema de Usernames Únicos implementado 🔒
  - Nomes de usuário agora são únicos no sistema
  - Arquivo `users.json` criado para armazenar usernames registrados
  - Validação automática: impede registro de usernames duplicados
  - Mensagens de erro claras na página de login
  - Usernames salvos em lowercase para evitar duplicatas (ex: "User" e "user")
  - .gitignore atualizado para não versionar dados de usuários
- 21/11/2025: Modal de anúncios ajustado 🎬
  - Anúncio não aparece mais no carregamento inicial da página
  - Sistema só exibe anúncio após o usuário fazer login (para não-admins)
  - Melhor experiência para visitantes não autenticados
- 21/11/2025: Sistema de Administradores implementado 👑
  - Variável de ambiente `ADMIN_USERS` para definir administradores
  - Administradores têm acesso ilimitado sem precisar assistir anúncios
  - Suporta usernames e IDs do Discord
  - Acesso configurado por 1 ano para admins
  - Log no console quando admin é detectado
- 19/11/2025: Preparado para deploy na VertraCloud 🚀
  - README-DEPLOY.md criado com guia completo
  - .env.example atualizado com PORT e configurações
  - package.json atualizado com "engines" Node.js >= 18.x
  - Documentação de deploy adicionada
- 19/11/2025: Sistema de Anúncios Recompensados implementado 🎬
  - Modal de anúncios com design galáxia
  - Anúncios de 30 segundos desbloqueiam 30 minutos de acesso
  - Timer visual mostrando tempo restante
  - API endpoints para controle de acesso (`/api/access-status`, `/api/grant-access`)
  - Bloqueio de conteúdo até assistir anúncio
  - Preparado para integração com Google AdSense Rewarded Ads
  - CSP atualizado para permitir Google AdSense
- 19/11/2025: Design Galáxia 🌌 e Fonte Gota 💧
  - Fundo escuro espacial com efeito de estrelas animadas
  - Fonte Fredoka (estilo arredondado tipo gota)
  - Cores azuis e roxas vibrantes (#93c5fd, #667eea)
  - Efeitos de brilho e glow nos elementos
  - Logo standalone sem texto
- 19/11/2025: Estrutura do projeto reorganizada em pastas
  - Criada pasta `src/` para código do servidor
  - Criada pasta `public/` para arquivos estáticos (HTML, CSS, imagens)
  - Workflow atualizado para executar `node src/server.js`
  - Caminhos no server.js ajustados para a nova estrutura
  - Servidor rodando em http://0.0.0.0:5000
- 19/11/2025: Estrutura do projeto reorganizada
  - Todos os arquivos movidos da pasta emoji-resizer-webzipzipzip/ para a raiz do projeto
- 19/11/2025: Barra de progresso implementada
  - Feedback visual durante processamento de múltiplas imagens
  - Mostra porcentagem e contador de imagens processadas
  - Design moderno com gradiente roxo combinando com o tema
- 19/11/2025: Logo minimalista criada
  - Gerada logo profissional com design pixel art
  - Cores roxas combinando com o tema do site
  - Implementada nas páginas de login e principal
- 19/11/2025: Configuração da integração Discord
  - Discord OAuth configurado para login social
  - Funcionando com autenticação do Replit
- 19/11/2025: Implementação de segurança completa
  - Adicionadas medidas de proteção contra hackers
  - Helmet para headers de segurança HTTP
  - Rate limiting em rotas de autenticação
  - Validação rigorosa de inputs do usuário
  - Proteção CSRF e XSS
  - Content Security Policy configurado
  - Cookies seguros com httpOnly e sameSite
  - Criação de .env.example para configuração
- 19/11/2025: Verificação e correção do projeto
  - Instalação do Node.js 20
  - Configuração do workflow para execução automática
  - Correção da documentação (porta 5000 ao invés de 3000)
  - **Implementação de nomes aleatórios**: Os emojis agora recebem nomes embaralhados aleatoriamente a cada upload
  - Adicionada função shuffleArray() para embaralhar nomes
  - Atualizada interface para indicar ordem aleatória
  - Criação de .gitignore para Node.js
  - Criação de documentação do projeto (replit.md)
