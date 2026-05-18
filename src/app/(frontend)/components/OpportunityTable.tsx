'use client'

import { useState } from 'react'
import OpportunityModal from './OpportunityModal'
import ArrowUpRight from '/arrow-up-right.svg'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr_1fr] gap-6 md:gap-8 py-8 items-start not-italic transition-colors hover:bg-gray-50">
      <div>
        <h2 className="font-bold text-base">{title}</h2>

        <p className="text-sm text-gray-500 mt-1">Apply by {deadlineLabel}</p>
      </div>

      <p className="text-sm italic">{description}</p>

      <div className="flex gap-6 justify-start md:justify-end">
        <button onClick={onReadMore} className="text-sm underline font-bold">
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
  const containerRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return // skip on mount, let scroll-fade-up handle it
    }
    if (!containerRef.current) return
    const rows = containerRef.current.querySelectorAll('.opportunity-row')
    gsap.fromTo(
      rows,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out' },
    )
  }, [opportunities])

  return (
    <div className="w-full" ref={containerRef}>
      {opportunities.map((opp, index) => (
        <div key={opp.id} className="scroll-fade-up opportunity-row">
          {index > 0 && <hr className="border-gray-200" />}

          <OpportunityRow {...opp} onReadMore={() => setSelectedOpp(opp)} />
        </div>
      ))}

      {/* Modal */}
      {selectedOpp && (
        <OpportunityModal
          title={selectedOpp.title}
          awarded={selectedOpp.type}
          value="TBC"
          description={selectedOpp.description}
          closingDate={selectedOpp.deadlineLabel}
          applyUrl={selectedOpp.applyUrl}
          onClose={() => setSelectedOpp(null)}
        />
      )}
    </div>
  )
}

export default OpportunityTable
