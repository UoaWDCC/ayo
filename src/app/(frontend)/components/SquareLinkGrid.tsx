import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export type SquareLinkGridItem = {
  id: string | number
  title: string
  href?: string
  imageAlt?: string
  imageSrc?: string
}

type SquareLinkGridProps = {
  title: string
  description?: string
  items: SquareLinkGridItem[]
}

const cardClasses =
  'flex min-h-[244px] w-full flex-col items-center justify-center rounded-lg border border-[#EBEBEB] bg-white px-8 py-8 text-center transition hover:border-[#D6D6D6] hover:shadow-sm'

export default function SquareLinkGrid({ title, description, items }: SquareLinkGridProps) {
  return (
    <section className="w-full bg-white px-8 py-16 text-black md:px-20 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-[30px] font-semibold leading-tight">{title}</h2>
        {description && <p className="mt-5 text-[24px] leading-tight">{description}</p>}

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <SquareLinkCard key={item.id} item={item} />
          ))}
        </div>
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

  return <div className={cardClasses}>{content}</div>
}
