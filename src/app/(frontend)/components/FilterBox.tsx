'use client'

import React from 'react'

export type FilterOption = 'All' | 'Players' | 'Alumni' | 'Team'

interface FilterBoxProps {
  selectedOption: FilterOption
  onSelectOption: (option: FilterOption) => void
}

export default function FilterBox({ selectedOption, onSelectOption }: FilterBoxProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    const options: FilterOption[] = ['All', 'Players', 'Alumni', 'Team']

    const handleFilterOptionClick = (option: FilterOption) => {
        onSelectOption(option)
        setIsOpen(false)
    }

    return (
        <div className="relative inline-block">
            {/* Closed state filter text */}
            <div className="flex items-center gap-1 text-sm mt-2">
                <span className="text-black/40 font-normal">Showing</span>
                <button onClick={() => setIsOpen(!isOpen)} className="text-black font-semibold">
                    <span className="font-bold">{selectedOption}</span> &#8249;
                </button>
            </div>

            {/* Open state overlaying filter box */}
            {isOpen && (
                <div className="absolute right-0 top-0 z-50 min-w-[220px] bg-black p-6 text-white">
                    {/* Close button */}
                    <button onClick={()=> setIsOpen(false)} className="absolute right-3 top-3 text-xl">x</button>

                    {/* Filter Options */}
                    <div className="mt-6 flex flex-col gap-4">
                        {options.map((option) => (
                            <button key={option} onClick={()=> handleFilterOptionClick(option)} className="text-left text-lg">
                                {option}
                            </button>
                        ))}
                    </div>

                </div>
            )}
            
        </div>
    )
}