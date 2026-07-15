'use client'
import React from 'react'
import { useState } from 'react'

const MyAYOCopyLink = ({ copyLink }: { copyLink: string }) => {
  const [text, setText] = useState('Copy ICS link')

  const handleCopy = () => {
    navigator.clipboard.writeText(copyLink)
    setText('Copied!')
    setTimeout(() => {
      setText('Copy ICS link')
    }, 1000)
  }
  return (
    <button
      onClick={handleCopy}
      className="p-3 ml-30 border-black border-2 rounded-md cursor-pointer"
    >
      {text}
    </button>
  )
}

export default MyAYOCopyLink
