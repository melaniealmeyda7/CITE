/**
 * CITE - Cámara Internacional de Talento y Empleabilidad
 * JavaScript de Interactividad y Experiencia de Usuario
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initProgramFilters();
    initCounters();
    initFaqAccordion();
    initModalEvents();
});

/* ==========================================================================
   1. Header Scroll Effect
   ========================================================================== */
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   2. Menú Móvil
   ========================================================================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
        } else {
            mobileMenu.classList.add('hidden');
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

/* ==========================================================================
   3. Filtro Interactivo de Programas
   ========================================================================== */
function initProgramFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const programCards = document.querySelectorAll('.program-card');

    if (!filterButtons.length || !programCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('active', 'bg-cite-navy', 'text-white', 'shadow-sm');
                b.classList.add('text-slate-600');
            });
            btn.classList.add('active', 'bg-cite-navy', 'text-white', 'shadow-sm');
            btn.classList.remove('text-slate-600');

            const filterValue = btn.getAttribute('data-filter');

            programCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'todos' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   4. Animación de Contadores de Impacto (IntersectionObserver)
   ========================================================================== */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const isDecimal = counter.hasAttribute('data-decimals');
                    const decimals = isDecimal ? parseInt(counter.getAttribute('data-decimals')) : 0;
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCount(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const currentVal = target * easeOut;

                        if (isDecimal) {
                            counter.textContent = currentVal.toFixed(decimals);
                        } else {
                            counter.textContent = Math.floor(currentVal).toLocaleString();
                        }

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            if (isDecimal) {
                                counter.textContent = target.toFixed(decimals);
                            } else {
                                counter.textContent = target.toLocaleString();
                            }
                        }
                    }

                    requestAnimationFrame(updateCount);
                });
            }
        });
    }, { threshold: 0.3 });

    const impactSection = document.getElementById('impacto');
    if (impactSection) {
        observer.observe(impactSection);
    }
}

/* ==========================================================================
   5. Acordeón de Preguntas Frecuentes (FAQ)
   ========================================================================== */
function initFaqAccordion() {
    const triggers = document.querySelectorAll('.faq-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            const icon = trigger.querySelector('.faq-icon');
            const isOpen = !content.classList.contains('hidden');

            triggers.forEach(otherTrigger => {
                if (otherTrigger !== trigger) {
                    const otherContent = otherTrigger.nextElementSibling;
                    const otherIcon = otherTrigger.querySelector('.faq-icon');
                    otherContent.classList.add('hidden');
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                }
            });

            if (isOpen) {
                content.classList.add('hidden');
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                content.classList.remove('hidden');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

/* ==========================================================================
   6. Modal Interactivo Multi-Perfil
   ========================================================================== */
function initModalEvents() {
    const modal = document.getElementById('action-modal');
    const loginModal = document.getElementById('login-modal');

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeLoginModal();
        }
    });
}

/**
 * Abre el modal y configura el estado según el modo y rol
 */
window.openModal = function(mode = 'registro', rolePreset = 'talento', programPreset = '') {
    const modal = document.getElementById('action-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const badge = document.getElementById('modal-category-badge');
    const form = document.getElementById('modal-form');
    const successBox = document.getElementById('modal-success');
    const presetInput = document.getElementById('form-program-preset');
    const roleSelectorContainer = document.getElementById('role-selector-container');

    if (!modal) return;

    form.classList.remove('hidden');
    successBox.classList.add('hidden');
    form.reset();

    if (presetInput) {
        presetInput.value = programPreset || '';
    }

    if (mode === 'donacion') {
        badge.textContent = 'Fondo de Solidaridad CITE';
        modalTitle.textContent = 'Aportar al Fondo de Becas de Talento';
        modalSubtitle.textContent = 'Tu donación 100% deducible financia certificaciones y tecnología para jóvenes de escasos recursos.';
        roleSelectorContainer.classList.add('hidden');
        document.getElementById('label-name').textContent = 'Nombre del Donante o Razón Social *';
        document.getElementById('label-extra').textContent = 'Monto estimado o tipo de contribución *';
        document.getElementById('form-extra').placeholder = 'Ej: $100 USD / Donación corporativa de equipos...';
        document.getElementById('form-submit-text').textContent = 'Continuar a Donación Segura';
    } else {
        roleSelectorContainer.classList.remove('hidden');
        badge.textContent = 'Convocatoria Oficial 2026';
        modalTitle.textContent = 'Sumarse a la Red de CITE';
        modalSubtitle.textContent = programPreset 
            ? `Postulación directa para: ${programPreset}` 
            : 'Completa el formulario institucional según tu perfil de participación.';
        document.getElementById('form-submit-text').textContent = 'Enviar Postulación / Registro';
        switchRole(rolePreset);
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
    const modal = document.getElementById('action-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
};

/**
 * Cambia los campos del formulario según el rol
 */
window.switchRole = function(role) {
    const roleInput = document.getElementById('form-role');
    const labelExtra = document.getElementById('label-extra');
    const inputExtra = document.getElementById('form-extra');
    const labelName = document.getElementById('label-name');

    const btnTalento = document.getElementById('role-btn-talento');
    const btnEmpresa = document.getElementById('role-btn-empresa');
    const btnMentor = document.getElementById('role-btn-mentor');

    [btnTalento, btnEmpresa, btnMentor].forEach(b => {
        if (b) {
            b.classList.remove('active', 'bg-blue-50', 'text-cite-blue', 'border-cite-blue');
            b.classList.add('border-slate-200', 'bg-white', 'text-slate-600');
        }
    });

    if (roleInput) roleInput.value = role;

    if (role === 'empresa') {
        if (btnEmpresa) {
            btnEmpresa.classList.add('active', 'bg-blue-50', 'text-cite-blue', 'border-cite-blue');
            btnEmpresa.classList.remove('border-slate-200', 'bg-white', 'text-slate-600');
        }
        if (labelName) labelName.textContent = 'Nombre del Representante o Empresa *';
        if (labelExtra) labelExtra.textContent = 'Nombre de la Empresa o Institución y Sector *';
        if (inputExtra) inputExtra.placeholder = 'Ej: Grupo Santander, Sector Tecnología o Retail...';
    } else if (role === 'mentor') {
        if (btnMentor) {
            btnMentor.classList.add('active', 'bg-blue-50', 'text-cite-blue', 'border-cite-blue');
            btnMentor.classList.remove('border-slate-200', 'bg-white', 'text-slate-600');
        }
        if (labelName) labelName.textContent = 'Nombre completo del Mentor *';
        if (labelExtra) labelExtra.textContent = 'Cargo actual y años de experiencia *';
        if (inputExtra) inputExtra.placeholder = 'Ej: Directora de RRHH / 12 años de trayectoria...';
    } else {
        // Talento
        if (btnTalento) {
            btnTalento.classList.add('active', 'bg-blue-50', 'text-cite-blue', 'border-cite-blue');
            btnTalento.classList.remove('border-slate-200', 'bg-white', 'text-slate-600');
        }
        if (labelName) labelName.textContent = 'Nombre completo *';
        if (labelExtra) labelExtra.textContent = 'Área de estudio, oficio o profesión *';
        if (inputExtra) inputExtra.placeholder = 'Ej: Ingeniería, Administración, Programación...';
    }
};

/**
 * Enviar formulario del modal
 */
window.handleModalSubmit = function(event) {
    event.preventDefault();
    const form = document.getElementById('modal-form');
    const successBox = document.getElementById('modal-success');
    const submitBtn = document.getElementById('form-submit-btn');

    if (!form || !successBox || !submitBtn) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        Procesando...
    `;

    setTimeout(() => {
        form.classList.add('hidden');
        successBox.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <i data-lucide="send" class="w-4 h-4"></i>
            <span id="form-submit-text">Enviar Postulación / Registro</span>
        `;
        if (window.lucide) {
            lucide.createIcons();
        }
    }, 800);
};

/* ==========================================================================
   7. Boletín / Newsletter
   ========================================================================== */
window.handleNewsletter = function(event) {
    event.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    const successMsg = document.getElementById('newsletter-success');

    if (!emailInput || !successMsg) return;

    emailInput.value = '';
    successMsg.classList.remove('hidden');

    setTimeout(() => {
        successMsg.classList.add('hidden');
    }, 5000);
};

/* ==========================================================================
   8. Código de Ética y Compromiso Institucional CITE
   ========================================================================== */
window.downloadReportModal = function() {
    openModal('registro', 'talento');
};

/* ==========================================================================
   9. Funciones de Acceso y Login al Directorio CITE
   ========================================================================== */
window.openLoginModal = function() {
    const modal = document.getElementById('login-modal');
    if (!modal) {
        window.location.href = 'directorio.html';
        return;
    }
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

window.closeLoginModal = function() {
    const modal = document.getElementById('login-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
};

window.selectLoginRole = function(role) {
    const roleInput = document.getElementById('login-role-input');
    const emailInput = document.getElementById('login-email');
    const btnEmpresa = document.getElementById('login-role-empresa');
    const btnTalento = document.getElementById('login-role-talento');
    const btnAuditor = document.getElementById('login-role-auditor');

    if (roleInput) roleInput.value = role;

    [btnEmpresa, btnTalento, btnAuditor].forEach(b => {
        if (b) {
            b.classList.remove('bg-cyan-500', 'text-slate-950', 'font-bold');
            b.classList.add('hover:text-white', 'text-slate-400');
        }
    });

    if (role === 'talento') {
        if (btnTalento) {
            btnTalento.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');
            btnTalento.classList.remove('hover:text-white', 'text-slate-400');
        }
        if (emailInput) emailInput.placeholder = 'talento.verificado@cite.org';
    } else if (role === 'auditor') {
        if (btnAuditor) {
            btnAuditor.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');
            btnAuditor.classList.remove('hover:text-white', 'text-slate-400');
        }
        if (emailInput) emailInput.placeholder = 'auditor.etico@cite-latam.org';
    } else {
        // Empresa
        if (btnEmpresa) {
            btnEmpresa.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');
            btnEmpresa.classList.remove('hover:text-white', 'text-slate-400');
        }
        if (emailInput) emailInput.placeholder = 'reclutador@empresa.com';
    }
};

window.handleLoginSubmit = async function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value || 'reclutador@empresa.com';
    const password = document.getElementById('login-password') ? document.getElementById('login-password').value : 'Empresa123!';
    const role = document.getElementById('login-role-input').value || 'empresa';
    const submitBtn = document.getElementById('login-submit-btn');

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Validando credenciales con JWT...
        `;
    }

    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (res.ok) {
            const data = await res.json();
            if (data.ok && data.token) {
                localStorage.setItem('cite_jwt_token', data.token);
                localStorage.setItem('cite_auth_user', JSON.stringify(data.user));
                window.location.href = 'directorio.html';
                return;
            }
        }
    } catch (e) {
        // Fallback local
    }

    const userData = {
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        role: role,
        company: role === 'empresa' ? 'Empresa Aliada CITE' : (role === 'auditor' ? 'Comité Auditor CITE' : 'Talento Certificado')
    };
    const mockToken = `jwt-sec.${btoa(JSON.stringify({ ...userData, exp: Date.now() + 86400000 }))}.sig-${Date.now()}`;
    localStorage.setItem('cite_jwt_token', mockToken);
    localStorage.setItem('cite_auth_user', JSON.stringify(userData));

    setTimeout(() => {
        window.location.href = 'directorio.html';
    }, 600);
};

window.demoLogin = function(role = 'empresa') {
    const creds = {
        auditor: { email: "admin@cite.org", name: "Directora General de Auditoría CITE", company: "Comité Evaluador CITE" },
        empresa: { email: "reclutador@empresa.com", name: "Tech Talent Partner", company: "Alianza Corporativa CITE" },
        talento: { email: "talento@cite.org", name: "Mateo Silva Arboleda", company: "Red de Talento Verificado" }
    };
    const user = creds[role] || creds.empresa;
    const userData = {
        id: `usr-${role}-01`,
        name: user.name,
        email: user.email,
        role: role,
        company: user.company
    };
    const mockToken = `jwt-sec.${btoa(JSON.stringify({ ...userData, exp: Date.now() + 86400000 }))}.sig-${Date.now()}`;
    localStorage.setItem('cite_jwt_token', mockToken);
    localStorage.setItem('cite_auth_user', JSON.stringify(userData));
    window.location.href = 'directorio.html';
};


