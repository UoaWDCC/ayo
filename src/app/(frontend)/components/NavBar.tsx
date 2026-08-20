'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

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
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isSolidBlack = isMenuOpen || isScrolled

  // Mobile (below lg): overlay starts fully transparent over the hero image and fades to a
  // solid black once scrolled (or the menu opens); the standalone header stays sticky and
  // follows its own variant, switching to black once scrolled.
  const isDarkMobile = overlay || variant === 'dark' || isSolidBlack
  const mobilePosition = overlay
    ? isScrolled
      ? 'fixed top-0 left-0 right-0'
      : 'absolute top-0 left-0 right-0'
    : 'sticky top-0'
  const mobileBg = overlay ? (isSolidBlack ? 'bg-black' : 'bg-transparent') : isDarkMobile ? 'bg-black' : 'bg-white'
  const mobileText = isDarkMobile ? 'text-white' : 'text-black'

  // Desktop (lg+): unaffected by scroll, keeps the original static/overlay appearance.
  const isDarkDesktop = overlay || variant === 'dark'
  const desktopPosition = overlay ? 'lg:absolute lg:top-0 lg:left-0 lg:right-0' : 'lg:relative'
  const desktopBg = overlay ? 'lg:bg-transparent' : isDarkDesktop ? 'lg:bg-black' : 'lg:bg-white'
  const desktopText = isDarkDesktop ? 'lg:text-white' : 'lg:text-black'

  return (
    <header
      className={`z-30 transition-colors duration-500 ${mobilePosition} ${mobileBg} ${mobileText} ${desktopPosition} ${desktopBg} ${desktopText}`}
    >
      <div className="flex items-center justify-between px-6 sm:px-8 lg:px-24 py-6 lg:py-8 xl:px-28">
        <Link href="/" className="shrink-0" onClick={() => setIsMenuOpen(false)}>
          {/* Two logos: each breakpoint picks its own colour independently, since scroll only affects mobile. */}
          <img
            src={isDarkMobile ? '/ayo-logo-white.png' : '/ayo-logo-black-bgwhite.png'}
            alt="AYO Logo"
            className="lg:hidden w-28 sm:w-36 h-auto"
          />
          <img
            src={isDarkDesktop ? '/ayo-logo-white.png' : '/ayo-logo-black-bgwhite.png'}
            alt="AYO Logo"
            className="hidden lg:block lg:w-52 h-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex flex-wrap justify-end gap-6 xl:gap-10 ml-8 xl:ml-16 items-center text-base lg:text-lg xl:text-xl font-semibold">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:opacity-70">
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
              isDarkMobile ? 'bg-white' : 'bg-black'
            } ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`block w-7 h-0.5 transition-opacity duration-200 ${
              isDarkMobile ? 'bg-white' : 'bg-black'
            } ${isMenuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block w-7 h-0.5 transition-transform duration-200 ${
              isDarkMobile ? 'bg-white' : 'bg-black'
            } ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </div>

      {/* Mobile nav */}
      <nav
        id="mobile-nav"
        className={`lg:hidden flex flex-col items-center gap-6 px-8 overflow-hidden text-lg font-semibold transition-[max-height,opacity] duration-200 ease-in-out ${
          isMenuOpen ? 'max-h-112 opacity-100 pb-8' : 'max-h-0 opacity-0'
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:opacity-70"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
