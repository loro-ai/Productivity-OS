import { useState } from 'react'
import useHabits from '../hooks/useHabits'
import HabitGrid from '../components/ui/HabitGrid'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const Habits = () => {
  const { data: habits, loading, create, toggle, remove, resetWeek } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', emoji: '✅' })
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    try {
      await create({ name: form.name, emoji: form.emoji })
      setForm({ name: '', emoji: '✅' })
      setShowForm(false)
    } catch (err) {
      console.error('Error creando hábito:', err)
    }
  }

  const handleResetWeek = async () => {
    try {
      await resetWeek()
      setShowResetConfirm(false)
    } catch (err) {
      console.error('Error reseteando semana:', err)
    }
  }

  const handleDelete = async (id) => {
    setDeleteTarget(null)
    await remove(id)
  }

  // Calcular progreso global de hábitos de hoy
  const todayStr = new Date().toISOString().split('T')[0]
  const completedToday = habits.filter((h) =>
    h.weekData?.some(
      (d) => new Date(d.date).toISOString().split('T')[0] === todayStr && d.completed
    )
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fadeUp">
        <div>
          <h1 className="font-sans text-xl font-bold text-white">Hábitos</h1>
          <p className="font-mono text-xs text-muted mt-0.5">
            {completedToday} / {habits.length} completados hoy
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="font-mono text-xs text-muted border border-muted/30 rounded px-3 py-2 hover:text-warn hover:border-warn/30 transition-hover"
          >
            Resetear semana
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent text-black font-mono font-bold text-sm px-4 py-2 rounded hover:bg-green-400 transition-hover"
          >
            + Hábito
          </button>
        </div>
      </div>

      {/* Barra de progreso global del día */}
      {habits.length > 0 && (
        <div className="animate-fadeUp delay-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-xs text-muted">Progreso de hoy</span>
            <span className="font-mono text-xs text-accent">
              {habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${habits.length > 0 ? (completedToday / habits.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Formulario inline */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-surface border border-accent/20 rounded-lg p-4 flex gap-3 animate-fadeUp"
        >
          <input
            type="text"
            placeholder="Emoji"
            value={form.emoji}
            onChange={(e) => setForm((p) => ({ ...p, emoji: e.target.value }))}
            className="w-16 bg-surface2 border border-muted/40 rounded px-3 py-2 font-mono text-sm text-white text-center focus:border-accent"
            maxLength={2}
          />
          <input
            type="text"
            placeholder="Nombre del hábito"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
            autoFocus
            className="flex-1 bg-surface2 border border-muted/40 rounded px-3 py-2 font-mono text-sm text-white placeholder-muted focus:border-accent"
          />
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="font-mono text-sm text-muted border border-muted/30 rounded px-3 py-2 hover:text-white transition-hover"
          >
            ✕
          </button>
          <button
            type="submit"
            className="bg-accent text-black font-mono font-bold text-sm px-4 py-2 rounded hover:bg-green-400 transition-hover"
          >
            Guardar
          </button>
        </form>
      )}

      {/* Grid de hábitos */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-surface border border-muted/30 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="animate-fadeUp delay-2">
          <HabitGrid
            habits={habits}
            onToggle={toggle}
            onDelete={(id) => setDeleteTarget(id)}
          />
        </div>
      )}

      {/* Confirm: reset semana */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Resetear semana"
        message="Esto eliminará todos los registros de la semana actual para todos los hábitos. Esta acción no se puede deshacer."
        onConfirm={handleResetWeek}
        onCancel={() => setShowResetConfirm(false)}
        requireTyping={true}
        confirmText="Resetear"
        variant="danger"
      />

      {/* Confirm: eliminar hábito */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Eliminar hábito"
        message="¿Estás seguro de que querés eliminar este hábito y todos sus registros?"
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  )
}

export default Habits
