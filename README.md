# Cámara Internacional de Talento y Empleabilidad (CITE)
## Landing Page Institucional Oficial (Modo Profesional)

[![Visualizar en vivo](https://img.shields.io/badge/Demo_en_Vivo-GitHub_Pages-2563EB?style=for-the-badge&logo=github)](https://melaniealmeyda7.github.io/CITE/)
[![Estado](https://img.shields.io/badge/Estado-Activo_&_Oficial-10B981?style=for-the-badge)](https://melaniealmeyda7.github.io/CITE/)

---

### 🌐 Enlaces Oficiales en Vivo:
- 🏛️ **Portal Institucional**: [https://melaniealmeyda7.github.io/CITE/](https://melaniealmeyda7.github.io/CITE/)
- 🛡️ **Directorio Interactivo de Talento Verificado**: [https://melaniealmeyda7.github.io/CITE/directorio.html](https://melaniealmeyda7.github.io/CITE/directorio.html)

---

Sitio web institucional, portal de acceso (Login) y **Directorio Interactivo de Talentos Verificados** desarrollados para la **Cámara Internacional de Talento y Empleabilidad (CITE)**, una asociación sin fines de lucro (ONG) dedicada a certificar y conectar talento de alto rendimiento en **Latinoamérica y el Caribe**.

---

## 🌟 Características Destacadas

- **Diseño Corporativo-Institucional de Alto Nivel**:
  - Paleta de color ejecutiva: Azul marino profundo (`#0B132B`), azul tecnológico (`#1D4ED8`), cian de innovación (`#06B6D4`) y fondos neutros balanceados.
  - Tipografía moderna (*Plus Jakarta Sans* y *Space Grotesk*).
  - Iconografía SVG vectorizada mediante *Lucide Icons*.
- **Arquitectura de Secciones Completas**:
  1. **Barra de Anuncios Superior**: Convocatorias activas y presencia en 28 países.
  2. **Navbar Inteligente**: Efecto con scroll y menú drawer responsivo para dispositivos móviles.
  3. **Hero Section con Métricas en Vivo**: Presentación del Sello de Empleabilidad CITE y progreso del fondo comunitario.
  4. **Quiénes Somos y Manifiesto**: Misión, visión 2030, valores y compromiso de transparencia.
  5. **4 Ejes de Acción Estratégica**: Formación digital, Certificación CIE, Bolsa de empleo ética y Mentoría global.
  6. **Catálogo Interactivo de Programas y Becas**: Filtrado dinámico por público (Jóvenes, Profesionales, Empresas).
  7. **Métricas de Impacto Social**: Animación de conteo numérico automático activado por scroll (*IntersectionObserver*).
  8. **Ecosistema de Alianzas**: Respaldo de cámaras de comercio, sector tecnológico, universidades y organismos multilaterales.
  9. **Testimonios y Casos Reales**: Historias de becarios, directores de RRHH y mentores.
  10. **Preguntas Frecuentes (FAQ)**: Acordeón interactivo accesible para postulantes y donantes.
  11. **Modal Interactivo Multi-Perfil**: Formulario inteligente que adapta sus campos según el rol seleccionado (*Talento / Becas*, *Empresa Aliada*, *Mentor Voluntario* o *Donación*).
  12. **Footer Institucional**: Observatorio de empleo, enlaces legales, políticas de privacidad y redes sociales.

---

## 📂 Estructura del Proyecto

```
cite-landing-page/
├── index.html         # Landing page principal y modal de login (HTML5 + Tailwind CSS)
├── directorio.html    # Dashboard interactivo con Auth Gate protegido por JWT
├── css/
│   └── styles.css     # Estilos personalizados, efectos de cristal, animaciones y scrollbar
├── js/
│   ├── app.js         # Interactividad principal, contadores, filtros y modales de la portada
│   └── directorio.js  # Lógica del directorio, cliente API REST, sesión JWT y RBAC
├── backend/
│   ├── server.js      # Servidor REST en Node.js (API REST + servidor estático)
│   ├── auth.js        # Módulo de autenticación con Bcrypt, JWT y middlewares RBAC
│   ├── database.js    # Motor de base de datos local (SQLite nativo + JSON sincronizado)
│   ├── package.json   # Dependencias del backend (bcryptjs, jsonwebtoken, express, cors)
│   └── data/          # Base de datos persistente local (cite.sqlite, users.json, talents.json)
└── README.md          # Documentación del proyecto
```

---

## 🔐 Sistema de Autenticación Segura y Roles (RBAC)

El proyecto incluye un backend seguro en Node.js con:
- **Encriptación de Contraseñas**: Todas las contraseñas se almacenan hasheadas con **Bcrypt** (Salt rounds = 10).
- **Manejo de Sesiones**: Tokens firmados **JWT (JSON Web Tokens)** con expiración a 24 horas.
- **Base de Datos Local**: Soporte nativo para **SQLite** y archivos JSON sincronizados.
- **Control de Acceso por Roles (RBAC)**:
  - 🛡️ **Auditor / Admin**: Registro de nuevos talentos, edición de puntajes y auditoría ética, y eliminación de registros.
  - 🏢 **Empresa / Reclutador**: Consulta de talentos, favoritos, solicitud de entrevistas y descarga de reportes.
  - 🎓 **Talento (Estudiante)**: Consulta general y edición de su propio perfil profesional, disponibilidad y habilidades.

### 👥 Credenciales Semilla para Pruebas:
| Rol | Correo Electrónico | Contraseña | Permisos |
|---|---|---|---|
| **Auditor / Admin** | `admin@cite.org` | `Admin123!` | Crear, editar puntajes, auditar y eliminar registros |
| **Empresa / Reclutador** | `reclutador@empresa.com` | `Empresa123!` | Buscar, filtrar, agendar entrevistas y exportar |
| **Talento (Estudiante)** | `talento@cite.org` | `Talento123!` | Ver directorio y actualizar su propio perfil y disponibilidad |

---

## 🚀 Cómo Iniciar el Backend y Visualizar Localmente

### Paso 1: Iniciar el Servidor Backend Seguro (Node.js)
```bash
cd /Users/melaniealmeyda/.gemini/antigravity/scratch/cite-landing-page/backend
node server.js
```
El servidor se iniciará en **`http://localhost:3000`** e inicializará automáticamente la base de datos SQLite y los usuarios semilla con contraseñas encriptadas.

### Paso 2: Abrir en tu Navegador
- **Directorio de Talentos**: [http://localhost:3000/directorio.html](http://localhost:3000/directorio.html)
- **Portada Principal**: [http://localhost:3000/](http://localhost:3000/)

---

## 🌐 Despliegue en Producción

Al ser un sitio web estático optimizado, puede alojarse de forma inmediata en:
- **Vercel / Netlify / Cloudflare Pages**: Arrastrando la carpeta o conectando un repositorio de Git.
- **GitHub Pages**: Activando la rama `main` en la configuración de Pages.
- **Amazon S3 / Google Cloud Storage + CDN**: Alojamiento estático económico de ultra alta disponibilidad.

---

## 📜 Licencia y Derechos

© 2026 Cámara Internacional de Talento y Empleabilidad (CITE). Asociación Internacional Sin Fines de Lucro.
