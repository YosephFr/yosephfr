"use client"

import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import AchievementToastStack, { type ToastData } from "@/components/AchievementToast"
import { engine } from "@/easter-eggs/engine"
import { confetti, matrixRain, screenFlip, discoMode, tealPulse } from "@/easter-eggs/effects/visualEffects"
import useKeyboardTriggers from "@/easter-eggs/triggers/useKeyboardTriggers"
import useClickTriggers from "@/easter-eggs/triggers/useClickTriggers"
import useScrollTriggers from "@/easter-eggs/triggers/useScrollTriggers"
import useTimeTriggers from "@/easter-eggs/triggers/useTimeTriggers"
import useMouseTriggers from "@/easter-eggs/triggers/useMouseTriggers"
import useDevToolsTrigger from "@/easter-eggs/triggers/useDevToolsTrigger"
import "@/easter-eggs/registry"

const EFFECT_MAP: Record<string, () => void> = {
  konami: confetti,
  matrix: matrixRain,
  reverse: screenFlip,
  party: discoMode,
  teal: tealPulse,
}

export default function EasterEggRuntime() {
  const { triggerEffect } = useKeyboardTriggers()
  useClickTriggers()
  useScrollTriggers()
  useTimeTriggers()
  useMouseTriggers()
  useDevToolsTrigger()
  const [activeToasts, setActiveToasts] = useState<ToastData[]>([])

  useEffect(() => {
    if (triggerEffect && EFFECT_MAP[triggerEffect]) {
      EFFECT_MAP[triggerEffect]()
    }
  }, [triggerEffect])

  useLayoutEffect(() => {
    return engine.onDiscover((egg) => {
      setActiveToasts((existing) => [
        ...existing,
        { id: egg.id, eggName: egg.name, category: egg.category, hint: egg.hint },
      ])
    })
  }, [])

  const handleDismiss = useCallback((toastId: string) => {
    setActiveToasts((prev) => prev.filter((toast) => toast.id !== toastId))
  }, [])

  return (
    <AchievementToastStack
      toasts={activeToasts}
      progress={engine.getProgress()}
      onDismiss={handleDismiss}
    />
  )
}
