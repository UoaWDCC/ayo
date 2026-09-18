'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import FakeScrollbar from './FakeScrollbar'
import { announceModalOpen } from './modalEvents'

const TRANSITION_MS = 300
const PARALLAX_FACTOR = 0.4
// Matches SmoothScroll's easing so the modal's internal scroll glides the
// same way the rest of the page does — the browser's native overflow-y-auto
// scroll otherwise jumps per wheel tick with no easing at all.
const SCROLL_EASE = 0.12
const SCROLL_SETTLE_THRESHOLD = 0.5

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
  const scrollRef = useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)

  // Mount/unmount with a fade + scale transition instead of popping in instantly
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      announceModalOpen()

      // Two rAFs: the first lets the browser paint the just-mounted "closed"
      // position; only then does flipping to "visible" register as a change
      // to transition from, instead of getting batched into the same paint.
      let innerRaf = 0
      const outerRaf = requestAnimationFrame(() => {
        innerRaf = requestAnimationFrame(() => setIsVisible(true))
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

  // Escape to close + lock background scroll for the whole time the popup is
  // mounted (including the closing animation), matching EventDetailsPanel.
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

  // Ease wheel scrolling within the popup body instead of letting the browser
  // apply its native per-tick jump, so it glides like the rest of the site.
  useEffect(() => {
    const el = scrollRef.current
    if (!shouldRender || !el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const target = { current: el.scrollTop }
    const current = { current: el.scrollTop }
    let rafId = 0
    let running = false

    const maxScroll = () => Math.max(el.scrollHeight - el.clientHeight, 0)

    const step = () => {
      current.current += (target.current - current.current) * SCROLL_EASE
      if (Math.abs(target.current - current.current) < SCROLL_SETTLE_THRESHOLD) {
        current.current = target.current
        el.scrollTop = current.current
        setScrollTop(current.current)
        running = false
        return
      }
      el.scrollTop = current.current
      setScrollTop(current.current)
      rafId = requestAnimationFrame(step)
    }

    const start = () => {
      if (!running) {
        running = true
        rafId = requestAnimationFrame(step)
      }
    }

    const onWheel = (e: WheelEvent) => {
      const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1
      e.preventDefault()
      target.current = Math.min(Math.max(target.current + e.deltaY * scale, 0), maxScroll())
      start()
    }

    // Any scroll that didn't come from our own rAF loop (thumb drag, touch,
    // keyboard) — resync the target so the next wheel tick continues from
    // the right place.
    const onScroll = () => {
      if (!running) {
        target.current = el.scrollTop
        current.current = el.scrollTop
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [shouldRender])

  if (!shouldRender) return null

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        // Only close if the click landed on the backdrop itself, not a child
        if (e.target === backdropRef.current) onClose()
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:p-8 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="spacer-title"
    >
      <div
        className={`relative flex w-full max-w-5xl max-h-[90vh] flex-col bg-black shadow-2xl transition-[opacity,transform] duration-300 ease-out ${
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'
        }`}
      >
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
        <FakeScrollbar target={scrollRef} variant="light" />
        <div
          ref={scrollRef}
          onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
          className="flex-1 overflow-y-auto overscroll-contain no-scrollbar"
        >
          {/* Hero image with title/subtitle overlaid */}
          <div className="relative h-[42vh] min-h-[260px] w-full overflow-hidden md:h-[52vh]">
            <div
              className="absolute inset-x-0 -top-[40%] -bottom-[40%]"
              style={{ transform: `translateY(${scrollTop * PARALLAX_FACTOR}px)` }}
            >
              <Image src={image} alt={title} fill priority className="object-cover object-center" />
            </div>
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
                className="mt-6 inline-flex items-center gap-1 font-bold text-white"
              >
                <span className="underline underline-offset-2">Set List</span>
                <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Footer stays pinned to the bottom of the popup */}
        {(bookNowUrl || ticketsLabel) && (
          <div className="flex flex-col gap-2 border-t border-[#EBEBEB] bg-white px-6 py-2 sm:flex-row sm:items-center sm:justify-between md:px-10">
            <p className="text-sm font-bold text-black md:text-base">{ticketsLabel}</p>
            {bookNowUrl && (
              <a
                href={bookNowUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-bold text-black md:text-base"
              >
                <span className="underline underline-offset-2">Book Now</span>
                <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
