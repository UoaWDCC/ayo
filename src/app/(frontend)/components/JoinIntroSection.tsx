'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import InfoRowList, { type TableRow } from './InfoRowList'
import StaggerReveal from './StaggerReveal'
import { createIntroConverters } from './richTextConverters'

{
  /* Maps the original Tailwind CSS from the hardcoded values to the RichText injection */
}
const introConverters = createIntroConverters('intro-fade')

const JoinIntroSection = ({
  introText,
  introRows,
}: {
  introText: SerializedEditorState
  introRows: TableRow[]
}) => {
  return (
    <section className="bg-white text-black w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-25 pb-12.5">
        <div className="max-w-[1380px]">
          <StaggerReveal fadeClass="intro-fade">
            <RichText data={introText} converters={introConverters} />
          </StaggerReveal>

          <InfoRowList rows={introRows} className="mt-14" />
        </div>
      </div>
    </section>
  )
}

export default JoinIntroSection
