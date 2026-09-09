'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function ConcertsIntro() {
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
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-16 md:pt-20 pb-15">
        <div ref={leadRef} className="max-w-[1380px]">
          <h2 className="concerts-lead-fade font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]">
            Every performance, months in the making.
          </h2>

          <div className="concerts-lead-fade mt-8 text-[18px] leading-6.5 md:text-[20px] md:leading-7 text-[#2E2E2E]">
            <p>
              Every single AYO concert is the ultimate payoff of months of rehearsal and practice by
              our players who passionately tackle serious repertoire head-on. Expect full symphonic
              programmes, mesmerizing soloists from within our own ranks and beyond, and that pure,
              absolute magic that sparks when incredible talent is given the space to excel. Truly,
              there is nothing else like it. <br />
              <br />
              Sign up to our newsletter for early notice of concert dates and priority booking
            </p>
          </div>
          <Link
            href="#"
            className="concerts-lead-fade mt-6 inline-flex items-center gap-1 font-semibold underline text-[18px] md:text-[20px] hover:opacity-70 transition-opacity"
          >
            Sign up &ensp;↗
          </Link>
        </div>
      </div>
    </section>
  )
}
