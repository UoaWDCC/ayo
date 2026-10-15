import React from 'react'
import './styles.css'
import FakeScrollbar from './components/FakeScrollbar'
import SiteShell from './components/SiteShell'
import PageTransitionProvider from './components/PageTransitionProvider'
import SmoothScroll from './components/SmoothScroll'
import { getSocialLinks } from '@/lib/getSiteSettings'

// Payload's Local API reads must run on each request, including date-driven listings.
// Explicit fetch caches (for example the Instagram feed) keep their own lifetimes.
export const revalidate = 0

export const metadata = {
  title: 'Auckland Youth Orchestra',
  description: 'Auckland Youth Orchestra website',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const socialLinks = await getSocialLinks()

  return (
    <html lang="en">
      <body>
        <SmoothScroll />
        <FakeScrollbar target="window" fixed variant="dark" />
        <PageTransitionProvider>
          <SiteShell socialLinks={socialLinks}>{children}</SiteShell>
        </PageTransitionProvider>
      </body>
    </html>
  )
}
