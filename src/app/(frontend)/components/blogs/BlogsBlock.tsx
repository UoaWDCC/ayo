'use client'

import { useState } from 'react'
import Link from 'next/link'

import BlogsCard from './BlogsCard'
import BlogsFilter from './BlogsFilter'
import BlogsPagination from './BlogsPagination'

export default function BlogsBlock() {
  // Dummy data for now, to be replaced with real data from backend
  const DummyBlogs = [
    {
      id: 1,
      title: '2025 Soloist Competition',
      date: 'November 1st, 2025',
      excerpt:
        'The Final of the 2025 AYO Soloist Competition was held on Sunday, 19 October 2025.  It was an exciting event with the wonderful talent of AYO’s players being showcased once more.',
    },
    {
      id: 2,
      title:
        'Hear Tony Yan Tong Chen being interviewed about our June concert series on RNZ Concert',
      date: 'June 6th, 2025',
      excerpt:
        'AYO’s soloist for the June concert series Tony Yan Tong Chen was interviewed by Bryan Crump on RNZ Concert on 4 June 2025 – hear the interview and some of his recordings here!',
    },
    {
      id: 3,
      title: 'Update – Howick June Concert CANCELLED',
      date: 'June 6th, 2025',
      excerpt:
        'With less than two weeks to go until the first concert of this series we regret inform you that our popular Howick venue, the All Saints Church, has suffered significant flooding and is...',
    },
    {
      id: 4,
      title: 'test blog post 4',
      date: 'happy new year',
      excerpt: 'A fake blog post.',
    },
    {
      id: 5,
      title: 'test blog post 5',
      date: 'happy new year',
      excerpt: 'A fake blog post.',
    },
    {
      id: 6,
      title: 'test blog post 6',
      date: 'happy new year',
      excerpt: 'A fake blog post.',
    },
    {
      id: 7,
      title: 'test blog post 7',
      date: 'happy new year',
      excerpt: 'A fake blog post.',
    },
  ]

  //blogs pagination
  const [currentPage, setCurrentPage] = useState(1)

  const totalCards = Math.ceil(DummyBlogs.length / 3) // calculate total num of cards for pagination total eg. 1 of {total}

  //slicing
  const currentBlogs = DummyBlogs.slice((currentPage - 1) * 3, (currentPage - 1) * 3 + 3) // 1-3, 4-6, 7

  return (
    <div className="px-24 py-14">
      <Link href={'/news'}>
        {/* TO: Resources page // all News */}
        <h1 className="text-4xl font-semibold mb-6 hover:text-muted transition-colors">News</h1>
      </Link>
      {/* What's New? // Latest Stories*/}

      <BlogsFilter />

      <div>
        {currentBlogs.map((blog) => (
          <BlogsCard key={blog.id} {...blog} />
        ))}
      </div>

      <BlogsPagination
        currentPage={currentPage}
        totalPages={totalCards}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
