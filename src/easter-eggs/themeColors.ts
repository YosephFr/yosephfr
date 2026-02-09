export function getThemeColor(varName: string): string {
  if (typeof window === "undefined") return ""
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim()
}

export function getSurface(): string {
  return getThemeColor("--color-surface") || "#161616"
}

export function getSurfaceRaised(): string {
  return getThemeColor("--color-surface-raised") || "#212121"
}

export function getSurfaceOverlay(): string {
  return getThemeColor("--color-surface-overlay") || "#2c2c2c"
}

export function getSurfaceBorder(): string {
  return getThemeColor("--color-surface-border") || "#383838"
}

export function getAccent(): string {
  return getThemeColor("--color-accent") || "#14B8A6"
}

export function getAccentHover(): string {
  return getThemeColor("--color-accent-hover") || "#0D9488"
}

export function getTextPrimary(): string {
  return getThemeColor("--color-text-primary") || "#ffffff"
}

export function getTextMuted(): string {
  return getThemeColor("--color-text-muted") || "#a0a0a0"
}
