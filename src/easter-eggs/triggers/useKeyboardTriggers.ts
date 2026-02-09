"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { engine } from "../engine"

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
]

const WORD_TRIGGERS: Record<string, string> = {
  hello: "egg-2",
  matrix: "egg-3",
  party: "egg-4",
  reverse: "egg-5",
  teal: "egg-6",
  speed: "egg-7",
  zen: "egg-8",
  coffee: "egg-9",
  sudo: "egg-10",
}

const BUFFER_SIZE = 20
const IDLE_TIMEOUT = 2000
const EFFECT_RESET_DELAY = 100

export default function useKeyboardTriggers(): { triggerEffect: string | null } {
  const bufferRef = useRef<string[]>([])
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [triggerEffect, setTriggerEffect] = useState<string | null>(null)
  const effectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fireTrigger = useCallback((eggId: string, effectName: string) => {
    engine.discover(eggId)
    setTriggerEffect(effectName)
    if (effectTimerRef.current) {
      clearTimeout(effectTimerRef.current)
    }
    effectTimerRef.current = setTimeout(() => {
      setTriggerEffect(null)
    }, EFFECT_RESET_DELAY)
  }, [])

  const checkKonami = useCallback((buffer: string[]) => {
    if (buffer.length < KONAMI_CODE.length) return false
    const tail = buffer.slice(-KONAMI_CODE.length)
    return tail.every((key, i) => key === KONAMI_CODE[i])
  }, [])

  const checkWords = useCallback((buffer: string[]) => {
    const typed = buffer.join("").toLowerCase()
    for (const [word, eggId] of Object.entries(WORD_TRIGGERS)) {
      if (typed.endsWith(word)) {
        return { eggId, word }
      }
    }
    return null
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }

      idleTimerRef.current = setTimeout(() => {
        bufferRef.current = []
      }, IDLE_TIMEOUT)

      bufferRef.current = [...bufferRef.current, e.key].slice(-BUFFER_SIZE)

      if (checkKonami(bufferRef.current)) {
        fireTrigger("egg-1", "konami")
        bufferRef.current = []
        return
      }

      const wordMatch = checkWords(bufferRef.current)
      if (wordMatch) {
        fireTrigger(wordMatch.eggId, wordMatch.word)
        bufferRef.current = []
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
      if (effectTimerRef.current) {
        clearTimeout(effectTimerRef.current)
      }
    }
  }, [checkKonami, checkWords, fireTrigger])

  return { triggerEffect }
}
