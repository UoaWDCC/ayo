'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

gsap.registerPlugin(ScrollTrigger)

type ScrollRevealProps = {
  children: ReactNode
  className?: string
}

/**
 * Fades a section in while it rises 40px into place as it scrolls into view.
 * Same timing and trigger point as the Join AYO / Concerts section reveals.
 */
export default function ScrollReveal({ children, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          // A leftover transform would make this wrapper the containing block for
          // fixed-position descendants, so remove it once the reveal has finished.
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
