'use client'

import { useEffect, useRef, type RefObject } from 'react'

// Matches SmoothScroll's easing so a modal's internal scroll glides the same way
// the rest of the page does — the browser's native overflow-y-auto scroll otherwise
// jumps per wheel tick with no easing at all.
const SCROLL_EASE = 0.12
const SCROLL_SETTLE_THRESHOLD = 0.5

/**
 * Eases wheel scrolling inside a scroll container, for modals whose body scrolls.
 *
 * `onPosition` is optional and only worth passing when something needs to follow the
 * scroll (a parallax header, say) — without it this runs entirely outside React, so a
 * long document scrolls without re-rendering anything.
 */
export function useEasedWheelScroll(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  onPosition?: (scrollTop: number) => void,
) {
  // Kept in a ref so a caller passing an inline function doesn't restart the loop.
  const onPositionRef = useRef(onPosition)
  onPositionRef.current = onPosition

  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return
    // Optional call: jsdom (and older browsers) may not implement matchMedia.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const target = { current: el.scrollTop }
    const current = { current: el.scrollTop }
    let rafId = 0
    let running = false

    const maxScroll = () => Math.max(el.scrollHeight - el.clientHeight, 0)

    const step = () => {
      current.current += (target.current - current.current) * SCROLL_EASE
      const settled = Math.abs(target.current - current.current) < SCROLL_SETTLE_THRESHOLD
      if (settled) current.current = target.current

      el.scrollTop = current.current
      onPositionRef.current?.(current.current)

      if (settled) {
        running = false
        return
      }
      rafId = requestAnimationFrame(step)
    }

    const start = () => {
      if (!running) {
        running = true
        rafId = requestAnimationFrame(step)
      }
    }

    const onWheel = (e: WheelEvent) => {
      const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1
      e.preventDefault()
      target.current = Math.min(Math.max(target.current + e.deltaY * scale, 0), maxScroll())
      start()
    }

    // Any scroll that didn't come from our own rAF loop (thumb drag, touch,
    // keyboard) — resync the target so the next wheel tick continues from
    // the right place.
    const onScroll = () => {
      if (!running) {
        target.current = el.scrollTop
        current.current = el.scrollTop
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [enabled, ref])
}
