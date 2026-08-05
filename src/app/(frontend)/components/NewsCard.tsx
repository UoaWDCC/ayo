import React from 'react'
import Image from 'next/image'

interface NewsCardProps {
  title: string
  date: string
  description: string
  type: string
  author: string
}

const NewsCard = ({ title, date, description, type, author }: NewsCardProps) => {
  return (
    <div className="ml-20 mt-15 w-110">
      <Image
        alt="placeholder"
        src="/hero-placeholder.jpg"
        className="flex"
        width="450"
        height="400"
      />
      <h1 className="font-semibold text-3xl mt-5">{title}</h1>
      <p className="mt-4 text-black/50"> {date} </p>
      <p className="mt-4 italic">{description}</p>
      <p className="mt-4 underline"> Read More</p>
      <p className="mt-4 text-xs uppercase font-semibold">
        {type} • {author}
      </p>
    </div>
  )
}

export default NewsCard
