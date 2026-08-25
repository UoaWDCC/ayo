import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import EventCard, { type EventCardData } from './EventCard'

afterEach(() => {
  cleanup()
})

const event: EventCardData = {
  id: 1,
  title: 'Séjourné, Bizet & Dvorak',
  subtitle: 'Sun, 21 June · Auckland Town Hall',
  image: '/hero-placeholder.jpg',
  description: 'A programme shaped by the vivid colour of Georges Bizet.',
  performances: [{ time: '19:30', date: 'Sunday, 21 June', venue: 'Auckland Town Hall' }],
  links: [{ label: 'Recordings', href: '/recordings' }],
  photosAvailable: true,
  ctaLabel: 'See Now',
  ctaHref: '/see-now',
}

describe('EventCard', () => {
  it('renders the card summary and does not show panel content until opened', () => {
    render(<EventCard event={event} />)

    expect(screen.getByText(event.title)).toBeTruthy()
    expect(screen.getByText(event.subtitle)).toBeTruthy()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens the side panel with performance details when the card is clicked', () => {
    render(<EventCard event={event} />)

    fireEvent.click(screen.getByRole('button', { name: new RegExp(event.title) }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeTruthy()
    expect(screen.getByText('Times:')).toBeTruthy()
    expect(screen.getByText('Sunday, 21 June')).toBeTruthy()
    expect(screen.getByText(/See Now/)).toBeTruthy()
  })

  it('closes the panel when the close button is clicked', async () => {
    render(<EventCard event={event} />)

    fireEvent.click(screen.getByRole('button', { name: new RegExp(event.title) }))
    expect(screen.getByRole('dialog')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    // panel unmounts after its exit transition, so wait for it rather than asserting instantly
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('closes the panel on Escape', async () => {
    render(<EventCard event={event} />)

    fireEvent.click(screen.getByRole('button', { name: new RegExp(event.title) }))
    expect(screen.getByRole('dialog')).toBeTruthy()

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })
})
