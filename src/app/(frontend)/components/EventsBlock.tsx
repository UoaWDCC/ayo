import React from 'react'
import EventsCard from './EventsCard'
import EventsCardSwitcher from './EventsCardSwitcher'
const eventsData = [
  {
    programme: [
      'Séjourné - Double Concerto for Marimba & Vibraphone (soloists: Eric Renick and Steve Logan)',
      "Bizet - Intermezzo from L' Arlésienne Suite no. 2",
      'Dvorak - Symphony No. 9 “From the New World”',
    ],
    concertDates: [
      'Sun. 14 June - TBD',
      'Sat. 20 June, 7.30pm - Orewa Arts & Events Centre',
      'Sun. 21 June, 2.30pm - Auckland Town Hall',
    ],
  },
]
const Events = () => {
  return (
    <div className="text-black w-full">
      <div className="text-body  my-10 ml-35">
        <h1 className="text-heading font-semibold">Concerts & Events</h1>
        <div className="flex mt-5">
          <p className="mr-6 text-[#B2B2B2]"> Year </p>
          <select className="font-bold appearance-none">
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>

          <p className="ml-15 mr-6 text-[#B2B2B2]"> Month </p>
          <select className="font-bold appearance-none">
            <option value="June">June</option>
            <option value="July">July</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <EventsCard programme={eventsData[0].programme} concertDates={eventsData[0].concertDates} />
      </div>

      <div className="flex justify-center">
        <EventsCardSwitcher />
      </div>
    </div>
  )
}

export default Events
