"use client"

import { useState, useRef, useEffect, useCallback } from "react"

interface ClickChallengeProps {
  onComplete?: () => void
}

const DURATION = 10
const STORAGE_KEY = "yc-click-record"

type Phase = "idle" | "active" | "finished"

function getPersonalBest(): number {
  if (typeof window === "undefined") return 0
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? parseInt(stored, 10) : 0
}

function savePersonalBest(score: number): number {
  const current = getPersonalBest()
  if (score > current) {
    localStorage.setItem(STORAGE_KEY, score.toString())
    return score
  }
  return current
}

export default function ClickChallenge({ onComplete }: ClickChallengeProps) {
  const [phase, setPhase] = useState<Phase>("idle")
  const [clicks, setClicks] = useState(0)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [personalBest, setPersonalBest] = useState(0)
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [pulseKey, setPulseKey] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setPersonalBest(getPersonalBest())
  }, [])

  const finishGame = useCallback(
    (finalClicks: number) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setPhase("finished")
      const best = savePersonalBest(finalClicks)
      setIsNewRecord(finalClicks > 0 && finalClicks >= best && best === finalClicks)
      setPersonalBest(best)
      onComplete?.()
    },
    [onComplete]
  )

  const startGame = useCallback(() => {
    setPhase("active")
    setClicks(0)
    setTimeLeft(DURATION)
    setIsNewRecord(false)

    const clicksRef = { current: 0 }
    let remaining = DURATION

    intervalRef.current = setInterval(() => {
      remaining -= 1
      setTimeLeft(remaining)
      if (remaining <= 0) {
        setPhase("finished")
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        const best = savePersonalBest(clicksRef.current)
        setIsNewRecord(
          clicksRef.current > 0 &&
            clicksRef.current >= best &&
            best === clicksRef.current
        )
        setPersonalBest(best)
        onComplete?.()
      }
    }, 1000)

    return clicksRef
  }, [onComplete])

  const clicksRefForGame = useRef<{ current: number }>({ current: 0 })

  const handleClick = () => {
    if (phase === "idle") {
      clicksRefForGame.current = startGame()
      clicksRefForGame.current.current = 1
      setClicks(1)
      setPulseKey((prev) => prev + 1)
      return
    }

    if (phase === "active") {
      const newClicks = clicks + 1
      setClicks(newClicks)
      clicksRefForGame.current.current = newClicks
      setPulseKey((prev) => prev + 1)
    }
  }

  const handleRestart = () => {
    setPhase("idle")
    setClicks(0)
    setTimeLeft(DURATION)
    setIsNewRecord(false)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const progressPercent = phase === "active" ? (timeLeft / DURATION) * 100 : 100

  return (
    <div className="flex flex-col items-center gap-6">
      {phase === "idle" && (
        <p className="text-text-secondary text-sm text-center max-w-[280px]">
          Haz clic lo mas rapido posible en 10 segundos
        </p>
      )}

      {phase === "active" && (
        <div className="flex flex-col items-center gap-3 w-full max-w-[300px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-text-muted text-sm">Tiempo</span>
            <span className="text-text-primary font-semibold tabular-nums text-lg">
              {timeLeft}s
            </span>
          </div>
          <div className="w-full h-2 bg-surface-overlay rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="relative">
        <button
          onClick={handleClick}
          disabled={phase === "finished"}
          className="relative w-36 h-36 rounded-full bg-accent text-surface font-bold text-3xl tabular-nums transition-all duration-150 hover:bg-accent-hover active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {phase === "idle" && (
            <span className="text-base font-semibold">Iniciar</span>
          )}
          {phase === "active" && clicks}
          {phase === "finished" && clicks}
        </button>
        {phase === "active" && (
          <span
            key={pulseKey}
            className="absolute inset-0 rounded-full border-2 border-accent animate-ping pointer-events-none"
            style={{ animationDuration: "0.4s", animationIterationCount: 1 }}
          />
        )}
      </div>

      {phase === "active" && (
        <p className="text-text-muted text-sm tabular-nums">
          {clicks} {clicks === 1 ? "clic" : "clics"}
        </p>
      )}

      {phase === "finished" && (
        <div className="flex flex-col items-center gap-3 p-5 bg-surface-raised border border-surface-border rounded-xl w-full max-w-[300px]">
          <p className="text-accent font-semibold text-lg">Resultado</p>
          <p className="text-text-primary text-3xl font-bold tabular-nums">
            {clicks} <span className="text-base font-normal text-text-muted">clics</span>
          </p>
          <p className="text-text-secondary text-sm">
            {(clicks / DURATION).toFixed(1)} clics/segundo
          </p>
          {personalBest > 0 && (
            <p className="text-text-muted text-xs">
              Record personal: {personalBest}
              {isNewRecord && (
                <span className="text-accent ml-1 font-medium">Nuevo record</span>
              )}
            </p>
          )}
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
