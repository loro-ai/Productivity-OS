import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layout
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import BottomNav from './components/layout/BottomNav'

// Páginas
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Habits from './pages/Habits'
import Projects from './pages/Projects'
import Inbox from './pages/Inbox'
import Routine from './pages/Routine'
import Manual from './pages/Manual'

// Componentes especiales
import SpotlightSearch from './components/ui/SpotlightSearch'
import PomodoroTimer from './components/ui/PomodoroTimer'

// Hooks para datos globales
import useInbox from './hooks/useInbox'
import useTasks from './hooks/useTasks'
import useProjects from './hooks/useProjects'

// Ruta protegida: redirige al login si no hay token
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
        <div className="font-mono text-accent text-sm animate-pulse">Cargando...</div>
      </div>
    )
  }

  return token ? children : <Navigate to="/login" replace />
}

// Layout principal de la app (con sidebar, topbar y bottom nav)
const AppLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const [focusMode, setFocusMode] = useState(false)
  const [spotlightOpen, setSpotlightOpen] = useState(false)

  // Datos globales para spotlight y sidebar
  const { data: inboxItems } = useInbox()
  const { data: tasks } = useTasks()
  const { data: projects } = useProjects()

  const inboxCount = inboxItems.filter((i) => !i.processed).length

  // Activar spotlight con "/"
  useEffect(() => {
    const handleKeyDown = (e) => {
      // No activar si el foco está en un input o textarea
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
      ) {
        e.preventDefault()
        setSpotlightOpen(true)
      }
      if (e.key === 'Escape') {
        setSpotlightOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Modo focus: oculta sidebar y topbar
  if (focusMode) {
    const topTasks = tasks
      .filter((t) => t.priority === 'alta' && t.status === 'pending')
      .slice(0, 3)

    return (
      <PomodoroTimer
        topTasks={topTasks}
        onExit={() => setFocusMode(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Sidebar (desktop) */}
      <Sidebar
        inboxCount={inboxCount}
        onFocusMode={() => setFocusMode(true)}
      />

      {/* TopBar */}
      <TopBar
        streak={user?.streak || 0}
        onFocusMode={() => setFocusMode(true)}
        onLogout={logout}
      />

      {/* Contenido principal */}
      <main className="md:ml-56 pt-16 pb-20 md:pb-6 px-4 md:px-8 py-6 min-h-screen">
        <div className="max-w-5xl mx-auto pt-4">
          {children}
        </div>
      </main>

      {/* Bottom nav (mobile) */}
      <BottomNav inboxCount={inboxCount} />

      {/* Spotlight Search */}
      <SpotlightSearch
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        tasks={tasks}
        projects={projects}
      />
    </div>
  )
}

const App = () => {
  const { token } = useAuth()
  const location = useLocation()

  return (
    <Routes>
      {/* Ruta de login */}
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Rutas protegidas con layout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/habits" element={<Habits />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/routine" element={<Routine />} />
                <Route path="/manual" element={<Manual />} />
                {/* Redirect por defecto */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
