import BlogsCard from './BlogsCard'
import BlogsFilter from './BlogsFilter'
import BlogsPagination from './BlogsPagination'

export default function BlogsBlock() {
  return (
    <div>
      <h1>News</h1>
      <BlogsFilter />
      <BlogsCard />
      <BlogsPagination />
    </div>
  )
}
