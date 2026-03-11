import axios from 'axios'

// Instancia de axios con baseURL desde variable de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de request: agregar JWT en cada petición
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
      // Limpiar sesión y redirigir al login
      localStorage.removeItem('am_token')
      localStorage.removeItem('am_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
