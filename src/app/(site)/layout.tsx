"use client"

import dynamic from "next/dynamic"
import type { ReactNode } from "react"
import { LocaleProvider } from "@/i18n"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { ModalProvider } from "@/providers/ModalProvider"
import { EasterEggProvider } from "@/providers/EasterEggProvider"
import Navbar from "@/components/Navbar"

const CommandPalette = dynamic(() => import("@/components/CommandPalette"))
const ContextMenu = dynamic(() => import("@/components/ContextMenu"))

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <ModalProvider>
          <EasterEggProvider>
            <Navbar />
            {children}
            <CommandPalette />
            <ContextMenu />
          </EasterEggProvider>
        </ModalProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}
