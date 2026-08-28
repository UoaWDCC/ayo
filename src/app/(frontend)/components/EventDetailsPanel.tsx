'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import type { EventCardData } from './EventCard'

const TRANSITION_MS = 300

type EventDetailsPanelProps = {
  event: EventCardData
  isOpen: boolean
  onClose: () => void
}

const EventDetailsPanel = ({ event, isOpen, onClose }: EventDetailsPanelProps) => {
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
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-end p-4">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-black/60 hover:opacity-70 text-xl leading-none"
            >
              ✕
            </button>
          </div>

          <div className="px-6">
            <div className="w-full aspect-[4/3] overflow-hidden bg-[#EBEBEB]">
              <Image
                src={event.image}
                alt={event.title}
                width={450}
                height={340}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 id={titleId} className="font-semibold text-2xl mt-6">
              {event.title}
            </h2>

            <p className="text-sm text-muted mt-1">{event.subtitle}</p>

            <p className="text-sm mt-4 text-black/70 leading-relaxed">{event.description}</p>

            {event.performances.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold">Times:</p>
                <ul className="mt-2 space-y-1">
                  {event.performances.map((performance, idx) => (
                    <li key={idx} className="flex justify-between gap-4 text-sm">
                      <span>{performance.time}</span>
                      <span>{performance.date}</span>
                      <span className="text-muted">{performance.venue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {event.links.length > 0 && (
              <div className="flex gap-8 mt-6 text-sm">
                {event.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-1 underline hover:opacity-70"
                  >
                    {link.label}
                    <Image
                      src="/arrow-up-right.svg"
                      alt=""
                      width={20}
                      height={20}
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {(event.footerNote || event.ctaLabel) && (
          <div className="bg-black text-white flex items-center justify-between px-6 py-4">
            <span className="text-sm">{event.footerNote}</span>
            {event.ctaLabel && (
              <a
                href={event.ctaHref ?? '#'}
                className="flex items-center gap-1 text-sm font-semibold hover:opacity-70"
              >
                {event.ctaLabel}
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

export default EventDetailsPanel
