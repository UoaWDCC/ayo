import React from 'react'
import Hero from './components/Hero'
import AboutIntro from './components/AboutIntro'
import EventsBlock from './components/events/EventsBlock'
import BlogsBlock from './components/blogs/BlogsBlock'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Hero title="Here Plays The Future" backgroundImage="/hero-placeholder.jpg" />
      <AboutIntro />
      <EventsBlock />
      <BlogsBlock />
    </main>
  )
}
