'use client'

import { gsap } from 'gsap'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

type SponsorLogoProps = {
  name: string
  imageUrl?: string
}

/**
 * One tile in the supporters grid. On hover the tile lifts and the logo scales,
 * reusing the event-card timing so the hover vocabulary stays consistent.
 * Placeholder tiles carry no logo, so they stay still.
 */
export default function SponsorLogo({ name, imageUrl }: SponsorLogoProps) {
  const tileRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const tile = tileRef.current
    const logo = logoRef.current
    if (!tile || !logo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onEnter = () => {
      gsap.to(tile, { y: -4, duration: 0.25, ease: 'power2.out' })
      gsap.to(logo, { scale: 1.05, duration: 0.4, ease: 'power2.out' })
    }
    const onLeave = () => {
      gsap.to(tile, { y: 0, duration: 0.25, ease: 'power2.in' })
      gsap.to(logo, { scale: 1, duration: 0.4, ease: 'power2.in' })
    }

    tile.addEventListener('mouseenter', onEnter)
    tile.addEventListener('mouseleave', onLeave)

    return () => {
      tile.removeEventListener('mouseenter', onEnter)
      tile.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={tileRef} className="flex min-w-0 flex-col items-center gap-3 w-full max-w-56">
      {imageUrl ? (
        <Image
          ref={logoRef}
          src={imageUrl}
          alt={name}
          width={224}
          height={128}
          className="h-24 md:h-32 w-full max-w-full object-contain"
        />
      ) : (
        <div className="h-24 md:h-32 w-full max-w-48 bg-[#EBEBEB]" aria-hidden="true" />
      )}
    </div>
  )
}
