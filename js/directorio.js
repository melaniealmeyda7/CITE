/**
 * CITE - Directorio Interactivo de Talentos Verificados
 * JavaScript para filtrado, búsqueda reactiva, expedientes y gestión de sesión
 */

// Dataset Oficial de Talentos Verificados CITE - Latinoamérica y el Caribe
const TALENT_DATA = [
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
        auditHash: "0x892a...f941c (Bloque Verificado #48291)"
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
        auditHash: "0x3e1b...d928a (Bloque Verificado #48305)"
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
        auditHash: "0x77c2...b943f (Bloque Verificado #48312)"
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
        auditHash: "0x11fa...e944d (Bloque Verificado #48324)"
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
        auditHash: "0x98bb...c945a (Bloque Verificado #48339)"
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
        auditHash: "0x44ec...a946b (Bloque Verificado #48348)"
    },
    {
        id: "CITE-VER-9477",
        name: "Andrea Méndez Solano",
        role: "Data Governance & BI Specialist",
        category: "data",
        country: "Costa Rica",
        city: "San José",
        flag: "🇨🇷",
        avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
        badgeLevel: "Oro",
        score: 94,
        ethicalScore: "100% Auditado",
        availability: "Inmediata",
        remote: true,
        experience: "4+ años de experiencia",
        english: "C1 Fluido",
        skills: ["Tableau", "Power BI", "SQL Server", "ETL Pipelines", "Data Modeling", "Calidad de Datos"],
        bio: "Construcción de tableros de control ejecutivos y lineamientos de gobierno de datos para optimizar la toma de decisiones empresariales.",
        certifications: [
            "CITE Business Intelligence & Data Strategy",
            "Certificado de Cumplimiento Ético CITE"
        ],
        auditHash: "0x55aa...f947e (Bloque Verificado #48356)"
    },
    {
        id: "CITE-VER-9483",
        name: "Gabriel Castro Ramos",
        role: "Backend Engineer (Go & Node.js)",
        category: "software",
        country: "Panamá",
        city: "Ciudad de Panamá",
        flag: "🇵🇦",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
        badgeLevel: "Oro",
        score: 96,
        ethicalScore: "100% Auditado",
        availability: "2 Semanas",
        remote: true,
        experience: "4+ años de experiencia",
        english: "B2 Intermedio",
        skills: ["Go / Golang", "Node.js", "Redis", "Kafka", "Microservicios", "PostgreSQL"],
        bio: "Desarrollo de microservicios de alto tráfico y procesamiento concurrente de transacciones con baja latencia.",
        certifications: [
            "CITE Distributed Systems & Backend Engineering",
            "Acreditación de Ética Técnica y Confiabilidad CITE"
        ],
        auditHash: "0x66dd...c9483 (Bloque Verificado #48367)"
    },
    {
        id: "CITE-VER-9491",
        name: "Mariana Ortiz Larrea",
        role: "Especialista en ESG Analytics & Sostenibilidad",
        category: "sostenibilidad",
        country: "Uruguay",
        city: "Montevideo",
        flag: "🇺🇾",
        avatar: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&w=400&q=80",
        badgeLevel: "Platino",
        score: 97,
        ethicalScore: "100% Auditado",
        availability: "Inmediata",
        remote: true,
        experience: "5+ años de experiencia",
        english: "C1 Avanzado",
        skills: ["Métricas ESG", "Reportes ODS", "Python para Análisis Ambiental", "Auditoría de Huella de Carbono", "GRI"],
        bio: "Consultora para empresas que integran sostenibilidad y cumplimiento normativo internacional en sus operaciones financieras y técnicas.",
        certifications: [
            "CITE Master en Sostenibilidad y Triple Impacto Empresarial",
            "Certificación Ética Superior CITE Internacional"
        ],
        auditHash: "0x88ff...9491a (Bloque Verificado #48378)"
    },
    {
        id: "CITE-VER-9504",
        name: "Carlos Peñaloza Mamani",
        role: "Frontend Engineer (React & Vue)",
        category: "software",
        country: "Bolivia",
        city: "La Paz",
        flag: "🇧🇴",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        badgeLevel: "Promesa CITE",
        score: 93,
        ethicalScore: "100% Auditado",
        availability: "Inmediata",
        remote: true,
        experience: "2+ años de experiencia",
        english: "B1 Técnico",
        skills: ["React.js", "Vue.js", "Tailwind CSS", "JavaScript ES6+", "Git", "Figma to Code"],
        bio: "Joven egresado destacado del programa NextGen de CITE. Gran rapidez de aprendizaje y sólida base en buenas prácticas de código limpio.",
        certifications: [
            "CITE NextGen Fellowship - Excelencia Técnica",
            "Compromiso de Integridad y Ética Profesional CITE"
        ],
        auditHash: "0x33ee...9504c (Bloque Verificado #48389)"
    },
    {
        id: "CITE-VER-9519",
        name: "Elena Rivas Tavárez",
        role: "Líder de Operaciones & Talento Humano",
        category: "negocios",
        country: "República Dominicana",
        city: "Santo Domingo",
        flag: "🇩🇴",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        badgeLevel: "Platino",
        score: 98,
        ethicalScore: "100% Auditado",
        availability: "2 Semanas",
        remote: true,
        experience: "6+ años de experiencia",
        english: "C1 Avanzado",
        skills: ["Gestión del Talento", "Evaluación por Competencias", "Diversidad e Inclusión", "Negociación Laboral", "KPIs de Personas"],
        bio: "Especialista en diseño de culturas organizacionales de alto rendimiento, atracción de perfiles técnicos y programas de bienestar.",
        certifications: [
            "CITE People Operations & Global Talent Strategy",
            "Certificación Ética en Selección y Gestión del Talento"
        ],
        auditHash: "0x22aa...9519d (Bloque Verificado #48399)"
    },
    {
        id: "CITE-VER-9527",
        name: "Javier Espinoza Morales",
        role: "Mobile App Developer (Flutter & iOS)",
        category: "software",
        country: "Guatemala",
        city: "Ciudad de Guatemala",
        flag: "🇬🇹",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
        badgeLevel: "Oro",
        score: 95,
        ethicalScore: "100% Auditado",
        availability: "Inmediata",
        remote: true,
        experience: "4+ años de experiencia",
        english: "B2 Profesional",
        skills: ["Flutter", "Dart", "Firebase", "State Management (Bloc)", "REST APIs", "App Store Publishing"],
        bio: "Desarrollo de aplicaciones móviles multiplataforma centradas en fluidez de usuario, modo offline y sincronización en tiempo real.",
        certifications: [
            "CITE Mobile Applications Engineering 2025",
            "Aprobación Ética y Estándares de Seguridad de Usuario CITE"
        ],
        auditHash: "0x77ee...9527e (Bloque Verificado #48410)"
    }
];

// Estado de la aplicación
const AppState = {
    searchQuery: "",
    selectedCategory: "todos",
    selectedCountry: "todos",
    selectedBadge: "todos",
    selectedAvailability: "todos",
    favorites: new Set(),
    currentUser: null
};

// Inicialización cuando carga el DOM
document.addEventListener("DOMContentLoaded", () => {
    checkSession();
    initFilterListeners();
    renderTalents();
    updateMetrics();
    initModalEvents();
});

/* ==========================================================================
   1. Control de Sesión y Autenticación Demo
   ========================================================================== */
function checkSession() {
    let session = localStorage.getItem("cite_auth_user");
    if (session) {
        try {
            AppState.currentUser = JSON.parse(session);
        } catch (e) {
            AppState.currentUser = null;
        }
    }

    // Si no hay sesión activa, configuramos una sesión de demostración por defecto
    if (!AppState.currentUser) {
        AppState.currentUser = {
            name: "Empresa Aliada (Sesión Invitado)",
            email: "reclutador@empresa-aliada.org",
            role: "empresa",
            company: "Red de Empleabilidad CITE"
        };
        localStorage.setItem("cite_auth_user", JSON.stringify(AppState.currentUser));
    }

    renderUserPill();
}

function renderUserPill() {
    const userContainer = document.getElementById("header-user-status");
    if (!userContainer || !AppState.currentUser) return;

    userContainer.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="hidden sm:flex flex-col text-right">
                <span class="text-xs font-bold text-white flex items-center justify-end gap-1.5">
                    ${AppState.currentUser.name}
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                </span>
                <span class="text-[11px] text-cyan-300 font-medium">
                    ${AppState.currentUser.company || "Acceso Verificado CITE"}
                </span>
            </div>
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-md border border-white/20">
                ${AppState.currentUser.name.charAt(0).toUpperCase()}
            </div>
            <button onclick="handleLogout()" title="Cerrar sesión" class="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <i data-lucide="log-out" class="w-4 h-4"></i>
            </button>
        </div>
    `;

    if (window.lucide) {
        lucide.createIcons();
    }
}

window.handleLogout = function() {
    localStorage.removeItem("cite_auth_user");
    showToast("Sesión finalizada. Redirigiendo a la portada...", "info");
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1200);
};

/* ==========================================================================
   2. Filtros y Búsqueda Reactiva
   ========================================================================== */
function initFilterListeners() {
    // Buscador en tiempo real
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            AppState.searchQuery = e.target.value.trim().toLowerCase();
            renderTalents();
        });
    }

    // Botones de Categorías
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryButtons.forEach(b => {
                b.classList.remove("active", "bg-cyan-500", "text-white", "font-bold", "shadow-md");
                b.classList.add("bg-white/5", "text-slate-300", "hover:bg-white/10");
            });
            btn.classList.add("active", "bg-cyan-500", "text-white", "font-bold", "shadow-md");
            btn.classList.remove("bg-white/5", "text-slate-300", "hover:bg-white/10");

            AppState.selectedCategory = btn.getAttribute("data-category");
            renderTalents();
        });
    });

    // Selector de País
    const countrySelect = document.getElementById("filter-country");
    if (countrySelect) {
        countrySelect.addEventListener("change", (e) => {
            AppState.selectedCountry = e.target.value;
            renderTalents();
        });
    }

    // Selector de Nivel de Verificación
    const badgeSelect = document.getElementById("filter-badge");
    if (badgeSelect) {
        badgeSelect.addEventListener("change", (e) => {
            AppState.selectedBadge = e.target.value;
            renderTalents();
        });
    }

    // Selector de Disponibilidad
    const availSelect = document.getElementById("filter-avail");
    if (availSelect) {
        availSelect.addEventListener("change", (e) => {
            AppState.selectedAvailability = e.target.value;
            renderTalents();
        });
    }
}

window.resetFilters = function() {
    AppState.searchQuery = "";
    AppState.selectedCategory = "todos";
    AppState.selectedCountry = "todos";
    AppState.selectedBadge = "todos";
    AppState.selectedAvailability = "todos";

    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";

    const countrySelect = document.getElementById("filter-country");
    if (countrySelect) countrySelect.value = "todos";

    const badgeSelect = document.getElementById("filter-badge");
    if (badgeSelect) badgeSelect.value = "todos";

    const availSelect = document.getElementById("filter-avail");
    if (availSelect) availSelect.value = "todos";

    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach(b => {
        if (b.getAttribute("data-category") === "todos") {
            b.classList.add("active", "bg-cyan-500", "text-white", "font-bold", "shadow-md");
            b.classList.remove("bg-white/5", "text-slate-300");
        } else {
            b.classList.remove("active", "bg-cyan-500", "text-white", "font-bold", "shadow-md");
            b.classList.add("bg-white/5", "text-slate-300");
        }
    });

    renderTalents();
    showToast("Filtros restablecidos", "info");
};

/* ==========================================================================
   3. Renderizado de Tarjetas de Talentos
   ========================================================================== */
function getFilteredTalents() {
    return TALENT_DATA.filter(talent => {
        // Búsqueda por texto (nombre, rol, skills, ID, país)
        if (AppState.searchQuery) {
            const q = AppState.searchQuery;
            const matchesName = talent.name.toLowerCase().includes(q);
            const matchesRole = talent.role.toLowerCase().includes(q);
            const matchesId = talent.id.toLowerCase().includes(q);
            const matchesCountry = talent.country.toLowerCase().includes(q);
            const matchesSkills = talent.skills.some(s => s.toLowerCase().includes(q));

            if (!matchesName && !matchesRole && !matchesId && !matchesCountry && !matchesSkills) {
                return false;
            }
        }

        // Filtro por categoría
        if (AppState.selectedCategory !== "todos" && talent.category !== AppState.selectedCategory) {
            return false;
        }

        // Filtro por país
        if (AppState.selectedCountry !== "todos" && talent.country !== AppState.selectedCountry) {
            return false;
        }

        // Filtro por badge
        if (AppState.selectedBadge !== "todos" && talent.badgeLevel !== AppState.selectedBadge) {
            return false;
        }

        // Filtro por disponibilidad
        if (AppState.selectedAvailability !== "todos" && talent.availability !== AppState.selectedAvailability) {
            return false;
        }

        return true;
    });
}

function renderTalents() {
    const grid = document.getElementById("talents-grid");
    const countDisplay = document.getElementById("results-count");
    const emptyState = document.getElementById("empty-state");

    if (!grid) return;

    const talents = getFilteredTalents();

    if (countDisplay) {
        countDisplay.textContent = `${talents.length} de ${TALENT_DATA.length} talentos verificados`;
    }

    if (talents.length === 0) {
        grid.innerHTML = "";
        if (emptyState) emptyState.classList.remove("hidden");
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    grid.innerHTML = talents.map(t => {
        const isFav = AppState.favorites.has(t.id);
        const badgeColor = t.badgeLevel === "Platino" 
            ? "from-cyan-400 to-blue-500 text-slate-950" 
            : (t.badgeLevel === "Oro" ? "from-amber-300 to-amber-500 text-slate-950" : "from-emerald-400 to-teal-500 text-slate-950");

        return `
            <div class="group relative rounded-2xl bg-gradient-to-b from-[#0f172a]/95 to-[#090e1a]/95 border border-white/10 hover:border-cyan-400/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 backdrop-blur-md">
                
                <!-- Card Header -->
                <div>
                    <div class="flex items-start justify-between gap-3 mb-4">
                        <div class="relative">
                            <img src="${t.avatar}" alt="${t.name}" class="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md group-hover:border-cyan-400 transition-colors">
                            <span class="absolute -bottom-1 -right-1 text-sm bg-slate-900 px-1 rounded shadow" title="${t.country}">${t.flag}</span>
                        </div>
                        <div class="flex flex-col items-end gap-1.5">
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-gradient-to-r ${badgeColor} shadow-sm">
                                ${t.badgeLevel} CITE
                            </span>
                            <span class="text-[10px] font-mono text-cyan-300/80">
                                ${t.id}
                            </span>
                        </div>
                    </div>

                    <!-- Name and Role -->
                    <div class="mb-3">
                        <h3 class="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                            ${t.name}
                            <i data-lucide="badge-check" class="w-4 h-4 text-cyan-400 shrink-0"></i>
                        </h3>
                        <p class="text-xs font-semibold text-slate-300 mt-0.5">${t.role}</p>
                        <p class="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                            <i data-lucide="map-pin" class="w-3 h-3 text-slate-500"></i> ${t.city}, ${t.country} &bull; ${t.experience}
                        </p>
                    </div>

                    <!-- Verified Score & Ethics Bar -->
                    <div class="p-2.5 rounded-xl bg-white/5 border border-white/5 mb-4 space-y-1.5">
                        <div class="flex justify-between text-[11px]">
                            <span class="text-slate-300 font-medium">Idoneidad Técnica:</span>
                            <span class="font-bold text-emerald-400 font-mono">${t.score}/100</span>
                        </div>
                        <div class="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full" style="width: ${t.score}%"></div>
                        </div>
                        <div class="flex justify-between items-center text-[10px] pt-1 text-slate-400">
                            <span class="flex items-center gap-1 text-cyan-300">
                                <i data-lucide="shield" class="w-3 h-3"></i> ${t.ethicalScore}
                            </span>
                            <span class="font-semibold text-slate-300">${t.english}</span>
                        </div>
                    </div>

                    <!-- Bio Summary -->
                    <p class="text-xs text-slate-300/90 line-clamp-2 leading-relaxed mb-4">
                        ${t.bio}
                    </p>

                    <!-- Skill Tags -->
                    <div class="flex flex-wrap gap-1.5 mb-6">
                        ${t.skills.slice(0, 4).map(skill => `
                            <span class="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 text-slate-200 border border-white/10">
                                ${skill}
                            </span>
                        `).join("")}
                        ${t.skills.length > 4 ? `
                            <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-slate-400">
                                +${t.skills.length - 4}
                            </span>
                        ` : ""}
                    </div>
                </div>

                <!-- Card Footer Actions -->
                <div class="pt-4 border-t border-white/10 flex items-center gap-2">
                    <button onclick="openDossierModal('${t.id}')" class="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5">
                        <i data-lucide="file-check" class="w-3.5 h-3.5"></i>
                        <span>Ver Credencial</span>
                    </button>
                    <button onclick="openContactModal('${t.id}')" class="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-colors flex items-center justify-center gap-1" title="Contactar talento">
                        <i data-lucide="mail" class="w-3.5 h-3.5 text-cyan-300"></i>
                    </button>
                    <button onclick="toggleFavorite('${t.id}')" class="p-2.5 rounded-xl ${isFav ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-white/5 text-slate-400 hover:text-white'} border border-white/10 transition-colors" title="${isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}">
                        <i data-lucide="bookmark" class="w-3.5 h-3.5 ${isFav ? 'fill-rose-400' : ''}"></i>
                    </button>
                </div>

            </div>
        `;
    }).join("");

    if (window.lucide) {
        lucide.createIcons();
    }
}

/* ==========================================================================
   4. Métricas Superiores
   ========================================================================== */
function updateMetrics() {
    const totalTalentsEl = document.getElementById("metric-total-talents");
    const avgScoreEl = document.getElementById("metric-avg-score");
    const placementRateEl = document.getElementById("metric-placement-rate");
    const countriesEl = document.getElementById("metric-countries");

    if (totalTalentsEl) totalTalentsEl.textContent = `+${TALENT_DATA.length * 105}`;
    if (avgScoreEl) avgScoreEl.textContent = "96.8%";
    if (placementRateEl) placementRateEl.textContent = "92.4%";
    if (countriesEl) countriesEl.textContent = "22 Países";
}

/* ==========================================================================
   5. Favoritos y Notificaciones Toast
   ========================================================================== */
window.toggleFavorite = function(id) {
    if (AppState.favorites.has(id)) {
        AppState.favorites.delete(id);
        showToast("Talento retirado de tus guardados", "info");
    } else {
        AppState.favorites.add(id);
        showToast("¡Talento guardado en tu preselección!", "success");
    }
    renderTalents();
};

window.exportSelection = function() {
    const count = AppState.favorites.size > 0 ? AppState.favorites.size : TALENT_DATA.length;
    showToast(`Generando reporte de ${count} talentos verificados en formato institucional...`, "success");
    setTimeout(() => {
        showToast("¡Reporte oficial CITE descargado correctamente!", "success");
    }, 1500);
};

function showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `pointer-events-auto px-4 py-3 rounded-xl text-xs font-bold text-white shadow-2xl flex items-center gap-2.5 transition-all transform translate-y-2 opacity-0 ${
        type === "success" ? "bg-emerald-600 border border-emerald-400/40" : "bg-cite-navy border border-white/20"
    }`;
    toast.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" class="w-4 h-4 text-cyan-300 shrink-0"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
        toast.classList.remove("translate-y-2", "opacity-0");
    }, 50);

    setTimeout(() => {
        toast.classList.add("translate-y-2", "opacity-0");
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

/* ==========================================================================
   6. Modal de Expediente y Credencial Oficial CITE
   ========================================================================== */
function initModalEvents() {
    const modal = document.getElementById("dossier-modal");
    const contactModal = document.getElementById("contact-modal");

    [modal, contactModal].forEach(m => {
        if (!m) return;
        m.addEventListener("click", (e) => {
            if (e.target === m) {
                closeModals();
            }
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModals();
        }
    });
}

window.closeModals = function() {
    const modal = document.getElementById("dossier-modal");
    const contactModal = document.getElementById("contact-modal");
    if (modal) modal.classList.add("hidden");
    if (contactModal) contactModal.classList.add("hidden");
    document.body.style.overflow = "";
};

window.openDossierModal = function(id) {
    const talent = TALENT_DATA.find(t => t.id === id);
    if (!talent) return;

    const modal = document.getElementById("dossier-modal");
    const content = document.getElementById("dossier-content");
    if (!modal || !content) return;

    content.innerHTML = `
        <!-- Header Profile Banner -->
        <div class="relative bg-gradient-to-r from-blue-900/60 via-slate-900 to-cyan-950 p-6 sm:p-8 rounded-t-3xl border-b border-white/10">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <img src="${talent.avatar}" alt="${talent.name}" class="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-xl">
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <h3 class="text-xl font-bold text-white">${talent.name}</h3>
                            <span class="text-lg">${talent.flag}</span>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                ${talent.badgeLevel} CITE
                            </span>
                        </div>
                        <p class="text-sm font-semibold text-cyan-300 mt-0.5">${talent.role}</p>
                        <p class="text-xs text-slate-300 mt-1">${talent.city}, ${talent.country} &bull; Disponibilidad: <strong class="text-white">${talent.availability}</strong></p>
                    </div>
                </div>
                <div class="sm:text-right">
                    <div class="text-xs font-mono text-cyan-400">ID: ${talent.id}</div>
                    <div class="text-[11px] text-slate-400 mt-1">Auditado por CITE Internacional</div>
                </div>
            </div>
        </div>

        <!-- Body Details -->
        <div class="p-6 sm:p-8 space-y-6 text-slate-200">
            
            <!-- Resumen y Perfil -->
            <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Perfil Profesional Auditado</h4>
                <p class="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    ${talent.bio}
                </p>
            </div>

            <!-- Métricas de Auditoría CITE -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div class="text-2xl font-extrabold text-emerald-400 font-mono">${talent.score}/100</div>
                    <div class="text-xs font-semibold text-slate-200 mt-1">Prueba Técnica CITE</div>
                    <div class="text-[10px] text-slate-400">Percentil Superior 2%</div>
                </div>
                <div class="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div class="text-2xl font-extrabold text-cyan-400 font-mono">100%</div>
                    <div class="text-xs font-semibold text-slate-200 mt-1">Auditoría Ética CITE</div>
                    <div class="text-[10px] text-slate-400">Valores & Compromiso</div>
                </div>
                <div class="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div class="text-2xl font-extrabold text-white font-mono">${talent.english.split(' ')[0]}</div>
                    <div class="text-xs font-semibold text-slate-200 mt-1">Dominio de Idioma</div>
                    <div class="text-[10px] text-slate-400">${talent.english}</div>
                </div>
            </div>

            <!-- Certificaciones y Acreditaciones -->
            <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Certificaciones & Acreditaciones Oficiales</h4>
                <div class="space-y-2">
                    ${talent.certifications.map(c => `
                        <div class="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-white">
                            <i data-lucide="award" class="w-4 h-4 text-cyan-400 shrink-0"></i>
                            <span class="font-medium">${c}</span>
                            <span class="ml-auto text-[10px] font-mono text-emerald-400">Válido</span>
                        </div>
                    `).join("")}
                </div>
            </div>

            <!-- Skills Stack -->
            <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Competencias Técnicas Clave</h4>
                <div class="flex flex-wrap gap-2">
                    ${talent.skills.map(s => `
                        <span class="px-3 py-1 rounded-lg bg-white/10 text-cyan-300 font-mono text-xs border border-white/10">
                            ${s}
                        </span>
                    `).join("")}
                </div>
            </div>

            <!-- Verificación Criptográfica / Blockchain CITE -->
            <div class="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-4 flex-wrap">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                        <i data-lucide="shield-check" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <div class="text-xs font-bold text-white">Sello Criptográfico de Autenticidad CITE</div>
                        <div class="text-[10px] font-mono text-cyan-300">${talent.auditHash}</div>
                    </div>
                </div>
                <button onclick="showToast('Comprobante institucional CITE verificado contra libro maestro.', 'success')" class="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4">
                    Comprobar Hash
                </button>
            </div>

            <!-- Acciones de Contacto -->
            <div class="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button onclick="closeModals()" class="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-semibold text-xs transition-colors">
                    Cerrar Expediente
                </button>
                <button onclick="openContactModal('${talent.id}')" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2">
                    <i data-lucide="calendar" class="w-4 h-4"></i>
                    <span>Agendar Entrevista / Solicitar Contacto</span>
                </button>
            </div>

        </div>
    `;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    if (window.lucide) lucide.createIcons();
};

/* ==========================================================================
   7. Modal de Contacto / Agendar Entrevista
   ========================================================================== */
window.openContactModal = function(id) {
    const talent = TALENT_DATA.find(t => t.id === id);
    if (!talent) return;

    closeModals();

    const contactModal = document.getElementById("contact-modal");
    const nameEl = document.getElementById("contact-talent-name");
    const roleEl = document.getElementById("contact-talent-role");
    const idInput = document.getElementById("contact-talent-id");

    if (!contactModal) return;

    if (nameEl) nameEl.textContent = talent.name;
    if (roleEl) roleEl.textContent = `${talent.role} (${talent.city}, ${talent.country})`;
    if (idInput) idInput.value = talent.id;

    contactModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    if (window.lucide) lucide.createIcons();
};

window.handleContactSubmit = function(event) {
    event.preventDefault();
    const submitBtn = document.getElementById("contact-submit-btn");

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Enviando solicitud...
        `;
    }

    setTimeout(() => {
        closeModals();
        showToast("¡Solicitud enviada! El equipo de CITE coordinará la conexión en menos de 24h.", "success");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <i data-lucide="send" class="w-4 h-4"></i>
                <span>Enviar Solicitud Institucional</span>
            `;
        }
    }, 900);
};
