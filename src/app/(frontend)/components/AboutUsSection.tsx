import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'
import Image from 'next/image'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import AboutUsQuoteStatic from './AboutUsQuoteStatic'
import ScrollReveal from './ScrollReveal'
import StaggerReveal from './StaggerReveal'
import { createIntroConverters } from './richTextConverters'

type AboutUsSectionProps = {
  foundingStoryText?: SerializedEditorState
  reachAndAlumniText?: SerializedEditorState
  quote?: string
  quoteImageUrl?: string
  quoteCaption?: string
  bannerImageUrl?: string
}

const foundingConverters = createIntroConverters('about-founding-fade')
const reachConverters = createIntroConverters('about-reach-fade')

const AboutUsSection = ({
  foundingStoryText,
  reachAndAlumniText,
  quote,
  quoteImageUrl,
  quoteCaption,
  bannerImageUrl,
}: AboutUsSectionProps) => {
  return (
    <section className="w-full bg-white">
      {foundingStoryText && (
        <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-25 pb-12.5">
          <StaggerReveal fadeClass="about-founding-fade" className="max-w-[1380px]">
            <RichText data={foundingStoryText} converters={foundingConverters} />
          </StaggerReveal>
        </div>
      )}

      {/* Full-bleed media break — deliberately outside the gutter. */}
      <ScrollReveal className="w-full my-12.5">
        <AboutUsQuoteStatic quote={quote} image={quoteImageUrl} caption={quoteCaption} />
      </ScrollReveal>

      {reachAndAlumniText && (
        <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5">
          <StaggerReveal fadeClass="about-reach-fade" className="max-w-[1380px]">
            <RichText data={reachAndAlumniText} converters={reachConverters} />
          </StaggerReveal>
        </div>
      )}

      <ScrollReveal className="relative h-[320px] md:h-[420px] w-full overflow-hidden my-12.5">
        <Image
          src={bannerImageUrl ?? '/about-us-quote-poster.jpg'}
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
      </ScrollReveal>
    </section>
  )
}

export default AboutUsSection
