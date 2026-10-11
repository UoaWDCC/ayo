'use client'

import { useEffect, useRef, useState } from 'react'

type DropdownProps = {
  label?: string
  value: string
  options: string[]
  onChange: (value: string) => void
  align?: 'left' | 'right'
  // Shown when value is empty, e.g. an unanswered form field.
  placeholder?: string
  // Stretches the trigger to fill its container, for use as a form field.
  fullWidth?: boolean
}

const Dropdown = ({
  label,
  value,
  options,
  onChange,
  align = 'left',
  placeholder = '',
  fullWidth = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  // Keeps the menu mounted after closing so dropdown-out can play before it unmounts.
  const [isRendered, setIsRendered] = useState(false)
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
    <div className={`flex items-center gap-2 ${fullWidth ? 'w-full' : ''}`}>
      {label && <label className="text-[#B2B2B2]">{label}</label>}

      <div ref={containerRef} className={`relative ${fullWidth ? 'w-full' : ''}`}>
        <button
          type="button"
          onClick={() => {
            if (!isOpen) setIsRendered(true)
            setIsOpen((open) => !open)
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`flex items-center gap-1.5 font-semibold text-black cursor-pointer transition-opacity hover:opacity-70 ${
            fullWidth ? 'w-full justify-between text-left' : ''
          }`}
        >
          {value || <span className="font-normal text-[#B2B2B2]">{placeholder}</span>}
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

        {isRendered && (
          <ul
            role="listbox"
            onAnimationEnd={() => {
              if (!isOpen) setIsRendered(false)
            }}
            className={`absolute ${
              align === 'right' ? 'right-0' : 'left-0'
            } top-full z-20 mt-2 min-w-full origin-top whitespace-nowrap border border-[#EBEBEB] bg-white py-1 ${
              isOpen
                ? 'animate-[dropdown-in_100ms_ease-out]'
                : 'pointer-events-none animate-[dropdown-out_100ms_ease-in_forwards]'
            }`}
          >
            {options.map((option) => (
              <li key={option} role="option" aria-selected={option === value}>
                <button
                  type="button"
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
        )}
      </div>
    </div>
  )
}

export default Dropdown
