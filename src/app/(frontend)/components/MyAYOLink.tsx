'use client'
import React from 'react'
import { useState } from 'react'
const MyAYOLink = () => {
  const [text, setText] = useState('Copy ICS link')

  const handleCopy = () => {
    navigator.clipboard.writeText('insert link here')
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

export default MyAYOLink
