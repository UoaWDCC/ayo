'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

export type SpacerTime = {
  time: string
  date: string
  location: string
}

export type SpacerProps = {
  isOpen: boolean
  onClose: () => void
  /** Hero/banner image shown at the top of the popup */
  image: string
  title: string
  subtitle: string
  /** Body copy under the image. Will eventually come from the CMS. */
  description?: string
  /** Small photo strip under the description. */
  galleryImages?: string[]
  times?: SpacerTime[]
  /** Dummy links for now — swap for real URLs once available. */
  setListUrl?: string
  bookNowUrl?: string
  ticketsLabel?: string
}

export default function Spacer({
  isOpen,
  onClose,
  image,
  title,
  subtitle,
  description,
  galleryImages = [],
  times = [],
  setListUrl,
  bookNowUrl,
  ticketsLabel = 'Tickets available.',
}: SpacerProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  // Escape to close + lock background scroll while the popup is open
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        // Only close if the click landed on the backdrop itself, not a child
        if (e.target === backdropRef.current) onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="spacer-title"
    >
      <div className="relative flex w-full max-w-5xl max-h-[90vh] flex-col bg-black shadow-2xl">
        {/* Close button — floats above the scrolling content, always reachable */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L15 15M15 1L1 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Hero image with title/subtitle overlaid */}
          <div className="relative h-[42vh] min-h-[260px] w-full md:h-[52vh]">
            <Image src={image} alt={title} fill priority className="object-cover object-center" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent px-6 pb-6 pt-20 md:px-10 md:pb-8">
              <h2
                id="spacer-title"
                className="m-0 leading-none text-white font-semibold"
                style={{ fontSize: 'clamp(1.75rem, 6vw, 3.5rem)' }}
              >
                {title}
              </h2>
              <p className="mt-3 text-sm italic text-white/90 md:text-base">{subtitle}</p>
            </div>
          </div>

          {/* Description + gallery + times */}
          <div className="bg-black px-6 py-8 text-white md:px-10">
            {description && (
              <p className="text-[15px] leading-relaxed text-[#B2B2B2] md:text-[17px]">
                {description}
              </p>
            )}

            {galleryImages.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-3 md:gap-4">
                {galleryImages.map((src, i) => (
                  <div key={i} className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={src}
                      alt={`${title} photo ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {times.length > 0 && (
              <div className="mt-8">
                <p className="font-bold">Times:</p>
                <div className="mt-3 space-y-2">
                  {times.map((t, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-x-8 gap-y-1 text-sm sm:flex-row sm:items-baseline md:text-base"
                    >
                      <span className="sm:w-32 sm:shrink-0">{t.time}</span>
                      <span className="sm:w-48 sm:shrink-0">{t.date}</span>
                      <span>{t.location}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {setListUrl && (
              <a
                href={setListUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1 font-bold text-white underline underline-offset-2"
              >
                Set List <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Footer stays pinned to the bottom of the popup */}
        {(bookNowUrl || ticketsLabel) && (
          <div className="flex flex-col gap-2 border-t border-[#EBEBEB] bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-10">
            <p className="text-sm font-bold text-black md:text-base">{ticketsLabel}</p>
            {bookNowUrl && (
              <a
                href={bookNowUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-bold text-black underline underline-offset-2 md:text-base"
              >
                Book Now <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
