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
      <div className="home font-sans text-center w-4xl">
        <h1 className="text-heading">Placeholder Text</h1>

        <div className="text-body">
          <p>
            Auckland Youth Orchestra is the premier regional youth orchestra in New Zealand. Founded
            in 1948, and originally named the Auckland Junior Symphony Orchestra (or AJSO), it was
            the first youth orchestra established in the Southern Hemisphere. It is designed to
            bridge the gap between school orchestras and adult professional groups. The role of AYO
            is not just to perform concerts but to train future musicians to feed into our national
            ensembles and orchestras. We also play an important audience development role as many of
            our young audience members are likely to be the future supporters of the arts. AYO is a
            vibrant social experience for young people and makes an important contribution to the
            cultural life of Auckland and New Zealand. No other orchestral organisation or
            institution in New Zealand provides such a comprehensive programme to musicians up to
            the age of 26.
          </p>
        </div>
      </div>
    </div>
  )
}
