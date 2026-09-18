type AboutUsQuoteStaticProps = {
  /** quote overlay text. omit to render the block without a quote. */
  quote?: string
  /** background image for the block. */
  image?: string
  /** small label pinned top-left. omit to hide. */
  caption?: string
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
    <div className={`relative block ${aspectClassName} w-full overflow-hidden`}>
      {image ? (
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-neutral-800" />
      )}

      <div className="absolute inset-0 bg-black/50" />

      {caption && (
        <div className="absolute z-10 top-0 left-0 right-0 mt-5 px-5 flex items-start justify-between">
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white">{caption}</p>
        </div>
      )}

      {quote && (
        <div className="relative z-10 flex h-full items-end justify-end p-6 md:p-8">
          <p className="w-full md:w-1/2 text-right text-white text-xl lg:text-3xl xl:text-5xl leading-snug">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      )}
    </div>
  )
}

export default AboutUsQuoteStatic
