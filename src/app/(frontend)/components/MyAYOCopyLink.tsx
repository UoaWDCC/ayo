'use client'

import { useState } from 'react'
import Button from './Button'

const LABEL = 'Copy ICS link'

const MyAYOCopyLink = ({ copyLink }: { copyLink: string }) => {
  const [text, setText] = useState(LABEL)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyLink)
      setText('Copied!')
    } catch {
      setText('Copy failed')
    }
    setTimeout(() => setText(LABEL), 1500)
  }

  return (
    <Button onClick={handleCopy} aria-live="polite">
      {text}
    </Button>
  )
}

export default MyAYOCopyLink
