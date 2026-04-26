import React from 'react'

const EventsCardSwitcher = () => {
  return (
    <div className="flex justify-between w-[90%] my-6">
      <div className="flex gap-6 underline">
        <button>Previous</button>
        <button>Next</button>
      </div>
      <div>1 of 3</div>
    </div>
  )
}

export default EventsCardSwitcher
