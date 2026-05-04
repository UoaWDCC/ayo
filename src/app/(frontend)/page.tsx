import React from 'react'
import './styles.css'
import EventsBlock from './components/EventsBlock'
import BlogsBlock from '../components/BlogsBlock'
import Grid from './components/Grid'
import AnnualReports from './components/AnnualReports'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Grid title="People" placeholderSubtitle="Name" />
      <Grid title="Alumni" placeholderSubtitle="Role" />
      <Grid title="Partners" placeholderSubtitle="Company" />
      <AnnualReports />

      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="home font-sans w-full max-w-2xl text-left px-4">
          <h1 className="text-heading font-semibold">Heading</h1>
          <div className="text-muted">Muted Text</div>

          <div className="mt-5 text-[20px] leading-body">
            <p>
              Auckland Youth Orchestra is the premier regional youth orchestra in New Zealand.
              Founded in 1948, and originally named the Auckland Junior Symphony Orchestra, or AJSO,
              it was the first youth orchestra established in the Southern Hemisphere. It is designed
              to bridge the gap between school orchestras and adult professional groups.
            </p>
          </div>

          <div className="mt-5 text-body leading-body">
            <p>
              This is standard body text. The Final of the 2025 AYO Soloist Competition was held on
              Sunday, 19 October 2025. It was an exciting event with the wonderful talent of AYO’s
              players being showcased once more.
            </p>
          </div>

          <div className="mt-5 text-body leading-miniheader">
            <p className="font-semibold">AYO Soloist Competition</p>
            <p>
              This is the line spacing for card components. Apply by 15th of August, 11:59pm NZST.
            </p>
          </div>
        </div>
      </div>

      <EventsBlock />
      <BlogsBlock />
    </div>
  )
}