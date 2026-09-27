import React from 'react'
import AboutUsQuoteStatic from './AboutUsQuoteStatic'
import { RichText } from './RichText'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Image from 'next/image'

type AboutUsSectionProps = {
  foundingStoryText?: SerializedEditorState
  reachAndAlumniText?: SerializedEditorState
  quote?: string
  quoteImageUrl?: string
  quoteCaption?: string
}

const AboutUsSection = ({
  foundingStoryText,
  reachAndAlumniText,
  quote,
  quoteImageUrl,
  quoteCaption,
}: AboutUsSectionProps) => {
  return (
    <section className="w-full bg-white">
      {/* Intro text */}
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-20 md:pt-[92px] pb-16 md:pb-24">
        {foundingStoryText ? (
          <div className="text-2xl md:text-3xl leading-body text-gray-600">
            <RichText data={foundingStoryText} />
          </div>
        ) : null}
      </div>

      {/* Quote banner */}
      <div className="w-full mt-10">
        <AboutUsQuoteStatic quote={quote} image={quoteImageUrl} caption={quoteCaption} />
      </div>

      {/* Reach & alumni copy */}
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-20 md:pt-[92px] pb-16 md:pb-24">
        {reachAndAlumniText ? (
          <div className="text-2xl md:text-3xl leading-body text-gray-600">
            <RichText data={reachAndAlumniText} />
          </div>
        ) : null}
      </div>

      {/* "Here Plays the Future" banner */}
      <div className="relative h-[320px] md:h-[420px] w-full overflow-hidden">
        <Image
          src="/about-us-quote-poster.jpg"
          alt="Auckland Youth Orchestra performing"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col justify-center">
          <span className="ml-[15%] lg:ml-[25%] text-4xl sm:text-5xl lg:text-6xl font-medium leading-none text-white">
            Here Plays
          </span>
          <span className="ml-[25%] lg:ml-[35%] mt-4 text-6xl sm:text-8xl lg:text-9xl font-medium leading-none text-white">
            the Future
          </span>
        </div>
      </div>

      <div className="h-16 bg-white w-full" />
    </section>
  )
}

export default AboutUsSection