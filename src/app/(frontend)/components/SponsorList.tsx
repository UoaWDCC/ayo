type SponsorListProps = {
  sponsors: { id: string | number; name: string; imageUrl?: string }[]
  placeholderCount?: number
}
export default function SponsorList({ sponsors, placeholderCount = 4 }: SponsorListProps) {
  const displaySponsors =
    sponsors.length > 0
      ? sponsors
      : Array.from({ length: placeholderCount }, (_, i) => ({
          id: i,
          name: 'Sponsor',
          imageUrl: undefined,
        }))

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-12 justify-items-center px-4 sm:px-6 lg:px-0 py-8 md:py-12">
      {displaySponsors.map((sponsor) => (
        <div key={sponsor.id} className="flex min-w-0 flex-col items-center gap-3 w-full max-w-56">
          {sponsor.imageUrl ? (
            <img
              src={sponsor.imageUrl}
              alt={sponsor.name}
              className="h-24 md:h-32 w-full max-w-full object-contain"
            />
          ) : (
            <div className="h-24 md:h-32 w-full max-w-48 bg-gray-100" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  )
}
