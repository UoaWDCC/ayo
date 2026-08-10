import React from 'react'
import AboutUsQuoteVideo from './AboutUsQuoteVid'

const AboutUsSection = () => {
  return (
    <section className="w-full bg-white">
      {/* Intro text */}
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-12 md:py-24">
        <p className="text-3xl leading-body text-gray-600">
          Founded in 1948 as the very first youth orchestra in the Southern Hemisphere, the Auckland
          Youth Orchestra (AYO) stands as Aotearoa New Zealand's premier regional youth symphony.
        </p>

        <p className="text-3xl leading-body text-gray-600 mt-5">
          We bring together musicians aged 16 to 26 who are passionate about their craft and ready
          to step into an opportunity like no other. Under the baton of our international conductor
          and music director, our young artists train within a full-scale symphony orchestra,
          collaborate with leading professional mentors, and play to expectant audiences in
          Auckland's best concert halls.
        </p>

        <p className="text-3xl leading-body text-gray-600 mt-5">
          The result? First class experiences. Polish and freshness in equal measure, alongside
          genuine connections.
        </p>
      </div>

      {/* Hover-to-preview quote / video — full width */}
      <div className="w-full mt-10">
        <AboutUsQuoteVideo
          quote="Watching Auckland Youth Orchestra perform, it was hard to believe this was youth talent. The passion, precision, and professionalism on stage were genuinely extraordinary."
          // posterImage="/about-us-quote-poster.jpg" //
          // videoSrc="/about-us-quote-preview.mp4"   //
          youtubeUrl="https://www.youtube.com/@aucklandyouthorchestra" // TODO: confirm channel/video URL
        />
      </div>

      {/* Reach & alumni copy */}
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-16 md:py-24">
        <p className="text-3xl leading-body text-gray-600">
          AYO performs widely, across Tāmaki Makaurau and beyond. We've taken our sound to Australia
          and the Pacific, North America, and Europe, and have built an international reputation as
          a world-class youth orchestra.
        </p>

        <p className="text-3xl leading-body text-gray-600 mt-5">
          Our players do far more than master performance - they discover how to lead with courage,
          organise with precision, and support each other under pressure. Many go on to professional
          orchestras around the world. Others take that same discipline into business, science,
          public life, and beyond.
        </p>

        <p className="text-3xl leading-body text-gray-600 mt-5">
          Wherever their path lies, you can be sure of one thing:
        </p>
      </div>

      {/* "Here Plays the Future" banner */}
      <div className="relative h-[320px] md:h-[420px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-neutral-800" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 flex h-full flex-col justify-center">
          <span className="ml-[25%] text-4xl sm:text-5xl md:text-6xl font-medium leading-none text-white">
            Here Plays
          </span>
          <span className="ml-[40%] mt-4 text-7xl sm:text-8xl md:text-9xl font-medium leading-none text-white">
            the Future
          </span>
        </div>
      </div>

      <div className="h-16 bg-white w-full" />
    </section>
  )
}

export default AboutUsSection
