'use client'

import { useState } from 'react'
import FilterBox, { type FilterOption } from './FilterBox'

import type { Person } from '@/payload-types'

interface AboutUsFilterProps {
    people: Person[]
}

export default function AboutUsFilter({people}:AboutUsFilterProps) {
  const [filter, setFilter] = useState<FilterOption>('All')
  
  const players = people.filter(
    (person) => person.type === 'player'
  )

  const alumni = people.filter(
    (person) => person.type === 'alumni'
  )

  const team = people.filter(
    (person) => person.type === 'team'
  )

  return (
    <section className="mx-auto w-full max-w-7xl px-4 md:px-8 md:py-12">
        <div className="flex w-full justify-end">
            <FilterBox selectedOption={filter} onSelectOption={setFilter} />
        </div>
    </section>
)
}