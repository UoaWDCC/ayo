'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollAnimation() {
  const initialized = useRef(false)

  useEffect(() => {
    // Avoid re-initializing in StrictMode
    if (initialized.current) return
    initialized.current = true

    const elements = document.querySelectorAll('.scroll-fade-up')
    if (elements.length === 0) return

    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el as HTMLElement,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    })

    // Refresh ScrollTrigger after a tick to account for any layout shifts
    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill())
      initialized.current = false
    }
  }, [])

  return null
}
