import Hero from '../components/Hero'
import PhotoSpotlight from '../components/PhotoSpotlight'
import UpcomingEvents from '../components/UpcomingEvents'
import AboutUsQuoteVid from '../components/AboutUsQuoteVid'
import PreviousEvents from '../components/PreviousEvents'
import FAQSection from '../components/FAQSection'
import ConcertsIntro from '../components/ConcertsIntro'
import NewsletterSignup from '../components/NewsletterSignup'
import { getPageBySlug } from '@/lib/getPageBySlug'
import { resolveHeroImage } from '@/lib/heroImage'
import { getConcertEvents } from '@/lib/concertEvents'

export default async function ConcertsEventsPage() {
  const page = await getPageBySlug('concerts-events')
  const { upcoming, previous } = await getConcertEvents()

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = resolveHeroImage(heroBlock?.backgroundImage)

  const richTextBlocks = page?.layout?.filter((block) => block.blockType === 'rich-text') ?? []

  const introText = richTextBlocks[0]?.content

  // Highlights reel under the upcoming events: its link and label come from the
  // page's video block.
  const highlightsVideo = page?.layout?.find((block) => block.blockType === 'video')

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero
        title={heroBlock?.slogan || page?.title || ''}
        subtitle={heroBlock?.subtitle ?? undefined}
        backgroundImage={heroImage}
      />
      <ConcertsIntro introText={introText} />
      <NewsletterSignup />
      <div className="w-full my-12.5">
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
      </div>

      <UpcomingEvents events={upcoming} />

      <div className="w-full my-12.5">
        <AboutUsQuoteVid
          posterImage="/about-us-quote-poster.jpg"
          // videoSrc="/about-us-quote-preview.mp4"   //
          youtubeUrl={highlightsVideo?.videoUrl}
          caption={highlightsVideo?.text ?? undefined}
          showSeeMore
          titleSmall="Our Past"
          titleLarge="Highlights"
        />
      </div>

      <PreviousEvents events={previous} />
      <FAQSection category="concerts-events" />
    </main>
  )
}
