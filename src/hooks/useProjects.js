import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

// Hook para gestión de proyectos
const useProjects = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/projects')
      setData(res.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar proyectos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const create = async (body) => {
    try {
      const res = await api.post('/projects', body)
      setData((prev) => [res.data, ...prev])
      return res.data
    } catch (err) {
      throw err
    }
  }

  const update = async (id, body) => {
    setData((prev) => prev.map((p) => (p._id === id ? { ...p, ...body } : p)))
    try {
      const res = await api.patch(`/projects/${id}`, body)
      setData((prev) => prev.map((p) => (p._id === id ? res.data : p)))
      return res.data
    } catch (err) {
      await fetchProjects()
      throw err
    }
  }

  const updateProgress = async (id, progress) => {
    setData((prev) => prev.map((p) => (p._id === id ? { ...p, progress } : p)))
    try {
      const res = await api.patch(`/projects/${id}/progress`, { progress })
      setData((prev) => prev.map((p) => (p._id === id ? res.data : p)))
      return res.data
    } catch (err) {
      await fetchProjects()
      throw err
    }
  }

  const remove = async (id) => {
    setData((prev) => prev.filter((p) => p._id !== id))
    try {
      await api.delete(`/projects/${id}`)
    } catch (err) {
      await fetchProjects()
      throw err
    }
  }

  return { data, loading, error, create, update, updateProgress, remove, refetch: fetchProjects }
}

export default useProjects
