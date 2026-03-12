import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const SECTIONS = [
  { id: 'bienvenida',   label: '👋 Bienvenida' },
  { id: 'primeros',     label: '🚀 Primeros pasos' },
  { id: 'tareas',       label: '✅ Tareas' },
  { id: 'habitos',      label: '🌱 Hábitos' },
  { id: 'proyectos',    label: '🚀 Proyectos' },
  { id: 'bandeja',      label: '📥 Bandeja de entrada' },
  { id: 'rutina',       label: '🔁 Rutina diaria' },
  { id: 'focus',        label: '🎯 Modo Focus' },
  { id: 'flujo',        label: '💡 Flujo recomendado' },
]

const Section = ({ id, title, children }) => (
  <section id={id} className="mb-10 scroll-mt-20">
    <h2 className="font-sans text-lg font-bold text-white mb-4 pb-2 border-b border-muted/20">
      {title}
    </h2>
    {children}
  </section>
)

const P = ({ children }) => (
  <p className="font-mono text-sm text-gray-400 leading-relaxed mb-3">{children}</p>
)

const H3 = ({ children }) => (
  <h3 className="font-sans font-semibold text-gray-200 mt-5 mb-2 text-base">{children}</h3>
)

const Tip = ({ children }) => (
  <div className="bg-accent/5 border border-accent/20 rounded-lg px-4 py-3 mb-3 font-mono text-sm text-accent/90">
    💡 {children}
  </div>
)

const Step = ({ number, title, description }) => (
  <div className="flex gap-4 mb-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center font-mono text-sm text-accent font-bold">
      {number}
    </div>
    <div>
      <div className="font-sans font-semibold text-gray-200 text-sm">{title}</div>
      <div className="font-mono text-xs text-gray-500 mt-0.5">{description}</div>
    </div>
  </div>
)

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-surface border border-muted/30 rounded-lg p-4 mb-3">
    <div className="flex items-start gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="font-sans font-semibold text-white text-sm mb-1">{title}</div>
        <div className="font-mono text-xs text-gray-400 leading-relaxed">{description}</div>
      </div>
    </div>
  </div>
)

const UserGuide = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('bienvenida')
  const [tocOpen, setTocOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
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

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(id)
      setTocOpen(false)
    }
  }

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

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fadeUp">
          <h1 className="font-sans text-xl font-bold text-white">
            Guía de uso · AM Productivity OS
          </h1>
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

        {/* ─── BIENVENIDA ─────────────────────────────────── */}
        <Section id="bienvenida" title="👋 Bienvenida">
          <P>
            Hola{user?.name ? `, ${user.name}` : ''}. AM Productivity OS es tu sistema personal de productividad
            inspirado en el método GTD (Getting Things Done). Todo lo que necesitas para organizar
            tu vida está aquí: tareas, hábitos, proyectos, rutinas y más.
          </P>
          <P>
            La idea central es simple: captura todo lo que llega a tu mente en la Bandeja,
            procésalo, conviértelo en tareas o proyectos, y ejecuta con foco.
          </P>
          <Tip>Esta guía te explica cómo sacarle el máximo partido a cada sección de la app.</Tip>
        </Section>

        {/* ─── PRIMEROS PASOS ─────────────────────────────── */}
        <Section id="primeros" title="🚀 Primeros pasos">
          <P>Te recomendamos seguir este orden la primera vez que uses la app:</P>
          <Step number="1" title="Configura tu rutina matutina y nocturna" description="Ve a Rutina y personaliza los pasos de tu mañana y tu noche según tus hábitos." />
          <Step number="2" title="Crea tus proyectos activos" description="En Proyectos, registra en qué áreas grandes estás trabajando ahora mismo." />
          <Step number="3" title="Vacía tu mente en la Bandeja" description="Escribe todo lo que tengas pendiente en la Bandeja de entrada, sin pensar en organizarlo todavía." />
          <Step number="4" title="Procesa la bandeja" description="Convierte cada item en tarea o proyecto. Esto es el corazón del método GTD." />
          <Step number="5" title="Define tus hábitos" description="En Hábitos, agrega las rutinas diarias que quieres consolidar." />
          <Tip>No intentes hacer todo perfecto desde el día uno. Empieza con lo más urgente y construye el sistema poco a poco.</Tip>
        </Section>

        {/* ─── TAREAS ─────────────────────────────────────── */}
        <Section id="tareas" title="✅ Tareas">
          <P>Las tareas son las acciones concretas que puedes ejecutar. Cada tarea tiene:</P>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Prioridad', values: '🔴 Alta · 🟡 Media · 🟢 Baja', tip: 'Sé honesto con las prioridades. Tener todo en "alta" hace que nada sea urgente.' },
              { label: 'Fecha límite', values: 'Opcional pero recomendada', tip: 'Asignar fechas te ayuda a planificar tu semana con el filtro por día.' },
              { label: 'Proyecto', values: 'Vincula la tarea a un proyecto', tip: 'Te permite ver todo lo pendiente de un proyecto de un vistazo.' },
            ].map(({ label, values, tip }) => (
              <div key={label} className="bg-surface border border-muted/30 rounded-lg p-3">
                <div className="font-sans font-semibold text-white text-sm mb-1">{label}</div>
                <div className="font-mono text-xs text-gray-400 mb-2">{values}</div>
                <div className="font-mono text-xs text-muted">{tip}</div>
              </div>
            ))}
          </div>
          <H3>Completar una tarea</H3>
          <P>Haz clic en el círculo a la izquierda de la tarea para marcarla como completada. Esto suma a tu racha diaria (streak). Puedes desmarcrarla de la misma forma.</P>
          <H3>Filtros disponibles</H3>
          <P>Usa los filtros de estado (pendiente / completada), prioridad y fecha para ver exactamente lo que necesitas en cada momento.</P>
          <Tip>Empieza cada día revisando las tareas de prioridad alta. Completa al menos una antes de revisar el correo o redes.</Tip>
        </Section>

        {/* ─── HÁBITOS ────────────────────────────────────── */}
        <Section id="habitos" title="🌱 Hábitos">
          <P>
            Los hábitos son acciones que quieres repetir todos los días. A diferencia de las tareas,
            no se eliminan al completarse — se reinician cada semana para que puedas ver tu progreso.
          </P>
          <H3>Cómo usarlos</H3>
          <P>Cada día, entra a la sección Hábitos y marca los que hayas completado. El grid semanal te muestra de un vistazo qué días fuiste consistente.</P>
          <H3>Cuántos hábitos agregar</H3>
          <P>Menos es más. Empieza con 3 a 5 hábitos fundamentales. Agregar demasiados de golpe dificulta mantenerlos todos.</P>
          <Tip>Los mejores hábitos para empezar: hidratación al despertar, lectura diaria, y revisar tu sistema de productividad cada mañana.</Tip>
        </Section>

        {/* ─── PROYECTOS ──────────────────────────────────── */}
        <Section id="proyectos" title="🚀 Proyectos">
          <P>
            Un proyecto es cualquier objetivo que requiere más de una tarea para completarse.
            Organiza tus proyectos por área (trabajo, personal, salud, finanzas, etc.).
          </P>
          <FeatureCard icon="📊" title="Progreso visual" description="Cada proyecto muestra un porcentaje de avance. Actualízalo manualmente o déjalo reflejar cuántas tareas asociadas están completadas." />
          <FeatureCard icon="🏷️" title="Estados de proyecto" description="Activo, planificado, pausado o completado. Mantener esta clasificación al día te ayuda a saber en qué estás realmente trabajando." />
          <FeatureCard icon="🔗" title="Vincular tareas" description="Al crear una tarea puedes asignarla a un proyecto. Desde la vista del proyecto puedes ver todas sus tareas pendientes." />
          <Tip>Revisa tus proyectos activos una vez por semana. Si un proyecto lleva semanas sin avance, considera si sigue siendo relevante o si deberías pausarlo.</Tip>
        </Section>

        {/* ─── BANDEJA ────────────────────────────────────── */}
        <Section id="bandeja" title="📥 Bandeja de entrada">
          <P>
            La bandeja es el corazón del sistema. Es el lugar donde capturas todo lo que llega
            a tu mente sin tener que organizarlo en el momento: ideas, compromisos, cosas por hacer,
            recordatorios.
          </P>
          <H3>El ciclo de la bandeja</H3>
          <Step number="1" title="Captura" description="Escribe todo lo que pasa por tu cabeza. No lo juzgues ni lo organices todavía." />
          <Step number="2" title="Procesa" description="Una vez al día, revisa cada item y decide: ¿es accionable? Si sí, conviértelo en tarea o proyecto." />
          <Step number="3" title="Vacía" description="El objetivo es tener la bandeja siempre en cero al final del día." />
          <Tip>La bandeja también puede recibir entradas automáticas de herramientas externas como n8n o asistentes de voz. Pregúntale al administrador si esta integración está configurada.</Tip>
        </Section>

        {/* ─── RUTINA ─────────────────────────────────────── */}
        <Section id="rutina" title="🔁 Rutina diaria">
          <P>
            La sección Rutina tiene dos checklists: uno matutino y uno nocturno. Son los pasos
            que defines para comenzar y cerrar bien cada día.
          </P>
          <H3>Rutina matutina</H3>
          <P>Úsala para activar tu modo productivo: revisar el día, hidratarte, hacer ejercicio o lo que funcione para ti. Marca cada paso al completarlo.</P>
          <H3>Rutina nocturna</H3>
          <P>Úsala para cerrar el día con intención: revisar qué completaste, preparar el día siguiente y desconectar. Completar la rutina nocturna te posiciona mejor para el día que viene.</P>
          <Tip>Personaliza los ítems de tu rutina desde el botón de edición. Los ítems por defecto son una sugerencia, no una obligación.</Tip>
        </Section>

        {/* ─── MODO FOCUS ─────────────────────────────────── */}
        <Section id="focus" title="🎯 Modo Focus (Pomodoro)">
          <P>
            El Modo Focus activa un temporizador Pomodoro con tus tareas de alta prioridad visibles.
            Está diseñado para eliminar distracciones y entrar en estado de flujo.
          </P>
          <H3>Cómo funciona</H3>
          <Step number="1" title="Actívalo" description='Haz clic en "Modo Focus" en el menú lateral o en el botón de la barra superior.' />
          <Step number="2" title="Trabaja 25 minutos" description="El timer corre durante 25 minutos. Enfócate solo en una tarea. Sin redes, sin correo." />
          <Step number="3" title="Descansa 5 minutos" description="Al terminar el pomodoro, tómate un descanso corto antes del siguiente." />
          <Step number="4" title="Repite" description="Después de 4 pomodoros, tómate un descanso largo de 15-30 minutos." />
          <Tip>Para salir del modo Focus antes de que termine el timer, usa el botón de salida en la parte inferior de la pantalla.</Tip>
        </Section>

        {/* ─── FLUJO RECOMENDADO ───────────────────────────── */}
        <Section id="flujo" title="💡 Flujo diario recomendado">
          <P>Este es el flujo que te recomendamos seguir cada día para sacarle el máximo partido al sistema:</P>
          <div className="bg-surface border border-muted/30 rounded-lg p-5 space-y-3">
            {[
              { time: 'Al despertar', icon: '🌅', action: 'Completa tu rutina matutina' },
              { time: 'Inicio del día', icon: '📥', action: 'Revisa y vacía la bandeja de entrada' },
              { time: 'Mañana', icon: '🎯', action: 'Usa Modo Focus para las tareas de alta prioridad' },
              { time: 'Mediodía', icon: '✅', action: 'Marca los hábitos completados hasta el momento' },
              { time: 'Tarde', icon: '🚀', action: 'Avanza en tus proyectos activos' },
              { time: 'Antes de dormir', icon: '🔁', action: 'Completa tu rutina nocturna y prepara el día siguiente' },
            ].map(({ time, icon, action }) => (
              <div key={time} className="flex items-center gap-4">
                <div className="font-mono text-xs text-muted w-28 flex-shrink-0">{time}</div>
                <div className="text-lg">{icon}</div>
                <div className="font-mono text-sm text-gray-300">{action}</div>
              </div>
            ))}
          </div>
          <Tip>No tienes que seguir esto al pie de la letra. Adáptalo a tu vida y horario. Lo importante es la consistencia, no la perfección.</Tip>
        </Section>
      </div>
    </div>
  )
}

export default UserGuide
