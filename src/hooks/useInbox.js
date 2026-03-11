import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

// Hook para gestión de la bandeja de entrada
const useInbox = (showAll = false) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchInbox = useCallback(async () => {
    try {
      setLoading(true)
      const query = showAll ? '' : '?processed=false'
      const res = await api.get(`/inbox${query}`)
      setData(res.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar bandeja')
    } finally {
      setLoading(false)
    }
  }, [showAll])

  useEffect(() => {
    fetchInbox()
  }, [fetchInbox])

  const create = async (text) => {
    const tempId = 'temp_' + Date.now()
    const optimistic = { _id: tempId, text, processed: false, createdAt: new Date().toISOString() }
    setData((prev) => [optimistic, ...prev])

    try {
      const res = await api.post('/inbox', { text })
      setData((prev) => prev.map((i) => (i._id === tempId ? res.data : i)))
      return res.data
    } catch (err) {
      setData((prev) => prev.filter((i) => i._id !== tempId))
      throw err
    }
  }

  const convert = async (id, to) => {
    try {
      const res = await api.patch(`/inbox/${id}/convert`, { to })
      // Remover el item convertido de la lista (ya está procesado)
      setData((prev) => prev.filter((i) => i._id !== id))
      return res.data
    } catch (err) {
      throw err
    }
  }

  const remove = async (id) => {
    setData((prev) => prev.filter((i) => i._id !== id))
    try {
      await api.delete(`/inbox/${id}`)
    } catch (err) {
      await fetchInbox()
      throw err
    }
  }

  const unreadCount = data.filter((i) => !i.processed).length

  return { data, loading, error, create, convert, remove, unreadCount, refetch: fetchInbox }
}

export default useInbox
