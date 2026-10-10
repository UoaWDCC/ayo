import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
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
