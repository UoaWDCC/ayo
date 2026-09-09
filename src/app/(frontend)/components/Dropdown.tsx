'use client'

import { useEffect, useRef, useState } from 'react'

type DropdownProps = {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

const Dropdown = ({ label, value, options, onChange }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
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

  return (
    <div className="flex items-center gap-2">
      <label className="text-[#B2B2B2]">{label}</label>

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="flex items-center gap-1.5 font-semibold text-black cursor-pointer transition-opacity hover:opacity-70"
        >
          {value}
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
          className={`absolute left-0 top-full z-20 mt-2 min-w-full origin-top whitespace-nowrap border border-[#EBEBEB] bg-white py-1 transition-[opacity,transform] duration-100 ease-out will-change-transform ${
            isOpen
              ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
          }`}
        >
          {options.map((option) => (
            <li key={option} role="option" aria-selected={option === value}>
              <button
                type="button"
                tabIndex={isOpen ? 0 : -1}
                onClick={() => {
                  onChange(option)
                  setIsOpen(false)
                }}
                className={`block w-full cursor-pointer px-4 py-2 text-left transition-colors hover:bg-gray-50 ${
                  option === value ? 'font-semibold text-black' : 'text-black/70'
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Dropdown
