"use client"

import { useEffect, useRef, useCallback } from "react"
import { engine } from "../engine"

const CLICK_THRESHOLDS: Record<string, { count: number; egg: string }> = {
  logo: { count: 7, egg: "egg-11" },
  avatar: { count: 5, egg: "egg-13" },
}

const SINGLE_CLICK_TRIGGERS: Record<string, string> = {
  disponible: "egg-22",
  "logo-dot": "egg-20",
}

export default function useClickTriggers(): void {
  const clickCountsRef = useRef<Map<string, number>>(new Map())
  const discoveredRef = useRef<Set<string>>(new Set())

  const markDiscovered = useCallback((eggId: string) => {
    if (discoveredRef.current.has(eggId)) return
    discoveredRef.current = new Set([...discoveredRef.current, eggId])
    engine.discover(eggId)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const eggElement = target.closest("[data-egg-click]") as HTMLElement | null

      if (!eggElement) return

      const identifier = eggElement.getAttribute("data-egg-click")
      if (!identifier) return

      if (identifier === "name" && e.detail === 3) {
        markDiscovered("egg-12")
        return
      }

      if (SINGLE_CLICK_TRIGGERS[identifier]) {
        markDiscovered(SINGLE_CLICK_TRIGGERS[identifier])
        return
      }

      const threshold = CLICK_THRESHOLDS[identifier]
      if (threshold) {
        const currentCount = (clickCountsRef.current.get(identifier) ?? 0) + 1
        clickCountsRef.current = new Map([
          ...clickCountsRef.current,
          [identifier, currentCount],
        ])
        if (currentCount >= threshold.count) {
          markDiscovered(threshold.egg)
        }
      }
    }

    const handleDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const eggElement = target.closest("[data-egg-click]") as HTMLElement | null

      if (!eggElement) return

      const identifier = eggElement.getAttribute("data-egg-click")
      if (identifier === "header") {
        markDiscovered("egg-15")
      }
    }

    document.addEventListener("click", handleClick)
    document.addEventListener("dblclick", handleDblClick)

    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("dblclick", handleDblClick)
    }
  }, [markDiscovered])
}
