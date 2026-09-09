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

export default function Header({ variant = 'light', overlay = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [isRevealed, setIsRevealed] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const transitionPhase = usePageTransitionPhase()
  const isTransitioning = transitionPhase !== 'idle'
  const [suppressSlide, setSuppressSlide] = useState(false)

  // A modal/panel elsewhere on the page (e.g. an event or spotlight popup) just opened —
  // the mobile nav sits above them (z-[110]), so close it to avoid overlapping the modal.
  useEffect(() => onModalOpen(() => setIsMenuOpen(false)), [])

  // Suppress the background's slide transition for the duration of a page transition *and*
  // for one more frame after it ends, so the forced-solid bg (and its snap back to hidden,
  // if the page wasn't actually scrolled) never triggers the slide-down/up animation.
  useEffect(() => {
    if (isTransitioning) {
      setSuppressSlide(true)
      return
    }
    const raf = requestAnimationFrame(() => setSuppressSlide(false))
    return () => cancelAnimationFrame(raf)
  }, [isTransitioning])

  // Three states as you scroll an overlay page: at the top (transparent, white content); away
  // from the top while scrolling down (bar fully hidden — content faded to nothing, background
  // never shows); and revealed by scrolling up (solid white background, black content). The bar
  // only ever turns solid in response to an upward scroll — never just from leaving the top.
  useEffect(() => {
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

    // Coalesce to one state update per animation frame, so fast/trackpad scrolling doesn't
    // pile up React renders faster than the browser can paint them.
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMenuOpen])

  // Forced solid + black-on-white for the duration of a page transition, so the bar stays
  // legible over the white cover regardless of scroll position or page variant.
  const isSolid = isRevealed || isMenuOpen || isTransitioning
  const isDark = !isSolid && (overlay || variant === 'dark')

  // The background only ever shows once revealed by an upward scroll (or always, for the
  // standalone/non-overlay header). It slides down + fades in to reveal, and slides back up +
  // fades out to hide — the same motion in both directions.
  const bgVisible = isSolid || !overlay
  const bgColor = !bgVisible || isSolid ? 'bg-white' : isDark ? 'bg-black' : 'bg-white'
  const text = isDark ? 'text-white' : 'text-black'

  // The content is visible at the top (white) and once revealed (black); scrolling down away
  // from the top with nothing revealed yet just fades it out to nothing, background included.
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
      <header className="fixed top-0 left-0 right-0 z-[110]">
        <div
          className={`absolute inset-0 -z-10 ${bgColor} duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            suppressSlide ? 'transition-opacity' : 'transition-[opacity,translate]'
          } ${bgVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
        />

        <div
          className={`relative transition-[opacity,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${text} ${
            contentVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-between px-10 h-15 lg:h-19">
            <Link href="/" className="shrink-0" onClick={() => setIsMenuOpen(false)}>
              <img
                src={isDark ? '/ayo-logo-white.png' : '/ayo-logo-black-bgwhite.png'}
                alt="AYO Logo"
                className="w-28 sm:w-36 h-auto lg:h-5 lg:w-auto xl:h-6"
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
              type="button"
              className="lg:hidden relative z-10 flex flex-col justify-center items-center gap-1.5 w-10 h-10 shrink-0"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span
                className={`block w-7 h-0.5 transition-transform duration-200 ${
                  isDark ? 'bg-white' : 'bg-black'
                } ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span
                className={`block w-7 h-0.5 transition-opacity duration-200 ${
                  isDark ? 'bg-white' : 'bg-black'
                } ${isMenuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block w-7 h-0.5 transition-transform duration-200 ${
                  isDark ? 'bg-white' : 'bg-black'
                } ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}
              />
            </button>
          </div>

          {/* Mobile nav */}
          <nav
            id="mobile-nav"
            className={`lg:hidden flex flex-col items-center gap-6 px-8 overflow-hidden text-lg font-semibold transition-[max-height,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isMenuOpen ? 'max-h-112 translate-y-0 pb-8' : 'max-h-0 -translate-y-4'
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-opacity duration-200 hover:opacity-70"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  )
}
