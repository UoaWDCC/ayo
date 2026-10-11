'use client'

import { gsap } from 'gsap'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import PersonDetailsPanel, { type PersonPanelData } from './PersonDetailsPanel'

type CardProps = {
  person: PersonPanelData
  /** Class the parent grid's reveal staggers. */
  fadeClass?: string
}

/**
 * A person in the Players / Alumni grids. Hover matches `EventCard`: the card
 * lifts 4px while the photo scales to 1.05 behind its own clip. Clicking opens
 * the same right-hand drawer the event cards use.
 */
const Card = ({ person, fadeClass }: CardProps) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // The photo is absent for people with no upload; the card still lifts.
    const image = imageRef.current

    const onEnter = () => {
      gsap.to(card, { y: -4, duration: 0.25, ease: 'power2.out' })
      if (image) gsap.to(image, { scale: 1.05, duration: 0.4, ease: 'power2.out' })
    }
    const onLeave = () => {
      gsap.to(card, { y: 0, duration: 0.25, ease: 'power2.in' })
      if (image) gsap.to(image, { scale: 1, duration: 0.4, ease: 'power2.in' })
    }

    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mouseleave', onLeave)

    return () => {
      card.removeEventListener('mouseenter', onEnter)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={cardRef} className={fadeClass}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsPanelOpen(true)}
        aria-haspopup="dialog"
        className="block w-full text-left cursor-pointer"
      >
        <div className="relative w-full aspect-square overflow-hidden bg-[#EBEBEB]">
          {person.imageUrl && (
            <div ref={imageRef} className="absolute inset-0">
              <Image
                src={person.imageUrl}
                alt={person.name}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
        </div>

        <p className="font-semibold text-lg leading-tight mt-3">{person.name}</p>
        <p className="text-sm italic leading-tight mt-2 text-[#B2B2B2]">{person.role}</p>
      </button>

      <PersonDetailsPanel
        person={person}
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false)
          triggerRef.current?.focus()
        }}
      />
    </div>
  )
}

export default Card
