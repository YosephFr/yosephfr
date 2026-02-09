"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface ModalState {
  contactOpen: boolean
  commandPaletteOpen: boolean
  openContact: () => void
  closeContact: () => void
  openCommandPalette: () => void
  closeCommandPalette: () => void
}

const ModalContext = createContext<ModalState | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [contactOpen, setContactOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  const openContact = useCallback(() => {
    setCommandPaletteOpen(false)
    setContactOpen(true)
  }, [])

  const closeContact = useCallback(() => setContactOpen(false), [])

  const openCommandPalette = useCallback(() => {
    setContactOpen(false)
    setCommandPaletteOpen(true)
  }, [])

  const closeCommandPalette = useCallback(() => setCommandPaletteOpen(false), [])

  return (
    <ModalContext.Provider
      value={{
        contactOpen,
        commandPaletteOpen,
        openContact,
        closeContact,
        openCommandPalette,
        closeCommandPalette,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export function useModals() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error("useModals must be used within ModalProvider")
  return ctx
}
