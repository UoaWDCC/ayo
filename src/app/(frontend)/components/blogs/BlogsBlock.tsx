'use client'

import { useState } from 'react'
import Link from 'next/link'

import BlogsCard from './BlogsCard'
import BlogsFilter from './BlogsFilter'
import BlogsPagination from './BlogsPagination'
import image from 'next/image'

export default function BlogsBlock() {
  // Dummy data for now, to be replaced with real data from backend
  const DummyBlogs = [
    {
      id: 1,
      title: '2025 Soloist Competition',
      date: 'November 1st, 2025',
      excerpt:
        'The Final of the 2025 AYO Soloist Competition was held on Sunday, 19 October 2025.  It was an exciting event with the wonderful talent of AYO’s players being showcased once more.',
      image: '/about-us-quote-poster.jpg',
    },
    {
      id: 2,
      title:
        'Hear Tony Yan Tong Chen being interviewed about our June concert series on RNZ Concert',
      date: 'June 6th, 2025',
      excerpt:
        'AYO’s soloist for the June concert series Tony Yan Tong Chen was interviewed by Bryan Crump on RNZ Concert on 4 June 2025 – hear the interview and some of his recordings here!',
      image: '/about-us-our-team.jpg',
    },
    {
      id: 3,
      title: 'Update – Howick June Concert CANCELLED',
      date: 'June 6th, 2025',
      excerpt:
        'With less than two weeks to go until the first concert of this series we regret inform you that our popular Howick venue, the All Saints Church, has suffered significant flooding and is...',
      image: '/about-us-our-team.jpg',
    },

    {
      id: 4,
      title: 'AYO Announces 2026 Winter Concert Series',
      date: 'May 12th, 2025',
      excerpt:
        'We are thrilled to announce the lineup for our 2026 Winter Concert Series, featuring works by Sibelius, Dvořák, and a new commission from a rising New Zealand composer.',
      image: '/about-us-our-team.jpg',
    },
    {
      id: 5,
      title: 'Auditions Open for the 2026 Season',
      date: 'April 3rd, 2025',
      excerpt:
        'Applications are now open for musicians wishing to join AYO for the 2026 season. Auditions will be held in Auckland, Wellington, and Christchurch throughout May.',
      image: '/about-us-our-team.jpg',
    },
    {
      id: 6,
      title: 'AYO Alumni Spotlight: Where Are They Now?',
      date: 'March 15th, 2025',
      excerpt:
        'We catch up with former AYO members now performing with orchestras around the world, from the Berlin Philharmonic to the Sydney Symphony Orchestra.',
      image: '/about-us-our-team.jpg',
    },
    {
      id: 7,
      title: 'Behind the Scenes: Preparing for Opening Night',
      date: 'February 20th, 2025',
      excerpt:
        'Take a look behind the curtain as our musicians and production crew put the final touches on this season’s opening performance at the Auckland Town Hall.',
      image: '/about-us-our-team.jpg',
    },
  ]

  //blogs pagination
  const [currentPage, setCurrentPage] = useState(1)

  const totalCards = Math.ceil(DummyBlogs.length / 2) // calculate total num of cards for pagination total eg. 1 of {total}

  //slicing
  const currentBlogs = DummyBlogs.slice((currentPage - 1) * 2, (currentPage - 1) * 2 + 2) // 1-2, 3-4, 5-6, 7

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
