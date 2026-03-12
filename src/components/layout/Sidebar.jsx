import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const Sidebar = ({ inboxCount = 0, onFocusMode }) => {
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'admin'

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/tasks', icon: '✅', label: 'Tareas' },
    { path: '/habits', icon: '🌱', label: 'Hábitos' },
    { path: '/projects', icon: '🚀', label: 'Proyectos' },
    { path: '/inbox', icon: '📥', label: 'Bandeja', badge: inboxCount },
    { path: '/routine', icon: '🔁', label: 'Rutina' },
    // Admin ve el manual técnico, usuarios ven la guía de uso
    isAdmin
      ? { path: '/manual', icon: '⚙️', label: 'Manual dev' }
      : { path: '/guia', icon: '📖', label: 'Guía de uso' },
  ]

  const handleExport = async () => {
    try {
      const res = await api.get('/export')
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `am-productivity-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error al exportar:', err)
    }
  }

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-surface border-r border-muted/30 px-4 py-6 fixed left-0 top-0 bottom-0 z-30">
      <div className="mb-8">
        <div className="font-sans text-2xl font-extrabold tracking-tight">
          <span className="text-white">A</span>
          <span className="text-accent">M</span>
        </div>
        <div className="font-mono text-xs text-muted mt-0.5">Productivity OS</div>
        <a
          href="https://alexismouwid.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-muted hover:text-accent transition-hover block mt-1"
        >
          alexismouwid.com ↗
        </a>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm transition-hover ${
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-gray-400 hover:text-white hover:bg-surface2 border border-transparent'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.badge > 0 && (
              <span className="bg-accent text-black font-bold font-mono text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-2 mt-6 pt-6 border-t border-muted/20">
        <button
          onClick={onFocusMode}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm text-gray-400 hover:text-accent hover:bg-accent/10 border border-transparent hover:border-accent/20 transition-hover"
        >
          <span>🎯</span>
          <span>Modo Focus</span>
        </button>

        <button
          onClick={handleExport}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm text-gray-400 hover:text-info hover:bg-info/10 border border-transparent hover:border-info/20 transition-hover"
        >
          <span>⬇</span>
          <span>Exportar datos</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm text-gray-400 hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-hover"
        >
          <span>→</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
