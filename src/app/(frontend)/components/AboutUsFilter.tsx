'use client'

import { useState } from 'react'
import FilterBox, { type FilterOption } from './FilterBox'

import type { Person } from '@/payload-types'
import OurTeam from './OurTeam'
import Grid from './Grid'

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
  const playerItems = [
    {
      id: 1,
      name: 'Frances Liu',
      subtitle: 'Cellist',
      imageUrl: 'players/Cello_Frances Liu.jpg',
    },
    {
      id: 2,
      name: 'Damon Herlihy-O’Brien',
      subtitle: 'Cellist',
      imageUrl: 'players/Cello_Damon Herlihy-O_Brien.jpg',
    },
    {
      id: 3,
      name: 'Ashley Ling',
      subtitle: 'Cellist',
      imageUrl: 'players/Cello_Ashley Ling.jpg',
    },
    {
      id: 4,
      name: 'Joy Shi',
      subtitle: 'Bassoonist',
      imageUrl: 'players/Bassoon_Joy Shi.jpg',
    },
    {
      id: 5,
      name: 'Harper Zhang',
      subtitle: 'Cellist',
      imageUrl: 'players/Cello_Harper Zhang.jpg',
    },
    {
      id: 6,
      name: 'Harry Kim',
      subtitle: 'Cellist',
      imageUrl: 'players/Cello_Harry Kim.jpg',
    },
    {
      id: 7,
      name: 'Howard Lu',
      subtitle: 'Cellist',
      imageUrl: 'players/Cello_Howard Lu.jpg',
    },
    {
      id: 8,
      name: 'Elvies Hu',
      subtitle: 'Cellist',
      imageUrl: 'players/Cello_Elvies Hu.jpg',
    },
  ]

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 md:px-8 md:py-12">
          <div className="flex w-full justify-end">
              <FilterBox selectedOption={filter} onSelectOption={setFilter} />
          </div>
      </section>

    
      {(filter === 'All' || filter === 'Team') && (<OurTeam/>)}
      {(filter === 'All' || filter === 'Players') && (<Grid title="Players" placeholderSubtitle="Name" items={playerItems} />)}
      {(filter === 'All' || filter === 'Alumni') && (<Grid title="Alumni" placeholderSubtitle="Name" items={playerItems} />)}
   
    </>
)
}