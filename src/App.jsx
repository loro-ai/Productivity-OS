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
import UserGuide from './pages/UserGuide'

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

// Ruta solo para admins: redirige al dashboard si el usuario no es admin
const AdminRoute = ({ children }) => {
  const { user } = useAuth()
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />
}

// Layout principal de la app (con sidebar, topbar y bottom nav)
const AppLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const [focusMode, setFocusMode] = useState(false)
  const [spotlightOpen, setSpotlightOpen] = useState(false)

  const { data: inboxItems } = useInbox()
  const { data: tasks } = useTasks()
  const { data: projects } = useProjects()

  const inboxCount = inboxItems.filter((i) => !i.processed).length

  useEffect(() => {
    const handleKeyDown = (e) => {
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
      <Sidebar inboxCount={inboxCount} onFocusMode={() => setFocusMode(true)} />
      <TopBar
        streak={user?.streak || 0}
        onFocusMode={() => setFocusMode(true)}
        onLogout={logout}
      />
      <main className="md:ml-56 pt-16 pb-20 md:pb-6 px-4 md:px-8 py-6 min-h-screen">
        <div className="max-w-5xl mx-auto pt-4">
          {children}
        </div>
      </main>
      <BottomNav inboxCount={inboxCount} />
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

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />

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
                {/* Manual técnico: solo admin */}
                <Route path="/manual" element={<AdminRoute><Manual /></AdminRoute>} />
                {/* Guía de usuario: todos los usuarios */}
                <Route path="/guia" element={<UserGuide />} />
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
