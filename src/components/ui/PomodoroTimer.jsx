import { useState, useEffect, useRef, useCallback } from 'react'

// Modo Focus con temporizador Pomodoro — oculta sidebar y topbar
// Notificación sonora con Web Audio API (sin archivos externos)
const PomodoroTimer = ({ topTasks = [], onExit }) => {
  const WORK_TIME = 25 * 60  // 25 minutos en segundos
  const BREAK_TIME = 5 * 60  // 5 minutos en segundos

  const [isWork, setIsWork] = useState(true)
  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef(null)
  const audioCtxRef = useRef(null)

  // Generar tono con Web Audio API (sin archivos externos)
  const playTone = useCallback((frequency = 440, duration = 0.5, type = 'sine') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch (e) {
      console.warn('Audio no disponible:', e)
    }
  }, [])

  // Notificación al terminar un bloque (secuencia de tonos)
  const playNotification = useCallback(() => {
    playTone(880, 0.2, 'sine')
    setTimeout(() => playTone(1100, 0.2, 'sine'), 250)
    setTimeout(() => playTone(880, 0.4, 'sine'), 500)
  }, [playTone])

  // Lógica del temporizador
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Cambiar entre trabajo y descanso
            playNotification()
            const nextIsWork = !isWork
            setIsWork(nextIsWork)
            if (!nextIsWork) setSessions((s) => s + 1)
            return nextIsWork ? WORK_TIME : BREAK_TIME
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, isWork, playNotification])

  // Formatear tiempo en MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // Calcular progreso para el anillo circular
  const totalTime = isWork ? WORK_TIME : BREAK_TIME
  const progress = (timeLeft / totalTime) * 100
  const circumference = 2 * Math.PI * 54  // radio = 54
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(isWork ? WORK_TIME : BREAK_TIME)
  }

  return (
    <div className="fixed inset-0 z-40 bg-[#0d0d0d] flex flex-col items-center justify-center">
      {/* Header del modo focus */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <div>
          <h1 className="font-sans text-xl font-bold text-white">Modo Focus</h1>
          <p className="font-mono text-xs text-muted mt-0.5">
            {sessions} sesión{sessions !== 1 ? 'es' : ''} completada{sessions !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onExit}
          className="font-mono text-sm text-muted hover:text-white border border-muted/30 hover:border-muted rounded px-4 py-2 transition-hover"
        >
          ✕ Salir
        </button>
      </div>

      {/* Anillo circular del temporizador */}
      <div className="relative flex items-center justify-center mb-8">
        <svg width="140" height="140" className="pomodoro-ring">
          {/* Anillo de fondo */}
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            stroke="#1c1c1c"
            strokeWidth="6"
          />
          {/* Anillo de progreso */}
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            stroke={isWork ? '#00ff88' : '#00b4ff'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        {/* Tiempo en el centro */}
        <div className="absolute text-center">
          <div className="font-mono text-3xl font-bold text-white">{formatTime(timeLeft)}</div>
          <div className={`font-mono text-xs mt-1 ${isWork ? 'text-accent' : 'text-info'}`}>
            {isWork ? '🎯 Trabajo' : '☕ Descanso'}
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={handleReset}
          className="font-mono text-sm text-muted hover:text-white border border-muted/30 hover:border-muted rounded px-4 py-2 transition-hover"
        >
          ↺ Reset
        </button>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`font-mono text-sm font-bold rounded px-8 py-3 transition-hover ${
            isRunning
              ? 'bg-surface2 text-white border border-muted hover:border-accent'
              : 'bg-accent text-black hover:bg-green-400'
          }`}
        >
          {isRunning ? '⏸ Pausar' : '▶ Iniciar'}
        </button>
        <button
          onClick={() => {
            setIsWork(!isWork)
            setTimeLeft(!isWork ? WORK_TIME : BREAK_TIME)
            setIsRunning(false)
          }}
          className="font-mono text-sm text-muted hover:text-white border border-muted/30 hover:border-muted rounded px-4 py-2 transition-hover"
        >
          ⇄ Cambiar
        </button>
      </div>

      {/* Top 3 tareas del día */}
      {topTasks.length > 0 && (
        <div className="w-full max-w-md">
          <h3 className="font-mono text-xs text-muted uppercase tracking-wider mb-3 text-center">
            Tareas prioritarias de hoy
          </h3>
          <div className="space-y-2">
            {topTasks.slice(0, 3).map((task, i) => (
              <div
                key={task._id}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-muted/30 bg-surface"
              >
                <span className="font-mono text-xs text-muted w-4">{i + 1}.</span>
                <span className={`font-mono text-sm flex-1 ${task.status === 'done' ? 'line-through text-muted' : 'text-gray-200'}`}>
                  {task.title}
                </span>
                <span className={`font-mono text-xs ${
                  task.priority === 'alta' ? 'text-danger' :
                  task.priority === 'media' ? 'text-warn' : 'text-accent'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PomodoroTimer
