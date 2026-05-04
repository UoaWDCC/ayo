import React from 'react'
import './styles.css'
import Header from './components/NavBar'
import Footer from './components/Footer'

export const metadata = {
  title: 'Auckland Youth Orchestra',
  description: 'Auckland Youth Orchestra website',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
