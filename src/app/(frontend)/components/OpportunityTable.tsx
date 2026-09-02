'use client'

import { useState } from 'react'
import OpportunityModal from './OpportunityModal'
import ArrowUpRight from '/arrow-up-right.svg'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

type Opportunity = {
  id: number
  type: string
  title: string
  deadlineLabel: string
  deadlineDate: string
  description: string
  applyUrl: string
}

type OpportunityTableProps = {
  opportunities: Opportunity[]
}

type OpportunityRowProps = Opportunity & {
  onReadMore: () => void
}

const OpportunityRow = ({
  title,
  deadlineLabel,
  description,
  applyUrl,
  onReadMore,
}: OpportunityRowProps) => {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const onEnter = () => gsap.to(el, { scale: 1.005, duration: 0.2, ease: 'power2.out' })
    const onLeave = () => gsap.to(el, { scale: 1, duration: 0.2, ease: 'power2.in' })

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      onClick={onReadMore}
      className="grid grid-cols-1 md:grid-cols-[2fr_3fr_1fr] gap-6 md:gap-8 py-8 items-start not-italic transition-colors hover:bg-gray-50"
    >
      <div>
        <h2 className="font-bold text-base">{title}</h2>

        <p className="text-sm text-gray-500 mt-1">Apply by {deadlineLabel}</p>
      </div>

      <p className="text-sm italic">{description}</p>

      <div className="flex gap-6 justify-start md:justify-end">
        <button onClick={onReadMore} className="text-sm underline font-bold cursor-pointer">
          Read More
        </button>

        <a href={applyUrl} className="text-sm flex items-center underline font-bold">
          Apply
          <img src="/arrow-up-right.svg" alt="" className="w-[15px] h-[15px]" />
        </a>
      </div>
    </div>
  )
}

const OpportunityTable = ({ opportunities }: OpportunityTableProps) => {
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  const prevOpportunitiesRef = useRef(opportunities)

  useEffect(() => {
    if (!containerRef.current) return
    const rows = containerRef.current.querySelectorAll('.opportunity-row')

    if (isFirstRender.current) {
      isFirstRender.current = false
      prevOpportunitiesRef.current = opportunities
      const firstRow = rows[0]
      if (!firstRow) return
      gsap.fromTo(
        rows,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: firstRow,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
      return
    }

    gsap.fromTo(
      rows,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out' },
    )
  }, [opportunities])

  return (
    <div className="w-full" ref={containerRef}>
      {opportunities.map((opp, index) => (
        <div key={opp.id} className="opportunity-row">
          {index > 0 && <hr className="border-gray-200" />}

          <OpportunityRow
            {...opp}
            onReadMore={() => {
              setSelectedOpp(opp)
              setIsPanelOpen(true)
            }}
          />
        </div>
      ))}

      {/* Side panel */}
      <OpportunityModal
        opportunity={
          selectedOpp && {
            title: selectedOpp.title,
            awarded: selectedOpp.type,
            value: 'TBC',
            description: selectedOpp.description,
            closingDate: selectedOpp.deadlineLabel,
            applyUrl: selectedOpp.applyUrl,
          }
        }
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  )
}

export default OpportunityTable
