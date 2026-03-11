import { useState, useEffect, useRef } from 'react'
import useRoutine from '../hooks/useRoutine'

// Columna de rutina (mañana o noche)
const RoutineColumn = ({ type, icon, label }) => {
  const { routine, todayLog, loading, updateItems, toggleItem } = useRoutine(type)
  const [newItemText, setNewItemText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const editRef = useRef(null)

  // Enfocar el input de edición al activarse
  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus()
    }
  }, [editingId])

  const items = routine?.items || []
  const completedIds = todayLog?.completedItems || []

  const isCompleted = (itemId) =>
    completedIds.some((id) => id.toString() === itemId.toString())

  // Progreso de la rutina
  const progress = items.length > 0
    ? Math.round((completedIds.length / items.length) * 100)
    : 0

  // Agregar nuevo ítem
  const handleAddItem = async () => {
    if (!newItemText.trim()) return
    const newItems = [
      ...items,
      { text: newItemText.trim(), order: items.length },
    ]
    try {
      await updateItems(newItems)
      setNewItemText('')
    } catch (err) {
      console.error('Error agregando ítem:', err)
    }
  }

  // Eliminar ítem
  const handleDeleteItem = async (itemId) => {
    const newItems = items.filter((i) => i._id.toString() !== itemId.toString())
    try {
      await updateItems(newItems)
    } catch (err) {
      console.error('Error eliminando ítem:', err)
    }
  }

  // Guardar edición con doble click
  const handleSaveEdit = async (itemId) => {
    if (!editText.trim()) {
      setEditingId(null)
      return
    }
    const newItems = items.map((i) =>
      i._id.toString() === itemId.toString() ? { ...i, text: editText } : i
    )
    try {
      await updateItems(newItems)
      setEditingId(null)
    } catch (err) {
      console.error('Error editando ítem:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-2">
        <div className="h-6 bg-surface border border-muted/30 rounded animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-surface border border-muted/30 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0">
      {/* Header de la columna */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-sans font-semibold text-white flex items-center gap-2">
          <span>{icon}</span> {label}
        </h2>
        <span className="font-mono text-xs text-accent">{progress}%</span>
      </div>

      {/* Barra de progreso */}
      <div className="progress-bar mb-4">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Lista de ítems */}
      <div className="space-y-2 mb-3">
        {items.map((item) => {
          const done = isCompleted(item._id)
          return (
            <div
              key={item._id}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-hover ${
                done
                  ? 'border-accent/20 bg-accent/5'
                  : 'border-muted/30 bg-surface hover:border-muted/60'
              }`}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={done}
                onChange={() => toggleItem(item._id)}
              />

              {/* Texto (doble click para editar) */}
              {editingId === item._id.toString() ? (
                <input
                  ref={editRef}
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => handleSaveEdit(item._id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(item._id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  className="flex-1 bg-transparent font-mono text-sm text-white outline-none border-b border-accent"
                />
              ) : (
                <span
                  onDoubleClick={() => {
                    setEditingId(item._id.toString())
                    setEditText(item.text)
                  }}
                  className={`flex-1 font-mono text-sm cursor-text ${
                    done ? 'line-through text-muted' : 'text-gray-200'
                  }`}
                  title="Doble click para editar"
                >
                  {item.text}
                </span>
              )}

              {/* Botón eliminar */}
              <button
                onClick={() => handleDeleteItem(item._id)}
                className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger transition-hover font-mono text-xs"
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>

      {/* Input para agregar nuevo ítem */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="Agregar ítem..."
          className="flex-1 bg-surface2 border border-muted/40 rounded px-3 py-2 font-mono text-sm text-white placeholder-muted focus:border-accent"
        />
        <button
          onClick={handleAddItem}
          className="font-mono text-sm text-accent border border-accent/30 rounded px-3 py-2 hover:bg-accent/10 transition-hover"
        >
          +
        </button>
      </div>
    </div>
  )
}

const Routine = () => {
  const [time, setTime] = useState(new Date())

  // Reloj en vivo actualizado cada segundo
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatClock = (date) => {
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header con reloj en vivo */}
      <div className="flex items-center justify-between animate-fadeUp">
        <h1 className="font-sans text-xl font-bold text-white">Rutina diaria</h1>
        <div className="font-mono text-2xl text-accent font-bold tracking-wider">
          {formatClock(time)}
        </div>
      </div>

      {/* Dos columnas: Mañana / Noche */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeUp delay-1">
        <div className="bg-surface border border-muted/30 rounded-lg p-5">
          <RoutineColumn type="morning" icon="☀️" label="Mañana" />
        </div>
        <div className="bg-surface border border-muted/30 rounded-lg p-5">
          <RoutineColumn type="night" icon="🌙" label="Noche" />
        </div>
      </div>

      {/* Hint de edición */}
      <p className="font-mono text-xs text-muted text-center animate-fadeUp delay-2">
        Doble click en un ítem para editarlo · Los checks se resetean automáticamente al cambiar de día
      </p>
    </div>
  )
}

export default Routine
