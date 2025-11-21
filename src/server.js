const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://pagead2.googlesyndication.com", "https://googleads.g.doubleclick.net", "https://www.googletagservices.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https://discord.com", "https://github.com", "https://pagead2.googlesyndication.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'", "https://googleads.g.doubleclick.net", "https://tpc.googlesyndication.com"],
            childSrc: ["'self'", "https://googleads.g.doubleclick.net"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    noSniff: true,
    xssFilter: true,
    hidePoweredBy: true
}));

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    standardHeaders: true,
    legacyHeaders: false,
});

const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: 'Muitas requisições. Tente novamente em breve.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(generalLimiter);
app.use(express.json({ limit: '10mb' }));

const sessionSecret = process.env.SESSION_SECRET || require('crypto').randomBytes(32).toString('hex');

const sessionStore = process.env.NODE_ENV === 'development' 
    ? undefined
    : new FileStore({
        path: './sessions',
        ttl: 7 * 24 * 60 * 60,
        retries: 0
    });

app.use(session({
    store: sessionStore,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../public')));

// Serialização do usuário para sessão
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Configuração Discord OAuth
if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
    const callbackURL = process.env.CALLBACK_URL 
        ? `${process.env.CALLBACK_URL}/auth/discord/callback`
        : 'http://localhost:5000/auth/discord/callback';

    passport.use(new DiscordStrategy({
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: callbackURL,
        scope: ['identify', 'email']
    }, (accessToken, refreshToken, profile, done) => {
        const user = {
            id: profile.id,
            username: profile.username,
            discriminator: profile.discriminator,
            avatar: profile.avatar 
                ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` 
                : null,
            email: profile.email,
            provider: 'discord'
        };
        return done(null, user);
    }));
} else {
    console.warn('⚠️  Discord OAuth não configurado. Defina DISCORD_CLIENT_ID e DISCORD_CLIENT_SECRET');
}

// Configuração GitHub OAuth
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    const callbackURL = process.env.CALLBACK_URL 
        ? `${process.env.CALLBACK_URL}/auth/github/callback`
        : 'http://localhost:5000/auth/github/callback';

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: callbackURL,
        scope: ['user:email']
    }, (accessToken, refreshToken, profile, done) => {
        const user = {
            id: profile.id,
            username: profile.username,
            name: profile.displayName || profile.username,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
            provider: 'github'
        };
        return done(null, user);
    }));
} else {
    console.warn('⚠️  GitHub OAuth não configurado. Defina GITHUB_CLIENT_ID e GITHUB_CLIENT_SECRET');
}

// Middleware para detectar bots do Google
function isGoogleBot(req) {
    const userAgent = req.headers['user-agent'] || '';
    const googleBotPatterns = [
        /googlebot/i,
        /adsbot-google/i,
        /mediapartners-google/i,
        /apis-google/i,
        /google-adwords/i,
        /google page speed/i,
        /feedfetcher-google/i
    ];
    return googleBotPatterns.some(pattern => pattern.test(userAgent));
}

function isAuthenticated(req, res, next) {
    if (isGoogleBot(req)) {
        req.session.user = {
            id: 'googlebot',
            username: 'GoogleBot',
            provider: 'bot'
        };
        req.session.accessExpiry = Date.now() + (365 * 24 * 60 * 60 * 1000);
        return next();
    }
    
    if (req.isAuthenticated() || req.session.user) {
        return next();
    }
    res.redirect('/login');
}

// Lista de administradores
const ADMIN_USERS = (process.env.ADMIN_USERS || '').split(',').map(u => u.trim()).filter(Boolean);

function isAdmin(user) {
    if (!user) return false;
    return ADMIN_USERS.includes(user.username) || ADMIN_USERS.includes(user.id);
}

// Rotas
app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/login', (req, res) => {
    if (req.isAuthenticated() || req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

// Discord OAuth
app.get('/auth/discord', loginLimiter, passport.authenticate('discord'));

app.get('/auth/discord/callback', 
    passport.authenticate('discord', { failureRedirect: '/login?error=auth_failed' }),
    (req, res) => {
        req.session.user = req.user;
        
        if (isAdmin(req.user)) {
            req.session.accessExpiry = Date.now() + (365 * 24 * 60 * 60 * 1000);
            console.log(`🔑 Admin detectado: ${req.user.username} - Acesso ilimitado concedido`);
        }
        
        console.log(`✅ Login via Discord: ${req.user.username}`);
        res.redirect('/');
    }
);

// GitHub OAuth
app.get('/auth/github', loginLimiter, passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login?error=auth_failed' }),
    (req, res) => {
        req.session.user = req.user;
        
        if (isAdmin(req.user)) {
            req.session.accessExpiry = Date.now() + (365 * 24 * 60 * 60 * 1000);
            console.log(`🔑 Admin detectado: ${req.user.username} - Acesso ilimitado concedido`);
        }
        
        console.log(`✅ Login via GitHub: ${req.user.username}`);
        res.redirect('/');
    }
);

// API Routes
app.get('/api/user', (req, res) => {
    if (req.isAuthenticated() || req.session.user) {
        res.json(req.session.user || req.user);
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: 'not-used' });
});

app.get('/api/access-status', (req, res) => {
    if (!req.isAuthenticated() && !req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const now = Date.now();
    const accessExpiry = req.session.accessExpiry || 0;
    const hasAccess = now < accessExpiry;
    const remainingTime = hasAccess ? Math.floor((accessExpiry - now) / 1000) : 0;

    res.json({
        hasAccess,
        remainingTime,
        expiryTime: accessExpiry
    });
});

app.post('/api/grant-access', (req, res) => {
    if (!req.isAuthenticated() && !req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const accessDuration = 30 * 60 * 1000;
    req.session.accessExpiry = Date.now() + accessDuration;

    res.json({
        success: true,
        accessGranted: true,
        expiryTime: req.session.accessExpiry,
        duration: accessDuration
    });
});

app.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        req.session.destroy(() => {
            res.redirect('/login');
        });
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Emoji Size rodando em http://0.0.0.0:${PORT}`);
    console.log(`🔐 Sistema de autenticação OAuth ativo`);
    
    if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
        console.warn('⚠️  Configure DISCORD_CLIENT_ID e DISCORD_CLIENT_SECRET');
    }
    
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        console.warn('⚠️  Configure GITHUB_CLIENT_ID e GITHUB_CLIENT_SECRET');
    }
    
    if (!process.env.SESSION_SECRET) {
        console.warn('⚠️  Usando SESSION_SECRET aleatório. Configure para produção!');
    }
});
