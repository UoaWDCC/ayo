'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  return (
    <footer className="bg-black text-white py-4">
      {/* Illusion of rounded bottom of page */}
      <div className="bg-white h-16 rounded-b-[30px] mb-10"></div>

      {/* Container to separate content */}
      <div className="max-w-7xl mx-auto flex justify-between items-start">
        {/* Left container */}
        <div className="container mx-auto text-center mb-4 px-4">
          <div className="text-4xl font-medium">Here Plays</div>
          <div className="text-7xl font-medium ml-50">the Future</div>

          {/* AYO logo png as placeholder, replace with new logo svg when available */}
          <img src="/ayo-logo-white.png" alt="AYO Logo" className="mx-auto mt-auto w-100 h-auto" />
        </div>

        {/* Right container */}
        <div className="container mx-auto text-left font-semibold px-4">
          <nav className="flex flex-col gap-4 mb-6">
            {/* Placeholder links, update with actual paths when available */}
            <div className="flex gap-20">
              <Link href="/" className="text-white text-lg hover:opacity-70">
                HOME
              </Link>
              <Link href="/about" className="text-white text-lg hover:opacity-70">
                ABOUT US
              </Link>
            </div>
            <div>
              <Link href="/concert" className="text-white text-lg hover:opacity-70">
                CONCERT & EVENTS
              </Link>
            </div>
            <div className="flex gap-20">
              <Link href="/join" className="text-white text-lg hover:opacity-70">
                JOIN AYO
              </Link>
              <Link href="/support" className="text-white text-lg hover:opacity-70">
                SUPPORT US
              </Link>
            </div>
          </nav>

          <div className="flex flex-col gap-4 w-full">
            <span className="text-lg font-semibold">SUBSCRIBE TO OUR NEWSLETTER</span>
            <div className="flex w-full">
              {/* Simple email input and button for newsletter subscription */}
              <input
                className="bg-white text-black font-semibold focus:outline-none px-4 py-3 flex-1"
                type="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="bg-white text-black font-semibold px-4 py-3 cursor-pointer border-l border-gray-300"
                //For demonstration, this just logs the email to the console
                //Replace with actual newsletter API call later
                onClick={() => console.log('subscribing:', email)}
              >
                ›
              </button>
            </div>

            <span className="text-lg font-semibold">
              AYO - AUCKLAND YOUTH ORCHESTRA © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
