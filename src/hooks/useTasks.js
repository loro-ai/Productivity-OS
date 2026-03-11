import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

// Hook para gestión de tareas con actualización optimista
const useTasks = (filters = {}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Construir query string desde filtros
  const buildQuery = (f) => {
    const params = new URLSearchParams()
    if (f.status) params.append('status', f.status)
    if (f.priority) params.append('priority', f.priority)
    if (f.date) params.append('date', f.date)
    return params.toString()
  }

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const query = buildQuery(filters)
      const res = await api.get(`/tasks${query ? '?' + query : ''}`)
      setData(res.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar tareas')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Crear tarea con actualización optimista
  const create = async (body) => {
    const tempId = 'temp_' + Date.now()
    const optimistic = { _id: tempId, status: 'pending', priority: 'media', ...body }
    setData((prev) => [optimistic, ...prev])

    try {
      const res = await api.post('/tasks', body)
      setData((prev) => prev.map((t) => (t._id === tempId ? res.data : t)))
      return res.data
    } catch (err) {
      setData((prev) => prev.filter((t) => t._id !== tempId))
      throw err
    }
  }

  // Actualizar tarea
  const update = async (id, body) => {
    setData((prev) => prev.map((t) => (t._id === id ? { ...t, ...body } : t)))
    try {
      const res = await api.patch(`/tasks/${id}`, body)
      setData((prev) => prev.map((t) => (t._id === id ? res.data : t)))
      return res.data
    } catch (err) {
      await fetchTasks()
      throw err
    }
  }

  // Toggle completar tarea
  const complete = async (id) => {
    try {
      const res = await api.patch(`/tasks/${id}/complete`)
      setData((prev) => prev.map((t) => (t._id === id ? res.data : t)))
      return res.data
    } catch (err) {
      throw err
    }
  }

  // Eliminar tarea
  const remove = async (id) => {
    setData((prev) => prev.filter((t) => t._id !== id))
    try {
      await api.delete(`/tasks/${id}`)
    } catch (err) {
      await fetchTasks()
      throw err
    }
  }

  return { data, loading, error, create, update, complete, remove, refetch: fetchTasks }
}

export default useTasks
