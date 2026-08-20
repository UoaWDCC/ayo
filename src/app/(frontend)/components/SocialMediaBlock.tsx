import Image from 'next/image'
import Link from 'next/link'

// Placeholder grid images until real Instagram posts/API are wired up
const posts = [
  '/grey_rectangle.png',
  '/grey_rectangle.png',
  '/grey_rectangle.png',
  '/grey_rectangle.png',
  '/grey_rectangle.png',
  '/grey_rectangle.png',
  '/grey_rectangle.png',
  '/grey_rectangle.png',
]

export default function SocialMediaBlock() {
  return (
    <div className="px-24 py-14">
      <h1 className="text-heading font-semibold mb-14">Follow us!</h1>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-x-4">
          <Image
            className="rounded-full"
            src="/ayo-logo-black-bgwhite.png"
            width={52}
            height={52}
            alt="Auckland Youth Orchestra"
          />
          <span className="font-semibold text-body">aucklandyouthorchestra</span>
        </div>

        <Link
          href="https://www.instagram.com/aucklandyouthorchestra/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white text-xs font-medium px-6 py-2 hover:bg-neutral-800 transition-colors"
        >
          Follow us
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
