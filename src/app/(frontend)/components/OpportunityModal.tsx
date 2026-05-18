'use client'
import { useEffect, useState } from 'react'

type OpportunityModalProps = {
  title: string
  awarded: string
  value: string
  description: string
  closingDate: string
  applyUrl?: string
  imageUrl?: string
  onClose: () => void
}
const OpportunityModal = ({
  title,
  awarded,
  value,
  description,
  closingDate,
  applyUrl,
  imageUrl,
  onClose,
}: OpportunityModalProps) => {
  const [isVisible, setIsVisible] = useState(false)

  // Trigger transition on mount
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  // Fade out before closing
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // match duration
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300
        ${isVisible ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'}`}
      onClick={handleClose}
    >
      <div
        className={`bg-white w-full max-w-2xl mx-4 flex flex-col max-h-[85vh] transition-all duration-300
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/*top bar stays fixed*/}
        <div className="p-8 pb-4">
          <div className="flex justify-between items-start">
            <h2 className="font-semibold text-2xl leading-tight max-w-[90%]">{title}</h2>
            <button onClick={handleClose} className="text-black/40 hover:opacity-70 text-xl">
              X
            </button>
          </div>
          {/* awarded and value row*/}
          <div className="flex gap-6 mt-2 text-sm">
            <span>
              <span className="text-black/50">Awarded: </span>
              {awarded}
            </span>
            <span>
              <span className="text-black/50">Value: </span>
              {value}
            </span>
          </div>
        </div>

        <div className="flex gap-6 px-8 overflow-y-auto flex-1">
          {/*space for image if needed*/}
          {imageUrl && (
            <img src={imageUrl} alt={title} className="w-40 h-48 object-cover shrink-0" />
          )}
          <p className="text-sm leading-relaxed">{description}</p>
        </div>
        {/*bottom bar*/}
        <div className="bg-black text-white flex items-center justify-between px-8 py-4 mt-4">
          <span className="text-sm">
            <span className="font-semibold">Closing Date: </span>
            {closingDate}
          </span>
          <a href={applyUrl ?? '#'} className="text-sm font-semibold hover:opacity-70">
            Apply ↗
          </a>
        </div>
      </div>
    </div>
  )
}

export default OpportunityModal
