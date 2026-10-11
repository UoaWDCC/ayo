'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import FakeScrollbar from './FakeScrollbar'
import { announceModalOpen } from './modalEvents'

const TRANSITION_MS = 300

export type PersonPanelData = {
  name: string
  /** Instrument or role, shown under the name. */
  role?: string
  imageUrl?: string
  description?: string
  /** Years with AYO, as typed in the CMS. */
  years?: string
  /** Every role a team member holds, when there is more than the one above. */
  roles?: string[]
  /** Left-hand label in the bottom bar, e.g. "Current player." */
  footerNote?: string
  ctaLabel?: string
  ctaHref?: string
}

type PersonDetailsPanelProps = {
  person: PersonPanelData
  isOpen: boolean
  onClose: () => void
}

/**
 * Right-hand drawer for a person in the About Us grids — the same panel as
 * `EventDetailsPanel` and `OpportunityModal`, with a person's details in it.
 */
const PersonDetailsPanel = ({ person, isOpen, onClose }: PersonDetailsPanelProps) => {
  const titleId = useId()
  const [shouldRender, setShouldRender] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      announceModalOpen()

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

  if (!shouldRender || typeof document === 'undefined') return null

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
        <div className="relative flex-1 min-h-0">
          <FakeScrollbar target={scrollRef} variant="dark" />
          <div ref={scrollRef} className="h-full overflow-y-auto no-scrollbar">
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

            <div className="px-6 pb-10">
              {/* No placeholder when there's no upload — the grid needs one to keep
                  its rows aligned, a drawer would just show a large empty block. */}
              {person.imageUrl && (
                <div className="relative w-full aspect-square bg-[#EBEBEB]">
                  <Image
                    src={person.imageUrl}
                    alt={person.name}
                    fill
                    sizes="448px"
                    className="object-cover"
                  />
                </div>
              )}

              <h2
                id={titleId}
                className={`font-semibold text-2xl ${person.imageUrl ? 'mt-6' : ''}`}
              >
                {person.name}
              </h2>

              {person.role && <p className="text-sm text-muted italic mt-1">{person.role}</p>}

              {person.description && (
                <p className="text-sm mt-4 text-black/70 leading-relaxed">{person.description}</p>
              )}

              {person.roles && person.roles.length > 1 && (
                <div className="mt-6">
                  <p className="text-sm font-semibold">Roles:</p>
                  <ul className="mt-2 space-y-1">
                    {person.roles.map((role) => (
                      <li key={role} className="text-xs text-black/70">
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {person.years && (
                <div className="mt-6">
                  <p className="text-sm font-semibold">Years with AYO:</p>
                  <p className="text-xs mt-2 text-black/70">{person.years}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {(person.footerNote || person.ctaLabel) && (
          <div className="bg-black text-white flex items-center justify-between gap-4 px-6 py-4">
            <span className="text-sm">{person.footerNote}</span>
            {person.ctaLabel && (
              <a
                href={person.ctaHref ?? '#'}
                className="flex items-center gap-1 text-sm font-semibold hover:opacity-70 shrink-0"
              >
                {person.ctaLabel}
                <Image
                  src="/arrow-up-right.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                  className="brightness-0 invert"
                />
              </a>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default PersonDetailsPanel
