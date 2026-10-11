'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import type { HeroImage } from '@/lib/heroImage'

type HeroProps = {
  title: string
  /** Short line shown below the title, aligned to the left */
  subtitle?: string
  /** Background photo and its intrinsic size — build it with `resolveHeroImage`. */
  backgroundImage?: HeroImage
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
    <section className="relative w-full flex flex-col bg-neutral-900 pt-15 md:h-screen md:min-h-[600px] md:pt-0">
      {/* NavBar is `position: fixed`, so it must live outside any `overflow-hidden` ancestor —
          overflow clipping still applies to fixed-position descendants, and since this section
          scrolls with the page, the clip box would move off-screen and cut the navbar off once
          the user scrolls past the hero. */}
      <NavBar overlay />

      {/* One <Image> serves both layouts: in normal flow on mobile (natural proportions, no
          cropping) and an absolutely-positioned cover on desktop. Rendering a second <img>
          for mobile doubles the bytes every visitor downloads — browsers fetch
          `display: none` images too, and React preloads both of them during SSR. */}
      {backgroundImage ? (
        <div className="relative w-full md:absolute md:inset-0 md:overflow-hidden md:bg-neutral-900">
          {/* `.hero-background` and `.animate-hero-zoom` are both scoped to >= 48rem in
              styles.css, so the shared element stays still and unzoomed on mobile. */}
          <div
            className="hero-background md:absolute md:inset-x-0 md:top-[-5%] md:bottom-[-5%]"
            style={{ ['--hero-parallax' as string]: `${scrollY * PARALLAX_FACTOR}px` }}
          >
            <Image
              src={backgroundImage.url}
              alt={title}
              width={backgroundImage.width}
              height={backgroundImage.height}
              sizes="100vw"
              priority
              className="block h-auto w-full animate-hero-zoom md:absolute md:inset-0 md:h-full md:object-cover md:object-center"
            />
          </div>

          {/* Dark scrim — desktop only, where the title sits over the image. */}
          <div className="absolute inset-0 hidden bg-black/50 md:block" />
        </div>
      ) : (
        <div className="absolute inset-0 hidden overflow-hidden bg-neutral-700 md:block">
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Layered content */}
      <div className="relative z-10 flex flex-1 flex-col pt-6 md:h-full md:pt-0">
        {/* Title pinned to bottom-left */}
        <div className="mt-auto px-4 pb-6 sm:px-6 md:px-10 md:pb-5">
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
            className="mt-4 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between md:ml-2 animate-hero-fade-up"
            style={{ ['--hero-delay' as string]: '0.55s' }}
          >
            <p className="text-white/90 font-sans text-sm sm:text-base max-w-3xl">{subtitle}</p>
            <div className="flex items-center gap-2 text-white/90 shrink-0">
              <span className="font-sans text-sm sm:text-base whitespace-nowrap">
                Scroll for More
              </span>
              {/* overflow-hidden clips the arrow as it slides in and out of its box. */}
              <div className="w-3.5 h-3.5 overflow-hidden">
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="block w-full h-full animate-scroll-diagonal"
                  aria-hidden="true"
                >
                  <path d="M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="butt" />
                  <path
                    d="M1 3V11H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
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
