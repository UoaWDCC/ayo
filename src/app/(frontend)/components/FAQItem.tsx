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
    <div
      className="border-t border-[#EBEBEB] mx-[64px] py-[24px] cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <h3 className="font-medium text-[24px] leading-[32px] text-black">{question}</h3>
      {isOpen && <p className="mt-[16px] text-[16px] leading-[24px] text-gray-600">{answer}</p>}
    </div>
  )
}

export default FAQItem
