import React from 'react'
import './styles.css'
import FakeScrollbar from './components/FakeScrollbar'
import SiteShell from './components/SiteShell'
import PageTransitionProvider from './components/PageTransitionProvider'

export const metadata = {
  title: 'Auckland Youth Orchestra',
  description: 'Auckland Youth Orchestra website',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <FakeScrollbar target="window" fixed variant="dark" />
        <PageTransitionProvider>
          <SiteShell>{children}</SiteShell>
        </PageTransitionProvider>
      </body>
    </html>
  )
}
