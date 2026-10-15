import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import CopyEmailButton from './CopyEmailButton'

const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
afterEach(() => {
  cleanup()
  if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor)
  else Reflect.deleteProperty(navigator, 'clipboard')
})

describe('contact email copy action', () => {
  it('copies the email address and confirms only after the copy succeeds', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    render(<CopyEmailButton email="ayo@ayo.org.nz" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy email' }))
    expect(await screen.findByText('Email address copied.')).toBeTruthy()
    expect(writeText).toHaveBeenCalledWith('ayo@ayo.org.nz')
  })
  it('offers manual copying if clipboard access fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('Denied')) },
    })
    render(<CopyEmailButton email="ayo@ayo.org.nz" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy email' }))
    expect(
      await screen.findByText('Copy did not work. Select the email address above to copy it.'),
    ).toBeTruthy()
    expect(screen.queryByText('Email address copied.')).toBeNull()
  })
})
