'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'

type HeroProps = {
  title: string
  /** Short line shown below the title, aligned to the left */
  subtitle?: string
  /** Absolute path from /public, e.g. "/hero-orchestra.jpg" */
  backgroundImage?: string
}

const PARALLAX_FACTOR = 0.5

const Hero = ({ title, subtitle, backgroundImage }: HeroProps) => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative w-full h-screen min-h-[600px] flex flex-col">
      {/* NavBar is `position: fixed`, so it must live outside any `overflow-hidden` ancestor —
          overflow clipping still applies to fixed-position descendants, and since this section
          scrolls with the page, the clip box would move off-screen and cut the navbar off once
          the user scrolls past the hero. */}
      <NavBar overlay />

      <div className="absolute inset-0 overflow-hidden">
        {/* Background */}
        {backgroundImage ? (
          <div
            className="absolute inset-x-0 top-[-40%] bottom-[-40%]"
            style={{ transform: `translateY(${scrollY * PARALLAX_FACTOR}px)` }}
          >
            <Image
              src={backgroundImage}
              alt={title}
              fill
              className="object-cover object-center animate-hero-zoom"
              priority
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-neutral-700" />
        )}

        {/* Dark scrim */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Layered content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Title pinned to bottom-left */}
        <div className="mt-auto px-10 pb-5">
          <h1
            className="text-white font-semibold leading-none m-0 max-w-2xl animate-hero-fade-up"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)', ['--hero-delay' as string]: '0.1s' }}
          >
            {title}
          </h1>

          <div
            className="mt-6 h-px w-full bg-white/40 animate-hero-fade-up"
            style={{ ['--hero-delay' as string]: '0.4s' }}
          />

          {/* Subtitle (left) / scroll indicator (right) */}
          <div
            className="mt-4 flex items-center justify-between gap-4 ml-2 animate-hero-fade-up"
            style={{ ['--hero-delay' as string]: '0.55s' }}
          >
            <p className="text-white/90 font-sans text-sm sm:text-base max-w-3xl">{subtitle}</p>
            <div className="flex items-center gap-1 text-white/90 shrink-0">
              <span className="font-sans text-sm sm:text-base whitespace-nowrap">
                Scroll for More
              </span>
              <div className="w-8 h-8 flex items-center justify-center animate-scroll-diagonal">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="rotate-180"
                  aria-hidden="true"
                >
                  <path
                    d="M14.5 9.5L9 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 9H14.6717C14.853 9 15 9.14703 15 9.32837V14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
