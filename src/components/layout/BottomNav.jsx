import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const BottomNav = ({ inboxCount = 0 }) => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const navItems = [
    { path: '/dashboard', icon: '🏠' },
    { path: '/tasks', icon: '✅' },
    { path: '/habits', icon: '🌱' },
    { path: '/projects', icon: '🚀' },
    { path: '/inbox', icon: '📥', badge: inboxCount },
    { path: '/routine', icon: '🔁' },
    isAdmin
      ? { path: '/manual', icon: '⚙️' }
      : { path: '/guia', icon: '📖' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-muted/30 flex items-center justify-around px-2 py-2">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `relative flex items-center justify-center w-10 h-10 rounded-lg transition-hover ${
              isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:text-white'
            }`
          }
        >
          <span className="text-lg">{item.icon}</span>
          {item.badge > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-black font-bold font-mono text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {item.badge > 9 ? '9+' : item.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
