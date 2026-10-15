'use client'

import { useState } from 'react'

export default function CopyEmailButton({ email }: { email: string }) {
  const [message, setMessage] = useState('')

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
      setMessage('Email address copied.')
    } catch {
      setMessage('Copy did not work. Select the email address above to copy it.')
    }
  }

  return (
    <div className="max-w-[260px]">
      <button
        type="button"
        onClick={() => void copy()}
        className="cursor-pointer py-3 text-[15px] font-semibold underline underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        Copy email
      </button>
      <p role="status" aria-live="polite" className="mt-2 min-h-6 text-[15px] leading-6 text-[#2E2E2E]">
        {message}
      </p>
    </div>
  )
}
