"use client"

import { useEffect, useRef, useCallback } from "react"
import { engine } from "../engine"

export default function useDevToolsTrigger(): void {
  const discoveredRef = useRef(false)

  const markDiscovered = useCallback(() => {
    if (discoveredRef.current) return
    discoveredRef.current = true
    engine.discover("egg-65")
  }, [])

  useEffect(() => {
    const threshold = 160
    let devtoolsOpen = false

    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold

      if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true
          markDiscovered()
        }
      } else {
        devtoolsOpen = false
      }
    }

    const interval = setInterval(checkDevTools, 1000)
    window.addEventListener("resize", checkDevTools)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", checkDevTools)
    }
  }, [markDiscovered])
}
