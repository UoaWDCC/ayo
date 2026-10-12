'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import FakeScrollbar from './FakeScrollbar'
import { announceModalOpen } from './modalEvents'
import { useEasedWheelScroll } from './useEasedWheelScroll'

// How long the close animation runs. Must stay in step with the `duration-200`
// on the backdrop and the card below — it's what keeps the modal mounted long
// enough for that animation to finish before it's torn out of the DOM.
const EXIT_MS = 200

type DataAgreementModalProps = {
  isOpen: boolean
  onClose: () => void
  onAgree: () => void
  /** The agreement text, written by an admin in Payload. Nothing is shown in its place if omitted. */
  children?: ReactNode
}

const DataAgreementModal = ({ isOpen, onClose, onAgree, children }: DataAgreementModalProps) => {
  const titleId = useId()
  const [shouldRender, setShouldRender] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      announceModalOpen()

      // Two rAFs so the closed state paints before flipping to visible,
      // otherwise the browser batches both into one paint and skips the transition.
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
    const timeout = setTimeout(() => setShouldRender(false), EXIT_MS)
    return () => clearTimeout(timeout)
  }, [isOpen])

  // Keyed off `isOpen`, not `shouldRender`: the page gets its scroll and its key
  // bindings back the instant the close starts, rather than staying locked for the
  // whole fade-out. The backdrop stops swallowing clicks at the same moment, below.
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  useEasedWheelScroll(scrollRef, isOpen)

  if (!shouldRender || typeof document === 'undefined') return null

  // Portalled to <body> at z-[120] so it sits above the fixed NavBar header (z-[110]).
  return createPortal(
    <div
      ref={backdropRef}
      onClick={(e) => {
        // Only close if the click landed on the backdrop itself, not the card
        if (e.target === backdropRef.current) onClose()
      }}
      /**
       * `backdrop-blur-[0px]`, not `backdrop-blur-none`: Tailwind's `none` resolves
       * `backdrop-filter` to an empty value, which can't be interpolated from
       * `blur(8px)` — the blur used to snap off on the first frame of the close while
       * the dim faded on for the full 200ms. `-webkit-backdrop-filter` is in the
       * transition list because that's the property Safari actually animates.
       */
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 md:p-8 transition-[opacity,backdrop-filter,-webkit-backdrop-filter] ${
        isVisible
          ? 'opacity-100 backdrop-blur-sm duration-300 ease-out'
          : 'pointer-events-none opacity-0 backdrop-blur-[0px] duration-200 ease-in'
      }`}
    >
      {/**
       * The dialog is the card, not the dimmed backdrop, so the role lives here:
       * a screen reader shouldn't treat the full-screen overlay as the dialog, and
       * the backdrop stays a plain click target for dismissing.
       */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        /**
         * The transition lists `translate` and `scale`, not `transform`: Tailwind v4's
         * `translate-y-*` and `scale-*` set those two standalone properties, so naming
         * `transform` transitioned nothing and the card jumped straight to its offset,
         * shrunken state before fading. `will-change` names the same two properties to
         * promote the card to its own compositor layer — without it the browser
         * re-rasterizes the whole agreement, a tall block of CMS rich text, on every
         * frame of the scale, which is what made closing stutter.
         *
         * Closing is quicker than opening and eases in rather than out, so the card
         * leaves instead of hanging around at the end of its own fade.
         */
        className={`relative flex w-full max-w-2xl max-h-[90vh] flex-col bg-white shadow-2xl transition-[opacity,translate,scale] [will-change:opacity,translate,scale] ${
          isVisible
            ? 'translate-y-0 scale-100 opacity-100 duration-300 ease-out'
            : 'translate-y-4 scale-95 opacity-0 duration-200 ease-in'
        }`}
      >
        {/* Close button — floats above the scrolling content, always reachable */}
        <button
          ref={closeButtonRef}
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
        <FakeScrollbar target={scrollRef} variant="dark" />
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain no-scrollbar"
        >
          <div className="px-6 pb-8 pt-16 md:px-10">
            <h2 id={titleId} className="text-2xl font-semibold">
              Processing of personal data
            </h2>

            {children && (
              <div className="mt-6 text-sm leading-relaxed text-black/70 [&_a]:underline [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:font-semibold [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
                {children}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end bg-black px-6 py-4 text-white md:px-10">
          <button
            type="button"
            onClick={onAgree}
            className="cursor-pointer bg-white px-6 py-2 text-sm font-semibold text-black hover:bg-white/80"
          >
            Agree
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default DataAgreementModal
