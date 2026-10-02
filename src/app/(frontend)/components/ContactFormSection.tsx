'use client'

import React, { useEffect, useRef, useState } from 'react'

const inputClasses =
  'w-full border-0 border-b border-black bg-transparent px-2 pb-3 text-[16px] outline-none'

const queryTypeOptions = [
  { value: 'general', label: 'General enquiry' },
  { value: 'join', label: 'Joining AYO' },
  { value: 'support', label: 'Supporting AYO' },
  { value: 'concerts', label: 'Concerts and events' },
]

function QueryTypeDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  const selected = queryTypeOptions.find((option) => option.value === value)

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name="queryType" value={value} />
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`${inputClasses} flex cursor-pointer items-center justify-between gap-2 text-left`}
      >
        <span className={selected ? 'text-black' : 'text-black/50'}>
          {selected ? selected.label : 'Select a query type'}
        </span>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`shrink-0 transition-transform duration-150 ease-out ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <ul
        role="listbox"
        aria-hidden={!isOpen}
        className={`absolute left-0 top-full z-20 mt-2 w-full origin-top border border-[#EBEBEB] bg-white py-1 transition-[opacity,transform] duration-100 ease-out will-change-transform ${
          isOpen
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
        }`}
      >
        {queryTypeOptions.map((option) => (
          <li key={option.value} role="option" aria-selected={option.value === value}>
            <button
              type="button"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => {
                setValue(option.value)
                setIsOpen(false)
              }}
              className={`block w-full cursor-pointer px-4 py-2 text-left transition-colors hover:bg-gray-50 ${
                option.value === value ? 'font-semibold text-black' : 'text-black/70'
              }`}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ContactFormSection({ onBack }: { onBack?: () => void }) {
  return (
    <section className="w-full bg-white text-black">
      <div className="px-4 py-14 sm:px-8 md:px-24">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-[15px] font-semibold underline hover:opacity-70"
          >
            ← Back to FAQs
          </button>
        )}

        <h2 className="mt-6 font-semibold text-[40px] leading-[48px] text-black">
          Still can&apos;t find your answer?
        </h2>
        <p className="mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">
          Let us know via our contact form.
        </p>

        <div className="mt-12 grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-between gap-20">
            <address className="not-italic">
              <h3 className="text-[16px] font-semibold">Postal Address</h3>
              <p className="mt-3 text-[15px] leading-6">PO Box 99830, Newmarket, Auckland 1149</p>
            </address>
          </div>

          <form className="w-full" aria-label="Contact form">
          <div className="grid gap-9">
            <label className="block">
              <span className="block px-2 pb-3 text-[15px]">Name*</span>
              <input className={inputClasses} type="text" name="name" aria-label="Name" />
            </label>

            <div className="block">
              <span className="block px-2 pb-3 text-[15px]">Query Type*</span>
              <QueryTypeDropdown />
            </div>

            <label className="block">
              <span className="block px-2 pb-3 text-[15px]">E-mail Address</span>
              <input
                className={inputClasses}
                type="email"
                name="email"
                aria-label="E-mail Address"
              />
            </label>

            <label className="block">
              <span className="block px-2 pb-3 text-[15px]">Message</span>
              <textarea
                className={`${inputClasses} min-h-[112px] resize-none`}
                name="message"
                aria-label="Message"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <label className="flex items-start gap-3 text-[15px] leading-5">
              <input
                type="checkbox"
                name="privacy"
                className="mt-0.5 h-5 w-5 shrink-0 appearance-none border border-black bg-white"
              />
              <span>
                By clicking submit, you agree to the{' '}
                <span className="font-semibold underline">processing of personal data</span>.
              </span>
            </label>

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="bg-black px-8 py-3 text-[15px] font-semibold text-white hover:bg-black/80"
              >
                Submit
              </button>
            </div>
          </div>
          </form>
        </div>
      </div>
    </section>
  )
}
