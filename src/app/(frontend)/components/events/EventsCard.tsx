import React from 'react'
import Image from 'next/image'

const EventsCard = ({
  image,
  programme,
  concertDates,
}: {
  image: string
  programme: string[]
  concertDates: string[]
}) => {
  return (
    <div className="text-body border-t border-[#EBEBEB] grid grid-cols-[1fr_2fr_2fr] items-center gap-x-8 py-12">
      <Image className="my-10" src={image} width={244} height={181} alt="Concert event photo" />

      <div className="">
        <div className="leading-miniheader">
          <p>
            <span className="font-semibold">June 2026</span>
            <br></br>Auckland, New Zealand
          </p>
        </div>

        <ul className="space-y-2 mt-5">
          {concertDates.map((concert, idx) => (
            <li key={idx}>{concert}</li>
          ))}
        </ul>
      </div>

      <div className="">
        <ul className="space-y-4">
          <li className="font-semibold"> Programme </li>
          {programme.map((piece, idx) => (
            <li key={idx}>{piece}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default EventsCard
