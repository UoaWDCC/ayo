'use client'

import { useState } from 'react'
import OpportunityModal from './OpportunityModal'

type Opportunity = {
  id: number
  type: string
  title: string
  deadlineLabel: string
  deadlineDate: string
  description: string
  readMoreUrl: string
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
        <button onClick={onReadMore} className="text-sm underline">
          Read More
        </button>

        <a href={applyUrl} className="text-sm underline flex items-center gap-1">
          Apply <span>↗</span>
        </a>
      </div>
    </div>
  )
}

const OpportunityTable = ({ opportunities }: OpportunityTableProps) => {
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null)

  return (
    <div className="w-full">
      {opportunities.map((opp, index) => (
        <div key={opp.id}>
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
