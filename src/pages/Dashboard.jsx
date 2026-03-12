import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import useTasks from '../hooks/useTasks'
import useHabits from '../hooks/useHabits'

// 30 frases motivacionales que rotan por día del año
const MOTIVATIONAL_PHRASES = [
  'El progreso, no la perfección, es lo que importa.',
  'Cada tarea completada es un paso hacia tu mejor versión.',
  'La disciplina es el puente entre metas y logros.',
  'Haz hoy lo que tu yo del futuro te agradecerá.',
  'El foco es el superpoder del siglo XXI.',
  'Pequeñas acciones consistentes crean grandes resultados.',
  'Tu sistema de trabajo es más importante que tu motivación.',
  'La claridad precede a la acción.',
  'Un día bien planificado es un día bien vivido.',
  'La energía sigue a la atención.',
  'No gestiones el tiempo, gestiona tu energía.',
  'Lo que se mide, mejora.',
  'La ejecución distingue a los que sueñan de los que logran.',
  'Cada hábito es un voto por la persona que quieres ser.',
  'El trabajo profundo es el superpoder de nuestra era.',
  'Simplifica, enfoca, ejecuta.',
  'La consistencia supera a la intensidad.',
  'Haz la tarea más difícil primero.',
  'El orden externo crea claridad interna.',
  'Tu entorno moldea tu comportamiento.',
  'La pausa estratégica es parte del trabajo.',
  'Revisar el progreso es tan importante como avanzar.',
  'Los sistemas ganan a los objetivos.',
  'Empieza antes de estar listo.',
  'La velocidad de implementación es una ventaja competitiva.',
  'Menos pero mejor.',
  'El tiempo es el recurso más valioso e irrecuperable.',
  'Construye hoy el sistema que te liberará mañana.',
  'La atención es la nueva moneda.',
  'Termina lo que empezas.',
]

// Componente de stat card con barra de progreso animada
const StatCard = ({ label, value, total, icon, delay = 0 }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div
      className={`bg-surface border border-muted/30 rounded-lg p-4 animate-fadeUp delay-${delay}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-muted uppercase tracking-wider">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="font-sans text-2xl font-bold text-white mb-1">
        {value}
        {total > 0 && <span className="text-muted font-mono text-sm font-normal"> / {total}</span>}
      </div>
      {total > 0 && (
        <div className="progress-bar mt-2">
          <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
        </div>
      )}
    </div>
  )
}

const Dashboard = () => {
  const { user, updateUser } = useAuth()
  const [summary, setSummary] = useState(null)
  const [loadingSummary, setLoadingSummary] = useState(true)

  // Obtener tareas de alta prioridad para la vista rápida
  const { data: tasks, complete: completeTask } = useTasks()
  const { data: habits, toggle: toggleHabit } = useHabits()

  // Cargar resumen del dashboard
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard/summary')
        setSummary(res.data)
        // Actualizar streak en el contexto
        if (res.data.streak !== undefined) {
          updateUser({ streak: res.data.streak })
        }
      } catch (err) {
        console.error('Error cargando dashboard:', err)
      } finally {
        setLoadingSummary(false)
      }
    }
    fetchSummary()
  }, [])

  // Frase del día basada en el día del año
  const getDayOfYear = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now - start
    const oneDay = 1000 * 60 * 60 * 24
    return Math.floor(diff / oneDay)
  }

  const todayPhrase = MOTIVATIONAL_PHRASES[getDayOfYear() % MOTIVATIONAL_PHRASES.length]

  // Fecha en español
  const todayFormatted = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Top 3 tareas de alta prioridad pendientes
  // Solo muestra tareas sin fecha o con dueDate <= hoy — nunca tareas futuras
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)
  const topTasks = tasks
    .filter((t) => {
      if (t.priority !== 'alta' || t.status !== 'pending') return false
      if (!t.dueDate) return true
      return new Date(t.dueDate) <= todayEnd
    })
    .slice(0, 3)

  // Hábitos de hoy
  const todayStr = new Date().toISOString().split('T')[0]
  const todayHabits = habits.slice(0, 5)

  const isHabitDoneToday = (habit) => {
    return habit.weekData?.some(
      (d) => new Date(d.date).toISOString().split('T')[0] === todayStr && d.completed
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con fecha y frase */}
      <div className="animate-fadeUp">
        <h1 className="font-sans text-xl font-bold text-white capitalize">{todayFormatted}</h1>
        <p className="font-mono text-sm text-muted mt-1 italic">"{todayPhrase}"</p>
      </div>

      {/* Streak */}
      {user?.streak > 0 && (
        <div className="animate-fadeUp delay-1 flex items-center gap-2 font-mono text-sm">
          <span>🔥</span>
          <span className="text-warn font-bold">{user.streak}</span>
          <span className="text-muted">día{user.streak !== 1 ? 's' : ''} consecutivo{user.streak !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Stat cards */}
      {loadingSummary ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-muted/30 rounded-lg p-4 h-24 animate-pulse" />
          ))}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Tareas hoy"
            value={summary.tasksToday.done}
            total={summary.tasksToday.total}
            icon="✅"
            delay={1}
          />
          <StatCard
            label="Proyectos activos"
            value={summary.activeProjects}
            total={0}
            icon="🚀"
            delay={2}
          />
          <StatCard
            label="Hábitos hoy"
            value={summary.habitsToday.done}
            total={summary.habitsToday.total}
            icon="🌱"
            delay={3}
          />
          <StatCard
            label="Bandeja"
            value={summary.inboxUnread}
            total={0}
            icon="📥"
            delay={4}
          />
        </div>
      ) : null}

      {/* Vista rápida de tareas de alta prioridad */}
      <div className="animate-fadeUp delay-3">
        <h2 className="font-sans font-semibold text-white mb-3 flex items-center gap-2">
          <span>🔴</span> Tareas prioritarias pendientes
        </h2>
        {topTasks.length === 0 ? (
          <div className="bg-surface border border-muted/30 rounded-lg p-4 font-mono text-sm text-muted text-center">
            Sin tareas de alta prioridad pendientes 🎉
          </div>
        ) : (
          <div className="space-y-2">
            {topTasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center gap-3 bg-surface border border-muted/30 rounded-lg px-4 py-3 hover:border-muted/60 transition-hover"
              >
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={task.status === 'done'}
                  onChange={() => completeTask(task._id)}
                />
                <span className={`font-mono text-sm flex-1 ${task.status === 'done' ? 'line-through text-muted' : 'text-gray-200'}`}>
                  {task.title}
                </span>
                <span className="font-mono text-xs text-danger">Alta</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vista rápida de hábitos de hoy */}
      <div className="animate-fadeUp delay-4">
        <h2 className="font-sans font-semibold text-white mb-3 flex items-center gap-2">
          <span>🌱</span> Hábitos de hoy
        </h2>
        {todayHabits.length === 0 ? (
          <div className="bg-surface border border-muted/30 rounded-lg p-4 font-mono text-sm text-muted text-center">
            No hay hábitos configurados aún
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {todayHabits.map((habit) => {
              const done = isHabitDoneToday(habit)
              return (
                <button
                  key={habit._id}
                  onClick={() => toggleHabit(habit._id, todayStr)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-hover text-left ${
                    done
                      ? 'border-accent/30 bg-accent/5 text-accent'
                      : 'border-muted/30 bg-surface hover:border-muted/60 text-gray-300'
                  }`}
                >
                  <span className="text-lg">{habit.emoji}</span>
                  <span className="font-mono text-sm flex-1">{habit.name}</span>
                  <span className="font-mono text-sm">{done ? '✓' : '○'}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
