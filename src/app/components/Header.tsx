import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-black text-white">
      {/* Container to separate content */}
      <div className="flex items-center px-6 py-8">
        {/* Left container */}
        <div>
          {/* AYO logo png as placeholder, replace with new logo svg when available */}
          <img src="/ayo-logo-white.png" alt="AYO Logo" className="w-50 h-auto ml-20" />
        </div>

        {/* Right Navbar */}
        <nav className="flex flex-1 ml-100 mr-40 justify-between text-2xl font-semibold">
          <Link href="/" className="text-white hover:opacity-70">
            HOME
          </Link>
          <Link href="/about" className="text-white hover:opacity-70">
            ABOUT US
          </Link>
          <Link href="/concert" className="text-white hover:opacity-70">
            CONCERT & EVENTS
          </Link>
          <Link href="/join" className="text-white hover:opacity-70">
            JOIN AYO
          </Link>
          <Link href="/support" className="text-white hover:opacity-70">
            SUPPORT US
          </Link>
        </nav>
      </div>
    </header>
  )
}
