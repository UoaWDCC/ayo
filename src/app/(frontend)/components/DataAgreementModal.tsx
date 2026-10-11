'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import FakeScrollbar from './FakeScrollbar'
import { announceModalOpen } from './modalEvents'

const TRANSITION_MS = 300

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
    <div
      ref={backdropRef}
      onClick={(e) => {
        // Only close if the click landed on the backdrop itself, not the card
        if (e.target === backdropRef.current) onClose()
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:p-8 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex w-full max-w-2xl max-h-[90vh] flex-col bg-white shadow-2xl transition-[opacity,transform] duration-300 ease-out ${
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'
        }`}
      >
        <FakeScrollbar target={scrollRef} variant="dark" />
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
          <div className="flex justify-end p-4">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="cursor-pointer text-xl leading-none text-black/60 hover:opacity-70"
            >
              ✕
            </button>
          </div>

          <div className="px-6 pb-8 md:px-10">
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
