import React from 'react'

type CardProps = {
  name: string
  subtitle: string
  imageUrl?: string
}

const Card = ({ name, subtitle, imageUrl }: CardProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full aspect-square bg-[#d9d9d9] rounded-sm overflow-hidden">
        {imageUrl && <img src={imageUrl} alt={name} className="w-full h-full object-cover" />}
      </div>
      <div>
        <p className="text-base font-semibold leading-tight mt-1">{name}</p>
        <p className="text-base italic leading-tight mt-2 text-black/80">{subtitle}</p>
      </div>
    </div>
  )
}

export default Card
