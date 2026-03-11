// Componente Badge para etiquetas de tipo [ARCHIVO] [COMANDO] [TIP] etc.
// Variantes de color según el tipo de badge
const Badge = ({ type, children }) => {
  const variants = {
    ARCHIVO: 'bg-info/10 text-info border-info/20',
    COMANDO: 'bg-accent/10 text-accent border-accent/20',
    VARIABLE: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
    ADVERTENCIA: 'bg-danger/10 text-danger border-danger/20',
    TIP: 'bg-warn/10 text-warn border-warn/20',
  }

  const style = variants[type] || 'bg-muted/10 text-gray-400 border-muted/20'

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border font-mono text-xs font-bold ${style}`}
    >
      [{type}] {children}
    </span>
  )
}

export default Badge
