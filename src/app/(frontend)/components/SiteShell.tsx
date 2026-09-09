'use client'

import { useEffect, useRef, useState } from 'react'
import Footer from './Footer'

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const footerRef = useRef<HTMLDivElement>(null)
  const [footerHeight, setFooterHeight] = useState(0)
  const [revealProgress, setRevealProgress] = useState(0)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return

    const update = () => setFooterHeight(el.offsetHeight)
    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (!footerHeight) return

    let rafId = 0
    const update = () => {
      rafId = 0
      const docHeight = document.documentElement.scrollHeight
      const revealStart = docHeight - window.innerHeight - footerHeight
      const progress = revealStart > 0 ? (window.scrollY - revealStart) / footerHeight : 1
      setRevealProgress(Math.min(1, Math.max(0, progress)))
    }
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [footerHeight])

  return (
    <>
      {/* `main` itself must stay transparent — only the page content inside it is
          opaque. The trailing spacer (exactly as tall as the footer) is the one
          part of `main` with nothing painted on it, so once the page has been
          scrolled far enough for that spacer to enter the viewport, the sticky
          footer sitting behind it (pulled up to overlap that same spacer via a
          matching negative margin) shows through — the page appears to slide
          up and off the footer underneath it. */}
      <main className="relative z-10">
        {children}
        <div style={{ height: footerHeight }} aria-hidden="true" />
      </main>
      <div
        className="sticky bottom-0 z-0"
        style={footerHeight ? { marginTop: -footerHeight } : undefined}
      >
        <div ref={footerRef}>
          <Footer revealProgress={revealProgress} />
        </div>
      </div>
    </>
  )
}
