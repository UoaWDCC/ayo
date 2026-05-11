import Link from 'next/link'

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
    //<Link href={'/news/' + Blog.id}> removed card link, following figma design // xl:gap-x-70  md:gap-x-20 sm:gap-x-10
    <div className="border-t border-[#EBEBEB] lg:grid lg:grid-cols-3 gap-x-10 py-12 hover:bg-gray-50 transition-colors">
      <div>
        {/* image column */}
        <img
          src={Blog.image}
          alt={Blog.title}
          width={300}
          height={200}
          className="w-full h-auto object-cover"
        />
      </div>
      <div>
        {/*xl:pr-80 lg:pr-8 md:pr-6 sm:pr-4 // lg:ml-12 2xl:pr-40 */}
        {/* middle column  */}

        {/*TO: individual blog post page*/}

        <h2 className="font-semibold">{Blog.title}</h2>

        <p className="mt-2 text-sm mb-6">{Blog.date}</p>
      </div>
      <div className="flex flex-col justify-between gap-y-6 pr-2 px-13 border">
        {/* xl:mr-20 xl:ml-40 */}
        <h3 className="italic text-[#]">{Blog.excerpt}</h3>
        <Link href={'/news/' + Blog.id} className="self-end pr-2">
          <p className="underline underline-offset-3 ">Read more</p>
        </Link>
      </div>
    </div>
  )
}
