"use client"

import { createContext, useContext, useState, useEffect, useLayoutEffect, useCallback, type ReactNode } from "react"
import { useEasterEggs } from "@/hooks/useEasterEggs"
import { engine } from "@/easter-eggs/engine"
import AchievementToastStack, { type ToastData } from "@/components/AchievementToast"
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
  const [activeToasts, setActiveToasts] = useState<ToastData[]>([])

  useLayoutEffect(() => {
    const unsubscribe = engine.onDiscover((egg) => {
      setActiveToasts((existing) => [
        ...existing,
        { id: egg.id, eggName: egg.name, category: egg.category, hint: egg.hint },
      ])
    })
    return unsubscribe
  }, [])

  const handleDismiss = useCallback((toastId: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== toastId))
  }, [])

  return (
    <EasterEggContext.Provider value={easterEggs}>
      <EasterEggTriggers />
      {children}
      <AchievementToastStack
        toasts={activeToasts}
        progress={easterEggs.progress}
        onDismiss={handleDismiss}
      />
    </EasterEggContext.Provider>
  )
}

export function useEasterEggContext() {
  const ctx = useContext(EasterEggContext)
  if (!ctx) throw new Error("useEasterEggContext must be used within EasterEggProvider")
  return ctx
}
