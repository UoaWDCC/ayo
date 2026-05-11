export default function JoinAyoSection() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8">
      <h1 className="text-6xl font-black mb-6 font-semibold">
        Inspired?
        <br />
        Register for an audition.
      </h1>

      <p className="text-xl mb-4">
        Registrations are currently open until <strong>May 20th, 2026.</strong>
      </p>

      <a href="#" className="text-xl font-semibold underline underline-offset-3 mb-12">
        Register ↗
      </a>

      <div>
        <p className="text-xl font-semibold">Enquires:</p>
        <p>Mary Lin (Orchestra Manager)</p>
        <a href="mailto:manager@ayo.org.nz" className="underline underline-offset-3">
          manager@ayo.org.nz
        </a>
      </div>
    </div>
  )
}
