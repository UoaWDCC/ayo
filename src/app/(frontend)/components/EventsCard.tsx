import React from 'react'
import Image from 'next/image'

const fontSize = "17px";

const EventsCard = ({ programme }: {programme:string[]}) => {
  return (
    <div className="text-body w-[90%] border-y border-gray-400 grid grid-cols-[1fr_2fr_2fr] items-center gap-x-8 p-4">
      <Image
        className="my-10"
        src="/grey_rectangle.png"
        width={250}
        height={250}
        alt="Grey Rectangle"
      />

      <div className="w-l" style ={{fontSize}}>
        <div className="font-bold">
          <p> June 2026 </p>
        </div>
        <div className="mt-1.5">
          <p> Auckland, New Zealand </p>
        </div>

        <ul className="space-y-2 mt-5">
          <li> Sun. 14 June - TBD </li>
          <li> Sat. 20 June, 7.30pm - Orewa Arts & Events Centre </li>
          <li> Sun. 21 June, 2.30pm - Auckland Town Hall </li>
        </ul>
      </div>

      <div className="w-l" style ={{fontSize}}>
        <ul className="space-y-4">
          <li className="font-bold"> Programme </li>
          {programme.map((piece, idx) => (
            <li key={idx}>{piece}</li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default EventsCard
