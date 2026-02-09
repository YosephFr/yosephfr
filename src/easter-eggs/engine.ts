export interface EasterEgg {
  id: string
  name: string
  category:
    | "keyboard"
    | "click"
    | "scroll"
    | "time"
    | "hover"
    | "hidden"
    | "form"
    | "game"
    | "achievement"
    | "visual"
  hint: string
}

type Listener = () => void

const STORAGE_KEY = "yc-eggs"

export class EasterEggEngine {
  private discovered: Set<string>
  private eggs: Map<string, EasterEgg>
  private listeners: Set<Listener>

  constructor() {
    this.discovered = this.load()
    this.eggs = new Map()
    this.listeners = new Set()
  }

  register(egg: EasterEgg): void {
    this.eggs.set(egg.id, egg)
  }

  registerMany(eggs: EasterEgg[]): void {
    eggs.forEach((egg) => this.eggs.set(egg.id, egg))
  }

  discover(id: string): boolean {
    if (this.discovered.has(id) || !this.eggs.has(id)) return false
    this.discovered = new Set([...this.discovered, id])
    this.persist()
    this.listeners.forEach((listener) => listener())
    return true
  }

  isDiscovered(id: string): boolean {
    return this.discovered.has(id)
  }

  getProgress(): { found: number; total: number } {
    return { found: this.discovered.size, total: this.eggs.size }
  }

  getDiscoveries(): string[] {
    return [...this.discovered]
  }

  getEgg(id: string): EasterEgg | undefined {
    return this.eggs.get(id)
  }

  getAllEggs(): EasterEgg[] {
    return [...this.eggs.values()]
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  reset(): void {
    this.discovered = new Set()
    this.persist()
    this.listeners.forEach((listener) => listener())
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.discovered]))
    } catch {
      /* noop */
    }
  }

  private load(): Set<string> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return new Set()
      return new Set(JSON.parse(raw))
    } catch {
      return new Set()
    }
  }
}

export const engine = new EasterEggEngine()
