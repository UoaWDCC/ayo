import React from 'react'
import Link from 'next/link'
const DonationBlock = ({
  tierName,
  descriptionContent,
  linkText,
  linkUrl,
}: {
  tierName: string
  descriptionContent: React.ReactNode
  linkText: string
  linkUrl: string
}) => {
  return (
    <div className="grid grid-cols-6 border-y">
      <div className="col-span-1 ml-10 content-center text-[25px] font-semibold">
        <p>{tierName}</p>
      </div>
      <div className="my-6 col-span-2 col-start-3 content-center">
        {descriptionContent}
      </div>
      <div className="grid col-span-1 col-start-6 content-center justify-items-end font-semibold underline mr-10">
        <Link href={linkUrl}>{linkText}</Link>
      </div>
    </div>
  )
}

export default DonationBlock
