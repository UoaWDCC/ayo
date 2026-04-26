import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-black text-white">
      <div className="flex items-center gap-8 lg:gap-48 px-8 lg:px-24 py-8 xl:px-28">
        {/* Logo — hard left */}
        <img src="/ayo-logo-white.png" alt="AYO Logo" className="w-36 lg:w-52 h-auto shrink-0" />

        {/* Navbar — expands and pushes to right */}
        <nav className="flex flex-1 items-center justify-between text-xl lg:text-2xl font-semibold xl:px-4">
          <Link href="/" className="hover:opacity-70">
            HOME
          </Link>
          <Link href="/about" className="hover:opacity-70">
            ABOUT US
          </Link>
          <Link href="/concert" className="hover:opacity-70">
            CONCERT & EVENTS
          </Link>
          <Link href="/join" className="hover:opacity-70">
            JOIN AYO
          </Link>
          <Link href="/support" className="hover:opacity-70">
            SUPPORT US
          </Link>
        </nav>
      </div>
    </header>
  )
}
