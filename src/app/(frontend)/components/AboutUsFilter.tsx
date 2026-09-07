'use client'

import { useState } from 'react'
import FilterBox, { type FilterOption } from './FilterBox'

export default function AboutUsFilter() {
  const [filter, setFilter] = useState<FilterOption>('All')

  return (
    <section className="mx-auto w-full max-w-7xl px-4 md:px-8 md:py-12">
        <div className="flex w-full justify-end">
            <FilterBox selectedOption={filter} onSelectOption={setFilter} />
        </div>
    </section>
)
}