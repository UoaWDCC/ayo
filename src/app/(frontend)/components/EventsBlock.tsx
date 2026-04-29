"use client";
import { useState } from 'react';
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
  {
    programme: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore  ',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
    ],
    concertDates: [
      'Lorem ipsum dolor sit amet',
      'Consectetur adipiscing elit, sed do',
      'Eiusmod tempor incididunt ut labore',
    ],
  },
]
const Events = () => {
  const [cardNum, setCardNum] = useState(0)

  return (
    <div className="text-black w-full">
      <div className="flex justify-center">
        <div className="text-body my-10 w-[90%]">
          <h1 className="text-heading font-semibold">Concerts & Events</h1>
          <div className="flex mt-5">
            <p className="mr-6 text-muted"> Year </p>
            <select className="font-bold appearance-none">
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>

            <p className="ml-15 mr-6 text-muted"> Month </p>
            <select className="font-bold appearance-none">
              <option value="June">June</option>
              <option value="July">July</option>
            </select>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex justify-center">
        <EventsCard programme={eventsData[cardNum].programme} concertDates={eventsData[cardNum].concertDates} />
      </div>

      <div className="flex-col lg:hidden content-center">
        {eventsData.map((concert, index) => (
          <div className="mb-5 flex justify-center" key={index}>
            <EventsCard programme={concert.programme} concertDates={concert.concertDates} />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <EventsCardSwitcher cardNum = {cardNum + 1} cardTotal = {eventsData.length}/>
      </div>
    </div>
  )
}

export default Events
