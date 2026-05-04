import React from 'react'
import PartnerCard from './PartnerCard'

type Partner = {
  id: string | number
  name?: string
  company?: string
  imageUrl?: string
}

const PLACEHOLDER_PARTNERS: Partner[] = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  name: 'Partner',
  company: 'Company',
}))

type PartnersGridProps = {
  partners?: Partner[]
  filterLabel?: string
}

const PartnersGrid = ({ partners = PLACEHOLDER_PARTNERS, filterLabel = 'Partners' }: PartnersGridProps) => {
  return (
    <section className="w-full py-12 px-10">
      <div className="flex items-start justify-between mb-8">
        <h1 className="text-4xl font-bold leading-none m-0">
          Our <em>{filterLabel}</em>
        </h1>
        <div className="flex items-center gap-1 text-sm mt-2">
          <span className="text-black/40 font-normal">Showing</span>
          <span className="font-bold">{filterLabel}</span>
          <span className="text-black font-semibold">&#8249;</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8">
        {partners.map((partner) => (
          <PartnerCard
            key={partner.id}
            name={partner.name}
            company={partner.company}
            imageUrl={partner.imageUrl}
          />
        ))}
      </div>
    </section>
  )
}

export default PartnersGrid
