import { getPayload } from 'payload'
import config from '@payload-config'

export default async function LinksSection() {
  const payload = await getPayload({ config })

  const links = await payload.find({
    collection: 'link',
    where: {
      category: {
        equals: 'links',
      },
    },
  })

  return (
    <section className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-12 pb-[64px]">
      <h2 className="font-semibold text-[40px] leading-[48px] text-black mb-[22px]">Links</h2>

      <div className="border-t border-[#EBEBEB]">
        {links.docs.map((link) => (
          <a
            key={link.name}
            href={link.url}
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
