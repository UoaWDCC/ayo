import Link from 'next/link'
export default function SupportUsPage() {
  return (
    <main>
      <div className="text-black w-full">
        <div className="flex justify-center">
          <div className="text-body my-10 w-[90%]">
            <h1 className="text-heading font-semibold">Donations</h1>
            <p className="mt-2 leading-9">
              We are grateful for the donations and grants from our major supporters and for the
              generosity of others. Every donation is appreciated and helpful. <br />
              Auckland Youth Orchestra Incorporated is a registered charity, CC45382, and is an
              IRD-registered Donee Organisation for tax credits on donations.
            </p>
            <p className="mt-5">
              Click here to{' '}
              <Link href="">
                <span className="underline">donate</span>
              </Link>{' '}
              (one-off), or explore below.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
