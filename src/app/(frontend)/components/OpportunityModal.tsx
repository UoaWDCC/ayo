'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const TRANSITION_MS = 300

export type OpportunityDetails = {
  title: string
  awarded: string
  value: string
  description: string
  closingDate: string
  applyUrl?: string
  imageUrl?: string
}

type OpportunityModalProps = {
  opportunity: OpportunityDetails | null
  isOpen: boolean
  onClose: () => void
}

const OpportunityModal = ({ opportunity, isOpen, onClose }: OpportunityModalProps) => {
  const titleId = useId()
  const [shouldRender, setShouldRender] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)

      // Two rAFs: the first lets the browser paint the just-mounted "closed"
      // position; only then does flipping to "visible" register as a change
      // to transition from, instead of getting batched into the same paint.
      let innerRaf = 0
      const outerRaf = requestAnimationFrame(() => {
        innerRaf = requestAnimationFrame(() => {
          setIsVisible(true)
          closeButtonRef.current?.focus()
        })
      })
      return () => {
        cancelAnimationFrame(outerRaf)
        cancelAnimationFrame(innerRaf)
      }
    }

    setIsVisible(false)
    const timeout = setTimeout(() => setShouldRender(false), TRANSITION_MS)
    return () => clearTimeout(timeout)
  }, [isOpen])

  useEffect(() => {
    if (!shouldRender) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [shouldRender, onClose])

  if (!shouldRender || !opportunity || typeof document === 'undefined') return null

  const { title, awarded, value, description, closingDate, applyUrl, imageUrl } = opportunity

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-black/50 transition-[opacity,backdrop-filter] duration-300 ${
          isVisible ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white flex flex-col shadow-xl transition-transform duration-300 ease-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-end p-4">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-black/60 hover:opacity-70 text-xl leading-none cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="px-6">
            {imageUrl && (
              <div className="w-full aspect-4/3 overflow-hidden bg-[#EBEBEB]">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              </div>
            )}

            <h2 id={titleId} className="font-semibold text-2xl leading-tight mt-6">
              {title}
            </h2>

            <div className="flex gap-6 mt-2 text-sm text-black/70">
              <span>
                <span className="text-black/50">Awarded: </span>
                {awarded}
              </span>
              <span>
                <span className="text-black/50">Value: </span>
                {value}
              </span>
            </div>

            <p className="text-sm mt-4 text-black/70 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="bg-black text-white flex items-center justify-between px-6 py-4">
          <span className="text-sm">
            <span className="font-semibold">Closing Date: </span>
            {closingDate}
          </span>
          <a
            href={applyUrl ?? '#'}
            className="text-sm font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
          >
            Apply
            <img
              src="/arrow-up-right.svg"
              alt=""
              className="w-[15px] h-[15px] brightness-0 invert"
            />
          </a>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default OpportunityModal
