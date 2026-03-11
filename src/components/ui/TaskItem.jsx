import { useState } from 'react'

// Componente de ítem de tarea con checkbox animado y botón eliminar en hover
const TaskItem = ({ task, onComplete, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const priorityColors = {
    alta: 'text-danger border-danger/30 bg-danger/10',
    media: 'text-warn border-warn/30 bg-warn/10',
    baja: 'text-accent border-accent/30 bg-accent/10',
  }

  const priorityLabels = {
    alta: '🔴 Alta',
    media: '🟡 Media',
    baja: '🟢 Baja',
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(task._id)
    } catch {
      setIsDeleting(false)
    }
  }

  const isDone = task.status === 'done'

  return (
    <div
      className={`group flex items-center gap-3 px-4 py-3 rounded-lg border transition-hover ${
        isDone
          ? 'border-muted/30 bg-surface/50 opacity-60'
          : 'border-muted/30 bg-surface hover:border-muted/60'
      } ${isDeleting ? 'opacity-30' : ''}`}
    >
      {/* Checkbox personalizado */}
      <input
        type="checkbox"
        className="custom-checkbox"
        checked={isDone}
        onChange={() => onComplete(task._id)}
      />

      {/* Título con tachado al completar */}
      <span
        className={`flex-1 font-mono text-sm transition-all duration-300 ${
          isDone ? 'line-through text-muted' : 'text-gray-200'
        }`}
      >
        {task.title}
      </span>

      {/* Tag de prioridad */}
      <span
        className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded border font-mono text-xs ${
          priorityColors[task.priority] || priorityColors.media
        }`}
      >
        {priorityLabels[task.priority] || task.priority}
      </span>

      {/* Fecha límite */}
      {task.dueDate && (
        <span className="hidden md:block font-mono text-xs text-muted">
          {new Date(task.dueDate).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
          })}
        </span>
      )}

      {/* Botón eliminar (visible en hover) */}
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 text-danger hover:text-red-400 transition-hover font-mono text-xs px-2 py-1 rounded border border-transparent hover:border-danger/30"
        title="Eliminar tarea"
      >
        ✕
      </button>
    </div>
  )
}

export default TaskItem
