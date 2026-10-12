'use client'

import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Button from './Button'
import Card from './Card'
import StaggerReveal from './StaggerReveal'
import { createSubsectionConverters } from './richTextConverters'
import type { Person } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type GridProps = {
  title: string
  /** Italic muted sub-line that pairs with the heading. */
  subtitle: string
  people: Person[]
  /** Section copy from Payload. */
  desc?: SerializedEditorState
  linkName: string
  linkHref: string
  /** Left-hand label in each person panel's bottom bar. */
  panelNote: string
  /** Fade class for this section's reveal — one per section. */
  fadeClass: string
  /**
   * The grid mounted because the viewer changed the filter, so `AboutUsFilter`
   * is already playing the shorter re-entry over the whole section. Skip the
   * scroll reveal rather than running both.
   */
  skipReveal?: boolean
}

const Grid = ({
  title,
  subtitle,
  people,
  desc,
  linkName,
  linkHref,
  panelNote,
  fadeClass,
  skipReveal = false,
}: GridProps) => {
  const lead = (
    <>
      <h2
        className={`${fadeClass} font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]`}
      >
        Our <em>{title}</em>
      </h2>

      <p className={`${fadeClass} mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic`}>
        {subtitle}
      </p>

      {desc && (
        <div className="mt-8">
          <RichText data={desc} converters={createSubsectionConverters(fadeClass)} />
        </div>
      )}

      <Button href={linkHref} className={`${fadeClass} mt-8`}>
        {linkName}
      </Button>
    </>
  )

  return (
    <div className="about-filter-section">
      <StaggerReveal fadeClass={fadeClass} active={!skipReveal}>
        {lead}
      </StaggerReveal>

      {/* Tighter stagger than a section reveal: these grids run to dozens of cards. */}
      <StaggerReveal
        fadeClass={`${fadeClass}-card`}
        stagger={0.04}
        active={!skipReveal}
        className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-8"
      >
        {people.map((person) => (
          <Card
            key={person.id}
            fadeClass={`${fadeClass}-card`}
            person={{
              name: person.name,
              role:
                typeof person.role === 'object' && person.role !== null
                  ? person.role.roleName
                  : undefined,
              imageUrl:
                typeof person.photo === 'object' && person.photo !== null && person.photo.url
                  ? person.photo.url
                  : undefined,
              description: person.description ?? undefined,
              years: person.years,
              footerNote: panelNote,
              ctaLabel: linkName,
              ctaHref: linkHref,
            }}
          />
        ))}
      </StaggerReveal>
    </div>
  )
}

export default Grid
