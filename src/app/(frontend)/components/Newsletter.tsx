'use client'

import { useState, useEffect, FormEvent, ChangeEvent } from 'react'

type PlayerStatus = 'Yes' | 'No' | ''

interface FormState {
  firstName: string
  lastName: string
  email: string
  isPlayer: PlayerStatus
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

const initialForm: FormState = { firstName: '', lastName: '', email: '', isPlayer: '' }

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
}

function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Reset form state each time the modal is opened fresh
  useEffect(() => {
    if (isOpen) {
      setForm(initialForm)
      setStatus('idle')
      setErrorMsg('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const updateField = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value as FormState[typeof field] }))

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!form.firstName || !form.lastName || !form.email || !form.isPlayer) {
      setStatus('error')
      setErrorMsg('Please fill out all fields.')
      return
    }

    setStatus('submitting')
    setErrorMsg('')

    // TODO: wire this up to Mailchimp (or whatever backend) later.
    setTimeout(() => {
      setStatus('success')
    }, 500)
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.panelStack} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modal}>
          <button style={styles.closeButton} onClick={onClose} aria-label="Close">
            ×
          </button>

          <h2 style={styles.heading}>Newsletter</h2>
          <p style={styles.subtext}>We're glad you want to hear about our concerts.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div style={styles.field}>
              <input
                style={styles.input}
                type="text"
                placeholder="First Name*"
                value={form.firstName}
                onChange={updateField('firstName')}
                required
              />
            </div>

            <div style={styles.field}>
              <input
                style={styles.input}
                type="text"
                placeholder="Last Name*"
                value={form.lastName}
                onChange={updateField('lastName')}
                required
              />
            </div>

            <div style={styles.field}>
              <input
                style={styles.input}
                type="email"
                placeholder="E-mail Address*"
                value={form.email}
                onChange={updateField('email')}
                required
              />
            </div>

            <fieldset style={styles.fieldset}>
              <legend style={styles.legend}>I'm a current or past player in AYO*</legend>
              <p style={styles.helperText}>Select one option.</p>

              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="isPlayer"
                    value="Yes"
                    checked={form.isPlayer === 'Yes'}
                    onChange={updateField('isPlayer')}
                  />
                  <span>Yes, I am a current or past player in AYO.</span>
                </label>

                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="isPlayer"
                    value="No"
                    checked={form.isPlayer === 'No'}
                    onChange={updateField('isPlayer')}
                  />
                  <span>No, I am not.</span>
                </label>
              </div>
            </fieldset>

            {status === 'error' && <p style={styles.error}>{errorMsg}</p>}

            <div style={styles.submitRow}>
              {status === 'success' && (
                <p style={styles.successText}>Thank you! You'll receive an email shortly.</p>
              )}
              <button type="submit" style={styles.button} disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </form>
        </div>

        <div style={styles.bottomBar} />
      </div>
    </div>
  )
}

export default function NewsletterSignupDemo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button style={styles.triggerButton} onClick={() => setIsOpen(true)}>
        Sign Up
      </button>
      <NewsletterModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(20, 20, 20, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 24,
  },
  panelStack: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 540,
  },
  modal: {
    position: 'relative',
    background: '#fff',
    padding: '56px 48px 44px',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  closeButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    border: 'none',
    background: 'transparent',
    fontSize: 28,
    lineHeight: 1,
    cursor: 'pointer',
    color: '#111',
    padding: 4,
  },
  heading: {
    fontSize: 38,
    fontWeight: 400,
    margin: '0 0 10px',
    color: '#111',
  },
  subtext: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
    margin: '0 0 32px',
    lineHeight: 1.5,
  },
  field: { marginBottom: 30 },
  input: {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #ccc',
    padding: '10px 2px',
    fontSize: 16,
    color: '#333',
    outline: 'none',
    background: 'transparent',
    boxSizing: 'border-box',
  },
  fieldset: { border: 'none', padding: 0, margin: '12px 0 28px' },
  legend: { fontSize: 15, fontWeight: 700, color: '#1B2A4A', padding: 0, lineHeight: 1.4 },
  helperText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#999',
    margin: '3px 0 14px',
    lineHeight: 1.5,
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 32,
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    fontSize: 15,
    color: '#222',
    marginBottom: 10,
    cursor: 'pointer',
    lineHeight: 1.5,
  },
  error: { color: '#c0392b', fontSize: 13, margin: '0 0 14px' },
  successText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#555',
    margin: 0,
    marginRight: 'auto',
    paddingRight: 16,
    lineHeight: 1.5,
  },
  submitRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  button: {
    background: '#111',
    color: '#fff',
    border: 'none',
    padding: '14px 32px',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 0.3,
    cursor: 'pointer',
    flexShrink: 0,
  },
  bottomBar: {
    height: 10,
    width: '92%',
    marginLeft: '4%',
    background: '#111',
  },
  triggerButton: {
    background: '#111',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
}
