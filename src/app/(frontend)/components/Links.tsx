type LinkItem = {
  name: string
  href: string
}

const LINKS: LinkItem[] = [
  { name: 'Europe Tour Photos - Google Drive', href: 'https://google.com' },
  { name: 'AYO 2026 - Google Calendar', href: 'https://google.com' },
]

export default function LinksSection() {
  return (
    <section className="px-6 sm:px-12 lg:px-16 py-12">
      <h2 className="font-semibold text-[40px] leading-[48px] text-black mb-[22px]">Links</h2>

      <div className="border-t border-[#EBEBEB]">
        {LINKS.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between border-b border-[#EBEBEB] py-4 group"
          >
            <span className="flex items-center gap-2 text-[15px] leading-[18px] text-black underline">
              {link.name}
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                className="rotate-180 transition-transform group-hover:rotate-0"
              >
                <path
                  d="M2 2L11 11M11 11V3M11 11H3"
                  stroke="#1E1E1E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
