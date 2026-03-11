import { useState } from 'react'

// Tarjeta de proyecto con progreso, estado y expansión de tareas
const ProjectCard = ({ project, tasks = [], onUpdateProgress, onDelete, onUpdate }) => {
  const [expanded, setExpanded] = useState(false)

  const statusConfig = {
    activo: { label: 'Activo', color: 'text-accent border-accent/30 bg-accent/10' },
    pausa: { label: 'Pausa', color: 'text-warn border-warn/30 bg-warn/10' },
    planificado: { label: 'Planificado', color: 'text-info border-info/30 bg-info/10' },
  }

  const status = statusConfig[project.status] || statusConfig.activo

  // Tareas asociadas a este proyecto
  const projectTasks = tasks.filter(
    (t) => t.projectId && (t.projectId._id === project._id || t.projectId === project._id)
  )

  return (
    <div className="bg-surface border border-muted/30 rounded-lg p-5 hover:border-muted/60 transition-hover animate-fadeUp">
      {/* Header de la tarjeta */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-sans font-semibold text-white truncate">{project.name}</h3>
          <span className="font-mono text-xs text-muted">{project.area}</span>
        </div>

        {/* Pill de estado */}
        <span
          className={`ml-3 flex-shrink-0 px-2 py-0.5 rounded border font-mono text-xs ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      {/* Barra de progreso con botones +5% / -5% */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-xs text-muted">Progreso</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateProgress(project._id, Math.max(0, project.progress - 5))}
              className="font-mono text-xs text-muted hover:text-white border border-muted/30 hover:border-muted rounded px-2 py-0.5 transition-hover"
            >
              -5%
            </button>
            <span className="font-mono text-sm text-accent font-bold w-10 text-center">
              {project.progress}%
            </span>
            <button
              onClick={() => onUpdateProgress(project._id, Math.min(100, project.progress + 5))}
              className="font-mono text-xs text-muted hover:text-white border border-muted/30 hover:border-muted rounded px-2 py-0.5 transition-hover"
            >
              +5%
            </button>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      {/* Fecha límite */}
      {project.dueDate && (
        <div className="flex items-center gap-1 mb-3">
          <span className="font-mono text-xs text-muted">Fecha límite:</span>
          <span className="font-mono text-xs text-gray-300">
            {new Date(project.dueDate).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      )}

      {/* Footer: tareas y acciones */}
      <div className="flex items-center justify-between">
        {/* Botón expandir tareas */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="font-mono text-xs text-muted hover:text-accent transition-hover"
        >
          {projectTasks.length} tarea{projectTasks.length !== 1 ? 's' : ''}{' '}
          {expanded ? '▲' : '▼'}
        </button>

        {/* Botón eliminar */}
        <button
          onClick={() => onDelete(project._id)}
          className="font-mono text-xs text-muted hover:text-danger transition-hover"
          title="Eliminar proyecto"
        >
          ✕
        </button>
      </div>

      {/* Lista de tareas expandida */}
      {expanded && projectTasks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-muted/20 space-y-1">
          {projectTasks.map((task) => (
            <div
              key={task._id}
              className="flex items-center gap-2 font-mono text-xs text-gray-400"
            >
              <span>{task.status === 'done' ? '✓' : '○'}</span>
              <span className={task.status === 'done' ? 'line-through text-muted' : ''}>
                {task.title}
              </span>
            </div>
          ))}
        </div>
      )}

      {expanded && projectTasks.length === 0 && (
        <div className="mt-3 pt-3 border-t border-muted/20 font-mono text-xs text-muted text-center">
          Sin tareas asociadas
        </div>
      )}
    </div>
  )
}

export default ProjectCard
