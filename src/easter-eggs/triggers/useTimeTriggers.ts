"use client"

import { useEffect, useRef, useCallback } from "react"
import { engine } from "../engine"

const FIRST_VISIT_KEY = "yc-first-visit"
const CHECK_INTERVAL = 60000
const FIVE_MINUTES = 5
const TEN_MINUTES = 10

export default function useTimeTriggers(): void {
  const discoveredRef = useRef<Set<string>>(new Set(engine.getDiscoveries()))
  const sessionStartRef = useRef(Date.now())

  const markDiscovered = useCallback((eggId: string) => {
    if (discoveredRef.current.has(eggId)) return
    if (engine.isDiscovered(eggId)) return
    discoveredRef.current = new Set([...discoveredRef.current, eggId])
    engine.discover(eggId)
  }, [])

  useEffect(() => {
    const firstVisit = localStorage.getItem(FIRST_VISIT_KEY)
    if (!firstVisit) {
      localStorage.setItem(FIRST_VISIT_KEY, new Date().toISOString())
      markDiscovered("egg-40")
    } else {
      markDiscovered("egg-41")
    }

    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay()
    const month = now.getMonth()
    const date = now.getDate()

    if (hour >= 0 && hour <= 5) {
      markDiscovered("egg-36")
    }

    if (hour >= 11 && hour <= 13) {
      markDiscovered("egg-37")
    }

    if (day === 0 || day === 6) {
      markDiscovered("egg-38")
    }

    if (month === 0 && date === 1) {
      markDiscovered("egg-42")
    }

    if (month === 11 && (date === 24 || date === 25)) {
      markDiscovered("egg-43")
    }

    if (month === 9) {
      markDiscovered("egg-44")
    }

    const checkIncognito = async () => {
      try {
        const storage = await navigator.storage.estimate()
        if (storage.quota && storage.quota < 120000000) {
          markDiscovered("egg-64")
          return
        }
      } catch {}

      try {
        const fs = (window as any).requestFileSystem || (window as any).webkitRequestFileSystem
        if (fs) {
          fs(0, 0, () => {}, () => markDiscovered("egg-64"))
        }
      } catch {}
    }

    checkIncognito()

    const interval = setInterval(() => {
      const elapsedMinutes = (Date.now() - sessionStartRef.current) / 60000

      if (elapsedMinutes >= FIVE_MINUTES) {
        markDiscovered("egg-39")
      }

      if (elapsedMinutes >= TEN_MINUTES) {
        markDiscovered("egg-45")
      }
    }, CHECK_INTERVAL)

    return () => {
      clearInterval(interval)
    }
  }, [markDiscovered])
}
