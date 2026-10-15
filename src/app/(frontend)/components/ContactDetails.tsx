import Button from './Button'
import CopyEmailButton from './CopyEmailButton'

const CONTACT_EMAIL = 'ayo@ayo.org.nz'

export default function ContactDetails() {
  return (
    <section
      className="w-full bg-white py-12.5 text-black"
      aria-labelledby="contact-details-heading"
    >
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32">
        <div className="max-w-[1380px]">
          <h2
            id="contact-details-heading"
            className="text-[32px] font-semibold leading-[40px] md:text-[40px] md:leading-[48px]"
          >
            Get in touch
          </h2>
          <p className="mt-4 max-w-[56ch] text-[18px] leading-7 text-[#2E2E2E]">
            For general enquiries, joining AYO, supporting the orchestra, or questions about
            concerts and events.
          </p>
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <h3 className="text-[18px] font-medium leading-7">Email</h3>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-3 inline-block break-all text-[18px] leading-7 underline underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
              <div className="mt-6 flex flex-wrap items-start gap-x-6 gap-y-4">
                <Button href={`mailto:${CONTACT_EMAIL}`}>Email AYO</Button>
                <CopyEmailButton email={CONTACT_EMAIL} />
              </div>
            </div>
            <address className="not-italic">
              <h3 className="text-[18px] font-medium leading-7">Postal address</h3>
              <p className="mt-3 text-[18px] leading-7 text-[#2E2E2E]">
                PO Box 99830, Newmarket, Auckland 1149
              </p>
            </address>
          </div>
        </div>
      </div>
    </section>
  )
}
