"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import { translations, type Locale, type Translations } from "./translations"

const STORAGE_KEY = "yc-locale"
const DEFAULT_LOCALE: Locale = "es"

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "es" || stored === "en") {
      setLocaleState(stored)
    }
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const t = translations[locale]

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}
