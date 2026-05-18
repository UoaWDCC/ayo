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
    // details
    <div
      className="group border-t border-[#EBEBEB] text-black mx-8 md:mx-20 lg:mx-25 xl:mx-30 py-[24px] cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* summary */}
      <div className="flex items-center justify-between">
        <span
          className={`transition-transform duration-300 mr-3 shrink-0 inline-block ${isOpen ? 'rotate-90' : 'rotate-0'}`}
        >
          ▶
        </span>
        <h3 className="font-medium text-[20px] leading-[32px] text-black flex-1">{question}</h3>
        <span
          className={`transition-transform duration-300 shrink-0 inline-block ${isOpen ? 'rotate-180' : 'rotate-0'}`}
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
      </div>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="mt-[16px] text-[20px] leading-[32px] text-gray-600 ">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default FAQItem
