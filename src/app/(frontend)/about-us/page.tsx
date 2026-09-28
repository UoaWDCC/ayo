import { getPayload } from 'payload'
import config from '@payload-config'
import AboutUsSection from '../components/AboutUsSection'
import Hero from '../components/Hero'
import AboutUsFilter from '../components/AboutUsFilter'
import FAQSection from '../components/FAQSection'
import { RichText } from '../components/RichText'

import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

export default async function AboutUsPage() {
  const payload = await getPayload({ config })
  const page = await getPageBySlug('about-us')
  const layout = page?.layout ?? []

  const heroBlock = layout.find((block) => block.blockType === 'hero')
  const quoteBlock = layout.find((block) => block.blockType === 'quote')

  const richTextBlocks = layout.filter((block) => block.blockType === 'rich-text')
  const imageBlocks = layout.filter((block) => block.blockType === 'image')

  const [
    foundingStoryText, // 1. Background
    reachAndAlumniText, // 2. Qualifications
    bulletPointsText, // 3. Bullet Points
    playersDesc, // 4. Our Players
    teamIntroText, // 5. People Who Keep AYO Running
    leadershipText, // 6. Artistic Leadership
    executiveText, // 7. Executive Committee
    adminText, // 8. Administrator
    alumniDesc, // 9. Alumni
  ] = richTextBlocks

  const [futureImage, leadershipImage] = imageBlocks

  const heroImage = heroBlock?.backgroundImage
  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? ((heroImage as Media).url ?? undefined)
      : '/about-us-hero.jpg'

  const quoteImage = quoteBlock?.image
  const quoteImageUrl =
    typeof quoteImage === 'object' && quoteImage !== null
      ? ((quoteImage as Media).url ?? undefined)
      : undefined

  const futureImageUrl =
    typeof futureImage?.image === 'object' && futureImage.image !== null
      ? ((futureImage.image as Media).url ?? undefined)
      : undefined

  const leadershipImageUrl =
    typeof leadershipImage?.image === 'object' && leadershipImage.image !== null
      ? ((leadershipImage.image as Media).url ?? undefined)
      : undefined

  const { docs: people } = await payload.find({
    collection: 'people',
    depth: 1,
    limit: 1000,
  })

  return (
    <div>
      <Hero
        title="About Us"
        subtitle="Aotearoa's first and original youth orchestra, founded 1948."
        backgroundImage={heroImageUrl}
      />
      <main className="min-h-screen bg-white text-black">
        <AboutUsSection
          foundingStoryText={foundingStoryText?.content}
          reachAndAlumniText={reachAndAlumniText?.content}
          quote={quoteBlock?.text ?? undefined}
          quoteImageUrl={quoteImageUrl}
          quoteCaption={quoteBlock?.caption ?? undefined}
          bannerImageUrl={futureImageUrl}
        />

        {bulletPointsText?.content && (
          <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-10 leading-body text-2xl [&_ul]:list-disc [&_ul]:ml-6">
            <RichText data={bulletPointsText.content} />
          </div>
        )}

        <AboutUsFilter
          people={people}
          playersDesc={playersDesc?.content}
          alumniDesc={alumniDesc?.content}
          teamIntroText={teamIntroText?.content}
          leadershipText={leadershipText?.content}
          leadershipImageUrl={leadershipImageUrl}
          executiveText={executiveText?.content}
          adminText={adminText?.content}
        />

        <FAQSection category="about-us" />
      </main>
    </div>
  )
}
