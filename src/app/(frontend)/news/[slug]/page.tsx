// single blog page
// app/news/[slug]/page.tsx
import Link from 'next/link'
import Image from 'next/image'

const placeholderPost = {
  title: 'AYO Newsletter – July, 2026',
  author: 'Mary Lin',
  date: 'Sun. 21 June',
  heroImage: '/grey_rectangle.png',
  body: [
    {
      type: 'paragraph',
      text: 'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance. A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance. A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance. A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
    },
    {
      type: 'imagePair',
      images: ['/grey_rectangle.png', '/grey_rectangle.png'],
      caption:
        'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
    },
    {
      type: 'paragraph',
      text: 'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance. A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné,.',
    },
    {
      type: 'quote',
      text: 'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné.',
    },
    {
      type: 'paragraph',
      text: 'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance. A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné,.',
    },
    {
      type: 'image',
      src: '/grey_rectangle.png',
    },
  ],
}

const relatedPosts = [
  {
    id: 1,
    title: '2025 Soloist Competition',
    date: 'November 1st, 2025',
    image: '/grey_rectangle.png',
  },
  {
    id: 2,
    title: 'Hear Tony Yan Tong Chen on RNZ Concert',
    date: 'June 6th, 2025',
    image: '/grey_rectangle.png',
  },
  {
    id: 3,
    title: 'Howick June Concert Cancelled',
    date: 'June 6th, 2025',
    image: '/grey_rectangle.png',
  },
]
interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function SinglePostPage({ params }: PageProps) {
  return (
    <article>
      {/* Hero */}
      <div className="relative h-105 w-full">
        <Image
          src={placeholderPost.heroImage}
          alt={placeholderPost.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12">
          <div className="max-w-175 mx-auto w-full text-white">
            <h1 className="text-6xl font-bold leading-tight">{placeholderPost.title}</h1>
            <p className="mt-6 text-lg">
              {placeholderPost.date} · By {placeholderPost.author}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-175 mx-auto px-6 py-14">
        <Link
          href="/news"
          className="inline-block mb-10 underline underline-offset-4 hover:text-muted transition-colors"
        >
          ← Back to Listing Page
        </Link>

        {/* Body */}
        <div className="space-y-8 text-base leading-relaxed text-justify">
          {placeholderPost.body.map((block, i) => {
            if (block.type === 'paragraph') {
              return <p key={i}>{block.text}</p>
            }
            if (block.type === 'quote') {
              return (
                <blockquote
                  key={i}
                  className="border-l-4 border-black pl-6 italic text-2xl not-italic-quote"
                >
                  {block.text}
                </blockquote>
              )
            }
            if (block.type === 'imagePair') {
              return (
                <figure key={i}>
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
                <div key={i} className="relative aspect-16/10 w-full">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedPosts.map((post) => (
              <Link key={post.id} href={`/news/${post.id}`} className="group">
                <div className="relative aspect-4/3 w-full mb-3 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-semibold group-hover:text-muted transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm mt-1">{post.date}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
