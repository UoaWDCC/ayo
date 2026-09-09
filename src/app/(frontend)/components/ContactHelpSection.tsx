'use client'

import { useState } from 'react'
import ContactFormSection from './ContactFormSection'
import SquareLinkGrid, { type SquareLinkGridItem } from './SquareLinkGrid'

type ContactHelpSectionProps = {
  title: string
  description?: string
  items: SquareLinkGridItem[]
}

export default function ContactHelpSection({ title, description, items }: ContactHelpSectionProps) {
  const [showForm, setShowForm] = useState(false)

  if (showForm) {
    return <ContactFormSection onBack={() => setShowForm(false)} />
  }

  const itemsWithFallback: SquareLinkGridItem[] = [
    ...items,
    {
      id: 'none-apply',
      title: 'None of these\napply',
      onClick: () => setShowForm(true),
    },
  ]

  return (
    <SquareLinkGrid
      title={title}
      description={description}
      items={itemsWithFallback}
      footer={
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="text-[15px] font-semibold underline hover:opacity-70"
        >
          Just go to contact form →
        </button>
      }
    />
  )
}
