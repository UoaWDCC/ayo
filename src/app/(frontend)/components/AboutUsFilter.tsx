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
  return people.filter(
    (person) => person.type === type,
  ).sort((a, b) => {
    const roleA = typeof a.role === 'object' && a.role !== null ? a.role.sortOrder : null
    const roleB = typeof b.role === 'object' && b.role !== null ? b.role.sortOrder : null

    if (roleA === null && roleB === null) return a.name.localeCompare(b.name)
    if (roleA === null) return 1
    if (roleB === null) return -1

    return roleA - roleB || a.name.localeCompare(b.name)
  })
}

export default function AboutUsFilter({people}:AboutUsFilterProps) {
  const [filter, setFilter] = useState<FilterOption>('All')
  
  const players = getPeopleByTypeAndSort(people, 'player')

  const alumni = getPeopleByTypeAndSort(people, 'alumni')

  const team = people.filter(
    (person) => person.type === 'team'
  )
  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 md:px-8 md:py-12">
          <div className="flex w-full justify-end">
              <FilterBox selectedOption={filter} onSelectOption={setFilter} />
          </div>
      </section>

    
      {(filter === 'All' || filter === 'Team') && (<OurTeam team={team}/>)}
      {(filter === 'All' || filter === 'Players') && (<Grid title="Players" placeholderSubtitle="Name" people={players} />)}
      {(filter === 'All' || filter === 'Alumni') && (<Grid title="Alumni" placeholderSubtitle="Name" people={alumni} />)}
   
    </>
)
}