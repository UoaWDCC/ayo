import React from 'react'
import AboutUsQuoteVideo from './AboutUsQuoteVid'

/**
 * "About Us" section of the About Us page — sits between the Hero and the
 * "History of AYO" section. Content is hardcoded per the design brief
 * (see GitHub issue: "Hardcode all content using text from design brief").
 *
 * TODO(design): the banner background image below ("Here Plays the Future")
 * is a placeholder — swap in the real orchestra photo when available.
 */
const AboutUsSection = () => {
  return (
    <section className="w-full bg-white text-black">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-8 py-16 md:py-24">
        {/* Section label */}
        <h2 className="text-2xl md:text-3xl font-medium text-muted mb-6">About Us</h2>

        {/* Intro card */}
        <div className="border border-black/10 p-6 md:p-10">
          <p className="text-body leading-body">
            Founded in 1948 as the very first youth orchestra in the Southern Hemisphere, the
            Auckland Youth Orchestra (AYO) stands as Aotearoa New Zealand&rsquo;s premier regional
            youth orchestra.
          </p>

          <p className="text-body leading-body mt-5">
            We bring together musicians aged 15 to 25 who are passionate about their craft and ready
            to step into an opportunity like no other. Under the baton of our international
            conductor and music director, our young artists train within a full-scale symphony
            orchestra, collaborate with leading professional mentors, and perform to exceptional
            audiences in Auckland&rsquo;s best concert halls.
          </p>

          <p className="text-body leading-body mt-5">
            The result? First-class experiences. Polish and freshness in equal measure, alongside
            genuine connections.
          </p>
        </div>

        {/* Hover-to-preview quote / video */}
        <div className="mt-10">
          <AboutUsQuoteVideo
            quote="Watching Auckland Youth Orchestra perform, it was hard to believe this was youth talent. The passion, precision, and professionalism on stage were genuinely extraordinary."
            // posterImage="/about-us-quote-poster.jpg" // TODO: add still frame
            // videoSrc="/about-us-quote-preview.mp4"   // TODO: add hover clip
            youtubeUrl="https://www.youtube.com/@aucklandyouthorchestra" // TODO: confirm channel/video URL
          />
        </div>

        {/* Reach & alumni copy */}
        <div className="mt-10">
          <p className="text-body leading-body">
            AYO performs widely, across Tāmaki Makaurau and beyond. We&rsquo;ve taken our sound to
            Australia and the Pacific, North America, and Europe, and have built an international
            reputation as a world-class youth orchestra.
          </p>

          <p className="text-body leading-body mt-5">
            Our players do far more than master performance &mdash; they discover how to lead with
            courage, organise with precision, and support each other under pressure. Many go on to
            professional orchestras around the world. Others take that same discipline into
            business, science, public life, and beyond.
          </p>

          <p className="text-body leading-body mt-5">
            Wherever their ties lie, you can be sure of one thing:
          </p>
        </div>
      </div>

      {/* "Here Plays the Future" banner */}
      <div className="relative h-[320px] md:h-[420px] w-full overflow-hidden">
        {/* PLACEHOLDER — swap for the real background photo (see Hero.tsx for the <Image> pattern) */}
        <div className="absolute inset-0 bg-neutral-800" />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 flex h-full flex-col justify-center px-8 md:px-16">
          <span className="self-start text-4xl sm:text-5xl md:text-6xl font-medium leading-none text-white">
            Here Plays
          </span>
          <span className="self-end mt-2 text-4xl sm:text-5xl md:text-6xl font-medium leading-none text-white">
            the Future
          </span>
        </div>
      </div>
    </section>
  )
}

export default AboutUsSection
