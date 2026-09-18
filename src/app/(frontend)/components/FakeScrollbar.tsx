'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

type ScrollTarget = RefObject<HTMLElement | null> | 'window'

type FakeScrollbarProps = {
  target: ScrollTarget
  variant?: 'light' | 'dark'
  /** Use fixed positioning spanning the viewport instead of absolute positioning within a relative parent. */
  fixed?: boolean
  className?: string
}

const MIN_THUMB_SIZE = 32

const getMetrics = (target: ScrollTarget) => {
  if (target === 'window') {
    return {
      scrollSize: document.documentElement.scrollHeight,
      clientSize: window.innerHeight,
      scrollPos: window.scrollY,
    }
  }
  const el = target.current
  if (!el) return null
  return {
    scrollSize: el.scrollHeight,
    clientSize: el.clientHeight,
    scrollPos: el.scrollTop,
  }
}

const setScrollPos = (target: ScrollTarget, pos: number) => {
  if (target === 'window') {
    window.scrollTo({ top: pos })
    return
  }
  const el = target.current
  if (el) el.scrollTop = pos
}

export default function FakeScrollbar({
  target,
  variant = 'dark',
  fixed = false,
  className = '',
}: FakeScrollbarProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [thumbSize, setThumbSize] = useState(0)
  const [thumbOffset, setThumbOffset] = useState(0)
  const [visible, setVisible] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const update = () => {
      const metrics = getMetrics(target)
      const trackSize = trackRef.current?.clientHeight
      if (!metrics || !trackSize || metrics.scrollSize <= metrics.clientSize) {
        setVisible(false)
        return
      }
      setVisible(true)
      const size = Math.max((metrics.clientSize / metrics.scrollSize) * trackSize, MIN_THUMB_SIZE)
      const maxOffset = trackSize - size
      const scrollable = metrics.scrollSize - metrics.clientSize
      const offset = scrollable > 0 ? (metrics.scrollPos / scrollable) * maxOffset : 0
      setThumbSize(size)
      setThumbOffset(offset)
    }

    update()

    const scrollEl: EventTarget = target === 'window' ? window : (target.current ?? window)
    scrollEl.addEventListener('scroll', update)
    window.addEventListener('resize', update)

    const observedEl = target === 'window' ? document.documentElement : target.current
    let ro: ResizeObserver | undefined
    if (observedEl) {
      ro = new ResizeObserver(update)
      ro.observe(observedEl)
    }

    return () => {
      scrollEl.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      ro?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  const handleThumbPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)

    const startY = e.clientY
    const startMetrics = getMetrics(target)
    if (!startMetrics) return
    const startScroll = startMetrics.scrollPos
    document.body.style.userSelect = 'none'

    const onMove = (ev: PointerEvent) => {
      const trackSize = trackRef.current?.clientHeight
      const metrics = getMetrics(target)
      if (!trackSize || !metrics) return
      const size = Math.max((metrics.clientSize / metrics.scrollSize) * trackSize, MIN_THUMB_SIZE)
      const maxOffset = trackSize - size
      if (maxOffset <= 0) return
      const scrollable = metrics.scrollSize - metrics.clientSize
      const deltaY = ev.clientY - startY
      const deltaScroll = (deltaY / maxOffset) * scrollable
      setScrollPos(target, startScroll + deltaScroll)
    }

    const onUp = () => {
      setDragging(false)
      document.body.style.userSelect = ''
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const handleTrackClick = (e: React.MouseEvent) => {
    if (e.target !== trackRef.current) return
    const trackRect = trackRef.current?.getBoundingClientRect()
    const metrics = getMetrics(target)
    if (!trackRect || !metrics) return
    const clickOffset = e.clientY - trackRect.top
    const size = Math.max((metrics.clientSize / metrics.scrollSize) * trackRect.height, MIN_THUMB_SIZE)
    const maxOffset = trackRect.height - size
    const ratio = maxOffset > 0 ? Math.min(Math.max((clickOffset - size / 2) / maxOffset, 0), 1) : 0
    const scrollable = metrics.scrollSize - metrics.clientSize
    setScrollPos(target, ratio * scrollable)
  }

  if (!visible) return null

  return (
    <div
      ref={trackRef}
      onClick={handleTrackClick}
      className={`fake-scrollbar-track ${fixed ? 'fake-scrollbar-fixed' : ''} ${className}`}
      aria-hidden="true"
    >
      <div
        onPointerDown={handleThumbPointerDown}
        className={`fake-scrollbar-thumb variant-${variant} ${dragging ? 'dragging' : ''}`}
        style={{ height: thumbSize, transform: `translateY(${thumbOffset}px)` }}
      />
    </div>
  )
}
