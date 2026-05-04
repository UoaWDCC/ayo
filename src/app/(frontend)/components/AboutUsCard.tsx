import React from 'react'

type PartnerCardProps = {
  name?: string
  company?: string
  imageUrl?: string
}

const PartnerCard = ({ name = 'Partner', company = 'Company', imageUrl }: PartnerCardProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full aspect-square bg-[#d9d9d9] rounded-sm overflow-hidden">
        {imageUrl && (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        )}
      </div>
      <div>
        <p className="text-base font-semibold leading-tight m-0">{name}</p>
        <p className="text-base italic leading-tight m-0 text-black/80">{company}</p>
      </div>
    </div>
  )
}

export default PartnerCard
