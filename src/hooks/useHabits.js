import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

// Hook para gestión de hábitos semanales
const useHabits = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/habits')
      setData(res.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar hábitos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  const create = async (body) => {
    try {
      const res = await api.post('/habits', body)
      setData((prev) => [...prev, res.data])
      return res.data
    } catch (err) {
      throw err
    }
  }

  // Toggle de un día específico para un hábito
  const toggle = async (id, date) => {
    try {
      const res = await api.patch(`/habits/${id}/toggle`, { date })
      setData((prev) => prev.map((h) => (h._id === id ? res.data : h)))
      return res.data
    } catch (err) {
      throw err
    }
  }

  const remove = async (id) => {
    setData((prev) => prev.filter((h) => h._id !== id))
    try {
      await api.delete(`/habits/${id}`)
    } catch (err) {
      await fetchHabits()
      throw err
    }
  }

  const resetWeek = async () => {
    try {
      await api.post('/habits/reset-week')
      await fetchHabits()
    } catch (err) {
      throw err
    }
  }

  return { data, loading, error, create, toggle, remove, resetWeek, refetch: fetchHabits }
}

export default useHabits
