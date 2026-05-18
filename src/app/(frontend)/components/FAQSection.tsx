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
    answer:
      'The audition process for the AYO typically involves performing a set of prepared pieces, scales, and sight-reading exercises. Applicants are usually required to submit an application form along with a recording of their performance or attend an in-person audition. To prepare, it’s important to practice regularly, focus on technical proficiency, and work on musical expression. It can also be helpful to seek feedback from teachers or mentors and to familiarize yourself with the orchestra’s repertoire.',
  },
  {
    id: 3,
    question: 'How often does the orchestra rehearse, and where are rehearsals held?',
    answer:
      'The orchestra rehearses regularly, typically once or twice a week, depending on the season and performance schedule. Rehearsals are usually held at the Auckland Town Hall or other suitable venues in the city.',
  },
  {
    id: 4,
    question: 'What level of musical experience is expected from members?',
    answer:
      'Members are expected to have a strong foundation in their instrument, typically at a Grade 7–8 level (or equivalent). They should be able to read music fluently, demonstrate good intonation and rhythm, and show a commitment to collaborative playing.',
  },
  {
    id: 5,
    question: 'Are there any membership fees, and what do they cover?',
    answer:
      'Yes, there are annual membership fees that help cover the costs of rehearsals, performances, and other orchestra activities. The fees typically cover administrative costs, venue rentals, and other operational expenses.',
  },
  {
    id: 6,
    question: 'What performance opportunities are available throughout the year?',
    answer:
      'Members have the opportunity to participate in various performances throughout the year, including concerts, recitals, and community events. The orchestra also participates in regional and national competitions and festivals.',
  },
  {
    id: 7,
    question: 'Can students from outside Auckland apply to join?',
    answer:
      'Yes, students from outside Auckland are welcome to apply, provided they are based in the Auckland region and can attend regular rehearsals and performances.',
  },
]

const FAQSection = () => {
  return (
    <section className="bg-white w-full">
      <h2 className="font-semibold text-[40px] leading-[56px] text-black mx-8 md:mx-20 lg:mx-25 xl:mx-30 pt-[116px] pb-[34px]">
        FAQs
      </h2>

      <div>
        {faqData.map((item) => (
          <div key={item.id} className="scroll-fade-up">
            <FAQItem {...item} />
          </div>
        ))}
      </div>

      <div className="h-[64px]" />
    </section>
  )
}

export default FAQSection
