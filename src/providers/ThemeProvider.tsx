"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

type Theme = "light" | "dark" | "auto"
type ResolvedTheme = "light" | "dark"

interface ThemeState {
  theme: Theme
  resolved: ResolvedTheme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeState | null>(null)

const STORAGE_KEY = "yc-theme"

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === "auto") return getSystemTheme()
  return theme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark")
  const [resolved, setResolved] = useState<ResolvedTheme>("dark")

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored && ["light", "dark", "auto"].includes(stored)) {
      setThemeState(stored)
      setResolved(resolveTheme(stored))
    }
  }, [])

  useEffect(() => {
    setResolved(resolveTheme(theme))

    if (theme === "auto") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      const handler = () => setResolved(getSystemTheme())
      mq.addEventListener("change", handler)
      return () => mq.removeEventListener("change", handler)
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolved)
  }, [resolved])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    localStorage.setItem(STORAGE_KEY, t)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
