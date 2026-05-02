import BlogsCard from './BlogsCard'
import BlogsFilter from './BlogsFilter'
import BlogsPagination from './BlogsPagination'

export default function BlogsBlock() {
  return (
    <div className="px-24 py-14">
      <h1 className="text-4xl font-semibold mb-6">News</h1>

      {/* <BlogsFilter  NOT SHOW FOR NOW/> */}

      <div className="mb-6">
        <BlogsCard
          title="2025 Soloist Competition"
          date="November 1st, 2025"
          description="The Final of the 2025 AYO Soloist Competition was held on Sunday, 19 October 2025.  It was an exciting event with the wonderful talent of AYO’s players being showcased once more."
        />
        <BlogsCard
          title="Hear Tony Yan Tong Chen being interviewed about our June concert series on RNZ Concert"
          date="June 6th, 2025"
          description="AYO’s soloist for the June concert series Tony Yan Tong Chen was interviewed by Bryan Crump on RNZ Concert on 4 June 2025 – hear the interview and some of his recordings here!"
        />
        <BlogsCard
          title="Update – Howick June Concert CANCELLED"
          date="June 6th, 2025"
          description="With less than two weeks to go until the first concert of this series we regret inform you that our popular Howick venue, the All Saints Church, has suffered significant flooding and is..."
        />
      </div>

      <BlogsPagination />
    </div>
  )
}
