import { createContext, useContext, useState, useEffect } from 'react'

// Contexto de autenticación: token en memoria + localStorage
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Al montar, recuperar token y usuario del localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('am_token')
    const savedUser = localStorage.getItem('am_user')

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('am_token')
        localStorage.removeItem('am_user')
      }
    }
    setLoading(false)
  }, [])

  // Guardar token y usuario tras login/registro exitoso
  const login = (tokenValue, userData) => {
    setToken(tokenValue)
    setUser(userData)
    localStorage.setItem('am_token', tokenValue)
    localStorage.setItem('am_user', JSON.stringify(userData))
  }

  // Limpiar sesión
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('am_token')
    localStorage.removeItem('am_user')
  }

  // Actualizar datos del usuario (ej: streak)
  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('am_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook de acceso rápido al contexto
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

export default AuthContext
