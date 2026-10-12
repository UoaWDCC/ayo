'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { useEffect, useRef } from 'react'
import { createIntroConverters } from './richTextConverters'

gsap.registerPlugin(ScrollTrigger)

{/* Maps the original Tailwind CSS from the hardcoded values to the RichText injection */}
const introConverters = createIntroConverters('concerts-lead-fade')

export default function ConcertsIntro({ introText }: { introText?: SerializedEditorState | null }) {
  const leadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!leadRef.current) return
    const leadEls = leadRef.current.querySelectorAll('.concerts-lead-fade')
    const firstLeadEl = leadEls[0]
    if (!firstLeadEl) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        leadEls,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: firstLeadEl,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="bg-white w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-25 pb-12.5">
        <div ref={leadRef} className="max-w-[1380px]">
          {introText && <RichText data={introText} converters={introConverters} />}
        </div>
      </div>
    </section>
  )
}
