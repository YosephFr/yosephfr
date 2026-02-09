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

const TOTAL_ROUNDS = 5

interface RoundResult {
  wpm: number
  accuracy: number
  phrase: string
}

function pickUniquePhrases(count: number): string[] {
  const shuffled = [...PHRASES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export default function TypingRace({ onComplete }: TypingRaceProps) {
  const [phrases] = useState(() => pickUniquePhrases(TOTAL_ROUNDS))
  const [currentRound, setCurrentRound] = useState(0)
  const [typed, setTyped] = useState("")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [liveWpm, setLiveWpm] = useState<number | null>(null)
  const [results, setResults] = useState<RoundResult[]>([])
  const [gameFinished, setGameFinished] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const phrase = phrases[currentRound]

  const calculateWpm = useCallback(
    (typedLength: number, start: number) => {
      const elapsedMinutes = (Date.now() - start) / 60000
      if (elapsedMinutes <= 0) return 0
      const wordCount = phrase.substring(0, typedLength).split(" ").length
      return Math.round(wordCount / elapsedMinutes)
    },
    [phrase]
  )

  const calculateAccuracy = useCallback(
    (typedText: string) => {
      if (typedText.length === 0) return 100
      const correct = typedText
        .split("")
        .filter((char, i) => char === phrase[i]).length
      return Math.round((correct / typedText.length) * 100)
    },
    [phrase]
  )

  const advanceRound = useCallback(
    (finalWpm: number) => {
      const accuracy = calculateAccuracy(phrase)
      const roundResult: RoundResult = { wpm: finalWpm, accuracy, phrase }
      const updatedResults = [...results, roundResult]
      setResults(updatedResults)

      if (currentRound + 1 >= TOTAL_ROUNDS) {
        setGameFinished(true)
        onComplete?.()
      } else {
        setCurrentRound((prev) => prev + 1)
        setTyped("")
        setStartTime(null)
        setLiveWpm(null)
        setTimeout(() => inputRef.current?.focus(), 50)
      }
    },
    [results, currentRound, phrase, calculateAccuracy, onComplete]
  )

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (gameFinished) return

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
        advanceRound(finalWpm)
      }
    },
    [gameFinished, startTime, phrase, calculateWpm, advanceRound]
  )

  useEffect(() => {
    if (!gameFinished && startTime) {
      const interval = setInterval(() => {
        setLiveWpm(calculateWpm(typed.length, startTime))
      }, 500)
      return () => clearInterval(interval)
    }
  }, [startTime, typed.length, gameFinished, calculateWpm])

  const handleRestart = () => {
    setCurrentRound(0)
    setTyped("")
    setStartTime(null)
    setLiveWpm(null)
    setResults([])
    setGameFinished(false)
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

  const currentAccuracy = calculateAccuracy(typed)

  const avgWpm =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / results.length)
      : 0

  const avgAccuracy =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length)
      : 0

  if (gameFinished) {
    return (
      <div className="flex flex-col items-center gap-5 w-full max-w-[480px]">
        <div className="flex flex-col items-center gap-3 p-6 bg-surface-raised border border-surface-border rounded-xl w-full">
          <p className="text-accent font-semibold text-lg">Resultados</p>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-text-primary text-3xl font-bold tabular-nums">
                {avgWpm}
              </p>
              <p className="text-text-muted text-xs">WPM promedio</p>
            </div>
            <div className="w-px h-10 bg-surface-border" />
            <div className="text-center">
              <p className="text-text-primary text-3xl font-bold tabular-nums">
                {avgAccuracy}%
              </p>
              <p className="text-text-muted text-xs">Precision promedio</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {results.map((result, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-2.5 bg-surface-raised border border-surface-border rounded-lg"
            >
              <span className="text-xs text-text-muted">
                Ronda {index + 1}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-xs text-text-secondary tabular-nums">
                  {result.wpm} WPM
                </span>
                <span className="text-xs text-text-secondary tabular-nums">
                  {result.accuracy}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleRestart}
          className="px-5 py-2.5 bg-accent text-surface text-sm font-medium rounded-full hover:bg-accent-hover transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex items-center justify-between w-full max-w-[480px]">
        <span className="text-xs text-text-muted">
          Ronda {currentRound + 1}/{TOTAL_ROUNDS}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">
            WPM:{" "}
            <span className="text-text-primary font-semibold tabular-nums">
              {liveWpm !== null ? liveWpm : "--"}
            </span>
          </span>
          <span className="text-sm text-text-secondary">
            Precision:{" "}
            <span className="text-text-primary font-semibold tabular-nums">
              {currentAccuracy}%
            </span>
          </span>
        </div>
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
        disabled={gameFinished}
        className="sr-only"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {!startTime && !gameFinished && (
        <p className="text-text-muted text-sm">
          Haz clic arriba y empieza a escribir
        </p>
      )}
    </div>
  )
}
