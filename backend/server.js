/**
 * CITE - Servidor Backend REST con Autenticación JWT y Base de Datos Local
 * Soporte dual: Express (si está instalado) o servidor nativo Node.js http (cero dependencias externas requeridas)
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { initDatabase, findUserByEmail, createUser, getAllTalents, getTalentById, createTalent, updateTalent, deleteTalent, createInterview, getAllInterviews } = require('./database');
const { hashPassword, comparePassword, generateToken, verifyToken } = require('./auth');

const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..');

/* ==========================================================================
   1. Utilidades HTTP para el Servidor Nativo
   ========================================================================== */

function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, statusCode, data) {
    setCorsHeaders(res);
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            if (!body) return resolve({});
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(new Error('JSON malformado en la petición'));
            }
        });
        req.on('error', reject);
    });
}

function extractUserFromAuthHeader(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.substring(7);
    try {
        return verifyToken(token);
    } catch (e) {
        return null;
    }
}

/* ==========================================================================
   2. Servidor de Archivos Estáticos (Frontend)
   ========================================================================== */
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function serveStatic(req, res, pathname) {
    let filePath = path.join(FRONTEND_DIR, pathname === '/' ? 'index.html' : pathname);

    if (!filePath.startsWith(FRONTEND_DIR)) {
        res.writeHead(403);
        return res.end('Acceso Prohibido');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Archivo no encontrado');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    setCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
}

/* ==========================================================================
   3. Router Principal de la API REST
   ========================================================================== */
async function handleApiRequest(req, res, pathname) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    // --- AUTENTICACIÓN ---
    // POST /api/auth/register
    if (pathname === '/api/auth/register' && req.method === 'POST') {
        try {
            const body = await parseJsonBody(req);
            const { email, password, name, role, company } = body;

            if (!email || !password || !name) {
                return sendJson(res, 400, { ok: false, message: 'Email, contraseña y nombre son campos obligatorios.' });
            }

            const existing = await findUserByEmail(email);
            if (existing) {
                return sendJson(res, 409, { ok: false, message: 'El correo ya se encuentra registrado.' });
            }

            const password_hash = await hashPassword(password);
            const user = await createUser({
                email,
                password_hash,
                name,
                role: role || 'empresa',
                company: company || ''
            });

            const token = generateToken(user);
            return sendJson(res, 201, {
                ok: true,
                message: 'Usuario registrado exitosamente',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    company: user.company
                }
            });
        } catch (err) {
            return sendJson(res, 500, { ok: false, message: 'Error interno en el registro', error: err.message });
        }
    }

    // POST /api/auth/login
    if (pathname === '/api/auth/login' && req.method === 'POST') {
        try {
            const body = await parseJsonBody(req);
            const { email, password } = body;

            if (!email || !password) {
                return sendJson(res, 400, { ok: false, message: 'Email y contraseña son obligatorios.' });
            }

            const user = await findUserByEmail(email);
            if (!user) {
                return sendJson(res, 401, { ok: false, message: 'Credenciales inválidas: correo no registrado.' });
            }

            const validPassword = await comparePassword(password, user.password_hash);
            if (!validPassword) {
                return sendJson(res, 401, { ok: false, message: 'Credenciales inválidas: contraseña incorrecta.' });
            }

            const token = generateToken(user);
            return sendJson(res, 200, {
                ok: true,
                message: 'Inicio de sesión exitoso',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    company: user.company
                }
            });
        } catch (err) {
            return sendJson(res, 500, { ok: false, message: 'Error interno en login', error: err.message });
        }
    }

    // GET /api/auth/me (Requiere token)
    if (pathname === '/api/auth/me' && req.method === 'GET') {
        const user = extractUserFromAuthHeader(req);
        if (!user) {
            return sendJson(res, 401, { ok: false, message: 'Token no válido o no proporcionado.' });
        }
        return sendJson(res, 200, { ok: true, user });
    }

    // --- PROTECCIÓN DE RUTAS DE TALENTOS (RBAC) ---
    // Toda petición a /api/talents requiere autenticación previa
    const authenticatedUser = extractUserFromAuthHeader(req);

    // GET /api/talents (Todos los roles autenticados)
    if (pathname === '/api/talents' && req.method === 'GET') {
        if (!authenticatedUser) {
            return sendJson(res, 401, { ok: false, message: 'Acceso no autorizado: Inicia sesión para ver los talentos verificados.' });
        }
        const talents = await getAllTalents();
        return sendJson(res, 200, {
            ok: true,
            count: talents.length,
            talents,
            userRole: authenticatedUser.role
        });
    }

    // GET /api/talents/:id
    if (pathname.startsWith('/api/talents/') && req.method === 'GET') {
        if (!authenticatedUser) {
            return sendJson(res, 401, { ok: false, message: 'Acceso no autorizado.' });
        }
        const id = decodeURIComponent(pathname.replace('/api/talents/', ''));
        const talent = await getTalentById(id);
        if (!talent) {
            return sendJson(res, 404, { ok: false, message: 'Talento no encontrado.' });
        }
        return sendJson(res, 200, { ok: true, talent });
    }

    // POST /api/talents (SOLO AUDITOR / ADMIN)
    if (pathname === '/api/talents' && req.method === 'POST') {
        if (!authenticatedUser) {
            return sendJson(res, 401, { ok: false, message: 'Acceso no autorizado.' });
        }
        if (authenticatedUser.role !== 'auditor') {
            return sendJson(res, 403, {
                ok: false,
                message: 'Acceso denegado: Solo los usuarios con rol Auditor/Admin pueden registrar nuevos talentos verificados.'
            });
        }

        try {
            const body = await parseJsonBody(req);
            if (!body.name || !body.role) {
                return sendJson(res, 400, { ok: false, message: 'Nombre y Rol profesional son requeridos.' });
            }

            const newTalent = await createTalent(body);
            return sendJson(res, 201, {
                ok: true,
                message: 'Talento registrado y acreditado en la base de datos oficial.',
                talent: newTalent
            });
        } catch (err) {
            return sendJson(res, 500, { ok: false, message: 'Error creando talento', error: err.message });
        }
    }

    // PUT /api/talents/:id (AUDITOR para todo, TALENTO para su propio perfil)
    if (pathname.startsWith('/api/talents/') && req.method === 'PUT') {
        if (!authenticatedUser) {
            return sendJson(res, 401, { ok: false, message: 'Acceso no autorizado.' });
        }

        const id = decodeURIComponent(pathname.replace('/api/talents/', ''));
        const existing = await getTalentById(id);
        if (!existing) {
            return sendJson(res, 404, { ok: false, message: 'Talento no encontrado.' });
        }

        const isAuditor = authenticatedUser.role === 'auditor';
        const isSelfTalento = authenticatedUser.role === 'talento';

        if (!isAuditor && !isSelfTalento) {
            return sendJson(res, 403, {
                ok: false,
                message: 'Acceso denegado: Las empresas no pueden modificar registros del directorio.'
            });
        }

        try {
            const body = await parseJsonBody(req);
            let updatePayload = {};

            if (isAuditor) {
                // Auditor puede modificar todo (puntajes, status, badges, etc.)
                updatePayload = body;
            } else if (isSelfTalento) {
                // Talento solo puede actualizar sus datos de contacto/disponibilidad y bio
                updatePayload = {
                    bio: body.bio !== undefined ? body.bio : existing.bio,
                    availability: body.availability !== undefined ? body.availability : existing.availability,
                    skills: body.skills !== undefined ? body.skills : existing.skills,
                    city: body.city !== undefined ? body.city : existing.city
                };
            }

            const updated = await updateTalent(id, updatePayload);
            return sendJson(res, 200, {
                ok: true,
                message: 'Expediente actualizado exitosamente.',
                talent: updated
            });
        } catch (err) {
            return sendJson(res, 500, { ok: false, message: 'Error al actualizar talento', error: err.message });
        }
    }

    // DELETE /api/talents/:id (SOLO AUDITOR / ADMIN)
    if (pathname.startsWith('/api/talents/') && req.method === 'DELETE') {
        if (!authenticatedUser) {
            return sendJson(res, 401, { ok: false, message: 'Acceso no autorizado.' });
        }
        if (authenticatedUser.role !== 'auditor') {
            return sendJson(res, 403, {
                ok: false,
                message: 'Acceso denegado: Solo el Auditor/Admin puede eliminar expedientes.'
            });
        }

        const id = decodeURIComponent(pathname.replace('/api/talents/', ''));
        await deleteTalent(id);
        return sendJson(res, 200, { ok: true, message: `Talento ${id} eliminado del directorio oficial.` });
    }

    // POST /api/interviews (EMPRESA o AUDITOR)
    if (pathname === '/api/interviews' && req.method === 'POST') {
        if (!authenticatedUser) {
            return sendJson(res, 401, { ok: false, message: 'Acceso no autorizado.' });
        }

        try {
            const body = await parseJsonBody(req);
            const interview = await createInterview({
                ...body,
                recruiter_email: authenticatedUser.email,
                recruiter_name: body.recruiter_name || authenticatedUser.name
            });
            return sendJson(res, 201, {
                ok: true,
                message: 'Solicitud de entrevista registrada correctamente.',
                interview
            });
        } catch (err) {
            return sendJson(res, 500, { ok: false, message: 'Error agendando entrevista', error: err.message });
        }
    }

    // GET /api/interviews (AUDITOR o EMPRESA)
    if (pathname === '/api/interviews' && req.method === 'GET') {
        if (!authenticatedUser) {
            return sendJson(res, 401, { ok: false, message: 'Acceso no autorizado.' });
        }
        const interviews = await getAllInterviews();
        return sendJson(res, 200, { ok: true, interviews });
    }

    // Ruta no encontrada en API
    return sendJson(res, 404, { ok: false, message: `Endpoint no encontrado: ${req.method} ${pathname}` });
}

/* ==========================================================================
   4. Inicio del Servidor
   ========================================================================== */
async function startServer() {
    console.log('[Server] Inicializando base de datos local...');
    await initDatabase();

    const server = http.createServer(async (req, res) => {
        try {
            const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
            const pathname = parsedUrl.pathname;

            if (pathname.startsWith('/api/')) {
                await handleApiRequest(req, res, pathname);
            } else {
                serveStatic(req, res, pathname);
            }
        } catch (err) {
            console.error('[Server Error]', err);
            sendJson(res, 500, { ok: false, message: 'Error interno del servidor', error: err.message });
        }
    });

    server.listen(PORT, () => {
        console.log('================================================================');
        console.log(`🚀 SERVIDOR CITE BACKEND ACTIVO EN: http://localhost:${PORT}`);
        console.log('================================================================');
        console.log(`📁 Directorio Frontend servido: ${FRONTEND_DIR}`);
        console.log(`🛡️ Endpoints de Autenticación:`);
        console.log(`   POST http://localhost:${PORT}/api/auth/register`);
        console.log(`   POST http://localhost:${PORT}/api/auth/login`);
        console.log(`   GET  http://localhost:${PORT}/api/auth/me`);
        console.log(`📊 Endpoints de Talentos (RBAC):`);
        console.log(`   GET    http://localhost:${PORT}/api/talents (Todos autenticados)`);
        console.log(`   POST   http://localhost:${PORT}/api/talents (Solo Auditor)`);
        console.log(`   PUT    http://localhost:${PORT}/api/talents/:id (Auditor / Talento)`);
        console.log(`   DELETE http://localhost:${PORT}/api/talents/:id (Solo Auditor)`);
        console.log('================================================================');
        console.log('👥 Credenciales Semilla en Base de Datos:');
        console.log('   Auditor:   admin@cite.org        / Admin123!');
        console.log('   Empresa:   reclutador@empresa.com / Empresa123!');
        console.log('   Talento:   talento@cite.org       / Talento123!');
        console.log('================================================================');
    });
}

startServer().catch(err => {
    console.error('Fallo fatal al iniciar el servidor CITE:', err);
    process.exit(1);
});
