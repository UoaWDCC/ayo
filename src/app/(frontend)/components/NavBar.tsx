import Link from 'next/link'

type HeaderProps = {
  variant?: 'light' | 'dark'
}

export default function Header({ variant = 'light' }: HeaderProps) {
  const isDark = variant === 'dark'

  return (
    <header className={isDark ? 'bg-black text-white' : 'bg-white text-black'}>
      <div className="flex flex-col lg:flex-row items-center justify-between px-8 lg:px-24 py-8 xl:px-28 gap-4 lg:gap-0">
        <img
          src={isDark ? '/ayo-logo-white.png' : '/ayo-logo-black-bgwhite.png'}
          alt="AYO Logo"
          className="w-36 lg:w-52 h-auto shrink-0"
        />

        {/* <nav className="flex flex-wrap justify-center lg:justify-end gap-4 lg:gap-10 xl:gap-14 lg:ml-16 items-center text-sm lg:text-xl xl:text-2xl font-semibold"> */}
        <nav className="flex flex-wrap justify-center lg:justify-end gap-4 lg:gap-6 xl:gap-10 lg:ml-8 xl:ml-16 items-center text-base lg:text-lg xl:text-xl font-semibold">
          <Link href="/" className="hover:opacity-70">
            HOME
          </Link>
          <Link href="/about-us" className="hover:opacity-70">
            ABOUT US
          </Link>
          <Link href="/concerts-events" className="hover:opacity-70">
            CONCERT & EVENTS
          </Link>
          <Link href="/join-ayo" className="hover:opacity-70">
            JOIN AYO
          </Link>
          <Link href="/support-us" className="hover:opacity-70">
            SUPPORT US
          </Link>
          <Link href="/contact-us" className="hover:opacity-70">
            CONTACT US
          </Link>
        </nav>
      </div>
    </header>
  )
}
