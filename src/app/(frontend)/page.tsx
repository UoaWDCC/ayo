import React from 'react'
import EventsBlock from './components/events/EventsBlock'
import BlogsBlock from './components/blogs/BlogsBlock'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <EventsBlock />
      <BlogsBlock />
    </main>
  )
}
