type Opportunity = {
  id: number
  title: string
  deadlineLabel: string
  description: string
  readMoreUrl: string
  applyUrl: string
}

type OpportunityTableProps = {
  opportunities: Opportunity[]
}

// Rendering one row
const OpportunityRow = ({
  title,
  deadlineLabel,
  description,
  readMoreUrl,
  applyUrl,
}: Opportunity) => {
  return (
    <div className="grid grid-cols-[2fr_3fr_1fr] gap-8 py-8 items-start not-italic">
      <div>
        <h2 className="font-bold text-base">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">Apply by {deadlineLabel}</p>
      </div>
      <p className="text-sm italic">{description}</p>
      <div className="flex gap-6 justify-end">
        <a href={readMoreUrl} className="text-sm underline">
          Read More
        </a>
        <a href={applyUrl} className="text-sm underline">
          Apply
        </a>
      </div>
    </div>
  )
}

// Need to also add an svg of an arrow that goes next to the Apply url

// Whole table is rendered row by row
const OpportunityTable = ({ opportunities }: OpportunityTableProps) => {
  return (
    <div className="w-full ">
      {opportunities.map((opp, index) => (
        <div key={opp.id}>
          {index > 0 && <hr className="border-gray-200" />}
          <OpportunityRow {...opp} />
        </div>
      ))}
    </div>
  )
}

export default OpportunityTable
