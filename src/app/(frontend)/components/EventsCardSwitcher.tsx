import React from 'react'

const EventsCardSwitcher = ({
  cardNum,
  cardTotal,
  onNext
}: {
  cardNum: number,
  cardTotal: number,
  onNext: () => void
}) => {
  return (
    <div className="flex justify-between w-[90%] my-6">
      <div className="flex gap-6 underline">
        <button>Previous</button>
        <button onClick = {onNext}>Next</button>
      </div>
      <div>{cardNum} of {cardTotal}</div>
    </div>
  )
}

export default EventsCardSwitcher
