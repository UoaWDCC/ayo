type wallItemProps = {
  name: string
  end: boolean
}

const WallItem = ({ name, end }: wallItemProps) => {
  return (
    <>
      <span className="inline-block">
        <span className="inline-block text-[15px] sm:text-[17px] md:text-[20px] leading-[26px] sm:leading-[28px] md:leading-[32px] text-gray-700 underline decoration-gray-300 underline-offset-4 transition-transform duration-200 ease-out hover:scale-110 hover:text-black cursor-default">
          {name}
        </span>
      </span>
      {!end && <span className="mx-1 text-gray-400 no-underline">·</span>}
    </>
  )
}

export default WallItem
