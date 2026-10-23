"use client"

import dynamic from "next/dynamic"
import { createContext, useContext, type ReactNode } from "react"
import { useEasterEggs } from "@/hooks/useEasterEggs"

const EasterEggRuntime = dynamic(() => import("./EasterEggRuntime"))

type EasterEggContextValue = ReturnType<typeof useEasterEggs>

const EasterEggContext = createContext<EasterEggContextValue | null>(null)

export function EasterEggProvider({ children }: { children: ReactNode }) {
  const easterEggs = useEasterEggs()

  return (
    <EasterEggContext.Provider value={easterEggs}>
      <EasterEggRuntime />
      {children}
    </EasterEggContext.Provider>
  )
}

export function useEasterEggContext() {
  const ctx = useContext(EasterEggContext)
  if (!ctx) throw new Error("useEasterEggContext must be used within EasterEggProvider")
  return ctx
}
