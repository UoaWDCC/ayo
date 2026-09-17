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

  const isPlaceholder = sponsors.length === 0

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-12 justify-items-center py-12">
      {displaySponsors.map((sponsor) => (
        <div key={sponsor.id} className="flex flex-col items-center gap-3 w-full max-w-56">
          {sponsor.imageUrl ? (
            <img
              src={sponsor.imageUrl}
              alt={sponsor.name}
              className="h-32 w-auto max-w-[220px] object-contain"
            />
          ) : (
            <div className="h-32 w-48 bg-gray-100" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  )
}
