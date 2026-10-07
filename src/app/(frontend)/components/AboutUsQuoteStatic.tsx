type AboutUsQuoteStaticProps = {
  /** quote overlay text. omit to render the block without a quote. */
  quote?: string | null
  /** background image for the block. */
  image?: string | null
  /** small label pinned top-left. omit to hide. */
  caption?: string | null
  /** tailwind aspect-ratio class for the block. defaults to aspect-[16/6] */
  aspectClassName?: string
}

const AboutUsQuoteStatic = ({
  quote,
  image,
  caption,
  aspectClassName = 'aspect-[16/6]',
}: AboutUsQuoteStaticProps) => {
  return (
    <div
      className={`relative flex min-h-64 flex-col justify-between ${aspectClassName} max-md:aspect-auto md:block md:min-h-0 w-full overflow-hidden`}
    >
      {image ? (
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-neutral-800" />
      )}

      <div className="absolute inset-0 bg-black/50" />

      {caption && (
        <div className="relative z-10 px-4 pt-5 sm:px-6 md:absolute md:top-0 md:left-0 md:right-0 md:px-5 flex items-start justify-between">
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white">{caption}</p>
        </div>
      )}

      {quote && (
        <div className="relative z-10 flex flex-1 items-end justify-end px-4 py-6 sm:px-6 md:h-full md:p-8">
          <p className="w-full md:w-1/2 text-right text-white text-xl lg:text-3xl xl:text-5xl leading-snug">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      )}
    </div>
  )
}

export default AboutUsQuoteStatic
