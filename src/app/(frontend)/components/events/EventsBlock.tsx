'use client'
import { useState } from 'react'
import EventsCard from './EventsCard'
import EventsCardSwitcher from './EventsCardSwitcher'

const eventsData = [
  {
    image: '/about-us-our-team.jpg',
    programme: [
      'Séjourné - Double Concerto for Marimba & Vibraphone (soloists: Eric Renick and Steve Logan)',
      "Bizet - Intermezzo from L' Arlésienne Suite no. 2",
      'Dvorak - Symphony No. 9 “From the New World”',
    ],
    concertDates: [
      'Sun. 14 June - TBD',
      'Sat. 20 June, 7.30pm - Orewa Arts & Events Centre',
      'Sun. 21 June, 2.30pm - Auckland Town Hall',
    ],
  },
  {
    image: '/hero-placeholder.jpg',
    programme: [
      'Séjourné - Double Concerto for Marimba & Vibraphone (soloists: Eric Renick and Steve Logan)',
      "Bizet - Intermezzo from L' Arlésienne Suite no. 2",
      'Dvorak - Symphony No. 9 “From the New World”',
    ],
    concertDates: [
      'Sun. 14 June - TBD',
      'Sat. 20 June, 7.30pm - Orewa Arts & Events Centre',
      'Sun. 21 June, 2.30pm - Auckland Town Hall',
    ],
  },
  {
    image: '/hero-placeholder.jpg',
    programme: [
      'Elgar - Enigma Variations',
      'Grieg - Piano Concerto in A minor (soloist: Maya Chen)',
      'Sibelius - Finlandia',
    ],
    concertDates: [
      'Fri. 11 July, 7.00pm - Auckland Town Hall',
      'Sat. 12 July, 7.30pm - Bruce Mason Centre',
      'Sun. 13 July, 2.30pm - Howick All Saints Church',
    ],
  },
  {
    image: '/about-us-our-team.jpg',
    programme: [
      'Holst - The Planets, Op. 32',
      'Rachmaninoff - Rhapsody on a Theme of Paganini (soloist: James O’Connell)',
      'Copland - Fanfare for the Common Man',
    ],
    concertDates: [
      'Sat. 8 August, 7.30pm - Auckland Town Hall',
      'Sun. 9 August, 2.30pm - Orewa Arts & Events Centre',
    ],
  },
  {
    image: '/hero-placeholder.jpg',
    programme: [
      'Tchaikovsky - Violin Concerto in D major (soloist: Aria Patel)',
      'Shostakovich - Symphony No. 5',
      'Mussorgsky (orch. Ravel) - Pictures at an Exhibition',
    ],
    concertDates: [
      'Fri. 4 September, 7.00pm - Bruce Mason Centre',
      'Sat. 5 September, 7.30pm - Auckland Town Hall',
      'Sun. 6 September, 2.30pm - Howick All Saints Church',
    ],
  },
  {
    image: '/about-us-our-team.jpg',
    programme: [
      'Beethoven - Symphony No. 7',
      'Mendelssohn - Violin Concerto in E minor (soloist: Lucas Wright)',
      'Wagner - Prelude to Die Meistersinger',
    ],
    concertDates: [
      'Sat. 3 October, 7.30pm - Auckland Town Hall',
      'Sun. 4 October, 2.30pm - Orewa Arts & Events Centre',
    ],
  },
]

const CARDS_PER_PAGE = 2

const Events = () => {
  const [pageNum, setPageNum] = useState(0)
  const pageTotal = Math.ceil(eventsData.length / CARDS_PER_PAGE)

  const handleNext = () => {
    if (pageNum < pageTotal - 1) {
      setPageNum((current) => current + 1)
    }
  }

  const handlePrev = () => {
    if (pageNum > 0) {
      setPageNum((current) => current - 1)
    }
  }

  const start = pageNum * CARDS_PER_PAGE
  const currentPageEvents = eventsData.slice(start, start + CARDS_PER_PAGE)

  return (
    <div className="text-black w-full px-24 py-14">
      <div className="my-10">
        <h1 className="text-heading font-semibold">Concerts & Events</h1>
        <div className="flex mt-5">
          <p className="mr-6 text-muted font-medium"> Year </p>
          <select className="font-semibold underline appearance-none">
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>

          <p className="ml-15 mr-6 text-muted font-medium"> Month </p>
          <select className="font-semibold underline appearance-none">
            <option value="June">June</option>
            <option value="July">July</option>
          </select>
        </div>
      </div>

      <div className="hidden lg:flex flex-col">
        {currentPageEvents.map((concert, index) => (
          <EventsCard
            key={start + index}
            image={concert.image}
            programme={concert.programme}
            concertDates={concert.concertDates}
          />
        ))}
      </div>

      <div className="flex-col lg:hidden">
        {eventsData.map((concert, index) => (
          <div className="mb-5" key={index}>
            <EventsCard
              image={concert.image}
              programme={concert.programme}
              concertDates={concert.concertDates}
            />
          </div>
        ))}
      </div>

      <EventsCardSwitcher
        cardNum={pageNum + 1}
        cardTotal={pageTotal}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  )
}

export default Events
