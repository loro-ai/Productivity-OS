// Componente de grid semanal de hábitos: N hábitos × 7 días
const HabitGrid = ({ habits, onToggle, onDelete }) => {

  // ── Fechas en timezone LOCAL del usuario ──────────────────────────────────
  // IMPORTANTE: nunca usar toISOString() para comparar días — ese método
  // convierte a UTC y puede desplazar la fecha un día en timezones negativos.
  const toLocalDateStr = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // Obtener los 7 días de la semana actual (lunes → domingo)
  const getWeekDays = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - dayOfWeek + 1)
    monday.setHours(0, 0, 0, 0)

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return d
    })
  }

  const weekDays  = getWeekDays()
  const todayStr  = toLocalDateStr(new Date())

  // Un día es pasado si su dateStr < todayStr (comparación lexicográfica YYYY-MM-DD)
  const isPast = (dateStr) => dateStr < todayStr

  const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  // Verificar si un hábito fue completado en una fecha específica
  // Usa toLocalDateStr para que el servidor almacene UTC mediodía (T12:00Z) para que en cualquier timezone local caiga en el día correcto
  // el cliente compare contra la fecha local correcta.
  const isCompleted = (habit, dateStr) => {
    return habit.weekData?.some((d) => {
      const stored = new Date(d.date)
      return toLocalDateStr(stored) === dateStr && d.completed
    })
  }

  // Progreso semanal (solo días hasta hoy para no contar días futuros)
  const getWeekProgress = (habit) => {
    const pastAndToday = weekDays.filter((d) => toLocalDateStr(d) <= todayStr)
    if (pastAndToday.length === 0) return 0
    const completed = pastAndToday.filter((d) =>
      isCompleted(habit, toLocalDateStr(d))
    ).length
    return Math.round((completed / pastAndToday.length) * 100)
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
            <th className="text-left font-mono text-xs text-muted pb-3 pr-4 w-48">Hábito</th>

            {weekDays.map((day, i) => {
              const dateStr = toLocalDateStr(day)
              const isToday = dateStr === todayStr
              const past    = isPast(dateStr)
              return (
                <th
                  key={i}
                  className={`text-center font-mono text-xs pb-3 w-10 ${
                    isToday ? 'text-accent' : past ? 'text-gray-600' : 'text-muted'
                  }`}
                >
                  <div>{dayLabels[i]}</div>
                  <div className={`text-xs mt-0.5 ${
                    isToday ? 'text-accent font-bold' : past ? 'text-gray-700' : 'text-gray-600'
                  }`}>
                    {day.getDate()}
                  </div>
                </th>
              )
            })}

            <th className="text-center font-mono text-xs text-muted pb-3 pl-4 w-20">%</th>
            <th className="w-8"></th>
          </tr>
        </thead>

        <tbody>
          {habits.map((habit, idx) => (
            <tr key={habit._id} className={`animate-fadeUp delay-${Math.min(idx + 1, 6)}`}>
              {/* Nombre */}
              <td className="pr-4 py-2">
                <span className="font-mono text-sm text-gray-200 flex items-center gap-2">
                  <span>{habit.emoji}</span>
                  <span className="truncate max-w-[120px]">{habit.name}</span>
                </span>
              </td>

              {/* Celdas de días */}
              {weekDays.map((day, i) => {
                const dateStr = toLocalDateStr(day)
                const isToday = dateStr === todayStr
                const past    = isPast(dateStr)
                const done    = isCompleted(habit, dateStr)
                // Días futuros: no interactuables
                const isFuture = dateStr > todayStr

                return (
                  <td key={i} className="text-center py-2">
                    <button
                      onClick={() => !isFuture && onToggle(habit._id, dateStr)}
                      disabled={isFuture}
                      className={`w-8 h-8 rounded border transition-hover flex items-center justify-center mx-auto ${
                        isFuture
                          // Días futuros: apagados, sin hover
                          ? 'border-muted/20 bg-surface opacity-30 cursor-not-allowed'
                          : done
                          // Completado (hoy o pasado)
                          ? past
                            ? 'bg-accent/60 border-accent/60 text-black font-bold cursor-default'
                            : 'bg-accent border-accent text-black font-bold'
                          : past
                          // Pasado sin completar: bloqueado visualmente
                          ? 'border-muted/20 bg-surface opacity-40 cursor-default'
                          : isToday
                          // Hoy sin completar: interactuable
                          ? 'border-accent/50 hover:border-accent bg-surface2'
                          : 'border-muted/40 hover:border-muted bg-surface2'
                      }`}
                      title={
                        isFuture ? 'Día futuro'
                        : done && past ? 'Completado (bloqueado)'
                        : !done && past ? 'No completado (bloqueado)'
                        : done ? 'Marcar como no completado'
                        : 'Marcar como completado'
                      }
                    >
                      {done
                        ? <span className="text-xs">✓</span>
                        : past && !done
                        ? <span className="text-xs text-muted/40">–</span>
                        : null
                      }
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

              {/* Eliminar */}
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
