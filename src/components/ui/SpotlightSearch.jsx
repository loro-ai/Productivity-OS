import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Spotlight Search — activar con "/" en cualquier parte de la app
// Busca en tiempo real entre tareas y proyectos
const SpotlightSearch = ({ isOpen, onClose, tasks = [], projects = [] }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Enfocar el input al abrir
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Filtrar resultados en tiempo real
  const results = query.trim()
    ? [
        ...tasks
          .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
          .map((t) => ({
            id: t._id,
            label: t.title,
            type: 'task',
            icon: t.status === 'done' ? '✓' : '○',
            path: '/tasks',
          })),
        ...projects
          .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
          .map((p) => ({
            id: p._id,
            label: p.name,
            type: 'project',
            icon: '🚀',
            path: '/projects',
          })),
      ]
    : []

  // Navegación con teclado
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex])
    }
  }

  const handleSelect = (result) => {
    navigate(result.path)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/80 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-xl mx-4 animate-fadeUp">
        {/* Input de búsqueda */}
        <div className="bg-surface border border-muted/60 rounded-lg overflow-hidden">
          <div className="flex items-center px-4 py-3 border-b border-muted/30">
            <span className="text-muted mr-3 font-mono text-sm">🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Buscar tareas y proyectos..."
              className="flex-1 bg-transparent font-mono text-sm text-white placeholder-muted outline-none"
            />
            <span className="font-mono text-xs text-muted ml-3">ESC para cerrar</span>
          </div>

          {/* Resultados */}
          {results.length > 0 && (
            <div className="max-h-64 overflow-y-auto">
              {results.map((result, i) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-hover ${
                    i === selectedIndex
                      ? 'bg-accent/10 border-l-2 border-accent'
                      : 'hover:bg-surface2 border-l-2 border-transparent'
                  }`}
                >
                  <span className="font-mono text-sm">{result.icon}</span>
                  <span className="font-mono text-sm text-gray-200 flex-1">{result.label}</span>
                  <span className={`font-mono text-xs ${
                    result.type === 'task' ? 'text-accent' : 'text-info'
                  }`}>
                    {result.type === 'task' ? 'Tarea' : 'Proyecto'}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Sin resultados */}
          {query.trim() && results.length === 0 && (
            <div className="px-4 py-6 text-center font-mono text-sm text-muted">
              Sin resultados para "{query}"
            </div>
          )}

          {/* Hint cuando no hay búsqueda */}
          {!query.trim() && (
            <div className="px-4 py-4 font-mono text-xs text-muted text-center">
              Escribe para buscar en tareas y proyectos
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SpotlightSearch
