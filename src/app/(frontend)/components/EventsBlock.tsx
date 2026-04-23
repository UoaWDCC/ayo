import React from 'react'
import EventsCard from './EventsCard'
const Events = () => {
  return (
    <div className="text-black w-full">
      <div className="text-heading font-semibold my-10 ml-35">
        <h1>Concerts & Events</h1>{' '}
      </div>
      <div className="flex justify-center">
        <EventsCard />
      </div>
    </div>
  )
}

export default Events
