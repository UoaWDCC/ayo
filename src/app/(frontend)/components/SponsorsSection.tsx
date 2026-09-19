interface SponsorsSectionProps {
  sponsors: string[]
}

export default function SponsorsSection({ sponsors }: SponsorsSectionProps) {
  return (
    <div className="w-full py-20">
      <div className="grid grid-cols-2 gap-y-12 gap-x-8 justify-items-center items-center">
        {sponsors.map((sponsor, index) => (
          <div
            key={index}
            className="text-black-300 font-bold text-3xl md:text-4xl tracking-wide select-none"
          >
            {sponsor}
          </div>
        ))}
      </div>
    </div>
  )
}
