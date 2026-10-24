"use client"

import { useLocale } from "@/i18n"
import { useModals } from "@/providers/ModalProvider"
import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { Search, ArrowRight, Briefcase, Layers, Mail, Home, Award, Gamepad2, FileText } from "lucide-react"
import { EXPERIENCE } from "@/data/experience"
import { SKILLS } from "@/data/skills"

interface CommandItem {
  id: string
  icon: React.ReactNode
  title: string
  subtitle?: string
  section: string
  keywords?: string[]
  action: () => void
}

function CommandItemRow({
  item,
  index,
  isSelected,
  onSelect,
}: {
  item: CommandItem
  index: number
  isSelected: boolean
  onSelect: (i: number) => void
}) {
  return (
    <button
      data-selected={isSelected}
      onClick={item.action}
      onMouseEnter={() => onSelect(index)}
      className={`group flex items-center gap-3 w-full px-4 py-2.5 text-left rounded-[18px] transition-colors duration-100 ${
        isSelected ? "bg-surface-overlay" : ""
      }`}
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-[18px] bg-surface-overlay text-text-secondary shrink-0">
        {item.icon}
      </span>
      <div className="flex-1 min-w-0">
        <span className="block text-sm text-text-primary truncate">{item.title}</span>
        {item.subtitle && (
          <span className="block text-xs text-text-muted truncate">{item.subtitle}</span>
        )}
      </div>
      <ArrowRight
        size={14}
        strokeWidth={1.5}
        className={`shrink-0 text-text-muted transition-opacity duration-100 ${
          isSelected ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  )
}

const GAME_KEYWORDS = ["play", "jugar", "game", "juego", "games", "juegos"]

export default function CommandPalette() {
  const { commandPaletteOpen, closeCommandPalette, openCommandPalette, openContact } = useModals()
  const { t } = useLocale()
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const navigate = useCallback(
    (path: string) => {
      closeCommandPalette()
      router.push(path)
    },
    [closeCommandPalette, router]
  )

  const handleContact = useCallback(() => {
    closeCommandPalette()
    openContact()
  }, [closeCommandPalette, openContact])

  const gameItems: CommandItem[] = useMemo(
    () => [
      {
        id: "game-snake",
        icon: <Gamepad2 size={16} strokeWidth={1.5} />,
        title: "Snake",
        section: t.search.games,
        keywords: [...GAME_KEYWORDS, "snake", "serpiente", "vibora"],
        action: () => navigate("/snake"),
      },
      {
        id: "game-memory",
        icon: <Gamepad2 size={16} strokeWidth={1.5} />,
        title: "Memory",
        section: t.search.games,
        keywords: [...GAME_KEYWORDS, "memory", "memoria", "pares"],
        action: () => navigate("/memory"),
      },
      {
        id: "game-typing",
        icon: <Gamepad2 size={16} strokeWidth={1.5} />,
        title: "Typing Race",
        section: t.search.games,
        keywords: [...GAME_KEYWORDS, "typing", "tipeo", "escritura", "velocidad"],
        action: () => navigate("/typing"),
      },
      {
        id: "game-click",
        icon: <Gamepad2 size={16} strokeWidth={1.5} />,
        title: "Click Challenge",
        section: t.search.games,
        keywords: [...GAME_KEYWORDS, "click", "clic", "clics", "rapido"],
        action: () => navigate("/click"),
      },
    ],
    [navigate, t.search.games]
  )

  const allItems: CommandItem[] = useMemo(
    () => [
      {
        id: "nav-home",
        icon: <Home size={16} strokeWidth={1.5} />,
        title: t.nav.home,
        section: t.search.navigation,
        action: () => navigate("/"),
      },
      {
        id: "nav-blog",
        icon: <FileText size={16} strokeWidth={1.5} />,
        title: "Artículos",
        section: t.search.navigation,
        keywords: ["blog", "articulos", "guias"],
        action: () => navigate("/blog"),
      },
      {
        id: "nav-cv",
        icon: <Briefcase size={16} strokeWidth={1.5} />,
        title: "CV",
        section: t.search.navigation,
        keywords: ["curriculum", "experiencia", "formacion"],
        action: () => navigate("/cv"),
      },
      {
        id: "nav-contacto",
        icon: <Mail size={16} strokeWidth={1.5} />,
        title: "Contacto",
        section: t.search.navigation,
        keywords: ["correo", "email", "contacto"],
        action: () => navigate("/contacto"),
      },
      {
        id: "nav-experiencia",
        icon: <Briefcase size={16} strokeWidth={1.5} />,
        title: t.experience.label,
        section: t.search.navigation,
        action: () => navigate("/#trabajo"),
      },
      {
        id: "nav-skills",
        icon: <Layers size={16} strokeWidth={1.5} />,
        title: "Capacidades",
        section: t.search.navigation,
        action: () => navigate("/#capacidades"),
      },
      ...EXPERIENCE.map((exp) => ({
        id: `exp-${exp.slug}`,
        icon: <Briefcase size={16} strokeWidth={1.5} />,
        title: exp.title,
        subtitle: exp.company,
        section: t.experience.label,
        action: () => navigate(`/experiencia/${exp.slug}`),
      })),
      ...SKILLS.map((skill) => ({
        id: `skill-${skill.slug}`,
        icon: <Layers size={16} strokeWidth={1.5} />,
        title: skill.name,
        subtitle: skill.description,
        section: t.skills.label,
        action: () => navigate(`/skills/${skill.slug}`),
      })),
      {
        id: "hidden-achievements",
        icon: <Award size={16} strokeWidth={1.5} />,
        title: "Logros",
        section: t.search.actions,
        keywords: ["logros", "achievements", "easter", "eggs", "progreso"],
        action: () => navigate("/achievements"),
      },
      {
        id: "hidden-secreto",
        icon: <Gamepad2 size={16} strokeWidth={1.5} />,
        title: "Curiosidades",
        section: t.search.actions,
        keywords: ["curiosidades", "secreto", "datos", "fun facts"],
        action: () => navigate("/secreto"),
      },
      {
        id: "hidden-credits",
        icon: <Award size={16} strokeWidth={1.5} />,
        title: "Credits",
        section: t.search.actions,
        action: () => navigate("/credits"),
      },
      ...gameItems,
    ],
    [navigate, handleContact, t, gameItems]
  )

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems
    const lower = query.toLowerCase()
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(lower)) ||
        (item.keywords && item.keywords.some((kw) => lower.includes(kw)))
    )
  }, [query, allItems])

  const { sections, orderedSections, flatItems } = useMemo(() => {
    const sectionMap = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
      return {
        ...acc,
        [item.section]: [...(acc[item.section] || []), item],
      }
    }, {})

    const sectionOrder = [
      t.search.navigation,
      t.experience.label,
      t.skills.label,
      t.search.actions,
      t.search.games,
    ]
    const ordered = sectionOrder.filter((s) => sectionMap[s])

    const flat: CommandItem[] = []
    ordered.forEach((sectionName) => {
      sectionMap[sectionName].forEach((item) => flat.push(item))
    })

    return { sections: sectionMap, orderedSections: ordered, flatItems: flat }
  }, [filtered, t])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (commandPaletteOpen) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      setQuery("")
      setSelectedIndex(0)
      document.body.style.overflow = "hidden"
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      document.body.style.overflow = ""
      // Al cerrar, el foco vuelve a donde estaba si ese elemento sigue en la página.
      if (returnFocus.current?.isConnected) returnFocus.current.focus()
      returnFocus.current = null
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [commandPaletteOpen])

  // Mientras la paleta está abierta, el resto de la página queda inerte: no se enfoca ni se lee.
  useEffect(() => {
    if (!commandPaletteOpen) return
    const dialog = dialogRef.current
    const blocked: Element[] = []
    for (const child of Array.from(document.body.children)) {
      if (dialog && child.contains(dialog)) continue
      if (child.hasAttribute("inert")) continue
      child.setAttribute("inert", "")
      blocked.push(child)
    }
    return () => blocked.forEach((child) => child.removeAttribute("inert"))
  }, [commandPaletteOpen])

  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      // Si el foco quedó fuera de la paleta abierta, Escape la cierra igual y Tab vuelve a entrar.
      const dialog = dialogRef.current
      if (commandPaletteOpen && dialog && !dialog.contains(document.activeElement)) {
        if (e.key === "Escape") {
          e.preventDefault()
          closeCommandPalette()
          return
        }
        if (e.key === "Tab") {
          e.preventDefault()
          const focusable = Array.from(
            dialog.querySelectorAll<HTMLElement>('input, button, [href], [tabindex]:not([tabindex="-1"])')
          ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null)
          ;(e.shiftKey ? focusable[focusable.length - 1] : focusable[0])?.focus()
          return
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        if (commandPaletteOpen) {
          closeCommandPalette()
        } else {
          openCommandPalette()
        }
      }
    }

    window.addEventListener("keydown", handleGlobalKeydown)
    return () => window.removeEventListener("keydown", handleGlobalKeydown)
  }, [commandPaletteOpen, closeCommandPalette, openCommandPalette])

  const handleKeydown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % flatItems.length)
      }

      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length)
      }

      if (e.key === "Enter" && flatItems[selectedIndex]) {
        e.preventDefault()
        flatItems[selectedIndex].action()
      }

      if (e.key === "Escape") {
        e.preventDefault()
        closeCommandPalette()
      }

      // Tab y Shift+Tab giran dentro de la paleta, aunque haya un solo elemento enfocable.
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>('input, button, [href], [tabindex]:not([tabindex="-1"])')
        ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null)
        if (focusable.length === 0) {
          e.preventDefault()
          return
        }
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const active = document.activeElement
        if (focusable.length === 1 || !dialogRef.current.contains(active)) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [flatItems, selectedIndex, closeCommandPalette]
  )

  useEffect(() => {
    if (!listRef.current) return
    const selected = listRef.current.querySelector("[data-selected='true']")
    if (selected) {
      selected.scrollIntoView({ block: "nearest" })
    }
  }, [selectedIndex])

  if (!commandPaletteOpen) return null

  let flatIndex = -1

  return createPortal(
    <div ref={dialogRef} className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]" onKeyDown={handleKeydown} role="dialog" aria-modal="true" aria-label="Buscar en el sitio">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeCommandPalette} />
      <div className="paleta relative w-full max-w-[520px] mx-4 overflow-hidden animate-slide-down">
        <div className="flex items-center gap-3 px-4 h-14 bg-surface-overlay">
          <Search size={18} strokeWidth={1.5} className="text-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search.placeholder}
            aria-label={t.search.placeholder}
            className="flex-1 bg-transparent text-text-primary text-base placeholder:text-text-muted outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs text-text-muted bg-surface-raised rounded-[18px]">
            Esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[360px] overflow-y-auto p-2">
          {flatItems.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-text-muted">
              {t.search.noResults}
            </div>
          )}

          {orderedSections.map((sectionName) => (
            <div key={sectionName}>
              <div className="px-4 pt-3 pb-1">
                <span className="text-[13px] font-medium text-text-muted">
                  {sectionName}
                </span>
              </div>
              {sections[sectionName].map((item) => {
                flatIndex++
                return (
                  <CommandItemRow
                    key={item.id}
                    item={item}
                    index={flatIndex}
                    isSelected={flatIndex === selectedIndex}
                    onSelect={setSelectedIndex}
                  />
                )
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 bg-surface-overlay">
          <div className="flex items-center gap-2">
            <kbd className="inline-flex items-center px-2 py-1 text-xs text-text-muted bg-surface-raised rounded-[18px]">
              ↑ ↓
            </kbd>
            <span className="text-xs text-text-muted">{t.search.navigate}</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="inline-flex items-center px-2 py-1 text-xs text-text-muted bg-surface-raised rounded-[18px]">
              Enter
            </kbd>
            <span className="text-xs text-text-muted">{t.search.select}</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
