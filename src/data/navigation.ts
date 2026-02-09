export interface NavItem {
  icon: string
  label: string
  href: string
  type: "link" | "action"
}

export const NAV_ITEMS: NavItem[] = [
  { icon: "home", label: "Inicio", href: "#inicio", type: "link" },
  { icon: "briefcase", label: "Experiencia", href: "#experiencia", type: "link" },
  { icon: "layers", label: "Skills", href: "#skills", type: "link" },
  { icon: "mail", label: "Contacto", href: "#contacto", type: "action" },
]
