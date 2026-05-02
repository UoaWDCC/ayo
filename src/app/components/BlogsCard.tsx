type Blog = {
  title: string
  date: string
  description: string
}

export default function BlogsCard(Blog: Blog) {
  return (
    <div>
      <h2>{Blog.title}</h2>
      <p>{Blog.date}</p>
      <p>{Blog.description}</p>
    </div>
  )
}
