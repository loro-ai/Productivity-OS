import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Barra superior con nombre de sección, reloj en vivo, streak y acciones
const TopBar = ({ streak = 0, onFocusMode, onLogout }) => {
  const [time, setTime] = useState(new Date())
  const location = useLocation()
  const { user } = useAuth()

  // Actualizar reloj cada segundo
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Mapeo de rutas a nombres de sección
  const sectionNames = {
    '/dashboard': 'Dashboard',
    '/tasks': 'Tareas',
    '/habits': 'Hábitos',
    '/projects': 'Proyectos',
    '/inbox': 'Bandeja',
    '/routine': 'Rutina',
    '/manual': 'Manual',
  }

  const sectionName = sectionNames[location.pathname] || 'AM · Productivity OS'

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('es-AR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    })
  }

  return (
    <header className="fixed top-0 left-0 md:left-56 right-0 z-20 bg-[#0d0d0d]/95 backdrop-blur border-b border-muted/20 px-4 md:px-6 py-3 flex items-center justify-between">
      {/* Nombre de la sección activa */}
      <h2 className="font-sans font-semibold text-white text-base">{sectionName}</h2>

      {/* Controles del lado derecho */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Fecha y hora en vivo */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-muted">
          <span>{formatDate(time)}</span>
          <span className="text-accent">{formatTime(time)}</span>
        </div>

        {/* Streak counter */}
        {streak > 0 && (
          <div className="flex items-center gap-1 font-mono text-xs">
            <span>🔥</span>
            <span className="text-warn font-bold">{streak}</span>
          </div>
        )}

        {/* Modo Focus */}
        <button
          onClick={onFocusMode}
          className="hidden md:flex items-center gap-1.5 font-mono text-xs text-muted hover:text-accent border border-muted/30 hover:border-accent/30 rounded px-3 py-1.5 transition-hover"
          title="Activar modo focus"
        >
          🎯 Focus
        </button>

        {/* Nombre del usuario */}
        {user && (
          <span className="hidden lg:block font-mono text-xs text-muted">
            {user.name}
          </span>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          className="font-mono text-xs text-muted hover:text-danger transition-hover"
          title="Cerrar sesión"
        >
          ✕
        </button>
      </div>
    </header>
  )
}

export default TopBar
