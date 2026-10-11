import Image from 'next/image'
import Link from 'next/link'

import Button from './Button'
import StaggerReveal from './StaggerReveal'
import { getInstagramFeed } from '@/lib/instagramFeedHelper'

const INSTAGRAM_URL = 'https://www.instagram.com/aucklandyouthorchestra/'

export default async function SocialMediaBlock() {
  const { posts } = await getInstagramFeed({ limit: 8 })
  return (
    <section className="bg-white w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5">
        <StaggerReveal fadeClass="social-fade">
          <h2 className="social-fade font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]">
            Follow Us
          </h2>
          <p className="social-fade mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">
            Rehearsals, concerts and life in the orchestra, as it happens on Instagram.
          </p>

          <div className="social-fade flex flex-wrap items-center justify-between gap-4 mt-8">
            <div className="flex items-center gap-x-4">
              <div className="w-[52px] h-[52px] shrink-0 rounded-full bg-[#EBEBEB] overflow-hidden">
                <Image
                  className="w-full h-full object-cover"
                  src="/hero-placeholder.jpg"
                  width={52}
                  height={52}
                  alt="Auckland Youth Orchestra"
                />
              </div>
              <span className="font-semibold text-[18px] leading-[22px]">
                @aucklandyouthorchestra
              </span>
            </div>

            <Button href={INSTAGRAM_URL} external>
              Follow
            </Button>
          </div>

          <hr className="border-[#EBEBEB] mt-6" />

          {posts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-fade block overflow-hidden bg-[#EBEBEB] transition-opacity hover:opacity-70"
                >
                  <Image
                    className="w-full h-auto aspect-square object-cover"
                    src={post.imageUrl}
                    width={279}
                    height={279}
                    alt={post.caption ? post.caption.slice(0, 120) : 'Instagram post'}
                  />
                </Link>
              ))}
            </div>
          )}
        </StaggerReveal>
      </div>
    </section>
  )
}
