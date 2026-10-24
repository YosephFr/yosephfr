"use client"

import { useSyncExternalStore, useCallback, useMemo } from "react"
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

  const state = useMemo(() => JSON.parse(raw) as {
    progress: { found: number; total: number }
    discoveries: string[]
  }, [raw])

  const discover = useCallback((id: string) => engine.discover(id), [])
  // Se consulta el mismo snapshot que se hidrata (vacío en el servidor), no el motor directamente.
  const discoveries = state.discoveries
  const isDiscovered = useCallback((id: string) => discoveries.includes(id), [discoveries])
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
