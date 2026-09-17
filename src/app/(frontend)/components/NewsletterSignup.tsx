'use client'

import { useState } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')

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

        <form
          onSubmit={(e) => {
            e.preventDefault()
            // TODO: replace with actual newsletter API call
            console.log('subscribing:', email)
          }}
          className="flex w-full max-w-md border border-[#EBEBEB]"
        >
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-black outline-none placeholder:text-[#B2B2B2]"
          />

          <button
            type="submit"
            className="cursor-pointer bg-black px-6 py-3 font-semibold text-white transition-opacity hover:opacity-80"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}
