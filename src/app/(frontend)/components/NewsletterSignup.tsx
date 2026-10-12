'use client'

import { useState } from 'react'
import Button from './Button'
import StaggerReveal from './StaggerReveal'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot, must stay empty
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus('success')
        setMessage(data.message ?? 'Almost there! Check your inbox to confirm.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please check your connection and try again.')
    }
  }

  return (
    <section className="bg-white text-black w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5">
        <div>
          <StaggerReveal fadeClass="newsletter-fade">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <h2 className="newsletter-fade font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]">
                  Sign up to our newsletter
                </h2>

                <p className="newsletter-fade mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">
                  Concert announcements, stories and updates from across the AYO community, sent
                  straight to your inbox.
                </p>
              </div>

              <div className="newsletter-fade w-full max-w-md">
                <form onSubmit={handleSubmit} className="flex w-full flex-wrap items-stretch gap-6">
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    className="min-w-0 flex-1 border border-[#EBEBEB] bg-transparent px-4 py-3 text-[15px] leading-[18px] text-black outline-none placeholder:text-[#B2B2B2]"
                  />

                  {/* Honeypot: hidden from people, visible to bots */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />

                  <Button type="submit">
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </form>

                <p
                  role="status"
                  aria-live="polite"
                  className={`mt-3 min-h-5 text-sm ${
                    status === 'error' ? 'text-red-600' : 'text-[#2E2E2E]'
                  }`}
                >
                  {message}
                </p>
              </div>
            </div>
          </StaggerReveal>
        </div>
      </div>
    </section>
  )
}
