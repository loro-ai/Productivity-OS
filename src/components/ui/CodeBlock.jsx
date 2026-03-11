import { useState } from 'react'

// Bloque de código con botón Copiar — cambia a "Copiado ✓" por 2 segundos
const CodeBlock = ({ code, language = '' }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback para navegadores sin clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative rounded-lg border border-accent/20 bg-[#0a0a0a] overflow-hidden my-3">
      {/* Header con lenguaje y botón copiar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-accent/10">
        {language && (
          <span className="font-mono text-xs text-muted uppercase tracking-wider">{language}</span>
        )}
        <button
          onClick={handleCopy}
          className={`ml-auto font-mono text-xs px-3 py-1 rounded border transition-hover ${
            copied
              ? 'border-accent/50 text-accent bg-accent/10'
              : 'border-muted text-gray-400 hover:border-accent/50 hover:text-accent'
          }`}
        >
          {copied ? 'Copiado ✓' : 'Copiar'}
        </button>
      </div>

      {/* Contenido del código */}
      <pre className="p-4 overflow-x-auto font-mono text-sm text-gray-300 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default CodeBlock
