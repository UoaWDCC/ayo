import FAQItem from './FAQItem'

const faqData = [
  {
    id: 1,
    question: 'Who is eligible to join the Auckland Youth Orchestra (AYO)?',
    answer:
      'The orchestra is open to young musicians typically aged between 14 and 24 who are based in the Auckland region. Applicants should have a solid level of proficiency on their instrument, usually around Grade 7–8 (or equivalent), and be able to commit to regular rehearsals and performances. Entry is by audition, and both school students and tertiary-level musicians are welcome to apply.',
  },
  {
    id: 2,
    question: 'What is the audition process like, and how can I prepare for it?',
    answer: '',
  },
  {
    id: 3,
    question: 'How often does the orchestra rehearse, and where are rehearsals held?',
    answer: '',
  },
  {
    id: 4,
    question: 'What level of musical experience is expected from members?',
    answer: '',
  },
  {
    id: 5,
    question: 'Are there any membership fees, and what do they cover?',
    answer: '',
  },
  {
    id: 6,
    question: 'What performance opportunities are available throughout the year?',
    answer: '',
  },
  {
    id: 7,
    question: 'Can students from outside Auckland apply to join?',
    answer: '',
  },
  // TODO: add more FAQ items here
  // each one needs: id, question, answer
  // example:
  // { id: 2, question: '...', answer: '...' },
]

const FAQSection = () => {
  return (
    <section className="bg-white w-full">
      <h2 className="font-semibold text-[40px] leading-[48px] text-black px-[111px] pt-[116px] pb-[34px]">
        FAQs
      </h2>
      <hr className="border-t border-[#EBEBEB] mx-[64px]" />
      <div>
        {faqData.map((item) => (
          <FAQItem key={item.id} {...item} />
        ))}
      </div>
      <div className="h-[64px]" />
    </section>
  )
}

export default FAQSection
