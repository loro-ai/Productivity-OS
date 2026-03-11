import { useState, useEffect, useRef } from 'react'
import CodeBlock from '../components/ui/CodeBlock'
import Badge from '../components/ui/Badge'

// Secciones del manual con sus anchors
const SECTIONS = [
  { id: 'instalacion', label: '1. Instalación y Setup' },
  { id: 'frontend', label: '2. Modificar el Frontend' },
  { id: 'backend', label: '3. Modificar el Backend' },
  { id: 'funcionalidades', label: '4. Nuevas Funcionalidades' },
  { id: 'config', label: '5. Variables de Entorno' },
  { id: 'despliegue', label: '6. Despliegue en Producción' },
  { id: 'troubleshooting', label: '7. Troubleshooting' },
]

const Manual = () => {
  const [activeSection, setActiveSection] = useState('instalacion')
  const [searchQuery, setSearchQuery] = useState('')
  const [tocOpen, setTocOpen] = useState(false)  // Para mobile
  const contentRef = useRef(null)
  const sectionRefs = useRef({})

  // Intersection Observer para detectar sección activa
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Scroll a sección al hacer click en TOC
  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(id)
      setTocOpen(false)
    }
  }

  // Resaltar coincidencias de búsqueda
  const highlight = (text) => {
    if (!searchQuery.trim()) return text
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark class="bg-accent/30 text-accent rounded px-0.5">$1</mark>')
  }

  const H2 = ({ id, children }) => (
    <h2
      id={id}
      ref={(el) => { sectionRefs.current[id] = el }}
      className="font-sans text-lg font-bold text-white mt-8 mb-4 pb-2 border-b border-muted/20 scroll-mt-20"
      dangerouslySetInnerHTML={{ __html: highlight(children) }}
    />
  )

  const H3 = ({ children }) => (
    <h3
      className="font-sans font-semibold text-gray-200 mt-5 mb-2"
      dangerouslySetInnerHTML={{ __html: highlight(children) }}
    />
  )

  const P = ({ children }) => (
    <p
      className="font-mono text-sm text-gray-400 leading-relaxed mb-3"
      dangerouslySetInnerHTML={{ __html: highlight(children) }}
    />
  )

  return (
    <div className="flex gap-6 relative">
      {/* TOC Sticky (desktop) */}
      <aside className="hidden lg:block w-52 flex-shrink-0">
        <div className="sticky top-20">
          <p className="font-mono text-xs text-muted uppercase tracking-wider mb-3">Contenido</p>
          <nav className="space-y-1">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`w-full text-left font-mono text-xs px-3 py-2 rounded transition-hover ${
                  activeSection === id
                    ? 'text-accent bg-accent/10 border-l-2 border-accent'
                    : 'text-muted hover:text-white border-l-2 border-transparent'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 min-w-0" ref={contentRef}>
        {/* Header del manual */}
        <div className="flex items-center justify-between mb-6 animate-fadeUp">
          <h1 className="font-sans text-xl font-bold text-white">Manual de AM · Productivity OS</h1>

          {/* TOC dropdown mobile */}
          <div className="lg:hidden relative">
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="font-mono text-xs text-muted border border-muted/30 rounded px-3 py-2 hover:text-white transition-hover"
            >
              Secciones ▾
            </button>
            {tocOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-surface border border-muted/30 rounded-lg shadow-xl z-10">
                {SECTIONS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="w-full text-left font-mono text-xs px-4 py-2.5 text-muted hover:text-white hover:bg-surface2 transition-hover first:rounded-t-lg last:rounded-b-lg"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buscador interno */}
        <div className="mb-6 animate-fadeUp delay-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en el manual..."
            className="w-full bg-surface border border-muted/40 rounded-lg px-4 py-2.5 font-mono text-sm text-white placeholder-muted focus:border-accent"
          />
        </div>

        {/* ─── SECCIÓN 1: INSTALACIÓN ──────────────────────────────── */}
        <section id="instalacion" className="animate-fadeUp delay-2">
          <H2 id="instalacion">1. Instalación y Setup Inicial</H2>

          <H3>1.1 Requisitos previos</H3>
          <P>Antes de instalar AM · Productivity OS, asegurate de tener instalado:</P>
          <ul className="font-mono text-sm text-gray-400 space-y-1 mb-4 ml-4">
            <li>· Node.js v22.22 → verificar con: <code className="text-accent">node -v</code></li>
            <li>· npm v10+ → verificar con: <code className="text-accent">npm -v</code></li>
            <li>· MongoDB local o URI de Atlas</li>
            <li>· Git instalado</li>
          </ul>

          <H3>1.2 Clonar el repositorio</H3>
          <CodeBlock language="bash" code={`git clone https://github.com/tu-usuario/am-productivity.git
cd am-productivity`} />

          <H3>1.3 Configurar variables de entorno</H3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge type="COMANDO">cp .env.example .env</Badge>
          </div>
          <P>Abrí el archivo .env y completá los valores según la sección de variables de entorno (ver sección #config).</P>

          <H3>1.4 Instalar dependencias</H3>
          <CodeBlock language="bash" code={`# Backend
cd server && npm install

# Frontend
cd ../client && npm install`} />

          <H3>1.5 Correr en desarrollo</H3>
          <CodeBlock language="bash" code={`# Terminal 1: Backend (Puerto 3001)
cd server && npm run dev

# Terminal 2: Frontend (Puerto 5173)
cd client && npm run dev`} />
          <P>Abrí tu navegador en <code className="text-accent">http://localhost:5173</code></P>
        </section>

        {/* ─── SECCIÓN 2: FRONTEND ─────────────────────────────────── */}
        <section id="frontend">
          <H2 id="frontend">2. Cómo Modificar el Frontend</H2>

          <H3>2.1 Agregar una nueva página</H3>
          <P>Para agregar una nueva página a la aplicación, seguí estos pasos:</P>
          <div className="space-y-2 mb-3">
            <Badge type="ARCHIVO">client/src/pages/NuevaPagina.jsx</Badge>
          </div>
          <CodeBlock language="jsx" code={`// client/src/pages/NuevaPagina.jsx
const NuevaPagina = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-sans text-xl font-bold text-white">
        Nueva Página
      </h1>
      {/* Contenido aquí */}
    </div>
  )
}

export default NuevaPagina`} />
          <P>Luego registrá la ruta en App.jsx y agregá el ítem en Sidebar.jsx:</P>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge type="ARCHIVO">client/src/App.jsx → agregar Route</Badge>
            <Badge type="ARCHIVO">client/src/components/layout/Sidebar.jsx → agregar item</Badge>
          </div>

          <H3>2.2 Modificar colores y tema</H3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge type="ARCHIVO">client/tailwind.config.js → theme.extend.colors</Badge>
            <Badge type="TIP">Cambiar accent cambia toda la identidad visual</Badge>
          </div>
          <div className="overflow-x-auto mb-3">
            <table className="w-full font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-muted/20">
                  <th className="text-left text-muted py-2 pr-4">Variable</th>
                  <th className="text-left text-muted py-2 pr-4">Valor</th>
                  <th className="text-left text-muted py-2">Uso</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['accent', '#00ff88', 'Checkboxes, bordes focus, links, highlights'],
                  ['surface', '#141414', 'Fondo de cards y paneles'],
                  ['surface2', '#1c1c1c', 'Fondo de inputs y elementos secundarios'],
                  ['danger', '#ff4757', 'Errores, eliminar, alertas críticas'],
                  ['warn', '#ffd32a', 'Estados en pausa, advertencias'],
                  ['info', '#00b4ff', 'Estados planificados, información neutral'],
                  ['muted', '#444444', 'Texto terciario, separadores'],
                ].map(([name, val, desc]) => (
                  <tr key={name} className="border-b border-muted/10">
                    <td className="py-2 pr-4 text-accent">{name}</td>
                    <td className="py-2 pr-4 text-gray-400">{val}</td>
                    <td className="py-2 text-gray-500">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <H3>2.3 Modificar tipografía</H3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge type="ARCHIVO">client/index.html → cambiar Google Fonts link</Badge>
            <Badge type="ARCHIVO">client/tailwind.config.js → theme.extend.fontFamily</Badge>
          </div>

          <H3>2.4 Modificar un componente existente</H3>
          <P>Los componentes UI están en <code className="text-accent">client/src/components/ui/</code></P>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge type="ADVERTENCIA">No modificar los hooks, solo los componentes visuales</Badge>
          </div>

          <H3>2.5 Agregar un nuevo componente UI</H3>
          <CodeBlock language="jsx" code={`// client/src/components/ui/NuevoComponente.jsx
const NuevoComponente = ({ prop1, prop2 }) => {
  return (
    <div className="bg-surface border border-muted/30 rounded-lg p-4">
      <span className="font-mono text-sm text-gray-200">{prop1}</span>
    </div>
  )
}

export default NuevoComponente`} />
        </section>

        {/* ─── SECCIÓN 3: BACKEND ──────────────────────────────────── */}
        <section id="backend">
          <H2 id="backend">3. Cómo Modificar el Backend</H2>

          <H3>3.1 Agregar un nuevo modelo</H3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge type="ARCHIVO">server/src/models/NuevoModelo.js</Badge>
          </div>
          <CodeBlock language="javascript" code={`const mongoose = require('mongoose')

const nuevoModeloSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    campo: {
      type: String,
      required: true,
      default: 'valor_default',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('NuevoModelo', nuevoModeloSchema)`} />

          <H3>3.2 Agregar una nueva ruta (flujo completo)</H3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge type="ARCHIVO">server/src/routes/nuevo.routes.js</Badge>
            <Badge type="ARCHIVO">server/src/controllers/nuevo.controller.js</Badge>
            <Badge type="ARCHIVO">server/src/app.js → registrar ruta</Badge>
          </div>
          <CodeBlock language="javascript" code={`// Ejemplo de ruta GET y POST con auth middleware
// En app.js:
const nuevoRoutes = require('./routes/nuevo.routes')
app.use('/api/nuevo', authMiddleware, nuevoRoutes)

// En nuevo.routes.js:
router.get('/', getAll)
router.post('/', create)`} />

          <H3>3.3 Modificar un modelo existente</H3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge type="ADVERTENCIA">Agregar campos nuevos con default para no romper documentos existentes en MongoDB</Badge>
          </div>

          <H3>3.4 Modificar la autenticación</H3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge type="ARCHIVO">server/src/middleware/auth.middleware.js</Badge>
            <Badge type="ARCHIVO">server/src/controllers/auth.controller.js</Badge>
            <Badge type="VARIABLE">JWT_SECRET → nunca hardcodeado</Badge>
          </div>
          <P>La expiración del token es configurable con JWT_EXPIRES_IN en el archivo .env.</P>
        </section>

        {/* ─── SECCIÓN 4: FUNCIONALIDADES ──────────────────────────── */}
        <section id="funcionalidades">
          <H2 id="funcionalidades">4. Cómo Agregar Nuevas Funcionalidades</H2>

          <H3>4.1 Checklist end-to-end de una nueva feature</H3>
          <div className="bg-surface border border-muted/30 rounded-lg p-4 mb-4 font-mono text-sm space-y-1.5">
            {[
              'Definir modelo en MongoDB',
              'Crear controller con lógica',
              'Crear rutas protegidas con JWT',
              'Registrar rutas en app.js',
              'Crear hook en client/src/hooks/',
              'Crear componente o página React',
              'Agregar ruta en App.jsx',
              'Agregar item en Sidebar.jsx',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-400">
                <span className="text-muted">□</span>
                <span>{i + 1}. {step}</span>
              </div>
            ))}
          </div>

          <H3>4.2 Integrar n8n</H3>
          <P>n8n puede disparar webhooks a POST /api/inbox con el JWT de un usuario bot.</P>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge type="TIP">Crear usuario "bot" en la app para que n8n use su token</Badge>
          </div>

          <H3>4.3 Integrar VAPI</H3>
          <P>VAPI puede enviar transcripciones a POST /api/inbox. Configurá el webhook en VAPI apuntando a la URL pública.</P>
          <CodeBlock language="bash" code={`# Exponer el backend con ngrok
ngrok http 3001`} />

          <H3>4.4 Exponer con ngrok</H3>
          <CodeBlock language="bash" code={`npm install -g ngrok
ngrok http 3001`} />
          <div className="flex flex-wrap gap-2">
            <Badge type="ADVERTENCIA">URL cambia en cada sesión con plan gratuito. Actualizar webhooks en VAPI y n8n cada vez que se reinicie.</Badge>
          </div>
        </section>

        {/* ─── SECCIÓN 5: CONFIG ───────────────────────────────────── */}
        <section id="config">
          <H2 id="config">5. Variables de Entorno</H2>

          <div className="overflow-x-auto mb-4">
            <table className="w-full font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-muted/20">
                  <th className="text-left text-muted py-2 pr-4">Variable</th>
                  <th className="text-left text-muted py-2 pr-4">Ejemplo</th>
                  <th className="text-left text-muted py-2">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['PORT', '3001', 'Puerto del servidor Express'],
                  ['MONGO_URI', 'mongodb://localhost:27017/amdb', 'URI de conexión MongoDB'],
                  ['JWT_SECRET', 'clave_larga_64chars', 'Secreto para firmar tokens'],
                  ['JWT_EXPIRES_IN', '7d', 'Duración del token'],
                  ['VITE_API_URL', 'http://localhost:3001/api', 'URL base del frontend'],
                  ['NODE_ENV', 'development', 'Modo de ejecución'],
                  ['CLIENT_URL', 'http://localhost:5173', 'Origen permitido por CORS'],
                ].map(([name, val, desc]) => (
                  <tr key={name} className="border-b border-muted/10">
                    <td className="py-2 pr-4 text-accent">{name}</td>
                    <td className="py-2 pr-4 text-gray-400">{val}</td>
                    <td className="py-2 text-gray-500">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge type="ADVERTENCIA">Nunca subir .env a Git. Verificar que está en .gitignore.</Badge>
          </div>

          <P>Generar un JWT_SECRET seguro:</P>
          <CodeBlock language="bash" code={`node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`} />
        </section>

        {/* ─── SECCIÓN 6: DESPLIEGUE ───────────────────────────────── */}
        <section id="despliegue">
          <H2 id="despliegue">6. Despliegue en Producción</H2>

          <H3>6.1 Build del frontend</H3>
          <CodeBlock language="bash" code={`cd client && npm run build
# Genera client/dist/`} />

          <H3>6.2 Servir frontend desde Express</H3>
          <CodeBlock language="javascript" code={`// En server.js (producción)
const path = require('path')
app.use(express.static(path.join(__dirname, '../client/dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})`} />

          <H3>6.3 Variables en producción</H3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge type="ADVERTENCIA">Rebuild del frontend si cambia VITE_API_URL</Badge>
          </div>
          <CodeBlock language="bash" code={`NODE_ENV=production
MONGO_URI=mongodb+srv://...  # MongoDB Atlas
VITE_API_URL=https://tu-backend.com/api`} />

          <H3>6.4 Opciones de despliegue</H3>
          <ul className="font-mono text-sm text-gray-400 space-y-1 mb-4 ml-4">
            <li>· Backend: Railway / Render / VPS con PM2</li>
            <li>· Frontend: Vercel / Netlify / servido desde Express</li>
            <li>· MongoDB: Atlas free tier</li>
          </ul>

          <H3>6.5 PM2 en Debian 13</H3>
          <CodeBlock language="bash" code={`npm install -g pm2
pm2 start server.js --name am-backend
pm2 save
pm2 startup`} />
        </section>

        {/* ─── SECCIÓN 7: TROUBLESHOOTING ──────────────────────────── */}
        <section id="troubleshooting">
          <H2 id="troubleshooting">7. Troubleshooting</H2>

          {[
            {
              problem: 'Cannot connect to MongoDB',
              cause: 'MongoDB no está corriendo o URI incorrecta',
              solution: 'sudo systemctl status mongod\nsudo systemctl start mongod\nRevisar MONGO_URI en .env',
            },
            {
              problem: 'JWT malformed / Unauthorized',
              cause: 'Token expirado, inválido o header ausente',
              solution: 'Verificar header: Authorization: Bearer <token>\nMismo JWT_SECRET en dev y producción\nHacer logout + login para token fresco',
            },
            {
              problem: 'CORS error en el frontend',
              cause: 'Origen del frontend no permitido en el backend',
              solution: 'Verificar en app.js:\ncors({ origin: process.env.CLIENT_URL })',
            },
            {
              problem: 'vite: command not found',
              cause: 'Dependencias del frontend no instaladas',
              solution: 'cd client && npm install',
            },
            {
              problem: 'Cambios en tailwind.config.js no se reflejan',
              cause: 'Vite necesita reiniciarse',
              solution: 'Ctrl+C y volver a correr npm run dev',
            },
            {
              problem: 'Module not found en el backend',
              cause: 'Dependencias del servidor no instaladas',
              solution: 'cd server && npm install',
            },
            {
              problem: 'ngrok URL cambió y webhooks no funcionan',
              cause: 'Plan gratuito asigna URL aleatoria por sesión',
              solution: 'Actualizar URL en VAPI y n8n\nO contratar ngrok paid para URL fija',
            },
            {
              problem: 'Puerto 3001 o 5173 ya en uso',
              cause: 'Otro proceso ocupa ese puerto',
              solution: 'lsof -i :3001 → kill -9 <PID>\nO cambiar PORT en .env',
            },
            {
              problem: 'bcrypt / argon2 error al instalar en Node 22.22',
              cause: 'Módulos nativos requieren recompilar para la versión de Node',
              solution: 'npm rebuild\nO usar bcryptjs (pure JS, sin compilación nativa)',
            },
          ].map(({ problem, cause, solution }, i) => (
            <div key={i} className="bg-surface border border-muted/30 rounded-lg p-4 mb-3">
              <div className="font-mono text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-danger flex-shrink-0">❌</span>
                  <span className="text-white font-bold">{problem}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-warn flex-shrink-0">💡</span>
                  <span className="text-gray-400">{cause}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent flex-shrink-0">✅</span>
                  <pre className="text-gray-300 whitespace-pre-wrap text-xs">{solution}</pre>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

export default Manual
