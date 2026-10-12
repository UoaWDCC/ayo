import FAQItem from './FAQItem'
import FAQReveal from './FAQReveal'
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
    <section className="bg-white w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5">
        <FAQReveal>
          <h2 className="faq-fade font-semibold text-[40px] leading-[56px] text-black mb-8">
            FAQs
          </h2>

          <div>
            {faqs.map((faq) => (
              <div key={faq.id} className="faq-fade">
                <FAQItem question={faq.question} answer={faq.answer} />
              </div>
            ))}
          </div>
        </FAQReveal>
      </div>
    </section>
  )
}

export default FAQSection
