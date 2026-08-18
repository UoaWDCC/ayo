import Image from 'next/image'
import React from 'react'
import NavBar from './NavBar'

type HeroProps = {
  title: string
  /** Absolute path from /public, e.g. "/hero-orchestra.jpg" */
  backgroundImage?: string
}

const Hero = ({ title, backgroundImage }: HeroProps) => {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex flex-col overflow-hidden">
      {/* Background */}
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover object-center"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-700" />
      )}

      {/* Dark scrim */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Layered content */}
      <div className="relative z-10 flex flex-col h-full">
        <NavBar overlay />

        {/* Title pinned to bottom-left */}
        <div className="mt-auto px-10 pb-10">
          <h1
            className="text-white font-bold leading-none m-0"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}
          >
            {title}
          </h1>
        </div>
      </div>
    </section>
  )
}

export default Hero
