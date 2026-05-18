'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollAnimation() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    let animationFrame = 0
    let context: gsap.Context | undefined

    const initializeAnimation = () => {
      const stage = document.querySelector<HTMLElement>('.join-ayo-stage')

      if (!stage) {
        animationFrame = window.requestAnimationFrame(initializeAnimation)
        return
      }

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduceMotion) {
        gsap.set('.join-curtain', { autoAlpha: 0 })
        gsap.set(
          [
            '.join-opening-title',
            '.join-photo-wrap',
            '.join-copy',
            '.join-score',
            '.join-score-timeline',
            '.join-timeline-item',
            '.join-timeline-label',
            '.join-timeline-clef',
            '.join-timeline-note',
            '.join-sections',
            '.join-section-photo',
            '.join-crescendo',
            '.join-applause',
            '.join-finale',
            '.join-register',
          ],
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
          },
        )
        return
      }

      context = gsap.context(() => {
        gsap.set('.join-curtain-left', { xPercent: 0 })
        gsap.set('.join-curtain-right', { xPercent: 0 })
        gsap.set('.join-opening-title', { autoAlpha: 1, y: 0 })
        gsap.set('.join-photo-wrap', { autoAlpha: 0, scale: 0.98 })
        gsap.set('.join-photo-card', { autoAlpha: 0, y: 80, scale: 0.96 })
        gsap.set('.join-copy-one', { autoAlpha: 0, y: 44 })
        gsap.set('.join-copy-two', { autoAlpha: 0, y: 44 })
        gsap.set('.join-score', { autoAlpha: 0 })
        gsap.set('.join-score-timeline', { x: () => window.innerWidth / 2 - 16 })
        gsap.set('.join-timeline-label', { autoAlpha: 0, y: 16 })
        gsap.set('.join-timeline-item', {
          autoAlpha: 0,
          y: (index) => (index % 2 === 0 ? -24 : 24),
        })
        gsap.set('.join-timeline-note', { autoAlpha: 0, scale: 0.8 })
        gsap.set('.join-timeline-clef', { autoAlpha: 0, scale: 0.9 })
        gsap.set('.join-sections', { autoAlpha: 0, y: 44 })
        gsap.set('.join-section-family', { autoAlpha: 0, y: 34 })
        gsap.set('.join-crescendo', { autoAlpha: 0, y: 48, scale: 0.98 })
        gsap.set('.join-applause', { autoAlpha: 0 })
        gsap.set('.join-applause-mark', { scaleY: 0.18, transformOrigin: 'bottom center' })
        gsap.set('.join-finale', { autoAlpha: 0, y: 42 })
        gsap.set('.join-register', { autoAlpha: 0, y: 56, scale: 0.98 })

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        })

        timeline
          .to(
            '.join-opening-title',
            { autoAlpha: 0, y: -30, duration: 0.9, ease: 'power2.inOut' },
            0.45,
          )
          .to('.join-curtain-left', { xPercent: -100, duration: 2.2, ease: 'power2.inOut' }, 0.95)
          .to('.join-curtain-right', { xPercent: 100, duration: 2.2, ease: 'power2.inOut' }, 0.95)
          .to('.join-photo-wrap', { autoAlpha: 1, scale: 1, duration: 1, ease: 'power2.out' }, 1.5)
          .to(
            '.join-photo-card',
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              stagger: 0.18,
              duration: 1.7,
              ease: 'power2.out',
            },
            1.9,
          )
          .to(
            '.join-photo-card',
            {
              x: (index) => [-36, -12, 18, 34, -28, 8, 30, 52][index] ?? 0,
              y: (index) => [-42, 24, -30, 18, 26, -18, 18, -24][index] ?? 0,
              scale: (index) => [1.08, 1.03, 1.06, 1.02, 1.04, 1.08, 1.03, 1.06][index] ?? 1.04,
              duration: 2.9,
              ease: 'power1.out',
            },
            3,
          )
          .to('.join-copy-one', { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power2.out' }, 3.35)
          .to('.join-copy-one', { autoAlpha: 0, y: -34, duration: 1, ease: 'power2.inOut' }, 5)
          .to(
            '.join-photo-card',
            {
              x: (index) => [-62, 8, 44, 70, -54, 18, 56, 78][index] ?? 0,
              y: (index) => [-80, -10, -58, -18, -18, -52, -22, -64][index] ?? 0,
              scale: (index) => [1.14, 1.07, 1.12, 1.06, 1.1, 1.15, 1.08, 1.12][index] ?? 1.08,
              duration: 2.2,
              ease: 'power1.out',
            },
            5.25,
          )
          .to('.join-copy-two', { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power2.out' }, 5.9)
          .to('.join-copy-two', { autoAlpha: 0, y: -30, duration: 1, ease: 'power2.inOut' }, 7.05)
          .to('.join-photo-card', { autoAlpha: 0, duration: 1.0, ease: 'power2.inOut', stagger: 0.06 }, 7.1)
          .to('.join-photo-wrap', { autoAlpha: 0, duration: 0.8, ease: 'power2.inOut' }, 7.1)
          .to('.join-score', { autoAlpha: 1, duration: 1.05, ease: 'power2.out' }, 7.35)
          .to('.join-timeline-label', { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 7.5)
          .to('.join-timeline-clef', { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, 7.5)
          .to(
            '.join-timeline-item',
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              stagger: { each: 0.2, from: 'start' },
            },
            7.5,
          )
          .to(
            '.join-timeline-note',
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
              stagger: { each: 0.1, from: 'start' },
            },
            7.5,
          )
          .fromTo(
            '.join-score-timeline',
            { x: () => window.innerWidth / 2 - 16 },
            {
              x: () => -(4400 - window.innerWidth),
              duration: 1.85,
              ease: 'none',
            },
            7.5,
          )
          .to('.join-score', { autoAlpha: 0, duration: 1, ease: 'power2.inOut' }, 9.35)
          .to('.join-timeline-label', { autoAlpha: 0, y: -8, duration: 0.6, ease: 'power2.inOut' }, 9.35)
          .to('.join-sections', { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }, 9.85)
          .to(
            '.join-section-family',
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.12,
              duration: 0.9,
              ease: 'power2.out',
            },
            10.1,
          )
          .to('.join-sections', { autoAlpha: 0, y: -32, duration: 1, ease: 'power2.inOut' }, 11.55)
          .to(
            '.join-crescendo',
            { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, ease: 'power2.out' },
            11.85,
          )
          .to(
            '.join-crescendo',
            { autoAlpha: 0, y: -34, scale: 1.02, duration: 1, ease: 'power2.inOut' },
            13.25,
          )
          .to('.join-applause', { autoAlpha: 1, duration: 1.1, ease: 'power2.out' }, 13.65)
          .to(
            '.join-applause-mark',
            {
              scaleY: (index) => [0.6, 1.3, 0.9, 1.7, 1.1, 1.45][index % 6],
              y: (index) => [-12, -42, -26, -58, -18, -36][index % 6],
              stagger: {
                each: 0.025,
                from: 'center',
              },
              duration: 1.25,
              ease: 'power2.out',
            },
            13.8,
          )
          .to('.join-finale', { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power2.out' }, 14.25)
          .to('.join-finale', { autoAlpha: 0, y: -26, duration: 0.9, ease: 'power2.inOut' }, 15.5)
          .to('.join-applause', { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' }, 15.6)
          .to(
            '.join-applause-mark',
            { autoAlpha: 0, y: -80, duration: 0.8, ease: 'power2.inOut' },
            15.65,
          )
          .to(
            '.join-register',
            { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: 'power2.out' },
            16.05,
          )
      }, stage)

      ScrollTrigger.refresh()
    }

    initializeAnimation()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      context?.revert()
      initialized.current = false
    }
  }, [])

  return null
}
