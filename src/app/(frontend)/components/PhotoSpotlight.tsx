import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const PhotoSpotlight = () => {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex flex-col overflow-hidden">
      <Image
        src="/hero-placeholder.jpg"
        alt="alt text"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Layered content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Title pinned to bottom-left */}
        <div className="mt-150 px-10 pb-10">
          <h3
            className="text-white leading-none m-0"
            style={{ fontSize: 'clamp(1.5rem, 9vw, 4rem)' }}
          >
            On Now:
          </h3>
        </div>
        <div className="mt-auto px-30 pb-10">
          <h1
            className="text-white font-semibold leading-none m-0"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}
          >
            Europe Tour
          </h1>
        </div>
      </div>
    </section>
  )
}

export default PhotoSpotlight
