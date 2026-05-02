type Blog = {
  title: string
  date: string
  description: string
}

export default function BlogsCard(Blog: Blog) {
  return (
    <div className="border-t border-[#EBEBEB] grid grid-cols-2 py-12">
      <div className="pr-16">
        {/* left column  */}
        <h2 className="font-semibold mr-80">{Blog.title}</h2>
        <p className="mt-2 text-sm">{Blog.date}</p>
      </div>
      <div className="flex justify-end mr-20 ml-40">
        <p className="italic text-[#]">{Blog.description}</p>
      </div>
    </div>
  )
}
