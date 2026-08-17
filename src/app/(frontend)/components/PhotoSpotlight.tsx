'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useState } from 'react'

type SpotlightProps = {
  textAbove: string
  textSmall: string
  headingSmall: string
  headingLarge: string
  hoverImgSrc: string
  staticImgSrc: string
}

const PhotoSpotlight = ({
  textAbove,
  textSmall,
  headingSmall,
  headingLarge,
  hoverImgSrc,
  staticImgSrc,
}: SpotlightProps) => {
  const [imgSrc, setImgSrc] = useState(staticImgSrc)

  return (
    <section>
      <div className="mx-auto w-[80%] mt-15 mb-15">
        <p className="text-[40px]">{textAbove}</p>

        <Link href="/concerts-events" className="font-bold text-[40px]">
          <span className="underline">Sign up to our newsletter</span>&ensp;↗
        </Link>
      </div>
      <Link href="/concerts-events">
        <section
          className="relative w-full h-screen min-h-[600px] flex flex-col overflow-hidden"
          onMouseEnter={() => setImgSrc(hoverImgSrc)}
          onMouseLeave={() => setImgSrc(staticImgSrc)}
        >
          <Image src={imgSrc} alt="alt text" fill className="object-cover object-center" priority />

          {/* Layered content */}
          <div className="relative z-10 flex flex-col h-full">
            <div className="mt-10 px-10 pb-10 flex">
              <h3
                className="text-white leading-none m-0"
                style={{ fontSize: 'clamp(0.5rem, 9vw, 1.5rem)' }}
              >
                {textSmall}
              </h3>

              <h3
                className="text-white leading-none ml-200"
                style={{ fontSize: 'clamp(0.5rem, 9vw, 1.5rem)' }}
              >
                See More
              </h3>
            </div>

            {/* Title pinned to bottom-left */}
            <div className="mt-130 px-10 pb-10">
              <h3
                className="text-white leading-none m-0"
                style={{ fontSize: 'clamp(1rem, 9vw, 4rem)' }}
              >
                {headingSmall}
              </h3>
            </div>
            <div className="mt-0 px-30 pb-10">
              <h1
                className="text-white font-semibold leading-none m-0"
                style={{ fontSize: 'clamp(3.5rem, 9vw, 12rem)' }}
              >
                {headingLarge}
              </h1>
            </div>
          </div>
        </section>
      </Link>
    </section>
  )
}

export default PhotoSpotlight
