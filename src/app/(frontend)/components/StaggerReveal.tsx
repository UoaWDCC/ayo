'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

gsap.registerPlugin(ScrollTrigger)

type StaggerRevealProps = {
  children: ReactNode
  /** Class marking each element to stagger in. */
  fadeClass?: string
  className?: string
  /**
   * Gap between each element, in seconds. Defaults to the section reveal's 0.15;
   * drop it for a long run of items (a card grid) so the last one isn't still
   * waiting its turn well after the viewer has scrolled past.
   */
  stagger?: number
  /**
   * Set false to leave the children alone — for content that is appearing because
   * the viewer changed a filter, where the parent plays the shorter re-entry
   * instead of replaying this reveal.
   */
  active?: boolean
}

/**
 * Staggers every `fadeClass` descendant into view as the section is reached.
 * Same timing and trigger point as the Concerts / Join AYO section reveals, for
 * sections whose copy comes from Payload and so can't carry their own refs.
 */
export default function StaggerReveal({
  children,
  fadeClass = 'faq-fade',
  className,
  stagger = 0.15,
  active = true,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const fadeEls = el.querySelectorAll(`.${fadeClass}`)
    const firstFadeEl = fadeEls[0]
    if (!firstFadeEl) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fadeEls,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger,
          ease: 'power2.out',
          // A leftover transform would make each item the containing block for
          // fixed-position descendants, so remove it once the reveal has finished.
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: firstFadeEl,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    })

    return () => ctx.revert()
  }, [fadeClass, stagger, active])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
