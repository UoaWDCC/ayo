type WallItemProps = {
  name: string
  end: boolean
}

const AYOWallItem = ({ name, end }: WallItemProps) => {
  return (
    <>
      <span className="group relative inline-block text-[16px] sm:text-[18px] leading-[28px] sm:leading-[32px]">
        <span className="relative inline-block text-gray-700 underline decoration-gray-300 underline-offset-4 transition-transform duration-200 ease-out group-hover:scale-125 group-hover:z-10 group-hover:text-black cursor-default">
          {name}
        </span>
      </span>
      {!end && (
        <span className="mx-1 text-gray-400 no-underline text-[16px] sm:text-[18px]">·</span>
      )}
    </>
  )
}

export default AYOWallItem
