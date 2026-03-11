import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

// Hook para gestión de rutinas diarias (mañana/noche)
const useRoutine = (type) => {
  const [routine, setRoutine] = useState(null)
  const [todayLog, setTodayLog] = useState({ completedItems: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRoutine = useCallback(async () => {
    try {
      setLoading(true)
      const [routineRes, logRes] = await Promise.all([
        api.get(`/routine/${type}`),
        api.get(`/routine/${type}/log/today`),
      ])
      setRoutine(routineRes.data)
      setTodayLog(logRes.data || { completedItems: [] })
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar rutina')
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    fetchRoutine()
  }, [fetchRoutine])

  // Actualizar lista de ítems de la rutina
  const updateItems = async (items) => {
    try {
      const res = await api.patch(`/routine/${type}/items`, { items })
      setRoutine(res.data)
      return res.data
    } catch (err) {
      throw err
    }
  }

  // Guardar log del día con los ítems completados
  const saveLog = async (completedItems) => {
    try {
      const res = await api.post(`/routine/${type}/log`, { completedItems })
      setTodayLog(res.data)
      return res.data
    } catch (err) {
      throw err
    }
  }

  // Toggle de un ítem en el log de hoy
  const toggleItem = async (itemId) => {
    const currentCompleted = todayLog.completedItems || []
    const isCompleted = currentCompleted.some((id) => id.toString() === itemId.toString())

    const newCompleted = isCompleted
      ? currentCompleted.filter((id) => id.toString() !== itemId.toString())
      : [...currentCompleted, itemId]

    // Actualizar estado local inmediatamente
    setTodayLog((prev) => ({ ...prev, completedItems: newCompleted }))

    try {
      await saveLog(newCompleted)
    } catch (err) {
      // Revertir en caso de error
      setTodayLog((prev) => ({ ...prev, completedItems: currentCompleted }))
      throw err
    }
  }

  return { routine, todayLog, loading, error, updateItems, saveLog, toggleItem, refetch: fetchRoutine }
}

export default useRoutine
