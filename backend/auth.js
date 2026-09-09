/**
 * CITE - Módulo de Autenticación y Autorización (JWT & Bcrypt)
 */

const crypto = require('node:crypto');

let bcrypt;
try {
    bcrypt = require('bcryptjs');
} catch (e) {
    bcrypt = null;
}

let jwt;
try {
    jwt = require('jsonwebtoken');
} catch (e) {
    jwt = null;
}

const JWT_SECRET = process.env.JWT_SECRET || 'cite_super_secure_jwt_secret_key_2026_latam_talento_verificado';
const JWT_EXPIRES_IN = '24h';

/* ==========================================================================
   1. Encriptación y Verificación de Contraseñas (Bcrypt con fallback Crypto)
   ========================================================================== */

/**
 * Hashea una contraseña usando bcrypt (o scrypt si bcryptjs no está disponible)
 */
async function hashPassword(password) {
    if (bcrypt) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    // Fallback nativo con crypto de Node.js (PBKDF2/scrypt seguro con sal)
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString('hex');
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) return reject(err);
            resolve(`scrypt:${salt}:${derivedKey.toString('hex')}`);
        });
    });
}

/**
 * Compara una contraseña en texto plano contra el hash almacenado
 */
async function comparePassword(password, hash) {
    if (!hash || !password) return false;

    if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
        if (bcrypt) {
            return await bcrypt.compare(password, hash);
        }
        // Si no está bcryptjs, no podemos verificar un hash bcrypt nativo directamente
        console.warn('Advertencia: hash bcrypt detectado sin módulo bcryptjs instalado.');
        return false;
    }

    if (hash.startsWith('scrypt:')) {
        return new Promise((resolve) => {
            const [, salt, originalKey] = hash.split(':');
            crypto.scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) return resolve(false);
                resolve(crypto.timingSafeEqual(Buffer.from(originalKey, 'hex'), derivedKey));
            });
        });
    }

    // Comparación simple de desarrollo si viniera en texto plano
    return password === hash;
}

/* ==========================================================================
   2. Generación y Validación de Tokens JWT
   ========================================================================== */

/**
 * Genera un token JWT firmado
 */
function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role, // 'empresa' | 'talento' | 'auditor'
        company: user.company || ''
    };

    if (jwt) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    // Fallback nativo: Generador de JWT con HMAC-SHA256
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
    const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
    const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    return `${header}.${body}.${signature}`;
}

/**
 * Verifica y decodifica un token JWT
 */
function verifyToken(token) {
    if (!token) throw new Error('Token no proporcionado');

    if (jwt) {
        return jwt.verify(token, JWT_SECRET);
    }

    // Fallback nativo: Verificación de JWT con HMAC-SHA256
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Formato de token inválido');
    const [header, body, signature] = parts;

    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (expectedSig !== signature) throw new Error('Firma de token inválida');

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('El token ha expirado');
    }
    return payload;
}

/* ==========================================================================
   3. Middlewares de Express para Autenticación y RBAC
   ========================================================================== */

/**
 * Middleware para validar el token JWT en el header Authorization
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
        return res.status(401).json({
            ok: false,
            message: 'Acceso no autorizado: Token JWT requerido.'
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({
            ok: false,
            message: 'Token inválido o expirado.',
            error: err.message
        });
    }
}

/**
 * Middleware para autorizar roles específicos (RBAC)
 * @param  {...string} allowedRoles - Lista de roles permitidos ('empresa', 'talento', 'auditor')
 */
function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ ok: false, message: 'Usuario no autenticado' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                ok: false,
                message: `Acceso denegado: El rol '${req.user.role}' no tiene permisos para esta acción. Se requiere uno de: [${allowedRoles.join(', ')}]`
            });
        }

        next();
    };
}

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
    authenticateToken,
    authorizeRole
};
