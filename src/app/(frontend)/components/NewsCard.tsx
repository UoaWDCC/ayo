'use client'

import { gsap } from 'gsap'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

interface NewsCardProps {
  title: string
  date: string
  description: string
  type: string
  author: string
  slug: string
}

const NewsCard = ({ title, date, description, type, author }: NewsCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const image = imageRef.current
    if (!card || !image) return

    const onEnter = () => {
      gsap.to(card, { y: -4, duration: 0.25, ease: 'power2.out' })
      gsap.to(image, { scale: 1.05, duration: 0.4, ease: 'power2.out' })
    }
    const onLeave = () => {
      gsap.to(card, { y: 0, duration: 0.25, ease: 'power2.in' })
      gsap.to(image, { scale: 1, duration: 0.4, ease: 'power2.in' })
    }

    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mouseleave', onLeave)

    return () => {
      card.removeEventListener('mouseenter', onEnter)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={cardRef} className="text-black">
      <div className="w-full aspect-[4/3] overflow-hidden bg-[#EBEBEB]">
        <Image
          ref={imageRef}
          alt={title}
          src="/hero-placeholder.jpg"
          width={400}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="font-semibold text-lg mt-4">{title}</h3>

      <p className="text-sm text-muted mt-1">{date}</p>

      <p className="text-sm mt-3 text-black/70 line-clamp-3">{description}</p>

      <p className="mt-4 flex items-center gap-1 text-sm underline group-hover:opacity-70 transition-opacity">
        Read More
        <Image src="/arrow-up-right.svg" alt="" width={20} height={20} aria-hidden="true" />
      </p>

      <span className="block mt-4 text-xs uppercase font-semibold text-black">
        {type} · {author}
      </span>
    </div>
  )
}

export default NewsCard
