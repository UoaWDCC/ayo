import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export type SquareLinkGridItem = {
  id: string | number
  title: string
  href?: string
  onClick?: () => void
  imageAlt?: string
  imageSrc?: string
}

type SquareLinkGridProps = {
  title: string
  description?: string
  items: SquareLinkGridItem[]
  /** Rendered below the grid, inside the same padded container (e.g. a fallback link). */
  footer?: React.ReactNode
}

const cardClasses =
  'flex min-h-[244px] w-full flex-col items-center justify-center rounded-lg border border-[#EBEBEB] bg-white px-8 py-8 text-center transition hover:border-[#D6D6D6] hover:shadow-sm'

export default function SquareLinkGrid({ title, description, items, footer }: SquareLinkGridProps) {
  return (
    <section className="w-full bg-white text-black">
      <div className="px-4 py-14 sm:px-8 md:px-24">
        <h2 className="font-semibold text-[40px] leading-[48px] text-black">{title}</h2>
        {description && (
          <p className="mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">{description}</p>
        )}

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <SquareLinkCard key={item.id} item={item} />
          ))}
        </div>

        {footer && <div className="mt-10">{footer}</div>}
      </div>
    </section>
  )
}

function SquareLinkCard({ item }: { item: SquareLinkGridItem }) {
  const content = (
    <>
      <div className="relative h-[88px] w-[114px] bg-[#D9D9D9]">
        {item.imageSrc && (
          <Image
            src={item.imageSrc}
            alt={item.imageAlt ?? item.title}
            fill
            sizes="114px"
            className="object-cover"
          />
        )}
      </div>
      <h3 className="mt-7 max-w-[180px] whitespace-pre-line text-[25px] font-semibold leading-[1.08]">
        {item.title}
      </h3>
    </>
  )

  if (item.href) {
    return (
      <Link href={item.href} className={cardClasses}>
        {content}
      </Link>
    )
  }

  if (item.onClick) {
    return (
      <button type="button" onClick={item.onClick} className={cardClasses}>
        {content}
      </button>
    )
  }

  return <div className={cardClasses}>{content}</div>
}
