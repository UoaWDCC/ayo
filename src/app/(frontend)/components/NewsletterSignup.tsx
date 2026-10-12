'use client'

import { useState } from 'react'
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
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-8 md:pt-10 pb-16 md:pb-20 border-t border-[#EBEBEB] flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B2B2B2]">
            Stay in the loop
          </p>

          <h2 className="mt-3 font-semibold text-[32px] md:text-[40px] leading-[40px] md:leading-[48px]">
            Sign up to our newsletter
          </h2>

          <p className="mt-4 max-w-md text-[16px] leading-6 text-[#2E2E2E]">
            Get concert announcements, stories, and updates from across the AYO community sent
            straight to your inbox.
          </p>
        </div>

        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="flex w-full border border-[#EBEBEB]">
            <input
              type="email"
              required
              placeholder="Email address"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-black outline-none placeholder:text-[#B2B2B2]"
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

            <button
              type="submit"
              disabled={status === 'loading'}
              className="cursor-pointer bg-black px-6 py-3 font-semibold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
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
    </section>
  )
}
