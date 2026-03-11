import { useState } from 'react'
import useTasks from '../hooks/useTasks'
import useProjects from '../hooks/useProjects'
import TaskItem from '../components/ui/TaskItem'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const Tasks = () => {
  const [filter, setFilter] = useState('all')  // 'all' | 'pending' | 'done'
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', priority: 'media', dueDate: '', projectId: '' })
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data: tasks, loading, create, complete, remove } = useTasks()
  const { data: projects } = useProjects()

  // Filtrar y agrupar tareas por prioridad
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return t.status === 'pending'
    if (filter === 'done') return t.status === 'done'
    return true
  })

  const byPriority = {
    alta: filteredTasks.filter((t) => t.priority === 'alta'),
    media: filteredTasks.filter((t) => t.priority === 'media'),
    baja: filteredTasks.filter((t) => t.priority === 'baja'),
  }

  // Contador de completadas hoy
  const todayStr = new Date().toISOString().split('T')[0]
  const completedToday = tasks.filter(
    (t) => t.status === 'done' && t.completedAt &&
    new Date(t.completedAt).toISOString().split('T')[0] === todayStr
  ).length

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return

    try {
      await create({
        title: form.title,
        priority: form.priority,
        dueDate: form.dueDate || undefined,
        projectId: form.projectId || undefined,
      })
      setForm({ title: '', priority: 'media', dueDate: '', projectId: '' })
      setShowForm(false)
    } catch (err) {
      console.error('Error creando tarea:', err)
    }
  }

  const handleDelete = async (id) => {
    setDeleteTarget(null)
    await remove(id)
  }

  const priorityGroups = [
    { key: 'alta', label: '🔴 Alta', color: 'text-danger' },
    { key: 'media', label: '🟡 Media', color: 'text-warn' },
    { key: 'baja', label: '🟢 Baja', color: 'text-accent' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fadeUp">
        <div>
          <h1 className="font-sans text-xl font-bold text-white">Tareas</h1>
          <p className="font-mono text-xs text-muted mt-0.5">
            {completedToday} completada{completedToday !== 1 ? 's' : ''} hoy · {tasks.filter(t => t.status === 'pending').length} pendiente{tasks.filter(t => t.status === 'pending').length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent text-black font-mono font-bold text-sm px-4 py-2 rounded hover:bg-green-400 transition-hover"
        >
          + Nueva tarea
        </button>
      </div>

      {/* Formulario inline */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-accent/20 rounded-lg p-4 space-y-3 animate-fadeUp"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Título de la tarea"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
              autoFocus
              className="col-span-full bg-surface2 border border-muted/40 rounded px-3 py-2 font-mono text-sm text-white placeholder-muted focus:border-accent"
            />
            <select
              value={form.priority}
              onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
              className="bg-surface2 border border-muted/40 rounded px-3 py-2 font-mono text-sm text-white focus:border-accent"
            >
              <option value="alta">🔴 Alta</option>
              <option value="media">🟡 Media</option>
              <option value="baja">🟢 Baja</option>
            </select>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
              className="bg-surface2 border border-muted/40 rounded px-3 py-2 font-mono text-sm text-white focus:border-accent"
            />
            <select
              value={form.projectId}
              onChange={(e) => setForm((p) => ({ ...p, projectId: e.target.value }))}
              className="bg-surface2 border border-muted/40 rounded px-3 py-2 font-mono text-sm text-white focus:border-accent"
            >
              <option value="">Sin proyecto</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="font-mono text-sm text-muted border border-muted/30 rounded px-4 py-2 hover:text-white transition-hover"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-accent text-black font-mono font-bold text-sm px-4 py-2 rounded hover:bg-green-400 transition-hover"
            >
              Guardar
            </button>
          </div>
        </form>
      )}

      {/* Filtros */}
      <div className="flex gap-2 animate-fadeUp delay-1">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'pending', label: 'Pendientes' },
          { key: 'done', label: 'Completadas' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`font-mono text-xs px-3 py-1.5 rounded border transition-hover ${
              filter === f.key
                ? 'bg-accent/10 text-accent border-accent/30'
                : 'text-muted border-muted/30 hover:text-white hover:border-muted'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grupos por prioridad */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-surface border border-muted/30 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {priorityGroups.map(({ key, label, color }) => {
            const group = byPriority[key]
            if (group.length === 0) return null

            return (
              <div key={key} className="animate-fadeUp">
                <h3 className={`font-mono text-xs uppercase tracking-wider mb-2 ${color}`}>
                  {label} ({group.length})
                </h3>
                <div className="space-y-2">
                  {group.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      onComplete={complete}
                      onDelete={(id) => setDeleteTarget(id)}
                    />
                  ))}
                </div>
              </div>
            )
          })}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 font-mono text-sm text-muted">
              {filter === 'all' ? 'No hay tareas. ¡Crea una!' : `No hay tareas ${filter === 'pending' ? 'pendientes' : 'completadas'}.`}
            </div>
          )}
        </div>
      )}

      {/* Confirm dialog para eliminar */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Eliminar tarea"
        message="¿Estás seguro de que querés eliminar esta tarea? Esta acción no se puede deshacer."
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  )
}

export default Tasks
