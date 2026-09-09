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
    <div className="max-w-2xl mx-auto grid grid-cols-2 gap-y-12 gap-x-16 justify-items-center py-12">
      {displaySponsors.map((sponsor) => (
        <div key={sponsor.id} className="flex flex-col items-center gap-3">
          {sponsor.imageUrl ? (
            <img src={sponsor.imageUrl} alt={sponsor.name} className="h-48 w-48 object-cover" />
          ) : (
            <div className="h-48 w-48 bg-gray-100" aria-hidden="true" />
          )}
          <span className={`text-2xl font-bold ${isPlaceholder ? 'text-gray-200' : 'text-black'}`}>
            {sponsor.name}
          </span>
        </div>
      ))}
    </div>
  )
}
