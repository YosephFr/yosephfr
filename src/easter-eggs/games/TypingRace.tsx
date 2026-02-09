"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface TypingRaceProps {
  onComplete?: () => void
}

const PHRASES = [
  "Crear sitios web rapidos es mi pasion diaria",
  "WordPress necesita optimizacion constante para rendir bien",
  "El SEO tecnico marca la diferencia en los resultados",
  "Una landing page bien hecha convierte visitantes en clientes",
  "La velocidad de carga afecta directamente la conversion",
  "Cada linea de codigo debe tener un proposito claro",
  "El rendimiento web no es opcional es fundamental",
  "Un buen desarrollador piensa primero en el usuario final",
  "La accesibilidad web beneficia a todos los usuarios",
  "Menos dependencias significa mejor rendimiento y seguridad",
]

function pickRandomPhrase(): string {
  return PHRASES[Math.floor(Math.random() * PHRASES.length)]
}

export default function TypingRace({ onComplete }: TypingRaceProps) {
  const [phrase] = useState(() => pickRandomPhrase())
  const [typed, setTyped] = useState("")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const calculateWpm = useCallback(
    (typedLength: number, start: number) => {
      const elapsedMinutes = (Date.now() - start) / 60000
      if (elapsedMinutes <= 0) return 0
      const wordCount = phrase.substring(0, typedLength).split(" ").length
      return Math.round(wordCount / elapsedMinutes)
    },
    [phrase]
  )

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (finished) return

      const value = e.target.value

      if (!startTime && value.length > 0) {
        setStartTime(Date.now())
      }

      const currentStart = startTime || Date.now()

      if (value.length <= phrase.length) {
        setTyped(value)
      }

      if (value === phrase) {
        const finalWpm = calculateWpm(phrase.length, currentStart)
        setWpm(finalWpm)
        setFinished(true)
        onComplete?.()
      }
    },
    [finished, startTime, phrase, calculateWpm, onComplete]
  )

  useEffect(() => {
    if (!finished && startTime) {
      const interval = setInterval(() => {
        setWpm(calculateWpm(typed.length, startTime))
      }, 500)
      return () => clearInterval(interval)
    }
  }, [startTime, typed.length, finished, calculateWpm])

  const handleRestart = () => {
    setTyped("")
    setStartTime(null)
    setWpm(null)
    setFinished(false)
    inputRef.current?.focus()
  }

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  const renderPhrase = () => {
    return phrase.split("").map((char, index) => {
      let colorClass = "text-text-muted"

      if (index < typed.length) {
        colorClass = typed[index] === char ? "text-accent" : "text-red-400"
      }

      const isCurrentChar = index === typed.length

      return (
        <span
          key={index}
          className={`${colorClass} ${isCurrentChar ? "border-b-2 border-accent" : ""}`}
        >
          {char}
        </span>
      )
    })
  }

  const correctChars = typed
    .split("")
    .filter((char, i) => char === phrase[i]).length
  const accuracy =
    typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-[480px]">
        <span className="text-sm text-text-secondary">
          WPM:{" "}
          <span className="text-text-primary font-semibold tabular-nums">
            {wpm !== null ? wpm : "--"}
          </span>
        </span>
        <span className="text-sm text-text-secondary">
          Precision:{" "}
          <span className="text-text-primary font-semibold tabular-nums">
            {accuracy}%
          </span>
        </span>
      </div>

      <div
        onClick={handleContainerClick}
        className="w-full max-w-[480px] p-5 bg-surface-raised border border-surface-border rounded-xl cursor-text min-h-[80px]"
      >
        <p className="text-lg leading-relaxed tracking-wide font-mono select-none break-words">
          {renderPhrase()}
        </p>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={typed}
        onChange={handleInput}
        disabled={finished}
        className="sr-only"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {!startTime && !finished && (
        <p className="text-text-muted text-sm">
          Haz clic arriba y empieza a escribir
        </p>
      )}

      {finished && (
        <div className="flex flex-col items-center gap-3 p-5 bg-surface-raised border border-surface-border rounded-xl w-full max-w-[480px]">
          <p className="text-accent font-semibold text-lg">Completado</p>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-text-primary text-2xl font-bold tabular-nums">
                {wpm}
              </p>
              <p className="text-text-muted text-xs">WPM</p>
            </div>
            <div className="w-px h-8 bg-surface-border" />
            <div className="text-center">
              <p className="text-text-primary text-2xl font-bold tabular-nums">
                {accuracy}%
              </p>
              <p className="text-text-muted text-xs">Precision</p>
            </div>
          </div>
          <button
            onClick={handleRestart}
            className="mt-1 px-5 py-2 bg-accent text-surface text-sm font-medium rounded-full hover:bg-accent-hover transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  )
}
