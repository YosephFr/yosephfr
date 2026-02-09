"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface CatchTheBugProps {
  onCatch?: () => void
}

function randomCoord(max: number, margin: number): number {
  return Math.floor(Math.random() * (max - margin * 2)) + margin
}

export default function CatchTheBug({ onCatch }: CatchTheBugProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [caught, setCaught] = useState(false)
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const moveToRandom = useCallback(() => {
    if (typeof window === "undefined") return
    setPosition({
      x: randomCoord(window.innerWidth, 40),
      y: randomCoord(window.innerHeight, 40),
    })
  }, [])

  useEffect(() => {
    moveToRandom()
    setVisible(true)
  }, [moveToRandom])

  useEffect(() => {
    if (caught) return

    const scheduleMove = () => {
      const delay = 2000 + Math.random() * 1000
      timeoutRef.current = setTimeout(() => {
        moveToRandom()
        scheduleMove()
      }, delay)
    }

    scheduleMove()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [caught, moveToRandom])

  const handleCatch = () => {
    if (caught) return
    setCaught(true)
    setVisible(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    onCatch?.()
  }

  if (caught || !visible) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <button
        onClick={handleCatch}
        className="absolute pointer-events-auto cursor-pointer"
        style={{
          left: position.x,
          top: position.y,
          transition: "left 0.6s ease-in-out, top 0.6s ease-in-out",
          width: 20,
          height: 20,
        }}
      >
        <div className="relative w-5 h-5">
          <div
            className="absolute rounded-full bg-accent/20 shadow-[0_0_4px_var(--color-accent-soft)]"
            style={{
              width: 10,
              height: 14,
              top: 3,
              left: 5,
            }}
          />
          <div
            className="absolute rounded-full bg-accent/20 shadow-[0_0_3px_var(--color-accent-soft)]"
            style={{
              width: 7,
              height: 7,
              top: 0,
              left: 6.5,
            }}
          />
          <div
            className="absolute bg-accent/15"
            style={{
              width: 6,
              height: 1,
              top: 6,
              left: -1,
              transform: "rotate(-30deg)",
              borderRadius: 1,
            }}
          />
          <div
            className="absolute bg-accent/15"
            style={{
              width: 6,
              height: 1,
              top: 10,
              left: -1,
              transform: "rotate(-15deg)",
              borderRadius: 1,
            }}
          />
          <div
            className="absolute bg-accent/15"
            style={{
              width: 6,
              height: 1,
              top: 14,
              left: 0,
              transform: "rotate(10deg)",
              borderRadius: 1,
            }}
          />
          <div
            className="absolute bg-accent/15"
            style={{
              width: 6,
              height: 1,
              top: 6,
              right: -1,
              transform: "rotate(30deg)",
              borderRadius: 1,
            }}
          />
          <div
            className="absolute bg-accent/15"
            style={{
              width: 6,
              height: 1,
              top: 10,
              right: -1,
              transform: "rotate(15deg)",
              borderRadius: 1,
            }}
          />
          <div
            className="absolute bg-accent/15"
            style={{
              width: 6,
              height: 1,
              top: 14,
              right: 0,
              transform: "rotate(-10deg)",
              borderRadius: 1,
            }}
          />
        </div>
      </button>
    </div>
  )
}
