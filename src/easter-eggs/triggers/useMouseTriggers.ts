"use client"

import { useEffect, useRef, useCallback } from "react"
import { engine } from "../engine"

const IDLE_TIMEOUT = 30000
const CORNER_THRESHOLD = 20
const THROTTLE_MS = 50

export default function useMouseTriggers(): void {
  const discoveredRef = useRef<Set<string>>(new Set())
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
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
