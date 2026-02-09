"use client"

import { useEffect, useRef, useCallback } from "react"
import { engine } from "../engine"

const IDLE_TIMEOUT = 30000
const SHAKE_THRESHOLD = 5
const SHAKE_WINDOW = 500
const CORNER_THRESHOLD = 20
const THROTTLE_MS = 50

export default function useMouseTriggers(): void {
  const discoveredRef = useRef<Set<string>>(new Set())
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const directionChangesRef = useRef<number[]>([])
  const lastDirectionRef = useRef<{ x: number; y: number } | null>(null)
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null)
  const lastThrottleRef = useRef(0)

  const markDiscovered = useCallback((eggId: string) => {
    if (discoveredRef.current.has(eggId)) return
    discoveredRef.current = new Set([...discoveredRef.current, eggId])
    engine.discover(eggId)
  }, [])

  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
      idleTimerRef.current = setTimeout(() => {
        markDiscovered("egg-49")
      }, IDLE_TIMEOUT)
    }

    resetIdleTimer()

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()

      if (now - lastThrottleRef.current < THROTTLE_MS) return
      lastThrottleRef.current = now

      resetIdleTimer()

      const currentPosition = { x: e.clientX, y: e.clientY }

      if (lastPositionRef.current) {
        const dx = currentPosition.x - lastPositionRef.current.x
        const dy = currentPosition.y - lastPositionRef.current.y
        const currentDirection = {
          x: dx > 0 ? 1 : dx < 0 ? -1 : 0,
          y: dy > 0 ? 1 : dy < 0 ? -1 : 0,
        }

        if (
          lastDirectionRef.current &&
          (currentDirection.x !== lastDirectionRef.current.x ||
            currentDirection.y !== lastDirectionRef.current.y)
        ) {
          directionChangesRef.current = [
            ...directionChangesRef.current.filter(
              (t) => now - t < SHAKE_WINDOW
            ),
            now,
          ]

          if (directionChangesRef.current.length >= SHAKE_THRESHOLD) {
            markDiscovered("egg-52")
            directionChangesRef.current = []
          }
        }

        lastDirectionRef.current = currentDirection
      }

      lastPositionRef.current = currentPosition

      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const { clientX, clientY } = e

      const inTopLeft =
        clientX <= CORNER_THRESHOLD && clientY <= CORNER_THRESHOLD
      const inTopRight =
        clientX >= windowWidth - CORNER_THRESHOLD &&
        clientY <= CORNER_THRESHOLD
      const inBottomLeft =
        clientX <= CORNER_THRESHOLD &&
        clientY >= windowHeight - CORNER_THRESHOLD
      const inBottomRight =
        clientX >= windowWidth - CORNER_THRESHOLD &&
        clientY >= windowHeight - CORNER_THRESHOLD

      if (inTopLeft || inTopRight || inBottomLeft || inBottomRight) {
        markDiscovered("egg-48")
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
    }
  }, [markDiscovered])
}
