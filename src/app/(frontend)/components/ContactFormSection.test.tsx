import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import ContactFormSection from './ContactFormSection'

afterEach(() => {
  cleanup()
})

const getSubmit = () => screen.getByRole('button', { name: 'Submit' }) as HTMLButtonElement
const getCheckbox = () => screen.getByRole('checkbox') as HTMLInputElement

describe('ContactFormSection consent checkbox', () => {
  it('starts unchecked with Submit disabled', () => {
    render(<ContactFormSection />)

    expect(getCheckbox().checked).toBe(false)
    expect(getSubmit().disabled).toBe(true)
  })

  it('enables Submit once the box is ticked', () => {
    render(<ContactFormSection />)

    fireEvent.click(getCheckbox())

    expect(getCheckbox().checked).toBe(true)
    expect(getSubmit().disabled).toBe(false)
  })

  it('disables Submit again when the box is unticked', () => {
    render(<ContactFormSection />)

    fireEvent.click(getCheckbox())
    fireEvent.click(getCheckbox())

    expect(getCheckbox().checked).toBe(false)
    expect(getSubmit().disabled).toBe(true)
  })

  it('does not toggle the box when the text is clicked', () => {
    render(<ContactFormSection />)

    fireEvent.click(screen.getByText('processing of personal data'))
    fireEvent.click(screen.getByText(/By clicking submit/))

    expect(getCheckbox().checked).toBe(false)
    expect(getSubmit().disabled).toBe(true)
  })

  it('still announces the consent text as the checkbox name', () => {
    render(<ContactFormSection />)

    const named = screen.getByRole('checkbox', {
      name: /By clicking submit, you agree to the processing of personal data/,
    })

    expect(named).toBe(getCheckbox())
  })
})

describe('ContactFormSection agreement pop-up', () => {
  const getLink = () => screen.getByRole('button', { name: 'processing of personal data' })
  const getDialog = () => screen.getByRole('dialog', { name: 'Processing of personal data' })
  const waitForClosed = () => waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

  it('is closed until "processing of personal data" is clicked', () => {
    render(<ContactFormSection />)

    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent.click(getLink())

    expect(getDialog()).toBeTruthy()
  })

  it('shows the agreement text it is given', () => {
    render(<ContactFormSection agreementContent={<p>Agreement written by an admin</p>} />)

    fireEvent.click(getLink())

    expect(screen.getByText('Agreement written by an admin')).toBeTruthy()
  })

  it('shows no body text when there is no agreement text', () => {
    render(<ContactFormSection />)

    fireEvent.click(getLink())

    expect(getDialog().querySelectorAll('p').length).toBe(0)
  })

  it('ticks the box, enables Submit and closes when Agree is pressed', async () => {
    render(<ContactFormSection />)

    fireEvent.click(getLink())
    fireEvent.click(screen.getByRole('button', { name: 'Agree' }))

    expect(getCheckbox().checked).toBe(true)
    expect(getSubmit().disabled).toBe(false)
    await waitForClosed()
  })

  it('closes with the close button without ticking the box', async () => {
    render(<ContactFormSection />)

    fireEvent.click(getLink())
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(getCheckbox().checked).toBe(false)
    expect(getSubmit().disabled).toBe(true)
    await waitForClosed()
  })

  it('closes when the dimmed area outside the card is clicked, without ticking the box', async () => {
    render(<ContactFormSection />)

    fireEvent.click(getLink())
    fireEvent.click(getDialog().parentElement as HTMLElement)

    expect(getCheckbox().checked).toBe(false)
    await waitForClosed()
  })

  it('stays open when the card itself is clicked', () => {
    render(<ContactFormSection />)

    fireEvent.click(getLink())
    fireEvent.click(getDialog())

    expect(getDialog()).toBeTruthy()
  })

  it('closes on Escape without ticking the box', async () => {
    render(<ContactFormSection />)

    fireEvent.click(getLink())
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(getCheckbox().checked).toBe(false)
    await waitForClosed()
  })

  it('returns focus to the link after closing', async () => {
    render(<ContactFormSection />)

    fireEvent.click(getLink())
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    await waitForClosed()
    expect(document.activeElement).toBe(getLink())
  })

  it('keeps the box ticked if it was already agreed and the pop-up is reopened and closed', async () => {
    render(<ContactFormSection />)

    fireEvent.click(getCheckbox())
    fireEvent.click(getLink())
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(getCheckbox().checked).toBe(true)
    expect(getSubmit().disabled).toBe(false)
    await waitForClosed()
  })
})
