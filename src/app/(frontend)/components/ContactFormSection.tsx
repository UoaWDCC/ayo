'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import Dropdown from './Dropdown'

const inputClasses =
  'w-full border-0 border-b border-black bg-transparent px-2 pb-3 text-[16px] outline-none'

const queryTypes = ['General enquiry', 'Joining AYO', 'Support AYO', 'Concerts and events']

export default function ContactFormSection() {
  const [queryType, setQueryType] = useState('')

  return (
    <section className="w-full bg-white px-8 py-12.5 text-black md:px-20 lg:px-24">
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
              <span className="block px-2 pb-3 text-[15px] font-semibold">Name*</span>
              <input className={inputClasses} type="text" name="name" aria-label="Name" />
            </label>

            <div className="block">
              <span className="block px-2 pb-3 text-[15px] font-semibold">Query Type*</span>
              <div className="border-b border-black px-2 pb-3 text-[16px]">
                <Dropdown
                  value={queryType}
                  options={queryTypes}
                  onChange={setQueryType}
                  placeholder="Select a query type"
                  fullWidth
                />
              </div>
              <input type="hidden" name="queryType" value={queryType} />
            </div>

            <label className="block">
              <span className="block px-2 pb-3 text-[15px] font-semibold">E-mail Address</span>
              <input
                className={inputClasses}
                type="email"
                name="email"
                aria-label="E-mail Address"
              />
            </label>

            <label className="block">
              <span className="block px-2 pb-3 text-[15px] font-semibold">Message</span>
              <textarea
                className={`${inputClasses} min-h-[112px] resize-none`}
                name="message"
                aria-label="Message"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <label className="flex items-start gap-3 text-[15px] leading-5">
              <input
                type="checkbox"
                name="privacy"
                className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer appearance-none border border-black bg-white checked:bg-black"
              />
              <span>
                By clicking submit, you agree to the{' '}
                <Link href="/policies" className="font-semibold underline">
                  processing of personal data
                </Link>.
              </span>
            </label>

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="bg-black px-8 py-3 text-[15px] font-semibold text-white hover:bg-black/80"
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
