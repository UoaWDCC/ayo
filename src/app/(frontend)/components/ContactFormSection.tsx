'use client'

import React, { useId, useState } from 'react'

const inputClasses =
  'w-full border-0 border-b border-black bg-transparent px-2 pb-3 text-[16px] outline-none'

export default function ContactFormSection() {
  const [agreed, setAgreed] = useState(false)
  const consentTextId = useId()

  return (
    <section className="w-full bg-white px-8 py-20 text-black md:px-20 lg:px-24 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col justify-between gap-20">
          <div>
            <h2 className="text-[30px] font-semibold leading-tight">
              Still can&apos;t find your answer?
            </h2>
            <p className="mt-6 max-w-[260px] text-[21px] leading-[1.08]">
              Let us know via our contact form.
            </p>
          </div>

          <address className="not-italic">
            <h3 className="text-[16px] font-semibold">Postal Address</h3>
            <p className="mt-3 text-[15px] leading-6">PO Box 99830, Newmarket, Auckland 1149</p>
          </address>
        </div>

        <form className="w-full" aria-label="Contact form">
          <div className="grid gap-9">
            <label className="block">
              <span className="block px-2 pb-3 text-[15px]">Name*</span>
              <input className={inputClasses} type="text" name="name" aria-label="Name" />
            </label>

            <label className="block">
              <span className="block px-2 pb-3 text-[15px]">Query Type*</span>
              <select
                className={inputClasses}
                name="queryType"
                aria-label="Query Type"
                defaultValue=""
              >
                <option value="" disabled />
                <option value="general">General enquiry</option>
                <option value="join">Joining AYO</option>
                <option value="support">Supporting AYO</option>
                <option value="concerts">Concerts and events</option>
              </select>
            </label>

            <label className="block">
              <span className="block px-2 pb-3 text-[15px]">E-mail Address</span>
              <input
                className={inputClasses}
                type="email"
                name="email"
                aria-label="E-mail Address"
              />
            </label>

            <label className="block">
              <span className="block px-2 pb-3 text-[15px]">Message</span>
              <textarea
                className={`${inputClasses} min-h-[112px] resize-none`}
                name="message"
                aria-label="Message"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3 text-[15px] leading-5">
              <span className="relative mt-0.5 h-5 w-5 shrink-0">
                <input
                  type="checkbox"
                  name="privacy"
                  aria-labelledby={consentTextId}
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none border border-black bg-white checked:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                />
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 hidden h-5 w-5 text-white peer-checked:block"
                >
                  <path d="M5 10.5l3.5 3.5L15 6.5" />
                </svg>
              </span>
              <span id={consentTextId}>
                By clicking submit, you agree to the{' '}
                <span className="font-semibold underline">processing of personal data</span>.
              </span>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                disabled={!agreed}
                className="bg-black px-8 py-3 text-[15px] font-semibold text-white enabled:hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
