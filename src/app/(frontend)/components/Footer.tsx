'use client'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { useState } from 'react'
import type { IconType } from 'react-icons'
import type { SocialLink, SocialPlatform } from '@/lib/getSiteSettings'

// The icons stay in code; the profile URLs behind them come from the
// `site-settings` global, so a platform with no URL set renders no icon.
const socialIcons: Record<SocialPlatform, IconType> = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  facebook: FaFacebook,
  linkedin: FaLinkedin,
}

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT US', href: '/about-us' },
  { label: 'NEWS', href: '/news' },
  { label: 'CONCERT & EVENTS', href: '/concerts-events' },
  { label: 'JOIN AYO', href: '/join-ayo' },
  { label: 'SUPPORT US', href: '/support-us' },
  { label: 'CONTACT US', href: '/contact-us' },
  { label: 'MY AYO', href: '/my-ayo' },
  { label: 'POLICIES', href: '/policies' },
]

// Standard design-system hover: fade to 70% opacity.
const linkHover = 'transition-opacity duration-200 hover:opacity-70 motion-reduce:transition-none'

type FooterProps = {
  /** 0 = not yet revealed, 1 = fully revealed. Drives the content's scroll-scrubbed entrance/exit. */
  revealProgress?: number
  /** Social profiles that have a URL set in Payload. */
  socialLinks?: SocialLink[]
}

export default function Footer({ revealProgress = 1, socialLinks = [] }: FooterProps) {
  const [email, setEmail] = useState('')
  return (
    <footer className="bg-black text-white pt-10 pb-0 w-full">
      {/* Container to separate content — fades and slides in step with how much
          of the footer has scrolled into view, and reverses the same way when
          scrolling back up. */}
      <div
        className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10 md:justify-between items-start px-4"
        style={{
          opacity: revealProgress,
          transform: `translateY(${(1 - revealProgress) * 32}px)`,
        }}
      >
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
            <div className="flex gap-x-6 gap-y-1 sm:gap-x-10 md:gap-x-20 flex-wrap">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-white text-md ${linkHover}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex flex-col gap-4 w-full">
            {socialLinks.length > 0 && (
              <>
                <span className="text-md font-semibold mt-3">CONNECT</span>
                <div className="flex gap-5 mb-3">
                  {socialLinks.map((social) => {
                    const Icon = socialIcons[social.platform]
                    return (
                      <Link
                        key={social.platform}
                        href={social.href}
                        aria-label={social.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:opacity-70 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      >
                        <Icon size={22} aria-hidden="true" />
                      </Link>
                    )
                  })}
                </div>
              </>
            )}
            <div>
              <p className="text-md font-semibold mt-1">Sign up to our newsletter</p>
            </div>
            <form
              className="flex w-full gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                // TODO: replace with actual newsletter API call
                console.log('subscribing:', email)
              }}
            >
              <input
                className="bg-white text-black focus:outline-none px-4 py-3 flex-1 min-w-0 placeholder:text-[#B2B2B2]"
                type="email"
                required
                placeholder="Email address"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-white text-black font-semibold px-6 py-3 cursor-pointer border border-white transition-colors hover:bg-white/80"
              >
                Subscribe
              </button>
            </form>

            <span className="text-md font-semibold mt-6">
              AYO - AUCKLAND YOUTH ORCHESTRA © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
