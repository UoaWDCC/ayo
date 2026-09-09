import Hero from '../components/Hero'
import PhotoSpotlight from '../components/PhotoSpotlight'
import UpcomingEvents from '../components/UpcomingEvents'
import AboutUsQuoteVid from '../components/AboutUsQuoteVid'
import PreviousEvents from '../components/PreviousEvents'
import FAQSection from '../components/FAQSection'
import ConcertsIntro from '../components/ConcertsIntro'
import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

export default async function ConcertsEventsPage() {
  const page = await getPageBySlug('concerts-events')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = heroBlock?.backgroundImage

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/hero-placeholder.jpg'

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero
        title="Concerts & Events"
        subtitle="Full symphonic programmes performed by our own ranks."
        backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'}
      />
      <ConcertsIntro />
      <PhotoSpotlight
        textSmall="Europe Tour - Friday, 23rd of October, 2025 to Friday 23rd of October, 2026"
        headingSmall="On Now:"
        headingLarge="Europe Tour"
        hoverImgSrc="/hero-placeholder.jpg"
        staticImgSrc="/about-us-quote-poster.jpg"
        modalSubtitle="Sep. 17th to Sep 30th · Norway, Sweden, UK"
        description="The orchestra is open to young musicians typically aged between 14 and 24."
        galleryImages={[
          '/about-us-quote-poster.jpg',
          '/about-us-quote-poster.jpg',
          '/about-us-quote-poster.jpg',
        ]}
        times={[
          { time: '16:00 - 18:00', date: 'Sunday, 21st of June', location: 'Howick, Auckland' },
          { time: '18:00 - 20:00', date: 'Monday, 22nd of June', location: 'Howick, Auckland' },
        ]}
        setListUrl="#"
        bookNowUrl="#"
      />

      <UpcomingEvents />

      <div className="w-full mt-10">
        <AboutUsQuoteVid
          posterImage="/about-us-quote-poster.jpg"
          // videoSrc="/about-us-quote-preview.mp4"   //
          youtubeUrl="https://youtu.be/8HixIOtXEN4?si=N13_yW1Zjo5zVaH-" // changeable
          showSeeMore
          titleSmall="Our Past"
          titleLarge="Highlights"
        />
      </div>

      <PreviousEvents />
      <FAQSection />
    </main>
  )
}
