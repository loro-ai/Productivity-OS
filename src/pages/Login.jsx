import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

// Página de login y registro en la misma vista con tabs
const Login = () => {
  const [tab, setTab] = useState('login')  // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = tab === 'login' ? '/auth/login' : '/auth/register'
      const body = tab === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }

      const res = await api.post(endpoint, body)
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al autenticar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-4">
      <div className="w-full max-w-sm animate-fadeUp">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-sans text-4xl font-extrabold tracking-tight mb-1">
            <span className="text-white">A</span>
            <span className="text-accent">M</span>
          </div>
          <div className="font-mono text-sm text-muted">Productivity OS</div>
          <a
            href="https://alexismouwid.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted hover:text-accent transition-hover"
          >
            alexismouwid.com
          </a>
        </div>

        {/* Card del formulario */}
        <div className="bg-surface border border-muted/30 rounded-lg p-6">
          {/* Tabs */}
          <div className="flex mb-6 border border-muted/30 rounded-lg overflow-hidden">
            <button
              onClick={() => { setTab('login'); setError('') }}
              className={`flex-1 py-2.5 font-mono text-sm transition-hover ${
                tab === 'login'
                  ? 'bg-accent/10 text-accent border-r border-muted/30'
                  : 'text-muted hover:text-white border-r border-muted/30'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => { setTab('register'); setError('') }}
              className={`flex-1 py-2.5 font-mono text-sm transition-hover ${
                tab === 'register'
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:text-white'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo nombre (solo en registro) */}
            {tab === 'register' && (
              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre"
                  className="w-full bg-surface2 border border-muted/40 rounded px-3 py-2.5 font-mono text-sm text-white placeholder-muted focus:border-accent transition-hover"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block font-mono text-xs text-muted mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
                className="w-full bg-surface2 border border-muted/40 rounded px-3 py-2.5 font-mono text-sm text-white placeholder-muted focus:border-accent transition-hover"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block font-mono text-xs text-muted mb-1.5">Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-surface2 border border-muted/40 rounded px-3 py-2.5 font-mono text-sm text-white placeholder-muted focus:border-accent transition-hover"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="font-mono text-xs text-danger bg-danger/10 border border-danger/20 rounded px-3 py-2">
                {error}
              </div>
            )}

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-black font-mono font-bold py-3 rounded hover:bg-green-400 transition-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Cargando...'
                : tab === 'login'
                ? 'Iniciar sesión'
                : 'Crear cuenta'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center font-mono text-xs text-muted mt-6">
          Hecho por{' '}
          <a
            href="https://alexismouwid.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Alexis Mouwid
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
