import React from 'react'
import Image from 'next/image'

const EventsCard = ({
  programme,
  concertDates,
}: {
  programme: string[]
  concertDates: string[]
}) => {
  return (
    <div className="text-body w-[90%] border-y border-gray-400 grid grid-cols-[1fr_2fr_2fr] items-center gap-x-8 p-4">
      <Image
        className="my-10"
        src="/grey_rectangle.png"
        width={250}
        height={250}
        alt="Grey Rectangle"
      />

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
