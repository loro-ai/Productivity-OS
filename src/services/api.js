import axios from 'axios'

// Instancia de axios con baseURL desde variable de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// V-12: el token se guarda en localStorage por compatibilidad con SPA pura.
// Mitigación: el servidor implementa Content-Security-Policy para reducir
// el riesgo de XSS. Si se migra a SSR/BFF, reemplazar por httpOnly cookies.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('am_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de response: logout automático si recibe 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('am_token')
      localStorage.removeItem('am_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
