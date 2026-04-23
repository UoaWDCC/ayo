import React from 'react'
import Image from 'next/image'
const EventsCard = () => {
  return (
    <div className="text-body w-6/7 border-y border-gray-400 flex items-center justify-evenly">
      <Image
        className="my-10"
        src="/grey_rectangle.png"
        width={250}
        height={250}
        alt="Grey Rectangle"
      />

      <div className="w-l">
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

      <div className="w-xl">
        <ul className="space-y-4">
          <li className="font-bold"> Programme </li>
          <li>
            {' '}
            Séjourné - Double Concerto for Marimba & Vibraphone (soloists: Eric Renick and Steve
            Logan){' '}
          </li>
          <li> Bizet - Intermezzo from L' Arlésienne Suite no. 2 </li>
          <li> Dvorak - Symphony No. 9 “From the New World” </li>
        </ul>
      </div>
    </div>
  )
}

export default EventsCard
