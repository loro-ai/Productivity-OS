// Ítem de bandeja de entrada con acciones de conversión y eliminación
const InboxItem = ({ item, onConvert, onDelete }) => {
  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    if (isToday) return `Hoy ${formatTime(dateStr)}`

    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
    }) + ' ' + formatTime(dateStr)
  }

  return (
    <div className="group flex items-start gap-3 px-4 py-3 rounded-lg border border-muted/30 bg-surface hover:border-muted/60 transition-hover animate-fadeUp">
      {/* Indicador de estado */}
      <div className="mt-1 flex-shrink-0">
        {item.processed ? (
          <span className="text-muted text-xs">✓</span>
        ) : (
          <span className="w-2 h-2 rounded-full bg-accent block mt-1"></span>
        )}
      </div>

      {/* Texto del item */}
      <div className="flex-1 min-w-0">
        <p className={`font-mono text-sm ${item.processed ? 'text-muted line-through' : 'text-gray-200'}`}>
          {item.text}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="font-mono text-xs text-muted">{formatDate(item.createdAt)}</span>
          {item.convertedTo && (
            <span className="font-mono text-xs text-info">
              → convertido a {item.convertedTo === 'task' ? 'tarea' : 'proyecto'}
            </span>
          )}
        </div>
      </div>

      {/* Acciones (visibles siempre en mobile, en hover en desktop) */}
      {!item.processed && (
        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-hover flex-shrink-0">
          <button
            onClick={() => onConvert(item._id, 'task')}
            className="font-mono text-xs px-2 py-1 rounded border border-accent/30 text-accent hover:bg-accent/10 transition-hover"
            title="Convertir a tarea"
          >
            → Tarea
          </button>
          <button
            onClick={() => onConvert(item._id, 'project')}
            className="font-mono text-xs px-2 py-1 rounded border border-info/30 text-info hover:bg-info/10 transition-hover"
            title="Convertir a proyecto"
          >
            → Proyecto
          </button>
        </div>
      )}

      {/* Botón eliminar */}
      <button
        onClick={() => onDelete(item._id)}
        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-muted hover:text-danger transition-hover font-mono text-xs flex-shrink-0"
        title="Eliminar"
      >
        🗑
      </button>
    </div>
  )
}

export default InboxItem
