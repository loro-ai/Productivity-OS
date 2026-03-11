import { useState, useEffect } from 'react'

// Componente de confirmación reutilizable — nunca usar window.confirm()
// Para acciones críticas con requireTyping=true, el usuario debe escribir "RESET"
const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  requireTyping = false,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}) => {
  const [typedValue, setTypedValue] = useState('')

  // Limpiar el campo al abrir/cerrar
  useEffect(() => {
    if (!isOpen) setTypedValue('')
  }, [isOpen])

  if (!isOpen) return null

  const canConfirm = requireTyping ? typedValue === 'RESET' : true

  const variantStyles = {
    danger: 'bg-danger text-black hover:bg-red-400',
    warn: 'bg-warn text-black hover:bg-yellow-300',
    accent: 'bg-accent text-black hover:bg-green-400',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-surface border border-muted rounded-lg p-6 w-full max-w-md mx-4 animate-fadeUp">
        {/* Título */}
        <h3 className="font-sans text-lg font-semibold text-white mb-2">{title}</h3>

        {/* Mensaje */}
        <p className="font-mono text-sm text-gray-400 mb-4">{message}</p>

        {/* Campo de escritura para acciones críticas */}
        {requireTyping && (
          <div className="mb-4">
            <p className="font-mono text-xs text-warn mb-2">
              Escribe <span className="text-white font-bold">RESET</span> para confirmar:
            </p>
            <input
              type="text"
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
              className="w-full bg-surface2 border border-muted rounded px-3 py-2 font-mono text-sm text-white focus:border-danger"
              placeholder="RESET"
              autoFocus
            />
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 font-mono text-sm text-gray-400 border border-muted rounded hover:border-gray-300 hover:text-white transition-hover"
          >
            {cancelText}
          </button>
          <button
            onClick={canConfirm ? onConfirm : undefined}
            disabled={!canConfirm}
            className={`px-4 py-2 font-mono text-sm font-bold rounded transition-hover ${
              canConfirm
                ? variantStyles[variant] || variantStyles.danger
                : 'bg-muted text-gray-600 cursor-not-allowed'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
