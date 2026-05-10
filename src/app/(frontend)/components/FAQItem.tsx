type FAQItemProps = {
  id: number
  question: string
  answer: string
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  return (
    <details className="group border-t border-[#EBEBEB] text-black mx-8 md:mx-20 lg:mx-25 xl:mx-30 py-[24px] cursor-pointer">
      <summary className="flex items-center justify-between list-none">
        <h3 className="font-medium text-[20px] leading-[32px] text-black">{question}</h3>
        <span className="transition-transform duration-300 group-open:rotate-180">
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
      </summary>

      <p className="mt-[16px] text-[20px] leading-[32px] text-gray-600 ">{answer}</p>
    </details>
  )
}

export default FAQItem
