import React from 'react'
import Card from './Card'
import Link from 'next/link'
import type { Person } from '@/payload-types'

type GridProps = {
  title: string
  people: Person[]
  placeholderCount?: number
  desc: string
  linkName: string
}

const Grid = ({ title, people, desc, linkName }: GridProps) => {
  return (
    <section className="mt-5">
      <div className="flex items-start justify-between mb-8">
        <h1 className="text-6xl font-bold leading-none m-0">
          Our <em>{title}</em>
        </h1>
      </div>
      <div className="items-start justify-between mb-8 text-[#2E2E2E]">
        <p className="text-xl mb-4">{desc}</p>
        <p className="text-xl mb-4">Thinking about joining them? Find out what it takes.</p>
        <Link href="/join-us">
          <p className="text-xl font-bold underline text-black">{linkName} ↗</p>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {people.map((person) => (
          <Card
            key={person.id}
            name={person.name}
            subtitle={
              typeof person.role === 'object' && person.role !== null ? person.role.roleName : ''
            }
            imageUrl={
              typeof person.photo === 'object' && person.photo !== null && person.photo.url
                ? person.photo.url
                : ''
            }
          />
        ))}
      </div>
    </section>
  )
}

export default Grid
