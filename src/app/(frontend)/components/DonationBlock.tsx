import React from 'react'
import Link from 'next/link'
const DonationBlock = ({
  tierName,
  descriptionContent,
  linkText,
  linkUrl,
  index,
}: {
  tierName: string
  descriptionContent: React.ReactNode
  linkText: string
  linkUrl: string,
  index: number
}) => {
  return (
    <div className={`grid grid-cols-1 gap-4 py-6 lg:grid-cols-6 lg:gap-0 lg:py-0 border-b ${index == 0 ? 'border-t' : ''}`}>
      <div className="min-w-0 break-words lg:col-span-1 lg:ml-10 content-center text-[25px] font-semibold">
        <p>{tierName}</p>
      </div>
      <div className="min-w-0 break-words lg:my-6 lg:col-span-2 lg:col-start-3 content-center">
        {descriptionContent}
      </div>
      <div className="grid min-w-0 break-words lg:col-span-1 lg:col-start-6 content-center justify-items-start lg:justify-items-end font-semibold underline lg:mr-10">
        <Link href={linkUrl}>{linkText}</Link>
      </div>
    </div>
  )
}

export default DonationBlock
