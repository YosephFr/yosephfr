"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import { useEasterEggs } from "@/hooks/useEasterEggs"
import AchievementToast from "@/components/AchievementToast"
import useKeyboardTriggers from "@/easter-eggs/triggers/useKeyboardTriggers"
import useClickTriggers from "@/easter-eggs/triggers/useClickTriggers"
import useScrollTriggers from "@/easter-eggs/triggers/useScrollTriggers"
import useTimeTriggers from "@/easter-eggs/triggers/useTimeTriggers"
import useMouseTriggers from "@/easter-eggs/triggers/useMouseTriggers"
import useDevToolsTrigger from "@/easter-eggs/triggers/useDevToolsTrigger"
import { confetti, matrixRain, screenFlip, discoMode, tealPulse } from "@/easter-eggs/effects/visualEffects"
import "@/easter-eggs/registry"

type EasterEggContextValue = ReturnType<typeof useEasterEggs>

const EasterEggContext = createContext<EasterEggContextValue | null>(null)

const EFFECT_MAP: Record<string, () => void> = {
  konami: confetti,
  matrix: matrixRain,
  reverse: screenFlip,
  party: discoMode,
  teal: tealPulse,
}

function EasterEggTriggers() {
  const { triggerEffect } = useKeyboardTriggers()
  useClickTriggers()
  useScrollTriggers()
  useTimeTriggers()
  useMouseTriggers()
  useDevToolsTrigger()

  useEffect(() => {
    if (triggerEffect && EFFECT_MAP[triggerEffect]) {
      EFFECT_MAP[triggerEffect]()
    }
  }, [triggerEffect])

  return null
}

export function EasterEggProvider({ children }: { children: ReactNode }) {
  const easterEggs = useEasterEggs()
  const [latestDiscovery, setLatestDiscovery] = useState<string | null>(null)
  const prevDiscoveries = useRef<string[]>(easterEggs.discoveries)

  useEffect(() => {
    const current = easterEggs.discoveries
    const prev = prevDiscoveries.current

    if (current.length > prev.length) {
      const newEggId = current.find((id) => !prev.includes(id))
      if (newEggId) {
        setLatestDiscovery(newEggId)
      }
    }

    prevDiscoveries.current = current
  }, [easterEggs.discoveries])

  const handleCloseToast = useCallback(() => setLatestDiscovery(null), [])

  const latestEgg = latestDiscovery ? easterEggs.getEgg(latestDiscovery) : undefined

  return (
    <EasterEggContext.Provider value={easterEggs}>
      <EasterEggTriggers />
      {children}
      <AchievementToast
        eggName={latestEgg?.name ?? ""}
        category={latestEgg?.category ?? ""}
        hint={latestEgg?.hint ?? ""}
        progress={easterEggs.progress}
        visible={!!latestEgg}
        onClose={handleCloseToast}
      />
    </EasterEggContext.Provider>
  )
}

export function useEasterEggContext() {
  const ctx = useContext(EasterEggContext)
  if (!ctx) throw new Error("useEasterEggContext must be used within EasterEggProvider")
  return ctx
}
