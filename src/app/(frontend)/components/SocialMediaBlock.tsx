import Image from 'next/image'
import Link from 'next/link'

import { getInstagramFeed } from '@/lib/instagramFeedHelper'

const INSTAGRAM_URL = 'https://www.instagram.com/aucklandyouthorchestra/'

export default async function SocialMediaBlock() {
  const { posts } = await getInstagramFeed({ limit: 8 })
  return (
    <div className="px-8 md:px-20 lg:px-24 xl:px-32 py-14">
      <h1 className="text-[32px] leading-[40px] md:text-[40px] md:leading-[48px] font-semibold mb-2">
        Follow us!
      </h1>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-x-4">
          <div className="w-[52px] h-[52px] shrink-0 rounded-full bg-[#D9D9D9] overflow-hidden">
            <Image
              className="w-full h-full object-cover"
              src="/hero-placeholder.jpg"
              width={52}
              height={52}
              alt="Auckland Youth Orchestra"
            />
          </div>
          <span className="font-semibold text-body">aucklandyouthorchestra</span>
        </div>

        <Link
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white text-sm font-medium px-6 py-2 hover:bg-neutral-800 transition-colors"
        >
          Follow us
        </Link>
      </div>
      {posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Image
                className="w-full h-auto aspect-square object-cover"
                src={post.imageUrl}
                width={279}
                height={271}
                alt={post.caption ? post.caption.slice(0, 120) : 'Instagram post'}
              />
            </Link>
          ))}
        </div>
      )}

      <p className="text-neutral-600 mt-6">
        Stay up to date with us on Instagram! Visit{' '}
        <Link href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="underline">
          @aucklandyouthorchestra
        </Link>
      </p>
    </div>
  )
}
