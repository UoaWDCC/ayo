import Link from 'next/link'
import Image from 'next/image'

type Blog = {
  id: number
  title: string
  date: string
  excerpt: string
  image: string
  //category: string (disabled for now)
}

export default function BlogsCard(Blog: Blog) {
  return (
    <Link href={'/news' /* TODO: revert to '/news/' + Blog.id once blog detail pages exist */}>
      <div className="text-body text-base border-t border-[#EBEBEB] lg:grid lg:grid-cols-2 lg:items-center py-12 px-4 xl:gap-x-70 md:gap-x-20 sm:gap-x-10 hover:bg-gray-50 transition-colors">
        <div className="lg:flex lg:items-center lg:gap-x-8">
          <Image
            className="mb-4 lg:mb-0"
            src={Blog.image}
            width={244}
            height={181}
            alt={Blog.title}
          />
          <div>
            <h2 className="font-semibold">{Blog.title}</h2>
            <p className="mt-2 mb-6 lg:mb-0">{Blog.date}</p>
          </div>
        </div>
        <div>
          <p className="italic text-justify">{Blog.excerpt}</p>
        </div>
      </div>
    </Link>
  )
}
