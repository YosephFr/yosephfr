"use client"

import { useState, useEffect, useCallback } from "react"

interface Card {
  id: number
  content: string
  flipped: boolean
  matched: boolean
}

interface MemoryGameProps {
  onComplete?: () => void
}

const TECH_LABELS = ["WP", "JS", "CSS", "PHP", "AWS", "SQL", "SEO", "CDN"]

const CARD_COLORS: Record<string, string> = {
  WP: "#21759B",
  JS: "#F7DF1E",
  CSS: "#264DE4",
  PHP: "#777BB4",
  AWS: "#FF9900",
  SQL: "#E48E00",
  SEO: "#47A248",
  CDN: "#F38020",
}

const TEXT_COLORS: Record<string, string> = {
  WP: "#ffffff",
  JS: "#000000",
  CSS: "#ffffff",
  PHP: "#ffffff",
  AWS: "#000000",
  SQL: "#000000",
  SEO: "#ffffff",
  CDN: "#ffffff",
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }
  return shuffled
}

function createDeck(): Card[] {
  const pairs = TECH_LABELS.flatMap((label, index) => [
    { id: index * 2, content: label, flipped: false, matched: false },
    { id: index * 2 + 1, content: label, flipped: false, matched: false },
  ])
  return shuffleArray(pairs)
}

export default function MemoryGame({ onComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>(() => createDeck())
  const [flippedIds, setFlippedIds] = useState<number[]>([])
  const [locked, setLocked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!startTime || completed) return

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, completed])

  const checkCompletion = useCallback(
    (updatedCards: Card[]) => {
      if (updatedCards.every((card) => card.matched)) {
        setCompleted(true)
        onComplete?.()
      }
    },
    [onComplete]
  )

  const handleCardClick = useCallback(
    (clickedId: number) => {
      if (locked) return

      const clickedCard = cards.find((c) => c.id === clickedId)
      if (!clickedCard || clickedCard.flipped || clickedCard.matched) return

      if (!startTime) {
        setStartTime(Date.now())
      }

      const newFlippedIds = [...flippedIds, clickedId]
      const updatedCards = cards.map((card) =>
        card.id === clickedId ? { ...card, flipped: true } : card
      )
      setCards(updatedCards)
      setFlippedIds(newFlippedIds)

      if (newFlippedIds.length === 2) {
        setAttempts((prev) => prev + 1)
        setLocked(true)

        const [firstId, secondId] = newFlippedIds
        const first = updatedCards.find((c) => c.id === firstId)
        const second = updatedCards.find((c) => c.id === secondId)

        if (first && second && first.content === second.content) {
          const matchedCards = updatedCards.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, matched: true }
              : card
          )
          setCards(matchedCards)
          setFlippedIds([])
          setLocked(false)
          checkCompletion(matchedCards)
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card) =>
                card.id === firstId || card.id === secondId
                  ? { ...card, flipped: false }
                  : card
              )
            )
            setFlippedIds([])
            setLocked(false)
          }, 800)
        }
      }
    },
    [cards, flippedIds, locked, startTime, checkCompletion]
  )

  const handleRestart = () => {
    setCards(createDeck())
    setFlippedIds([])
    setLocked(false)
    setAttempts(0)
    setStartTime(null)
    setElapsed(0)
    setCompleted(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-[360px]">
        <span className="text-sm text-text-secondary">
          Intentos: <span className="text-text-primary tabular-nums">{attempts}</span>
        </span>
        <span className="text-sm text-text-secondary">
          Tiempo: <span className="text-text-primary tabular-nums">{formatTime(elapsed)}</span>
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2.5 w-full max-w-[360px]">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className="relative aspect-square rounded-lg overflow-hidden"
            style={{ perspective: "600px" }}
          >
            <div
              className="absolute inset-0 transition-transform duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform:
                  card.flipped || card.matched
                    ? "rotateY(180deg)"
                    : "rotateY(0deg)",
              }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center bg-surface-overlay border border-surface-border rounded-lg hover:border-accent/40 transition-colors"
                style={{ backfaceVisibility: "hidden" }}
              >
                <span className="text-text-muted text-lg font-medium">?</span>
              </div>

              <div
                className="absolute inset-0 flex items-center justify-center rounded-lg"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  backgroundColor: CARD_COLORS[card.content] || "#14B8A6",
                }}
              >
                <span
                  className="text-sm font-bold tracking-wide"
                  style={{ color: TEXT_COLORS[card.content] || "#ffffff" }}
                >
                  {card.content}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {completed && (
        <div className="flex flex-col items-center gap-3 mt-2 p-5 bg-surface-raised border border-surface-border rounded-xl w-full max-w-[360px]">
          <p className="text-accent font-semibold text-lg">Completado</p>
          <p className="text-text-secondary text-sm">
            {attempts} intentos en {formatTime(elapsed)}
          </p>
          <button
            onClick={handleRestart}
            className="mt-1 px-5 py-2 bg-accent text-surface text-sm font-medium rounded-full hover:bg-accent-hover transition-colors"
          >
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  )
}
