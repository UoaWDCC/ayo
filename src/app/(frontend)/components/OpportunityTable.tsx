'use client'

import { useState } from 'react'
import OpportunityModal from './OpportunityModal'

type Opportunity = {
  id: number
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

// Row component
const OpportunityRow = ({
  title,
  deadlineLabel,
  description,
  readMoreUrl,
  applyUrl,
  onReadMore,
}: OpportunityRowProps) => {
  return (
    <div className="grid grid-cols-[2fr_3fr_1fr] gap-8 py-8 items-start not-italic">
      <div>
        <h2 className="font-bold text-base">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">Apply by {deadlineLabel}</p>
      </div>

      <p className="text-sm italic">{description}</p>

      <div className="flex gap-6 justify-end">
        <button onClick={onReadMore} className="text-sm underline">
          Read More
        </button>

        <a href={applyUrl} className="text-sm underline">
          Apply
        </a>
      </div>
    </div>
  )
}

// Table component
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
          awarded="AYO Scholarship"
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
