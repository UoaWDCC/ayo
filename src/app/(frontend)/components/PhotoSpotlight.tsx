'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useState } from 'react'
import Spacer, { SpacerTime } from './PhotoSpotlightSpacer'

type SpotlightProps = {
  textSmall: string
  headingSmall: string
  headingLarge: string
  hoverImgSrc: string
  staticImgSrc: string
  modalSubtitle?: string
  description?: string
  galleryImages?: string[]
  times?: SpacerTime[]
  setListUrl?: string
  bookNowUrl?: string
}

const PhotoSpotlight = ({
  textSmall,
  headingSmall,
  headingLarge,
  hoverImgSrc,
  staticImgSrc,
  modalSubtitle,
  description,
  galleryImages,
  times,
  setListUrl,
  bookNowUrl,
}: SpotlightProps) => {
  const [imgSrc, setImgSrc] = useState(staticImgSrc)
  const [isSpacerOpen, setIsSpacerOpen] = useState(false)

  return (
    <section>
      <button
        type="button"
        onClick={() => setIsSpacerOpen(true)}
        className="relative flex h-screen min-h-[600px] w-full flex-col overflow-hidden text-left"
        onMouseEnter={() => setImgSrc(hoverImgSrc)}
        onMouseLeave={() => setImgSrc(staticImgSrc)}
      >
        <Image src={imgSrc} alt="alt text" fill className="object-cover object-center" priority />

        {/* Layered content */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="mt-10 px-10 pb-10 flex">
            <h3
              className="text-white leading-none mr-5"
              style={{ fontSize: 'clamp(0.5rem, 9vw, 1.5rem)' }}
            >
              {textSmall}
            </h3>

            <h3
              className="text-white leading-none ml-auto"
              style={{ fontSize: 'clamp(0.5rem, 9vw, 1.5rem)' }}
            >
              See More
            </h3>
          </div>

          {/* Title pinned to bottom-left */}
          <div className="mt-auto px-10 pb-10">
            <h3
              className="text-white leading-none m-0"
              style={{ fontSize: 'clamp(0.5rem, 9vw, 4rem)' }}
            >
              {headingSmall}
            </h3>
          </div>
          <div className="mt-0 px-20 pb-10">
            <h1
              className="text-white font-semibold leading-none m-0"
              style={{ fontSize: 'clamp(5.5rem, 9vw, 12rem)' }}
            >
              {headingLarge}
            </h1>
          </div>
        </div>
      </button>

      <Spacer
        isOpen={isSpacerOpen}
        onClose={() => setIsSpacerOpen(false)}
        image={staticImgSrc}
        title={headingLarge}
        subtitle={modalSubtitle ?? textSmall}
        description={description}
        galleryImages={galleryImages}
        times={times}
        setListUrl={setListUrl}
        bookNowUrl={bookNowUrl}
      />
    </section>
  )
}

export default PhotoSpotlight
