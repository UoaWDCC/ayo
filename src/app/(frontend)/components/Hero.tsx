import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT US', href: '/about-us' },
  { label: 'CONCERT & EVENTS', href: '/concerts-events' },
  { label: 'JOIN AYO', href: '/join-ayo' },
  { label: 'SUPPORT US', href: '/support-us' },
  { label: 'CONTACT US', href: '/contact-us' },
]

type HeroProps = {
  title: string
  /** Absolute path from /public, e.g. "/hero-orchestra.jpg" */
  backgroundImage?: string
}

const Hero = ({ title, backgroundImage }: HeroProps) => {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex flex-col overflow-hidden">
      {/* Background */}
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover object-center"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-700" />
      )}

      {/* Dark scrim */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Layered content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Nav */}
        <nav className="flex items-center justify-between px-10 py-6">
          <Image
            src="/ayo-logo-white.png"
            alt="Auckland Youth Orchestra"
            width={110}
            height={44}
            className="object-contain"
          />
          <ul className="flex items-center gap-10 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-white text-sm font-semibold tracking-wide hover:opacity-70 transition-opacity no-underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Title pinned to bottom-left */}
        <div className="mt-auto px-10 pb-10">
          <h1
            className="text-white font-bold leading-none m-0"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}
          >
            {title}
          </h1>
        </div>
      </div>
    </section>
  )
}

export default Hero
