import Image from 'next/image'
import Link from 'next/link'

// Placeholder grid images until real Instagram posts/API are wired up
const posts = [
  '/hero-placeholder.jpg',
  '/about-us-quote-poster.jpg',
  '/about-us-our-team.jpg',
  '/hero-placeholder.jpg',
  '/about-us-quote-poster.jpg',
  '/about-us-our-team.jpg',
  '/hero-placeholder.jpg',
  '/about-us-quote-poster.jpg',
]

export default function SocialMediaBlock() {
  return (
    <div className="px-4 sm:px-8 md:px-24 py-14">
      <h1 className="text-heading font-semibold mb-2">Follow us!</h1>

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
          href="https://www.instagram.com/aucklandyouthorchestra/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white text-sm font-medium px-6 py-2 hover:bg-neutral-800 transition-colors"
        >
          Follow us
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {posts.map((post, idx) => (
          <Image
            key={idx}
            className="w-full h-auto aspect-square object-cover"
            src={post}
            width={279}
            height={271}
            alt="Instagram post"
          />
        ))}
      </div>
    </div>
  )
}
