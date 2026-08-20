import React from 'react'

const EventsCardSwitcher = ({
  cardNum,
  cardTotal,
  onNext,
  onPrev,
}: {
  cardNum: number
  cardTotal: number
  onNext: () => void
  onPrev: () => void
}) => {
  return (
    <div className="border-t border-[#EBEBEB] pt-5 mb-6 flex justify-between">
      <div className="flex gap-6 underline">
        <button onClick={onPrev}>Previous</button>
        <button onClick={onNext}>Next</button>
      </div>
      <div>
        {cardNum} of {cardTotal}
      </div>
    </div>
  )
}

export default EventsCardSwitcher
