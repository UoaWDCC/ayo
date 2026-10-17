'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { onModalOpen } from './modalEvents'
import { usePageTransitionPhase, FADE_DURATION } from './PageTransitionProvider'

type HeaderProps = {
  variant?: 'light' | 'dark'
  /** Renders with a transparent background, absolutely positioned to sit on top of a hero image. */
  overlay?: boolean
}

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/about-us', label: 'ABOUT US' },
  { href: '/news', label: 'NEWS' },
  { href: '/concerts-events', label: 'CONCERT & EVENTS' },
  { href: '/join-ayo', label: 'JOIN AYO' },
  { href: '/support-us', label: 'SUPPORT US' },
  { href: '/contact-us', label: 'CONTACT US' },
]

const MENU_TRANSITION_MS = 300

export default function Header({ variant = 'light', overlay = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuPresent, setMenuPresent] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [isRevealed, setIsRevealed] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const transitionPhase = usePageTransitionPhase()
  const isTransitioning = transitionPhase !== 'idle'
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // A modal/panel elsewhere on the page (e.g. an event or spotlight popup) just opened —
  // the mobile nav sits above them (z-[110]), so close it to avoid overlapping the modal.
  useEffect(() => onModalOpen(() => setIsMenuOpen(false)), [])

  // Keep one shared background behind the bar and links until the menu has collapsed.
  useEffect(() => {
    if (isMenuOpen) {
      setMenuPresent(true)
      return
    }
    if (!menuPresent) return
    if (window.matchMedia('(prefers-reduced-motion: reduce), (min-width: 1024px)').matches) {
      setMenuPresent(false)
      return
    }
    const timeout = window.setTimeout(() => setMenuPresent(false), MENU_TRANSITION_MS)
    return () => window.clearTimeout(timeout)
  }, [isMenuOpen, menuPresent])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => {
      if (desktop.matches) setIsMenuOpen(false)
    }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  // Reveal the solid header when scrolling up and hide it when scrolling down.
  useEffect(() => {
    if (!overlay) return
    lastScrollY.current = window.scrollY

    const update = () => {
      const y = window.scrollY
      const nowAtTop = y <= 8
      setAtTop(nowAtTop)

      if (isMenuOpen) {
        setIsRevealed(true)
      } else if (nowAtTop) {
        setIsRevealed(false)
      } else if (y > lastScrollY.current) {
        setIsRevealed(false)
      } else if (y < lastScrollY.current) {
        setIsRevealed(true)
      }

      lastScrollY.current = y
      ticking.current = false
    }

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMenuOpen, overlay])

  const menuSurfaceVisible = isMenuOpen || menuPresent
  const isSolid = overlay && (isRevealed || menuSurfaceVisible || isTransitioning)
  const isDark = overlay ? !isSolid : variant === 'dark'

  const bgVisible = isSolid || !overlay
  const bgColor = !overlay && isDark ? 'bg-black' : 'bg-white'
  const text = isDark ? 'text-white' : 'text-black'
  const contentVisible = atTop || isSolid || !overlay

  return (
    <>
      {/* Page-transition cover: fades everything below the nav to white, then back in, as
          routes swap underneath. Rendered as a sibling of `header` (not a child) so its z-[100]
          always stacks beneath the header's z-[110], regardless of how deep this NavBar sits in a
          given page's own stacking contexts. Sits above every other fixed/overlay element (modals,
          in-page curtains, etc. topping out at z-50) so nothing leaks through while scrolling
          mid-transition. */}
      <div
        aria-hidden="true"
        style={{ transitionDuration: `${FADE_DURATION}ms` }}
        className={`fixed inset-0 z-[100] bg-white pointer-events-none transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <header
        className="fixed top-0 left-0 right-0 z-[110]"
        onKeyDown={(event) => {
          if (isMenuOpen && event.key === 'Escape') {
            event.preventDefault()
            setIsMenuOpen(false)
            menuButtonRef.current?.focus()
          }
        }}
      >
        <div
          className={`absolute inset-0 -z-10 ${bgColor} duration-500 motion-reduce:transition-none ease-[cubic-bezier(0.22,1,0.36,1)] ${
            atTop || menuSurfaceVisible || isTransitioning
              ? 'transition-none'
              : 'transition-opacity'
          } ${bgVisible ? 'opacity-100' : 'opacity-0'}`}
        />

        <div
          className={`relative transition-[opacity,color] duration-500 motion-reduce:transition-none ease-[cubic-bezier(0.22,1,0.36,1)] ${text} ${
            contentVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-between pl-4 pr-4 sm:px-6 md:px-10 h-15 lg:h-19">
            <Link href="/" className="shrink-0" onClick={() => setIsMenuOpen(false)}>
              <img
                src="/ayo-logo-white.png"
                alt="AYO Logo"
                className={`w-28 sm:w-36 h-auto lg:h-5 lg:w-auto xl:h-6 ${isDark ? '' : 'brightness-0'}`}
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex flex-nowrap justify-end gap-3 xl:gap-6 ml-3 xl:ml-8 items-center text-xs lg:text-sm xl:text-base font-semibold whitespace-nowrap">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-opacity duration-200 hover:opacity-70"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Hamburger button, shown below the lg breakpoint */}
            <button
              ref={menuButtonRef}
              type="button"
              className="lg:hidden relative z-10 flex flex-col justify-center items-center gap-1.5 w-10 h-10 shrink-0"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span
                className={`block w-7 h-0.5 transition-transform duration-200 motion-reduce:transition-none ${
                  isDark ? 'bg-white' : 'bg-black'
                } ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span
                className={`block w-7 h-0.5 transition-opacity duration-200 motion-reduce:transition-none ${
                  isDark ? 'bg-white' : 'bg-black'
                } ${isMenuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block w-7 h-0.5 transition-transform duration-200 motion-reduce:transition-none ${
                  isDark ? 'bg-white' : 'bg-black'
                } ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}
              />
            </button>
          </div>

          {/* Mobile nav */}
          <nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            aria-hidden={!isMenuOpen}
            inert={!isMenuOpen}
            style={{ transitionDuration: `${MENU_TRANSITION_MS}ms` }}
            className={`lg:hidden grid transition-[grid-template-rows] motion-reduce:transition-none ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="flex max-h-[calc(100dvh-3.75rem)] flex-col items-center gap-6 overflow-y-auto px-8 pt-2 pb-8 text-lg font-semibold">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="shrink-0 transition-opacity duration-200 motion-reduce:transition-none hover:opacity-70"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
