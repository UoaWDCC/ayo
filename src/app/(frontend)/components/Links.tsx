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
    <section className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-12 pb-[64px]">
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
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
