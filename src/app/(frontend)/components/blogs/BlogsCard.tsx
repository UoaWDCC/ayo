import Link from 'next/link'

type Blog = {
  id: number
  title: string
  date: string
  excerpt: string
  //image: string
  //category: string (disabled for now)
}

export default function BlogsCard(Blog: Blog) {
  return (
    <Link href={'/news/' + Blog.id}>
      <div className="border-t border-[#EBEBEB] lg:grid lg:grid-cols-2 py-12 px-4 xl:gap-x-70 md:gap-x-20 sm:gap-x-10 hover:bg-gray-50 transition-colors">
        <div className="2xl:pr-40">
          <h2 className="font-semibold">{Blog.title}</h2>
          <p className="mt-2 text-sm mb-6">{Blog.date}</p>
        </div>
        <div className="lg:flex lg:justify-end">
          <p className="italic text-[#]">{Blog.excerpt}</p>
        </div>
      </div>
    </Link>
  )
}
