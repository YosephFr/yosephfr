"use client"

import { useLocale } from "@/i18n"
import { useModals } from "@/providers/ModalProvider"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import { Search, Mail, Home, Eye, Link2 } from "lucide-react"

interface MenuPosition {
  x: number
  y: number
}

interface ContextTarget {
  hasCard: boolean
  cardHref?: string
}

interface MenuItem {
  icon: React.ReactNode
  label: string
  action: () => void
}

function ContextMenuItem({ icon, label, action }: MenuItem) {
  return (
    <button
      onClick={action}
      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors duration-100"
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

export default function ContextMenu() {
  const { t } = useLocale()
  const { openCommandPalette } = useModals()
  const router = useRouter()
  const [position, setPosition] = useState<MenuPosition | null>(null)
  const [target, setTarget] = useState<ContextTarget>({ hasCard: false })
  const menuRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setPosition(null)
  }, [])

  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault()

    const element = e.target as HTMLElement
    const card = element.closest("[data-context-menu]") as HTMLElement | null

    const contextTarget: ContextTarget = {
      hasCard: !!card,
      cardHref: card?.dataset.contextMenu || undefined,
    }

    setTarget(contextTarget)

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const menuWidth = 180
    const menuHeight = 160

    const x = e.clientX + menuWidth > viewportWidth ? e.clientX - menuWidth : e.clientX
    const y = e.clientY + menuHeight > viewportHeight ? e.clientY - menuHeight : e.clientY

    setPosition({ x, y })
  }, [])

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu)
    return () => document.removeEventListener("contextmenu", handleContextMenu)
  }, [handleContextMenu])

  useEffect(() => {
    if (!position) return

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close()
      }
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close()
      }
    }

    const handleScroll = () => {
      close()
    }

    document.addEventListener("click", handleClick)
    document.addEventListener("keydown", handleKeydown)
    window.addEventListener("scroll", handleScroll, true)

    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("keydown", handleKeydown)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [position, close])

  if (!position) return null

  const cardItems: MenuItem[] = target.hasCard
    ? [
        {
          icon: <Eye size={14} strokeWidth={1.5} />,
          label: t.contextMenu.viewDetail,
          action: () => {
            if (target.cardHref) {
              router.push(target.cardHref)
            }
            close()
          },
        },
        {
          icon: <Link2 size={14} strokeWidth={1.5} />,
          label: t.contextMenu.copyLink,
          action: () => {
            if (target.cardHref) {
              navigator.clipboard.writeText(`${window.location.origin}${target.cardHref}`)
            }
            close()
          },
        },
      ]
    : []

  const generalItems: MenuItem[] = [
    {
      icon: <Search size={14} strokeWidth={1.5} />,
      label: t.contextMenu.search,
      action: () => {
        close()
        openCommandPalette()
      },
    },
    {
      icon: <Mail size={14} strokeWidth={1.5} />,
      label: t.contextMenu.contact,
      action: () => {
        close()
        router.push("/contacto")
      },
    },
    {
      icon: <Home size={14} strokeWidth={1.5} />,
      label: t.contextMenu.home,
      action: () => {
        close()
        router.push("/")
      },
    },
  ]

  const items = [...cardItems, ...generalItems]

  return createPortal(
    <div
      ref={menuRef}
      style={{ left: position.x, top: position.y }}
      className="fixed z-[110] bg-surface-raised border border-surface-border rounded-xl shadow-2xl p-1.5 min-w-[180px] animate-fade-in"
    >
      {items.map((item, i) => (
        <ContextMenuItem
          key={i}
          icon={item.icon}
          label={item.label}
          action={item.action}
        />
      ))}
    </div>,
    document.body
  )
}
