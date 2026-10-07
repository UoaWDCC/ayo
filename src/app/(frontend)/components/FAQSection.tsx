import FAQItem from './FAQItem'
import { getFaqsByCategory } from '@/lib/getFaqsByCategory'
import type { Faq } from '@/payload-types'

const FAQSection = async ({
  category,
  emptyClassName,
}: {
  category: Faq['category']
  emptyClassName?: string
}) => {
  const faqs = await getFaqsByCategory(category)

  if (faqs.length === 0) {
    return emptyClassName ? <div aria-hidden="true" className={emptyClassName} /> : null
  }

  return (
    <section id="faq" className="bg-white w-full scroll-mt-24">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-14">
        <h2 className="font-semibold text-[40px] leading-[56px] text-black mb-8">FAQs</h2>

        <div>
          {faqs.map((faq) => (
            <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
