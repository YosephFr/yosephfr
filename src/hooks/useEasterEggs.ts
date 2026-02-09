"use client"

import { useSyncExternalStore, useCallback } from "react"
import { engine } from "../easter-eggs/engine"

export function useEasterEggs() {
  const getSnapshot = () => JSON.stringify({
    progress: engine.getProgress(),
    discoveries: engine.getDiscoveries(),
  })

  const getServerSnapshot = () => JSON.stringify({
    progress: { found: 0, total: 0 },
    discoveries: [] as string[],
  })

  const raw = useSyncExternalStore(
    (listener) => engine.subscribe(listener),
    getSnapshot,
    getServerSnapshot
  )

  const state = JSON.parse(raw) as {
    progress: { found: number; total: number }
    discoveries: string[]
  }

  const discover = useCallback((id: string) => engine.discover(id), [])
  const isDiscovered = useCallback((id: string) => engine.isDiscovered(id), [])
  const getEgg = useCallback((id: string) => engine.getEgg(id), [])
  const getAllEggs = useCallback(() => engine.getAllEggs(), [])
  const reset = useCallback(() => engine.reset(), [])

  return {
    discover,
    isDiscovered,
    progress: state.progress,
    discoveries: state.discoveries,
    getEgg,
    getAllEggs,
    reset,
  }
}
