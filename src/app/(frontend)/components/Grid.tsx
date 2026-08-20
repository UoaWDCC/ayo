import React from 'react'
import Card from './Card'

export type GridItem = {
  id: string | number
  name: string
  subtitle: string
  imageUrl?: string
}

type GridProps = {
  title: string
  items?: GridItem[]
  placeholderCount?: number
  placeholderSubtitle?: string
}

const Grid = ({ title, items, placeholderCount = 8, placeholderSubtitle = 'Role' }: GridProps) => {
  const displayItems: GridItem[] =
    items ??
    Array.from({ length: placeholderCount }, (_, i) => ({
      id: i,
      name: title,
      subtitle: placeholderSubtitle,
    }))

  return (
    <section className="mx-auto w-full max-w-7xl px-4 md:px-8 md:py-12">
      <div className="flex items-start justify-between mb-8">
        <h1 className="text-6xl font-bold leading-none m-0">
          Our <em>{title}</em>
        </h1>
        <div className="flex items-center gap-1 text-sm mt-2">
          <span className="text-black/40 font-normal">Showing</span>
          <span className="font-bold">{title}</span>
          <span className="text-black font-semibold">&#8249;</span>
        </div>
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
        {displayItems.map((item) => (
          <Card key={item.id} name={item.name} subtitle={item.subtitle} imageUrl={item.imageUrl} />
        ))}
      </div>
    </section>
  )
}

export default Grid
