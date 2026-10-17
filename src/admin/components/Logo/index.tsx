export default function Logo() {
  return (
    // A plain image keeps the local brand asset available without image optimization.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/ayo-logo-black-bgwhite.png"
      alt="Auckland Youth Orchestra"
      width={512}
      height={157}
      style={{ display: 'block', width: '100%', maxWidth: 320, height: 'auto' }}
    />
  )
}
