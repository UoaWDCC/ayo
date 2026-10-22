import React from 'react'
import Hero from '../components/Hero'
import { RichText } from '@payloadcms/richtext-lexical/react'
import InfoRowList from '../components/InfoRowList'
import { createIntroConverters } from '../components/richTextConverters'

import { getPageBySlug } from '@/lib/getPageBySlug'
import { resolveHeroImage } from '@/lib/heroImage'

export const metadata = {
  title: 'Policies | Auckland Youth Orchestra',
  description: 'Policies of Auckland Youth Orchestra.',
}

const introConverters = createIntroConverters('')

export default async function PoliciesPage() {
  const page = await getPageBySlug('policies')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = resolveHeroImage(heroBlock?.backgroundImage)
  const content = page?.layout?.filter((block) => block.blockType === 'rich-text') ?? []
  const tables = page?.layout?.filter((block) => block.blockType === 'table') ?? []

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero
        title={heroBlock?.slogan || page?.title || ''}
        subtitle={heroBlock?.subtitle ?? undefined}
        backgroundImage={heroImage}
      />
      <section className="bg-white w-full">
        <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-25 pb-12.5">
          <div className="max-w-[1380px]">
            {content.map((block) => (
              <RichText key={block.id} data={block.content} converters={introConverters} />
            ))}
            {tables.map((block) => (
              <InfoRowList key={block.id} rows={block.rows} className="mt-14" />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
