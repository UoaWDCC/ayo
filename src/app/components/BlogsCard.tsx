type Blog = {
  title: string
  date: string
  description: string
}

export default function BlogsCard(Blog: Blog) {
  return (
    <div className="border-t border-[#EBEBEB] lg:grid lg:grid-cols-2 py-12 xl:gap-x-70  md:gap-x-20 sm:gap-x-10">
      <div className="lg:ml-12 2xl:pr-40 ">
        {/*xl:pr-80 lg:pr-8 md:pr-6 sm:pr-4 */}
        {/* left column  */}
        <h2 className="font-semibold">{Blog.title}</h2>
        <p className="mt-2 text-sm mb-6">{Blog.date}</p>
      </div>
      <div className="lg:flex lg:justify-end lg:mr-20">
        {/* xl:mr-20 xl:ml-40 */}
        <p className="italic text-[#]">{Blog.description}</p>
      </div>
    </div>
  )
}
