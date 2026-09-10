'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import NavBar from '../../components/NavBar'

gsap.registerPlugin(ScrollTrigger)

const PARALLAX_FACTOR = 0.5

type BodyBlock = {
  type: string
  text?: string
  images?: string[]
  caption?: string
  src?: string
}

type Post = {
  title: string
  author: string
  date: string
  heroImage: string
  body: BodyBlock[]
}

type RelatedPost = {
  id: number
  title: string
  date: string
  image: string
}

type NewsArticleContentProps = {
  post: Post
  relatedPosts: RelatedPost[]
}

const NewsArticleContent = ({ post, relatedPosts }: NewsArticleContentProps) => {
  const heroRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
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

      if (bodyRef.current) {
        const blocks = bodyRef.current.querySelectorAll('.article-body-block')
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
      <div className="relative h-105 w-full">
        {/* NavBar is `position: fixed`, so it must live outside any `overflow-hidden` ancestor —
            overflow clipping still applies to fixed-position descendants, and since this section
            scrolls with the page, the clip box would move off-screen and cut the navbar off once
            the user scrolls past the hero. */}
        <NavBar overlay />

        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-x-0 top-[-40%] bottom-[-40%]"
            style={{ transform: `translateY(${scrollY * PARALLAX_FACTOR}px)` }}
          >
            <Image src={post.heroImage} alt={post.title} fill className="object-cover" priority />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
        </div>

        <div ref={heroRef} className="absolute inset-0 flex flex-col justify-end px-6 pb-12">
          <div className="max-w-175 mx-auto w-full text-white">
            <h1 className="article-hero-fade text-6xl font-bold leading-tight">{post.title}</h1>
            <p className="article-hero-fade mt-6 text-lg">
              {post.date} · By {post.author}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-14">
        <div className="max-w-175 mx-auto">
          {/* Body */}
          <div ref={bodyRef} className="space-y-8 text-base leading-relaxed text-justify">
            {post.body.map((block, i) => {
              if (block.type === 'paragraph') {
                return (
                  <p key={i} className="article-body-block">
                    {block.text}
                  </p>
                )
              }
              if (block.type === 'quote') {
                return (
                  <blockquote
                    key={i}
                    className="article-body-block border-l-4 border-black pl-6 italic text-2xl not-italic-quote"
                  >
                    {block.text}
                  </blockquote>
                )
              }
              if (block.type === 'imagePair') {
                return (
                  <figure key={i} className="article-body-block">
                    <div className="grid grid-cols-2 gap-3">
                      {block.images?.map((src, j) => (
                        <div key={j} className="relative aspect-4/3 w-full">
                          <Image src={src} alt="" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                    {block.caption && (
                      <figcaption className="text-sm italic text-gray-400 text-center mt-4 max-w-md mx-auto">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              }
              if (block.type === 'image' && block.src) {
                return (
                  <div key={i} className="article-body-block relative aspect-16/10 w-full">
                    <Image src={block.src} alt="" fill className="object-cover" />
                  </div>
                )
              }
              return null
            })}
          </div>

          {/* Related posts */}
          <div className="mt-20 border-t border-[#EBEBEB] pt-10">
            <h2 className="text-2xl font-semibold mb-8">Related Posts</h2>
            <div ref={relatedRef} className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/news/${relatedPost.id}`}
                  className="related-post-card group"
                >
                  <div className="relative aspect-4/3 w-full mb-3 overflow-hidden">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold group-hover:text-muted transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm mt-1">{relatedPost.date}</p>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/news"
            className="inline-block mt-14 underline underline-offset-4 hover:text-muted transition-colors"
          >
            ← Back to Listing Page
          </Link>
        </div>
      </div>
    </article>
  )
}

export default NewsArticleContent
