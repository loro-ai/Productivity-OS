import { useState, useRef } from 'react'
import useInbox from '../hooks/useInbox'
import InboxItem from '../components/ui/InboxItem'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const Inbox = () => {
  const [inputText, setInputText] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const inputRef = useRef(null)

  const { data: items, loading, create, convert, remove } = useInbox(showAll)

  // Guardar al presionar Enter
  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && inputText.trim()) {
      e.preventDefault()
      try {
        await create(inputText.trim())
        setInputText('')
      } catch (err) {
        console.error('Error guardando en bandeja:', err)
      }
    }
  }

  const handleConvert = async (id, to) => {
    try {
      await convert(id, to)
    } catch (err) {
      console.error('Error convirtiendo item:', err)
    }
  }

  const handleDelete = async (id) => {
    setDeleteTarget(null)
    await remove(id)
  }

  const unreadCount = items.filter((i) => !i.processed).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fadeUp">
        <div>
          <h1 className="font-sans text-xl font-bold text-white">Bandeja de entrada</h1>
          <p className="font-mono text-xs text-muted mt-0.5">
            {unreadCount} sin procesar
          </p>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className={`font-mono text-xs px-3 py-1.5 rounded border transition-hover ${
            showAll
              ? 'bg-info/10 text-info border-info/30'
              : 'text-muted border-muted/30 hover:text-white'
          }`}
        >
          {showAll ? 'Ver sin procesar' : 'Ver todos'}
        </button>
      </div>

      {/* Input de captura rápida estilo terminal */}
      <div className="animate-fadeUp delay-1">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-accent text-sm">›</span>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Captura cualquier idea aquí... [Enter para guardar]"
            className="w-full bg-surface border border-muted/40 hover:border-muted focus:border-accent rounded-lg pl-8 pr-4 py-4 font-mono text-sm text-white placeholder-muted transition-hover"
          />
        </div>
        <p className="font-mono text-xs text-muted mt-1.5 ml-1">
          Presiona Enter para guardar instantáneamente
        </p>
      </div>

      {/* Lista de items */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface border border-muted/30 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 font-mono text-sm text-muted animate-fadeUp">
          {showAll ? 'No hay items en la bandeja.' : 'La bandeja está vacía. ¡Bien hecho!'}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={item._id} className={`animate-fadeUp delay-${Math.min(idx + 1, 6)}`}>
              <InboxItem
                item={item}
                onConvert={handleConvert}
                onDelete={(id) => setDeleteTarget(id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Confirm dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Eliminar item"
        message="¿Estás seguro de que querés eliminar este item de la bandeja?"
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  )
}

export default Inbox
