'use client'

import { useEffect } from 'react'
import { sendEvent } from '@/lib/attribution'
import type { Lang } from '@/lib/lang'

const ACTIVE_MS = 60_000

export default function ArticleRead({ lang }: { lang: Lang }) {
  useEffect(() => {
    const path = window.location.pathname
    const key = `article_read:${path}`
    try {
      if (sessionStorage.getItem(key)) return
    } catch {
      // If storage is blocked, this view can still emit the event once.
    }

    const state = {
      done: false,
      activeMs: 0,
      lastTick: document.visibilityState === 'visible' ? performance.now() : 0,
      timer: 0,
    }

    const stop = () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisible)
      if (state.timer) window.clearInterval(state.timer)
      state.timer = 0
    }

    const fire = (method: 'scroll' | 'time') => {
      if (state.done) return
      state.done = true
      try {
        sessionStorage.setItem(key, method)
      } catch {
        // One shot for this document even if the session cannot remember it.
      }
      sendEvent('article_read', { page_path: path, language: lang, method })
      stop()
    }

    const onScroll = () => {
      const article = document.querySelector('main article')
      if (!(article instanceof HTMLElement)) return
      const start = window.scrollY + article.getBoundingClientRect().top
      const seen = window.scrollY + window.innerHeight - start
      if (article.offsetHeight > 0 && seen / article.offsetHeight >= 0.75) fire('scroll')
    }

    const onVisible = () => {
      state.lastTick = document.visibilityState === 'visible' ? performance.now() : 0
    }

    const tick = () => {
      const now = performance.now()
      if (document.visibilityState === 'visible' && state.lastTick > 0) state.activeMs += now - state.lastTick
      state.lastTick = document.visibilityState === 'visible' ? now : 0
      if (state.activeMs >= ACTIVE_MS) fire('time')
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisible)
    state.timer = window.setInterval(tick, 1000)
    onScroll()
    return stop
  }, [lang])

  return null
}
