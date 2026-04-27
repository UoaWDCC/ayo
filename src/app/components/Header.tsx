import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-black text-white">
      <div className="flex flex-col lg:flex-row items-center justify-between px-8 lg:px-24 py-8 xl:px-28 gap-4 lg:gap-0">
        <img src="/ayo-logo-white.png" alt="AYO Logo" className="w-36 lg:w-52 h-auto shrink-0" />

        <nav className="flex flex-wrap justify-center lg:justify-end gap-4 lg:gap-10 xl:gap-14 lg:ml-16 items-center text-sm lg:text-xl xl:text-2xl font-semibold">
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
