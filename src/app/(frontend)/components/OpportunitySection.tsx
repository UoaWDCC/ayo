import OpportunityTable from './OpportunityTable'

const opportunities = [
  {
    id: 1,
    title: 'Lodge of the Liberal Arts: Howard Wyatt Memorial Scholarship',
    deadlineLabel: '20th of May, 11:59pm NZST',
    description:
      'The Freemasons of Lodge No.500 have established a trust for charitable purposes, to assist young musicians in their education. Scholarships totalling $3,000 are granted each year to members of AYO who have shown outstanding...',
    readMoreUrl: '#',
    applyUrl: '#',
  },
  {
    id: 2,
    title: 'Chip and Muriel Stevens Award',
    deadlineLabel: '20th of May, 11:59pm NZST',
    description:
      'This $1,500 award is dedicated to the memory of a former Chairman of AYO, N.W. (Chip) Stevens, who spent his lifetime encouraging young people to love music and young musicians to reach their full potential.',
    readMoreUrl: '#',
    applyUrl: '#',
  },
  {
    id: 3,
    title: 'AYO Soloist Competition',
    deadlineLabel: '15th of August, 11:59pm NZST',
    description:
      'The AYO Soloist Competition offers existing orchestra members the chance to compete for monetary prizes and a concerto appearance with the orchestra. The orchestra showcases young soloists and composers; it...',
    readMoreUrl: '#',
    applyUrl: '#',
  },
  // Need to figure out how the urls for the applyUrl and readMoreUrl work. Also some descriptions in the figma are incomplete so these are just current placeholders
]

export default function OpportunitySection() {
  return (
    <section className="font-semibold text-[48px] leading-[56px] text-black mx-8 md:mx-24 lg:mx-40 xl:mx-64 pt-[116px] pb-[34px]">
      <h1>Opportunities</h1>
      <p className="mt-[16px] text-[24px] text-gray-400 italic">
        There are a range of opportunities we offer, exclusively to AYO players.
      </p>
      <p className="mt-2 text-sm italic text-gray-400">
        Showing {opportunities.length} opportunities
      </p>
      <OpportunityTable opportunities={opportunities} />
    </section>
  )
}
