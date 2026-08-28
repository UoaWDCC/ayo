'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

import EventDetailsPanel from './EventDetailsPanel'

export type EventPerformance = {
  time: string
  date: string
  venue: string
}

export type EventLink = {
  label: string
  href: string
}

export type EventCardData = {
  id: string | number
  title: string
  subtitle: string
  image: string
  description: string
  performances: EventPerformance[]
  links: EventLink[]
  /** left-side label in the modal's bottom bar, e.g. "Tickets available." or "Photos available." */
  footerNote?: string
  ctaLabel?: string
  ctaHref?: string
  footerLabel?: string
}

const EventCard = ({ event }: { event: EventCardData }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="text-black">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsPanelOpen(true)}
        aria-haspopup="dialog"
        className="block w-full text-left cursor-pointer"
      >
        <div className="w-full aspect-[4/3] overflow-hidden bg-[#EBEBEB]">
          <Image
            src={event.image}
            alt={event.title}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="font-semibold text-lg mt-4">{event.title}</h3>

        <p className="text-sm text-muted mt-1">{event.subtitle}</p>

        <p className="text-sm mt-3 text-black/70 line-clamp-3">{event.description}</p>
      </button>

      {(event.links.length > 0 || event.footerLabel) && (
        <div className="mt-4 text-sm">
          {event.links.length > 0 && (
            <div className="flex gap-8">
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

          {event.footerLabel && (
            <span className="block mt-4 text-xs uppercase font-semibold text-black">
              {event.footerLabel}
            </span>
          )}
        </div>
      )}

      <EventDetailsPanel
        event={event}
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false)
          triggerRef.current?.focus()
        }}
      />
    </div>
  )
}

export default EventCard
