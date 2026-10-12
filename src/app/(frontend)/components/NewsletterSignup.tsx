'use client'

import { useState } from 'react'
import Button from './Button'
import StaggerReveal from './StaggerReveal'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')

  return (
    <section className="bg-white text-black w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5">
        <div className="max-w-[1380px]">
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

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  // TODO: replace with actual newsletter API call
                  console.log('subscribing:', email)
                }}
                className="newsletter-fade flex w-full max-w-md flex-wrap items-stretch gap-6"
              >
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                  className="min-w-0 flex-1 border border-[#EBEBEB] bg-transparent px-4 py-3 text-[15px] leading-[18px] text-black outline-none placeholder:text-[#B2B2B2]"
                />

                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </StaggerReveal>
        </div>
      </div>
    </section>
  )
}
