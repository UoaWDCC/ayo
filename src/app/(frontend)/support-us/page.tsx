import Link from 'next/link'
import DonationBlock from '../components/DonationBlock'
export default function SupportUsPage() {
  const tierArray = [
    {
      tierName: 'Subscriber',
      descriptionContent: (
        <p>Subscribers pay an annual subscription of $25.00 as a donation towards our ongoing work and their names 
          are listed in our printed concert programmes. 
          They automatically become Members of the incorporated society 
          and, as such, are entitled to attend General Meetings and vote.</p>
      ),
      linkText: 'Register',
      linkUrl: '',
    },
    {
      tierName: 'Supporter',
      descriptionContent: (
        <>
          <p>Supporters donate a minimum of <strong>$75.00</strong> and, to show our appreciation for their support: </p>
          
          <ul className='list-disc pl-6 py-4'>
            <li>Their names are listed in the printed programmes (unless anonymity is requested); and,</li>
            <li>Some of the best seats are cordoned off exclusively for them at the free Auckland Town Hall concerts. </li>
          </ul>

          <div className = "max-w">
            <div className = "flex justify-between">
              <span className = "font-semibold">General Supporter</span>
              <span>$75.00+</span>
            </div>
            <div className = "flex justify-between">
              <span className = "font-semibold">Special Supporter</span>
              <span>$500.00+</span>
            </div>
            <div className = "flex justify-between">
              <span className = "font-semibold">General Supporter</span>
              <span>$5,000.00+</span>
            </div>
          </div>

        </>
      ),
      linkText: 'Register',
      linkUrl: '',
    },
    {
      tierName: 'KORA Cards',
      descriptionContent: (
        <p>Sign up for Kora fuel cards and a few cents per litre will be donated to AYO every time you fill up at either a Mobil or Waitomo station.  Kora offers cardholders a discount of 10c/litre and you can have some (or all!) of that saving donated to AYO automatically!</p>
      ),
      linkText: 'Read More',
      linkUrl: '',
    }
  ]
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
            <p className="mt-5 mb-10">
              Click here to{' '}
              <Link href="">
                <span className="underline">donate</span>
              </Link>{' '}
              (one-off), or explore below.
            </p>
            <div>
              {tierArray.map((tier, index) => (
                <div key={index}>
                  <DonationBlock
                    tierName={tier.tierName}
                    descriptionContent={tier.descriptionContent}
                    linkText={tier.linkText}
                    linkUrl={tier.linkUrl}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
