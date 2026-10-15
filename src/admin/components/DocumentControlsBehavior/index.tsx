'use client'

import { usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

// Keep Payload's native actions and breadcrumb together without replacing either component.
export function DocumentControlsBehavior({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    let frame = 0
    let observedControls: Element | null = null
    const update = () => {
      const header = document.querySelector<HTMLElement>('.app-header')
      // Document drawers have their own controls and must not affect the page header.
      const bar = Array.from(document.querySelectorAll<HTMLElement>('.doc-controls')).find(
        (element) => !element.closest('[role="dialog"], .drawer'),
      )
      if (!header || !bar) return
      const headerHeight = header.getBoundingClientRect().height
      const stuck = bar.getBoundingClientRect().top <= headerHeight + 1
      if (bar.classList.contains('ayo-doc-controls--stuck') !== stuck) {
        bar.classList.toggle('ayo-doc-controls--stuck', stuck)
      }
      const controls = bar.querySelector<HTMLElement>('.doc-controls__controls-wrapper')
      if (controls) {
        const width =
          Math.ceil(Math.max(controls.scrollWidth, controls.getBoundingClientRect().width)) + 24
        const reservedWidth = `${width}px`
        if (header.style.getPropertyValue('--ayo-doc-actions-width') !== reservedWidth) {
          header.style.setProperty('--ayo-doc-actions-width', reservedWidth)
        }
        if (observedControls !== controls) {
          observer.disconnect()
          observer.observe(controls)
          observedControls = controls
        }
      }
    }
    const schedule = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0
          update()
        })
    }
    const onScroll = (event: Event) => {
      if (event.target === document || event.target === window) schedule()
    }
    const observer = new ResizeObserver(schedule)
    schedule()
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', schedule)
      document
        .querySelector<HTMLElement>('.app-header')
        ?.style.removeProperty('--ayo-doc-actions-width')
      document
        .querySelectorAll('.ayo-doc-controls--stuck')
        .forEach((bar) => bar.classList.remove('ayo-doc-controls--stuck'))
    }
  }, [pathname])

  return children
}
