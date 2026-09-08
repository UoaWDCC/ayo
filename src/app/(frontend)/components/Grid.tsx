import React from 'react'
import Card from './Card'

import type { Person } from '@/payload-types'


type GridProps = {
  title: string
  people: Person[]
  placeholderCount?: number
  placeholderSubtitle?: string
}


const Grid = ({title, people}: GridProps) => {

  return (
    <section className="mx-auto w-full max-w-7xl px-4 md:px-8 md:py-12">
      <div className="flex items-start justify-between mb-8">
        <h1 className="text-6xl font-bold leading-none m-0">
          Our <em>{title}</em>
        </h1>
      </div>
      <div className="items-start justify-between mb-8">
        <h2 className="text-2xl font-bold mb-8">The People Who Keep AYO Running</h2>
        <p className="text-xl mb-4">
          AYO brings together some of Aotearoa&apos;s most driven young musicians, each one
          committed to the hours of rehearsal, the discipline of the ensemble, and the thrill of of
          coming together to perform seriously ambitious repertoire.
        </p>
        <p className="text-xl mb-4">Thinking about joining them? Find out what it takes.</p>
        <p className="text-xl font-bold underline">Become A Player</p>
      </div>

      <div className="grid grid-cols-4 gap-8">
        {people.map((person) => (
          <Card key={person.id} name={person.name} 
            subtitle={
              typeof person.role === 'object' && person.role !== null
              ? person.role.roleName: ''} 
            imageUrl={
              typeof person.photo === 'object' && person.photo !== null && person.photo.url
                ? person.photo.url
                : ''
            } />
        ))}
      </div>
    </section>
  )
}

export default Grid
