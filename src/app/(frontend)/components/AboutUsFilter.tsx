'use client'

import { useState } from 'react'
import FilterBox, { type FilterOption } from './FilterBox'

import type { Person } from '@/payload-types'
import OurTeam from './OurTeam'
import Grid from './Grid'

interface AboutUsFilterProps {
  people: Person[]
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

export default function AboutUsFilter({ people }: AboutUsFilterProps) {
  const [filter, setFilter] = useState<FilterOption>('All')

  const players = getPeopleByTypeAndSort(people, 'player')

  const alumni = getPeopleByTypeAndSort(people, 'alumni')

  const team = people.filter((person) => person.type === 'team')
  return (
    <section className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-20 md:pt-[92px] pb-16 md:pb-24 leading-body">
      <div className="flex justify-end">
        <FilterBox selectedOption={filter} onSelectOption={setFilter} />
      </div>

      {(filter === 'All' || filter === 'Team') && <OurTeam team={team} />}
      {(filter === 'All' || filter === 'Players') && (
        <Grid
          title="Players"
          subtitle="The People Who Keep AYO Running"
          people={players}
          desc="AYO brings together some of Aotearoa's most driven young musicians, each one
          committed to the hours of rehearsal, the discipline of the ensemble, and the thrill of of
          coming together to perform seriously ambitious repertoire."
          linkName="Become A Player"
        />
      )}
      {(filter === 'All' || filter === 'Alumni') && (
        <Grid
          title="Alumni"
          people={alumni}
          desc="Look inside almost any professional orchestra in Aotearoa New Zealand (and plenty overseas) and you'll find AYO alumni. Many of our players go on to the New Zealand Symphony Orchestra, the Auckland Philharmonia, conservatory teaching posts, international orchestras and ensembles, and solo and conducting careers. No matter where their professional life takes them, our alumni carry with them lasting friendships and the confidence that comes from channeling absolute focus, hard work, and inspiration into an exceptional collaborative performance. Many of our alumni stay close to AYO for years as mentors, donors, and advocates for the next generation coming through."
          linkName="Join the AYO Alumni Network"
        />
      )}
    </section>
  )
}
