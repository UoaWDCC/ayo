'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

gsap.registerPlugin(ScrollTrigger)

const PARALLAX_FACTOR = 0.5

type RemainingPhoto = { id: string; src: string; alt: string }
type RelatedPost = {
  id: string | number
  slug: string
  title: string
  date: string
  image: string | null
}

type NewsArticleContentProps = {
  title: string
  author: string
  date: string
  category: string | null
  heroImageUrl: string | null
  description: any // Payload lexical richText data
  remainingPhotos: RemainingPhoto[]
  relatedPosts: RelatedPost[]
}

const NewsArticleContent = ({
  title,
  author,
  date,
  category,
  heroImageUrl,
  description,
  remainingPhotos,
  relatedPosts,
}: NewsArticleContentProps) => {
  const heroRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const photosRef = useRef<HTMLDivElement>(null)
  const relatedRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll('.article-hero-fade'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.2 },
        )
      }

      // RichText renders whatever elements the editor produced, so we animate
      // its direct children rather than relying on fixed block classes.
      if (bodyRef.current) {
        const blocks = Array.from(bodyRef.current.children)
        const firstBlock = blocks[0]
        if (firstBlock) {
          gsap.fromTo(
            blocks,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: bodyRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            },
          )
        }
      }

      if (photosRef.current) {
        const photos = photosRef.current.querySelectorAll('.article-photo-item')
        const firstPhoto = photos[0]
        if (firstPhoto) {
          gsap.fromTo(
            photos,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: firstPhoto,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            },
          )
        }
      }

      if (relatedRef.current) {
        const cards = relatedRef.current.querySelectorAll('.related-post-card')
        const firstCard = cards[0]
        if (firstCard) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: firstCard,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            },
          )
        }
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <article className="bg-white">
      {/* Hero */}
      <div className="relative h-105 w-full bg-black">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-x-0 top-[-40%] bottom-[-40%]"
            style={{ transform: `translateY(${scrollY * PARALLAX_FACTOR}px)` }}
          >
            {heroImageUrl && (
              <Image src={heroImageUrl} alt={title} fill className="object-cover" priority />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
        </div>

        <div ref={heroRef} className="absolute inset-0 flex flex-col justify-end px-6 pb-12">
          <div className="max-w-175 mx-auto w-full text-white">
            {category && (
              <span className="article-hero-fade text-xs font-semibold uppercase tracking-wide text-white/80">
                {category}
              </span>
            )}
            <h1 className="article-hero-fade mt-3 text-6xl font-bold leading-tight">{title}</h1>
            <p className="article-hero-fade mt-6 text-lg">
              {date}
              {author ? ` · By ${author}` : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-14">
        <div className="max-w-175 mx-auto">
          <Link
            href="/news"
            className="inline-block mb-10 underline underline-offset-4 hover:text-muted transition-colors"
          >
            ← Back to Listing Page
          </Link>

          {/* Body — Payload's RichText */}
          <div ref={bodyRef} className="prose max-w-none text-base leading-relaxed space-y-8">
            {description && <RichText data={description} />}
          </div>

          {/* Any photos beyond the hero image */}
          {remainingPhotos.length > 0 && (
            <div ref={photosRef} className="mt-10 grid grid-cols-2 gap-3">
              {remainingPhotos.map((photo) => (
                <div key={photo.id} className="article-photo-item relative aspect-4/3 w-full">
                  <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-20 border-t border-[#EBEBEB] pt-10">
              <h2 className="text-2xl font-semibold mb-8">Related Posts</h2>
              <div ref={relatedRef} className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/news/${related.slug}`}
                    className="related-post-card group"
                  >
                    <div className="relative aspect-4/3 w-full mb-3 overflow-hidden bg-[#EBEBEB]">
                      {related.image && (
                        <Image
                          src={related.image}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <h3 className="font-semibold group-hover:text-muted transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm mt-1">{related.date}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default NewsArticleContent
