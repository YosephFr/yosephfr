"use client"

import { useLocale, type Locale } from "@/i18n"
import { useTheme } from "@/providers/ThemeProvider"
import { useModals } from "@/providers/ModalProvider"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Briefcase, Layers, Search, Mail, Sun, Moon, Monitor } from "lucide-react"

type Theme = "dark" | "light" | "auto"

const THEME_CYCLE: Record<Theme, Theme> = {
  dark: "light",
  light: "auto",
  auto: "dark",
}

const THEME_ICONS: Record<Theme, typeof Moon> = {
  dark: Moon,
  light: Sun,
  auto: Monitor,
}

const SECTION_IDS = ["inicio", "experiencia", "skills"]

function useActiveSection(pathname: string) {
  const [active, setActive] = useState<string | null>(null)
  const ratioMap = useRef<Record<string, number>>({})

  useEffect(() => {
    if (pathname !== "/") {
      setActive(null)
      return
    }

    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[]

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratioMap.current[entry.target.id] = entry.intersectionRatio
        }

        const scrollY = window.scrollY
        if (scrollY < 100) {
          setActive("inicio")
          return
        }

        let maxId: string | null = null
        let maxRatio = 0

        for (const [id, ratio] of Object.entries(ratioMap.current)) {
          if (ratio > maxRatio) {
            maxRatio = ratio
            maxId = id
          }
        }

        setActive(maxRatio > 0 ? maxId : null)
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    for (const el of elements) {
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [pathname])

  return active
}

function isNavActive(
  key: string,
  pathname: string,
  activeSection: string | null
): boolean {
  if (key === "home") {
    if (pathname === "/" && (activeSection === "inicio" || activeSection === null)) return true
    return false
  }

  if (key === "experience") {
    if (pathname === "/" && activeSection === "experiencia") return true
    if (pathname.startsWith("/experiencia")) return true
    return false
  }

  if (key === "skills") {
    if (pathname === "/" && activeSection === "skills") return true
    if (pathname.startsWith("/skills")) return true
    return false
  }

  return false
}

const NAV_ITEMS = [
  { key: "home", icon: Home, href: "/#inicio" },
  { key: "experience", icon: Briefcase, href: "/#experiencia" },
  { key: "skills", icon: Layers, href: "/#skills" },
]

export default function Navbar() {
  const { t, locale, setLocale } = useLocale()
  const { theme, setTheme } = useTheme()
  const { openCommandPalette } = useModals()
  const pathname = usePathname()
  const activeSection = useActiveSection(pathname)

  const currentTheme = theme as Theme
  const ThemeIcon = THEME_ICONS[currentTheme]

  const cycleTheme = () => {
    setTheme(THEME_CYCLE[currentTheme])
  }

  const toggleLocale = () => {
    setLocale(locale === "es" ? "en" : "es" as Locale)
  }

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[640px] px-4">
      <div className="flex items-center justify-between bg-surface-raised/80 backdrop-blur-xl border border-surface-border rounded-full px-3 py-2">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.map(({ key, icon: Icon, href }) => (
            <Link
              key={key}
              href={href}
              aria-label={
                key === "home"
                  ? t.nav.home
                  : key === "experience"
                    ? t.nav.experience
                    : t.nav.skills
              }
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 shrink-0 ${
                isNavActive(key, pathname, activeSection)
                  ? "text-text-primary bg-surface-overlay"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-overlay"
              }`}
            >
              <Icon size={18} strokeWidth={1.5} />
            </Link>
          ))}
          <button
            onClick={openCommandPalette}
            aria-label={t.nav.search}
            className="flex items-center justify-center w-10 h-10 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-all duration-200 shrink-0"
          >
            <Search size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleLocale}
            aria-label={t.nav.home}
            className="flex items-center justify-center h-8 px-2.5 rounded-full bg-surface-overlay border border-surface-border text-[11px] font-semibold text-text-secondary hover:text-text-primary transition-all duration-200"
          >
            {locale === "es" ? "EN" : "ES"}
          </button>

          <button
            onClick={cycleTheme}
            aria-label={t.nav.theme}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-overlay border border-surface-border text-text-secondary hover:text-text-primary transition-all duration-200"
          >
            <ThemeIcon size={14} strokeWidth={1.5} />
          </button>

          <Link
            href="/contacto"
            aria-label={t.nav.contact}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-accent text-surface hover:bg-accent-hover transition-all duration-200"
          >
            <Mail size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </nav>
  )
}
