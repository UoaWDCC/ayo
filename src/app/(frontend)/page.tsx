import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="home font-sans w-2xl text-left">
        <h1 className="text-heading font-semibold">Heading</h1>
        <div className="text-muted">Muted Text</div>

        <div className="mt-5 text-[20] leading-body">
          <p>
            Auckland Youth Orchestra is the premier regional youth orchestra in New Zealand. Founded
            in 1948, and originally named the Auckland Junior Symphony Orchestra (or AJSO), it was
            the first youth orchestra established in the Southern Hemisphere. It is designed to
            bridge the gap between school orchestras and adult professional groups.
          </p>
        </div>

        <div className="mt-5 text-body leading-body">
          <p>
            This is standard body text. The Final of the 2025 AYO Soloist Competition was held on
            Sunday, 19 October 2025.  It was an exciting event with the wonderful talent of AYO’s
            players being showcased once more.
          </p>
        </div>

        <div className="mt-5 text-body leading-miniheader">
          <p className="font-semibold">AYO Soloist Competition</p>
          <p>
            {' '}
            This is the line spacing for card components. Apply by 15th of August, 11:59pm
            NZST.{' '}
          </p>
        </div>
      </div>
    </div>
  )
}
