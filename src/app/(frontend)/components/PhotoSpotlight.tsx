'use client'
import Image from 'next/image'
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
  const [isHovered, setIsHovered] = useState(false)
  const [isSpacerOpen, setIsSpacerOpen] = useState(false)

  return (
    <section>
      <button
        type="button"
        onClick={() => setIsSpacerOpen(true)}
        className="relative flex h-[85vh] min-h-[560px] w-full flex-col overflow-hidden text-left"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Both images stay mounted and crossfade via opacity so hovering never
            re-triggers a network load / flash of the swapped src. */}
        <Image
          src={staticImgSrc}
          alt="alt text"
          fill
          className="object-cover object-center"
          priority
        />
        <Image
          src={hoverImgSrc}
          alt=""
          fill
          aria-hidden="true"
          className={`object-cover object-center transition-opacity duration-500 ease-out ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Dark scrim */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Layered content */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="mt-8 px-10 pb-10 flex">
            <p className="text-white leading-none mr-5 text-xs sm:text-xs md:text-sm lg:text-base">
              {textSmall}
            </p>

            <p className="flex items-center gap-2 text-white leading-none ml-auto text-xs sm:text-xs md:text-sm lg:text-base">
              See More
              <Image
                src="/arrow-up-right.svg"
                alt=""
                width={30}
                height={30}
                aria-hidden="true"
                className="brightness-0 invert"
              />
            </p>
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
          <div className="mt-0 px-10 sm:px-16 md:px-20 pb-10">
            <h1
              className="text-white font-semibold leading-none m-0"
              style={{ fontSize: 'clamp(2.5rem, 9vw, 12rem)' }}
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
