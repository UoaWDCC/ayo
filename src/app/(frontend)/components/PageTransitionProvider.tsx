'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

type Phase = 'idle' | 'covering' | 'revealing'

const PageTransitionContext = createContext<Phase>('idle')

/** Whether a page transition is in progress — NavBar uses this to force its solid,
 *  black-on-white look so it stays legible over the white cover. */
export const usePageTransitionPhase = () => useContext(PageTransitionContext)

export const FADE_DURATION = 350

/**
 * Intercepts same-origin link clicks so navigation fades the page to white first, swaps the
 * route underneath the cover, then fades back in — rather than jump-cutting to the new page.
 */
export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')
  const pendingHref = useRef<string | null>(null)
  const previousPathname = useRef(pathname)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const anchor = (e.target as HTMLElement)?.closest('a')
      if (!anchor) return
      if (anchor.hasAttribute('download') || anchor.target === '_blank') return

      const href = anchor.getAttribute('href')
      if (!href) return

      let url: URL
      try {
        url = new URL(href, window.location.href)
      } catch {
        return
      }

      if (url.origin !== window.location.origin) return
      if (url.pathname === pathname && !url.search && !url.hash) return

      e.preventDefault()
      pendingHref.current = href
      setPhase('covering')
    }

    // Capture phase: must run before next/link's own bubble-phase click handler (delegated on
    // the React root, which sits between `document` and the anchor in the bubble path) fires
    // and navigates on its own.
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [pathname])

  // Once fully covered in white, actually perform the navigation.
  useEffect(() => {
    if (phase !== 'covering') return
    const timeout = setTimeout(() => {
      if (pendingHref.current) router.push(pendingHref.current)
    }, FADE_DURATION)
    return () => clearTimeout(timeout)
  }, [phase, router])

  // Once the new route has mounted underneath the cover, fade back in.
  useEffect(() => {
    if (pathname === previousPathname.current) return
    previousPathname.current = pathname
    pendingHref.current = null
    if (phase === 'covering') setPhase('revealing')
  }, [pathname, phase])

  useEffect(() => {
    if (phase !== 'revealing') return
    const timeout = setTimeout(() => setPhase('idle'), FADE_DURATION)
    return () => clearTimeout(timeout)
  }, [phase])

  return <PageTransitionContext.Provider value={phase}>{children}</PageTransitionContext.Provider>
}
