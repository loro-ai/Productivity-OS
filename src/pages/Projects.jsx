import { useState } from 'react'
import useProjects from '../hooks/useProjects'
import useTasks from '../hooks/useTasks'
import ProjectCard from '../components/ui/ProjectCard'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const Projects = () => {
  const { data: projects, loading, create, updateProgress, remove } = useProjects()
  const { data: tasks } = useTasks()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', area: '', status: 'activo', dueDate: '' })
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.area.trim()) return
    try {
      await create({
        name: form.name,
        area: form.area,
        status: form.status,
        dueDate: form.dueDate || undefined,
      })
      setForm({ name: '', area: '', status: 'activo', dueDate: '' })
      setShowForm(false)
    } catch (err) {
      console.error('Error creando proyecto:', err)
    }
  }

  const handleDelete = async (id) => {
    setDeleteTarget(null)
    await remove(id)
  }

  const activeCount = projects.filter((p) => p.status === 'activo').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fadeUp">
        <div>
          <h1 className="font-sans text-xl font-bold text-white">Proyectos</h1>
          <p className="font-mono text-xs text-muted mt-0.5">
            {activeCount} activo{activeCount !== 1 ? 's' : ''} · {projects.length} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent text-black font-mono font-bold text-sm px-4 py-2 rounded hover:bg-green-400 transition-hover"
        >
          + Proyecto
        </button>
      </div>

      {/* Formulario inline */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-surface border border-accent/20 rounded-lg p-4 space-y-3 animate-fadeUp"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nombre del proyecto"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              autoFocus
              className="bg-surface2 border border-muted/40 rounded px-3 py-2 font-mono text-sm text-white placeholder-muted focus:border-accent"
            />
            <input
              type="text"
              placeholder="Área (ej: Trabajo, Personal, Estudio)"
              value={form.area}
              onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
              required
              className="bg-surface2 border border-muted/40 rounded px-3 py-2 font-mono text-sm text-white placeholder-muted focus:border-accent"
            />
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="bg-surface2 border border-muted/40 rounded px-3 py-2 font-mono text-sm text-white focus:border-accent"
            >
              <option value="activo">Activo</option>
              <option value="pausa">En pausa</option>
              <option value="planificado">Planificado</option>
            </select>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
              className="bg-surface2 border border-muted/40 rounded px-3 py-2 font-mono text-sm text-white focus:border-accent"
            />
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

      {/* Grid de proyectos */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-surface border border-muted/30 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 font-mono text-sm text-muted animate-fadeUp">
          No hay proyectos. ¡Crea el primero!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, idx) => (
            <div key={project._id} className={`animate-fadeUp delay-${Math.min(idx + 1, 6)}`}>
              <ProjectCard
                project={project}
                tasks={tasks}
                onUpdateProgress={updateProgress}
                onDelete={(id) => setDeleteTarget(id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Confirm dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Eliminar proyecto"
        message="¿Estás seguro de que querés eliminar este proyecto? Las tareas asociadas no se eliminarán."
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  )
}

export default Projects
