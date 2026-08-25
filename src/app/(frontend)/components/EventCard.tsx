import Image from 'next/image'

interface EventCardProps {
  image: string
  title: string
  date: string
  location: string
  description: string
  eventType: string
}

export default function EventCard({
  image,
  title,
  date,
  location,
  description,
  eventType,
}: EventCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative w-full h-[200px] bg-gray-200">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="font-semibold text-[16px] leading-[20px] text-black mb-3">{title}</h3>

        {/* Date and Location */}
        <p className="text-[14px] leading-[17px] text-[#B2B2B2] mb-3">
          {date} · {location}
        </p>

        {/* Description */}
        <p className="text-[14px] leading-[17px] text-[#666666] mb-6">{description}</p>

        {/* Event Type Tag */}
        <div className="pt-4 border-t border-[#EBEBEB]">
          <p className="text-[12px] leading-[15px] font-semibold text-black tracking-wide">
            {eventType}
          </p>
        </div>
      </div>
    </div>
  )
}
