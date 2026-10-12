import SponsorLogo from './SponsorLogo'
import StaggerReveal from './StaggerReveal'

type SponsorListProps = {
  sponsors: { id: string | number; name: string; imageUrl?: string }[]
  placeholderCount?: number
  /** Section heading. Pass null to render the grid on its own. */
  heading?: string | null
  /** Italic sub-line under the heading, as every other section has. */
  subheading?: string | null
}

export default function SponsorList({
  sponsors,
  placeholderCount = 4,
  heading = 'Our Supporters',
  subheading = 'The funders, trusts and partners whose backing keeps the orchestra playing.',
}: SponsorListProps) {
  const displaySponsors =
    sponsors.length > 0
      ? sponsors
      : Array.from({ length: placeholderCount }, (_, i) => ({
          id: i,
          name: 'Sponsor',
          imageUrl: undefined,
        }))

  return (
    <section className="bg-white w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5">
        <StaggerReveal fadeClass="sponsor-fade" className="max-w-[1380px]">
          {heading && (
            <h2 className="sponsor-fade font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px] text-black">
              {heading}
            </h2>
          )}

          {subheading && (
            <p className="sponsor-fade mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">
              {subheading}
            </p>
          )}

          <div className="sponsor-fade mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-12 justify-items-center">
            {displaySponsors.map((sponsor) => (
              <SponsorLogo key={sponsor.id} name={sponsor.name} imageUrl={sponsor.imageUrl} />
            ))}
          </div>
        </StaggerReveal>
      </div>
    </section>
  )
}
