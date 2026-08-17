'use client'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { useState } from 'react'

const socialLinks = [
  { name: 'Instagram', href: '#', Icon: FaInstagram },
  { name: 'YouTube', href: '#', Icon: FaYoutube },
  { name: 'Facebook', href: '#', Icon: FaFacebook },
  { name: 'LinkedIn', href: '#', Icon: FaLinkedin },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  return (
    <footer className="bg-black text-white pb-0 w-full">
      {/* Illusion of rounded bottom of page */}
      <div className="bg-white h-16 rounded-b-[30px] mb-10 w-full"></div>

      {/* Container to separate content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10 md:justify-between items-start px-4">
        {/* Left container */}
        <div className="w-full h-full md:w-1/2">
          <div className="flex flex-row items-center justify-between gap-4 mt-5 md:flex-col md:items-start md:justify-start">
            {/* AYO logo png as placeholder, replace with new logo svg when available */}
            <img
              src="/ayo-logo-white.png"
              alt="AYO Logo"
              className="order-1 w-50 sm:w-40 md:order-2 md:mx-auto md:mt-6 md:w-96 h-auto shrink-0"
            />
            <div className="order-2 flex flex-col items-end md:order-1 md:items-start">
              <div className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-medium">
                Here Plays
              </div>
              <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-medium">
                the Future
              </div>
            </div>
          </div>
        </div>

        {/* Right container */}
        <div className="w-full md:w-1/2 text-left font-semibold">
          <nav className="flex flex-col gap-4 mt-5 mb-6">
            {/* Placeholder links, update with actual paths when available */}
            <div className="flex gap-x-6 gap-y-1 sm:gap-x-10 md:gap-x-20 flex-wrap">
              <Link href="/" className="text-white text-md hover:opacity-70">
                HOME
              </Link>

              <Link href="/about-us" className="text-white text-md hover:opacity-70">
                ABOUT US
              </Link>

              <Link href="/news" className="text-white text-md hover:opacity-70">
                NEWS
              </Link>

              <Link href="/concerts-events" className="text-white text-md hover:opacity-70">
                CONCERT & EVENTS
              </Link>

              <Link href="/join-ayo" className="text-white text-md hover:opacity-70">
                JOIN AYO
              </Link>

              <Link href="/support-us" className="text-white text-md hover:opacity-70">
                SUPPORT US
              </Link>

              <Link href="/contact-us" className="text-white text-md hover:opacity-70">
                CONTACT US
              </Link>

              <Link href="/my-ayo" className="text-white text-md hover:opacity-70">
                MY AYO
              </Link>

              <Link href="/policies" className="text-white text-md hover:opacity-70">
                POLICIES
              </Link>
            </div>
          </nav>

          <div className="flex flex-col gap-4 w-full">
            {/* Social media links, hrefs to be filled in with the real profile URLs */}
            <span className="text-md font-semibold mt-3">CONNECT</span>
            <div className="flex gap-5 mb-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="text-white hover:opacity-70"
                >
                  <social.Icon size={22} aria-hidden="true" />
                </Link>
              ))}
            </div>
            <span className="text-md font-semibold">SUBSCRIBE TO OUR NEWSLETTER</span>
            <div className="flex w-full">
              {/* Simple email input and button for newsletter subscription */}
              <input
                className="bg-white text-black font-semibold focus:outline-none px-4 py-3 flex-1 min-w-0"
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

            <span className="text-md font-semibold mt-6">
              AYO - AUCKLAND YOUTH ORCHESTRA © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
