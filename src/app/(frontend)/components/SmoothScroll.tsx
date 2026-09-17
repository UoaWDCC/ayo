'use client'

import { useEffect, useRef } from 'react'

// How much of the remaining distance to close each frame — lower eases harder.
const EASE = 0.12
const SETTLE_THRESHOLD = 0.5

/**
 * Turns wheel/trackpad scrolling into an eased glide instead of the browser's
 * default per-tick jump: each wheel event nudges a target scroll position,
 * and a rAF loop lerps the real scroll position toward it every frame.
 * Touch scrolling is left native (it doesn't dispatch wheel events), and any
 * element that manages its own internal scroll (modals, panels) is left
 * alone so it keeps scrolling normally under the cursor.
 */
export default function SmoothScroll() {
  const target = useRef(0)
  const current = useRef(0)
  const rafId = useRef(0)
  const running = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    target.current = window.scrollY
    current.current = window.scrollY

    const maxScroll = () =>
      Math.max(document.documentElement.scrollHeight - window.innerHeight, 0)

    // A modal/panel (EventDetailsPanel, the PhotoSpotlight popup, etc.) locks
    // `document.body.style.overflow = 'hidden'` while it's open — respect that
    // lock here too, since this loop drives the scroll position with its own
    // `window.scrollTo` calls that would otherwise bypass it.
    const isScrollLocked = () => document.body.style.overflow === 'hidden'

    const step = () => {
      if (isScrollLocked()) {
        running.current = false
        return
      }
      current.current += (target.current - current.current) * EASE
      if (Math.abs(target.current - current.current) < SETTLE_THRESHOLD) {
        current.current = target.current
        window.scrollTo(0, current.current)
        running.current = false
        return
      }
      window.scrollTo(0, current.current)
      rafId.current = requestAnimationFrame(step)
    }

    const start = () => {
      if (!running.current) {
        running.current = true
        rafId.current = requestAnimationFrame(step)
      }
    }

    const onWheel = (e: WheelEvent) => {
      if (isScrollLocked()) return
      if ((e.target as HTMLElement)?.closest('.overflow-y-auto, .overflow-auto')) return

      // Normalise line/page deltas (Firefox et al.) to roughly pixel units.
      const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1
      e.preventDefault()
      target.current = Math.min(Math.max(target.current + e.deltaY * scale, 0), maxScroll())
      start()
    }

    // Any scroll that didn't come from our own rAF loop (drag on the fake
    // scrollbar, keyboard, browser scroll restoration) — resync the target
    // so the next wheel tick continues from the right place.
    const onScroll = () => {
      if (!running.current) {
        target.current = window.scrollY
        current.current = window.scrollY
      }
    }

    const onResize = () => {
      target.current = Math.min(target.current, maxScroll())
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return null
}
