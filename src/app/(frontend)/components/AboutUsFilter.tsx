'use client'

import { useState } from 'react'
import FilterBox, { type FilterOption } from './FilterBox'

import type { Person } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import OurTeam from './OurTeam'
import Grid from './Grid'
import { RichText } from './RichText'

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

      if (roleA === null && roleB === null) return a.name.localeCompare(b.name)
      if (roleA === null) return 1
      if (roleB === null) return -1

      return roleA - roleB || a.name.localeCompare(b.name)
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

  const players = getPeopleByTypeAndSort(people, 'player')
  const alumni = getPeopleByTypeAndSort(people, 'alumni')
  const team = people.filter((person) => person.type === 'team')

  return (
    <section className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-20 md:pt-[92px] pb-16 md:pb-24 leading-body">
      <div className="flex justify-end">
        <FilterBox selectedOption={filter} onSelectOption={setFilter} />
      </div>

      {(filter === 'All' || filter === 'Players') && (
        <Grid
          title="Players"
          people={players}
          desc={playersDesc ? <RichText data={playersDesc} /> : undefined}
          linkName="Become A Player"
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
        />
      )}
      {(filter === 'All' || filter === 'Alumni') && (
        <Grid
          title="Alumni"
          people={alumni}
          desc={alumniDesc ? <RichText data={alumniDesc} /> : undefined}
          linkName="Join the AYO Alumni Network"
        />
      )}
    </section>
  )
}
