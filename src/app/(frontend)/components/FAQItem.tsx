'use client'

import { useState } from 'react'

type FAQItemProps = {
  id: number
  question: string
  answer: string
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-t border-[#EBEBEB] text-black py-6">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 text-left cursor-pointer"
      >
        <h3 className="font-medium text-[20px] leading-[32px] text-black">{question}</h3>

        <span
          className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <svg
            fill="none"
            height="24"
            width="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="mt-4 text-[20px] leading-8 text-gray-600">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default FAQItem
