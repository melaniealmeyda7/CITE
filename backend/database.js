/**
 * CITE - Módulo de Base de Datos Local
 * Soporte dual: SQLite local (con node:sqlite en Node 24) y respaldo persistente en JSON
 */

const fs = require('node:fs');
const path = require('node:path');
const { hashPassword } = require('./auth');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'cite.sqlite');
const USERS_JSON_PATH = path.join(DATA_DIR, 'users.json');
const TALENTS_JSON_PATH = path.join(DATA_DIR, 'talents.json');
const INTERVIEWS_JSON_PATH = path.join(DATA_DIR, 'interviews.json');

let sqliteDb = null;

// Intentar inicializar SQLite nativo de Node 24
try {
    const { DatabaseSync } = require('node:sqlite');
    sqliteDb = new DatabaseSync(DB_PATH);
    console.log(`[Database] SQLite nativo conectado exitosamente: ${DB_PATH}`);
} catch (e) {
    console.warn(`[Database] SQLite no disponible, usando motor JSON local: ${e.message}`);
}

/* ==========================================================================
   1. Dataset Semilla de Talentos Verificados (Latinoamérica y el Caribe)
   ========================================================================== */
const INITIAL_TALENTS = [
    {
        id: "CITE-VER-9412",
        name: "Mateo Silva Arboleda",
        role: "Senior Cloud & DevOps Engineer",
        category: "software",
        country: "Colombia",
        city: "Medellín",
        flag: "🇨🇴",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        badgeLevel: "Platino",
        score: 98,
        ethicalScore: "100% Auditado",
        availability: "Inmediata",
        remote: true,
        experience: "6+ años de experiencia",
        english: "C1 Profesional Avanzado",
        skills: ["AWS Cloud", "Kubernetes", "Terraform", "CI/CD", "Docker", "Python"],
        bio: "Ingeniero especializado en arquitectura escalable y migración a la nube para fintech y banca. Graduado con honores de la aceleración técnica CITE.",
        certifications: [
            "Acreditación Técnica CITE Cloud Architecture 2025",
            "Auditoría Ética y Liderazgo Colaborativo CITE",
            "AWS Certified Solutions Architect"
        ],
        auditHash: "0x892a...f941c (Bloque Verificado #48291)",
        status: "aprobado",
        created_at: new Date().toISOString()
    },
    {
        id: "CITE-VER-9428",
        name: "Sofía Morales Guzmán",
        role: "Lead Data Scientist & Generative AI",
        category: "data",
        country: "México",
        city: "Guadalajara",
        flag: "🇲🇽",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        badgeLevel: "Platino",
        score: 99,
        ethicalScore: "100% Auditado",
        availability: "2 Semanas",
        remote: true,
        experience: "5+ años de experiencia",
        english: "C1 Profesional Avanzado",
        skills: ["Python", "PyTorch", "LLMs & RAG", "SQL Avanzado", "Power BI", "Data Governance"],
        bio: "Especialista en modelos predictivos y soluciones de inteligencia artificial aplicada a operaciones de impacto comercial y social.",
        certifications: [
            "Certificación CITE Especialista en IA y Datos",
            "Validación de Idoneidad Ética y Manejo de Datos Sensibles",
            "TensorFlow Developer Certified"
        ],
        auditHash: "0x3e1b...d928a (Bloque Verificado #48305)",
        status: "aprobado",
        created_at: new Date().toISOString()
    },
    {
        id: "CITE-VER-9435",
        name: "Camila Ramos Velarde",
        role: "Full Stack Software Engineer",
        category: "software",
        country: "Perú",
        city: "Lima",
        flag: "🇵🇪",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        badgeLevel: "Oro",
        score: 96,
        ethicalScore: "100% Auditado",
        availability: "Inmediata",
        remote: true,
        experience: "4+ años de experiencia",
        english: "B2 Profesional Intermedio",
        skills: ["React.js", "Node.js", "TypeScript", "PostgreSQL", "Next.js", "Tailwind CSS"],
        bio: "Desarrolladora orientada a productos digitales centrados en el usuario, interfaces de alto rendimiento y APIs resilientes.",
        certifications: [
            "Insignia CITE Desarrollo Web Full Stack de Alto Nivel",
            "Certificado de Integridad Laboral CITE 2025"
        ],
        auditHash: "0x77c2...b943f (Bloque Verificado #48312)",
        status: "aprobado",
        created_at: new Date().toISOString()
    },
    {
        id: "CITE-VER-9441",
        name: "Lucas Fernández Rossi",
        role: "DevSecOps & Ciberseguridad",
        category: "cyber",
        country: "Argentina",
        city: "Córdoba",
        flag: "🇦🇷",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        badgeLevel: "Platino",
        score: 97,
        ethicalScore: "100% Auditado",
        availability: "Inmediata",
        remote: true,
        experience: "5+ años de experiencia",
        english: "B2 Avanzado",
        skills: ["Seguridad Ofensiva", "OWASP Top 10", "Linux Hardening", "Go", "Docker", "SOC Analysis"],
        bio: "Especialista en aseguramiento de infraestructura crítica y mitigación de vulnerabilidades en arquitecturas distribuidas.",
        certifications: [
            "CITE Cyber Defense & Threat Intelligence Specialist",
            "Aprobación de Antecedentes y Ética Criptográfica CITE"
        ],
        auditHash: "0x11fa...e944d (Bloque Verificado #48324)",
        status: "aprobado",
        created_at: new Date().toISOString()
    },
    {
        id: "CITE-VER-9456",
        name: "Valentina Gómez Valdés",
        role: "Agile Project Manager & Digital Transformation",
        category: "negocios",
        country: "Chile",
        city: "Santiago",
        flag: "🇨🇱",
        avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
        badgeLevel: "Platino",
        score: 98,
        ethicalScore: "100% Auditado",
        availability: "2 Semanas",
        remote: true,
        experience: "7+ años de experiencia",
        english: "C2 Bilingüe",
        skills: ["Scrum Master (PSM II)", "Jira / Confluence", "Lean Six Sigma", "OKRs", "Liderazgo de Equipos"],
        bio: "Líder de gestión ágil para escuadras multidisciplinarias con enfoque en entrega de valor continuo, métricas de negocio y reducción del 'time-to-market'.",
        certifications: [
            "CITE Executive Agile Leadership & Culture",
            "Certificación de Gestión Ética Organizacional CITE"
        ],
        auditHash: "0x98bb...c945a (Bloque Verificado #48339)",
        status: "aprobado",
        created_at: new Date().toISOString()
    },
    {
        id: "CITE-VER-9462",
        name: "Diego Alvarado Cueva",
        role: "Machine Learning Engineer & MLOps",
        category: "data",
        country: "Ecuador",
        city: "Quito",
        flag: "🇪🇨",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        badgeLevel: "Oro",
        score: 95,
        ethicalScore: "100% Auditado",
        availability: "Inmediata",
        remote: true,
        experience: "3+ años de experiencia",
        english: "B2 Profesional",
        skills: ["Python", "FastAPI", "MLflow", "Scikit-Learn", "Computer Vision", "Docker"],
        bio: "Despliegue y mantenimiento de pipelines de aprendizaje automático en producción para visión por computadora y análisis de documentos.",
        certifications: [
            "CITE Machine Learning Applied Systems 2025",
            "Certificación de Buenas Prácticas Éticas en Algoritmos CITE"
        ],
        auditHash: "0x44ec...a946b (Bloque Verificado #48348)",
        status: "aprobado",
        created_at: new Date().toISOString()
    }
];

/* ==========================================================================
   2. Inicialización de Tablas y Esquemas
   ========================================================================== */
async function initDatabase() {
    // Si SQLite está disponible, crear tablas
    if (sqliteDb) {
        sqliteDb.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                company TEXT,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS talents (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                category TEXT NOT NULL,
                country TEXT NOT NULL,
                city TEXT NOT NULL,
                flag TEXT NOT NULL,
                avatar TEXT NOT NULL,
                badgeLevel TEXT NOT NULL,
                score INTEGER NOT NULL,
                ethicalScore TEXT NOT NULL,
                availability TEXT NOT NULL,
                remote INTEGER NOT NULL,
                experience TEXT NOT NULL,
                english TEXT NOT NULL,
                skills TEXT NOT NULL,
                bio TEXT NOT NULL,
                certifications TEXT NOT NULL,
                auditHash TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS interviews (
                id TEXT PRIMARY KEY,
                talent_id TEXT NOT NULL,
                talent_name TEXT NOT NULL,
                recruiter_name TEXT NOT NULL,
                recruiter_email TEXT NOT NULL,
                job_proposal TEXT NOT NULL,
                notes TEXT,
                created_at TEXT NOT NULL
            );
        `);
    }

    // Inicializar o sincronizar con JSON
    if (!fs.existsSync(USERS_JSON_PATH)) {
        fs.writeFileSync(USERS_JSON_PATH, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(TALENTS_JSON_PATH)) {
        fs.writeFileSync(TALENTS_JSON_PATH, JSON.stringify(INITIAL_TALENTS, null, 2));
    }
    if (!fs.existsSync(INTERVIEWS_JSON_PATH)) {
        fs.writeFileSync(INTERVIEWS_JSON_PATH, JSON.stringify([], null, 2));
    }

    // Sembrar usuarios iniciales con contraseñas encriptadas con bcrypt
    await seedDefaultUsers();
    await seedDefaultTalents();
}

/**
 * Inserta los usuarios por defecto con contraseñas seguras hasheadas
 */
async function seedDefaultUsers() {
    const defaultUsers = [
        {
            id: "usr-admin-01",
            email: "admin@cite.org",
            password: "Admin123!",
            name: "Directora General de Auditoría CITE",
            role: "auditor",
            company: "Comité Evaluador CITE Internacional"
        },
        {
            id: "usr-empresa-01",
            email: "reclutador@empresa.com",
            password: "Empresa123!",
            name: "Tech Talent Partner",
            role: "empresa",
            company: "Alianza Corporativa CITE"
        },
        {
            id: "usr-talento-01",
            email: "talento@cite.org",
            password: "Talento123!",
            name: "Mateo Silva Arboleda",
            role: "talento",
            company: "Red de Talento Verificado"
        }
    ];

    for (const u of defaultUsers) {
        const existing = await findUserByEmail(u.email);
        if (!existing) {
            const password_hash = await hashPassword(u.password);
            await createUser({
                id: u.id,
                email: u.email,
                password_hash,
                name: u.name,
                role: u.role,
                company: u.company,
                created_at: new Date().toISOString()
            });
            console.log(`[Database] Usuario inicial creado: ${u.email} (${u.role}) con contraseña encriptada.`);
        }
    }
}

/**
 * Inserta los talentos iniciales en SQLite si está vacío
 */
async function seedDefaultTalents() {
    const currentTalents = await getAllTalents();
    if (currentTalents.length === 0) {
        for (const t of INITIAL_TALENTS) {
            await createTalent(t);
        }
        console.log(`[Database] ${INITIAL_TALENTS.length} talentos verificados sembrados en la base de datos.`);
    }
}

/* ==========================================================================
   3. Métodos CRUD para Usuarios
   ========================================================================== */

async function findUserByEmail(email) {
    const cleanEmail = email.trim().toLowerCase();

    if (sqliteDb) {
        const stmt = sqliteDb.prepare('SELECT * FROM users WHERE LOWER(email) = ?');
        const user = stmt.get(cleanEmail);
        if (user) return user;
    }

    // Fallback JSON
    const users = JSON.parse(fs.readFileSync(USERS_JSON_PATH, 'utf-8'));
    return users.find(u => u.email.toLowerCase() === cleanEmail) || null;
}

async function findUserById(id) {
    if (sqliteDb) {
        const stmt = sqliteDb.prepare('SELECT * FROM users WHERE id = ?');
        const user = stmt.get(id);
        if (user) return user;
    }

    const users = JSON.parse(fs.readFileSync(USERS_JSON_PATH, 'utf-8'));
    return users.find(u => u.id === id) || null;
}

async function createUser(userData) {
    const user = {
        id: userData.id || `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        email: userData.email.trim().toLowerCase(),
        password_hash: userData.password_hash,
        name: userData.name,
        role: userData.role || 'empresa',
        company: userData.company || '',
        created_at: userData.created_at || new Date().toISOString()
    };

    if (sqliteDb) {
        const stmt = sqliteDb.prepare(`
            INSERT INTO users (id, email, password_hash, name, role, company, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(user.id, user.email, user.password_hash, user.name, user.role, user.company, user.created_at);
    }

    // Mantener sincronizado el JSON
    const users = JSON.parse(fs.readFileSync(USERS_JSON_PATH, 'utf-8'));
    users.push(user);
    fs.writeFileSync(USERS_JSON_PATH, JSON.stringify(users, null, 2));

    return user;
}

/* ==========================================================================
   4. Métodos CRUD para Talentos
   ========================================================================== */

async function getAllTalents() {
    if (sqliteDb) {
        const stmt = sqliteDb.prepare('SELECT * FROM talents ORDER BY score DESC');
        const rows = stmt.all();
        if (rows.length > 0) {
            return rows.map(r => ({
                ...r,
                remote: Boolean(r.remote),
                skills: typeof r.skills === 'string' ? JSON.parse(r.skills) : r.skills,
                certifications: typeof r.certifications === 'string' ? JSON.parse(r.certifications) : r.certifications
            }));
        }
    }

    // Fallback JSON
    if (fs.existsSync(TALENTS_JSON_PATH)) {
        return JSON.parse(fs.readFileSync(TALENTS_JSON_PATH, 'utf-8'));
    }
    return [];
}

async function getTalentById(id) {
    if (sqliteDb) {
        const stmt = sqliteDb.prepare('SELECT * FROM talents WHERE id = ?');
        const r = stmt.get(id);
        if (r) {
            return {
                ...r,
                remote: Boolean(r.remote),
                skills: typeof r.skills === 'string' ? JSON.parse(r.skills) : r.skills,
                certifications: typeof r.certifications === 'string' ? JSON.parse(r.certifications) : r.certifications
            };
        }
    }

    const talents = await getAllTalents();
    return talents.find(t => t.id === id) || null;
}

async function createTalent(data) {
    const talent = {
        id: data.id || `CITE-VER-${Math.floor(9000 + Math.random() * 999)}`,
        name: data.name,
        role: data.role,
        category: data.category || 'software',
        country: data.country || 'Latinoamérica',
        city: data.city || 'Remoto',
        flag: data.flag || '🌎',
        avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        badgeLevel: data.badgeLevel || 'Oro',
        score: parseInt(data.score, 10) || 95,
        ethicalScore: data.ethicalScore || '100% Auditado',
        availability: data.availability || 'Inmediata',
        remote: data.remote !== undefined ? Boolean(data.remote) : true,
        experience: data.experience || '3+ años',
        english: data.english || 'B2 Profesional',
        skills: Array.isArray(data.skills) ? data.skills : (data.skills ? data.skills.split(',').map(s => s.trim()) : []),
        bio: data.bio || '',
        certifications: Array.isArray(data.certifications) ? data.certifications : ['Certificación CITE Oficial 2026'],
        auditHash: data.auditHash || `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)} (Bloque Verificado)`,
        status: data.status || 'aprobado',
        created_at: new Date().toISOString()
    };

    if (sqliteDb) {
        const stmt = sqliteDb.prepare(`
            INSERT INTO talents (
                id, name, role, category, country, city, flag, avatar, badgeLevel,
                score, ethicalScore, availability, remote, experience, english,
                skills, bio, certifications, auditHash, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
            talent.id, talent.name, talent.role, talent.category, talent.country, talent.city,
            talent.flag, talent.avatar, talent.badgeLevel, talent.score, talent.ethicalScore,
            talent.availability, talent.remote ? 1 : 0, talent.experience, talent.english,
            JSON.stringify(talent.skills), talent.bio, JSON.stringify(talent.certifications),
            talent.auditHash, talent.status, talent.created_at
        );
    }

    // Sincronizar JSON
    const talents = JSON.parse(fs.readFileSync(TALENTS_JSON_PATH, 'utf-8'));
    talents.unshift(talent);
    fs.writeFileSync(TALENTS_JSON_PATH, JSON.stringify(talents, null, 2));

    return talent;
}

async function updateTalent(id, updateData) {
    const existing = await getTalentById(id);
    if (!existing) return null;

    const updated = {
        ...existing,
        ...updateData,
        skills: Array.isArray(updateData.skills) ? updateData.skills : (updateData.skills !== undefined ? (typeof updateData.skills === 'string' ? JSON.parse(updateData.skills) : updateData.skills) : existing.skills),
        certifications: Array.isArray(updateData.certifications) ? updateData.certifications : (updateData.certifications !== undefined ? (typeof updateData.certifications === 'string' ? JSON.parse(updateData.certifications) : updateData.certifications) : existing.certifications)
    };

    if (sqliteDb) {
        const stmt = sqliteDb.prepare(`
            UPDATE talents SET
                name = ?, role = ?, category = ?, country = ?, city = ?, flag = ?,
                avatar = ?, badgeLevel = ?, score = ?, ethicalScore = ?, availability = ?,
                remote = ?, experience = ?, english = ?, skills = ?, bio = ?,
                certifications = ?, status = ?
            WHERE id = ?
        `);
        stmt.run(
            updated.name, updated.role, updated.category, updated.country, updated.city,
            updated.flag, updated.avatar, updated.badgeLevel, updated.score, updated.ethicalScore,
            updated.availability, updated.remote ? 1 : 0, updated.experience, updated.english,
            JSON.stringify(updated.skills), updated.bio, JSON.stringify(updated.certifications),
            updated.status, id
        );
    }

    // Sincronizar JSON
    const talents = JSON.parse(fs.readFileSync(TALENTS_JSON_PATH, 'utf-8'));
    const idx = talents.findIndex(t => t.id === id);
    if (idx !== -1) {
        talents[idx] = updated;
        fs.writeFileSync(TALENTS_JSON_PATH, JSON.stringify(talents, null, 2));
    }

    return updated;
}

async function deleteTalent(id) {
    if (sqliteDb) {
        const stmt = sqliteDb.prepare('DELETE FROM talents WHERE id = ?');
        stmt.run(id);
    }

    const talents = JSON.parse(fs.readFileSync(TALENTS_JSON_PATH, 'utf-8'));
    const filtered = talents.filter(t => t.id !== id);
    fs.writeFileSync(TALENTS_JSON_PATH, JSON.stringify(filtered, null, 2));
    return true;
}

/* ==========================================================================
   5. Métodos para Solicitudes de Entrevistas
   ========================================================================== */
async function createInterview(data) {
    const interview = {
        id: `int-${Date.now()}`,
        talent_id: data.talent_id,
        talent_name: data.talent_name,
        recruiter_name: data.recruiter_name,
        recruiter_email: data.recruiter_email,
        job_proposal: data.job_proposal,
        notes: data.notes || '',
        created_at: new Date().toISOString()
    };

    if (sqliteDb) {
        const stmt = sqliteDb.prepare(`
            INSERT INTO interviews (id, talent_id, talent_name, recruiter_name, recruiter_email, job_proposal, notes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
            interview.id, interview.talent_id, interview.talent_name,
            interview.recruiter_name, interview.recruiter_email,
            interview.job_proposal, interview.notes, interview.created_at
        );
    }

    const list = JSON.parse(fs.readFileSync(INTERVIEWS_JSON_PATH, 'utf-8'));
    list.unshift(interview);
    fs.writeFileSync(INTERVIEWS_JSON_PATH, JSON.stringify(list, null, 2));

    return interview;
}

async function getAllInterviews() {
    if (sqliteDb) {
        const stmt = sqliteDb.prepare('SELECT * FROM interviews ORDER BY created_at DESC');
        return stmt.all();
    }
    return JSON.parse(fs.readFileSync(INTERVIEWS_JSON_PATH, 'utf-8'));
}

module.exports = {
    initDatabase,
    findUserByEmail,
    findUserById,
    createUser,
    getAllTalents,
    getTalentById,
    createTalent,
    updateTalent,
    deleteTalent,
    createInterview,
    getAllInterviews
};
