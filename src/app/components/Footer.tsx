'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  return (
    <footer className="bg-black-100 text-white py-4">
      {/* Container to separate content */}
      <div className="max-w-7xl mx-auto flex justify-between items-start">
        {/* Left container */}
        <div className="container mx-auto text-center mb-4 px-4">
          <p className="text-4xl font-bold">Here Plays </p>
          <p className="text-6xl font-bold"> the Future</p>

          {/* AYO logo png as placeholder, replace with new logo svg when available */}
          <img src="/ayo-logo-white.png" alt="AYO Logo" className="mx-auto mt-4 w-100 h-auto" />
        </div>

        {/* Right container */}
        <div className="container mx-auto text-left">
          <nav className="grid grid-cols-2 gap-y-5 gap-x-20">
            {/* Placeholder links, update with actual paths when available */}
            <Link href="/" className="text-gray-400 hover:text-white mx-2">
              HOME
            </Link>
            <Link href="/about" className="text-gray-400 hover:text-white mx-2">
              ABOUT US
            </Link>
            <Link href="/concert" className="text-gray-400 hover:text-white mx-2">
              CONCERT & EVENTS
            </Link>
            <Link href="/join" className="text-gray-400 hover:text-white mx-2">
              JOIN AYO
            </Link>
            <Link href="/support" className="text-gray-400 hover:text-white mx-2">
              SUPPORT US
            </Link>
          </nav>

          <p className="text-sm">SUBSCRIBE TO OUR NEWSLETTER</p>
          <div className="max-w-lg">
            {/* Simple email input and button for newsletter subscription */}
            <input
              className="bg-white text-black focus:outline-none px-4 py-3 flex-1"
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="bg-white text-black px-4 py-3 cursor-pointer"
              //For demonstration, this just logs the email to the console
              //Replace with actual newsletter API call later
              onClick={() => console.log('subscribing:', email)}
            >
              ›
            </button>
          </div>

          <p className="text-sm">
            AYO - AUCKLAND YOUTH ORCHESTRA &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
