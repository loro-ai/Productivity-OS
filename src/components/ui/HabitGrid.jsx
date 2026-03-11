// Componente de grid semanal de hábitos: N hábitos × 7 días
const HabitGrid = ({ habits, onToggle, onDelete }) => {
  // Obtener los 7 días de la semana actual (lunes a domingo)
  const getWeekDays = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - dayOfWeek + 1)

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return d
    })
  }

  const weekDays = getWeekDays()
  const todayStr = new Date().toISOString().split('T')[0]

  const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  // Verificar si un hábito fue completado en una fecha específica
  const isCompleted = (habit, dateStr) => {
    return habit.weekData?.some(
      (d) => new Date(d.date).toISOString().split('T')[0] === dateStr && d.completed
    )
  }

  // Calcular progreso semanal de un hábito
  const getWeekProgress = (habit) => {
    const completed = weekDays.filter((d) =>
      isCompleted(habit, d.toISOString().split('T')[0])
    ).length
    return Math.round((completed / 7) * 100)
  }

  if (!habits || habits.length === 0) {
    return (
      <div className="text-center py-12 text-muted font-mono text-sm">
        No hay hábitos registrados. Agrega uno para comenzar.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr>
            {/* Columna de nombre del hábito */}
            <th className="text-left font-mono text-xs text-muted pb-3 pr-4 w-48">Hábito</th>

            {/* Columnas de días */}
            {weekDays.map((day, i) => {
              const dateStr = day.toISOString().split('T')[0]
              const isToday = dateStr === todayStr
              return (
                <th
                  key={i}
                  className={`text-center font-mono text-xs pb-3 w-10 ${
                    isToday ? 'text-accent' : 'text-muted'
                  }`}
                >
                  <div>{dayLabels[i]}</div>
                  <div className={`text-xs mt-0.5 ${isToday ? 'text-accent font-bold' : 'text-gray-600'}`}>
                    {day.getDate()}
                  </div>
                </th>
              )
            })}

            {/* Columna de progreso */}
            <th className="text-center font-mono text-xs text-muted pb-3 pl-4 w-20">%</th>
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit, idx) => (
            <tr
              key={habit._id}
              className={`animate-fadeUp delay-${Math.min(idx + 1, 6)}`}
            >
              {/* Nombre del hábito */}
              <td className="pr-4 py-2">
                <span className="font-mono text-sm text-gray-200 flex items-center gap-2">
                  <span>{habit.emoji}</span>
                  <span className="truncate max-w-[120px]">{habit.name}</span>
                </span>
              </td>

              {/* Celdas de días */}
              {weekDays.map((day, i) => {
                const dateStr = day.toISOString().split('T')[0]
                const isToday = dateStr === todayStr
                const done = isCompleted(habit, dateStr)

                return (
                  <td key={i} className="text-center py-2">
                    <button
                      onClick={() => onToggle(habit._id, dateStr)}
                      className={`w-8 h-8 rounded border transition-hover flex items-center justify-center mx-auto ${
                        done
                          ? 'bg-accent border-accent text-black font-bold'
                          : isToday
                          ? 'border-accent/50 hover:border-accent bg-surface2'
                          : 'border-muted/40 hover:border-muted bg-surface2'
                      }`}
                      title={done ? 'Marcar como no completado' : 'Marcar como completado'}
                    >
                      {done ? <span className="text-xs">✓</span> : null}
                    </button>
                  </td>
                )
              })}

              {/* Progreso semanal */}
              <td className="pl-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="progress-bar flex-1">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${getWeekProgress(habit)}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-muted w-8 text-right">
                    {getWeekProgress(habit)}%
                  </span>
                </div>
              </td>

              {/* Botón eliminar */}
              <td className="pl-2 py-2">
                <button
                  onClick={() => onDelete(habit._id)}
                  className="text-muted hover:text-danger transition-hover font-mono text-xs"
                  title="Eliminar hábito"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default HabitGrid
