'use client'

import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import Dropdown from './Dropdown'
import OurTeam from './OurTeam'
import Grid from './Grid'

import type { Person } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { compareOrdered } from '@/lib/ordering'

export type FilterOption = 'All' | 'Players' | 'Alumni' | 'Team'

const FILTER_OPTIONS: FilterOption[] = ['All', 'Players', 'Alumni', 'Team']

interface AboutUsFilterProps {
  people: Person[]
  playersDesc?: SerializedEditorState
  alumniDesc?: SerializedEditorState
  teamIntroText?: SerializedEditorState
  leadershipText?: SerializedEditorState
  leadershipImageUrl?: string
  executiveText?: SerializedEditorState
  adminText?: SerializedEditorState
}

function getPeopleByTypeAndSort(people: Person[], type: Person['type']) {
  return people
    .filter((person) => person.type === type)
    .sort((a, b) => {
      const roleA = typeof a.role === 'object' && a.role !== null ? a.role.sortOrder : null
      const roleB = typeof b.role === 'object' && b.role !== null ? b.role.sortOrder : null

      if (roleA === null && roleB === null) return compareOrdered(a, b)
      if (roleA === null) return 1
      if (roleB === null) return -1

      return roleA - roleB || compareOrdered(a, b)
    })
}

export default function AboutUsFilter({
  people,
  playersDesc,
  alumniDesc,
  teamIntroText,
  leadershipText,
  leadershipImageUrl,
  executiveText,
  adminText,
}: AboutUsFilterProps) {
  const [filter, setFilter] = useState<FilterOption>('All')
  // Once the viewer has touched the filter, the sections animate as a group here
  // rather than replaying their own scroll reveals on every remount.
  const [hasFiltered, setHasFiltered] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const players = getPeopleByTypeAndSort(people, 'player')
  const alumni = getPeopleByTypeAndSort(people, 'alumni')
  const team = people.filter((person) => person.type === 'team')

  // Filter-change re-entry: shorter than the first reveal, as on the Concerts
  // and News lists.
  useEffect(() => {
    if (!hasFiltered) return
    const el = resultsRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const sections = el.querySelectorAll('.about-filter-section')
    if (sections.length === 0) return

    gsap.killTweensOf(sections)
    gsap.fromTo(
      sections,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out',
        overwrite: true,
        clearProps: 'opacity,transform',
      },
    )
  }, [filter, hasFiltered])

  const handleSelectOption = (option: FilterOption) => {
    setHasFiltered(true)
    setFilter(option)
  }

  return (
    <section className="bg-white w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5 leading-body">
        <div className="relative z-30 flex flex-wrap items-center gap-8 text-[15px] leading-[18px]">
          <Dropdown
            label="Showing"
            value={filter}
            options={FILTER_OPTIONS}
            onChange={(value) => handleSelectOption(value as FilterOption)}
          />
        </div>
        <hr className="border-[#EBEBEB] mt-6" />

        <div ref={resultsRef} className="mt-14 [&>*+*]:mt-14">
          {(filter === 'All' || filter === 'Players') && (
            <Grid
              title="Players"
              /* TODO: move these sub-lines into Payload alongside each section's rich text. */
              subtitle="The young musicians who make up the orchestra this season."
              people={players}
              desc={playersDesc}
              linkName="Become A Player"
              linkHref="/join-ayo"
              panelNote="AYO player."
              fadeClass="players-fade"
              skipReveal={hasFiltered}
            />
          )}
          {(filter === 'All' || filter === 'Team') && (
            <OurTeam
              team={team}
              introText={teamIntroText}
              leadershipText={leadershipText}
              leadershipImageUrl={leadershipImageUrl}
              executiveText={executiveText}
              adminText={adminText}
              skipReveal={hasFiltered}
            />
          )}
          {(filter === 'All' || filter === 'Alumni') && (
            <Grid
              title="Alumni"
              subtitle="Players who came through AYO and went on to music and beyond."
              people={alumni}
              desc={alumniDesc}
              linkName="Join the AYO Alumni Network"
              linkHref="/join-ayo"
              panelNote="AYO alumni."
              fadeClass="alumni-fade"
              skipReveal={hasFiltered}
            />
          )}
        </div>
      </div>
    </section>
  )
}
