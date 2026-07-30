import React from 'react'
import Image from 'next/image'
const NewsCard = () => {
  return (
    <div className="mt-5">
      <Image
        alt="placeholder"
        src="/hero-placeholder.jpg"
        className="flex"
        width="400"
        height="400"
      />
      <h1 className="font-semibold text-2xl mt-5">AYO Newsletter - July, 2026</h1>
    </div>
  )
}

export default NewsCard
