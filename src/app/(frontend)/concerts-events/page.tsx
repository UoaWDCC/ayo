import Hero from '../components/Hero'
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
  const highlightsUrl = highlightsVideo?.videoUrl?.trim()

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero
        title={heroBlock?.slogan || page?.title || ''}
        subtitle={heroBlock?.subtitle ?? undefined}
        backgroundImage={heroImage}
      />
      <ConcertsIntro introText={introText} />
      <NewsletterSignup />
      <UpcomingEvents events={upcoming} />

      {highlightsUrl && (
        <div className="w-full my-12.5">
          <AboutUsQuoteVid
            posterImage={heroImage.url}
            youtubeUrl={highlightsUrl}
            caption={highlightsVideo?.text ?? undefined}
            showSeeMore
            titleSmall="Our Past"
            titleLarge="Highlights"
          />
        </div>
      )}

      <PreviousEvents events={previous} />
      <FAQSection category="concerts-events" />
    </main>
  )
}
