import { NEWSLETTER_SIGNUP_URL } from '@/lib/newsletter'
import Button from './Button'
import StaggerReveal from './StaggerReveal'

export default function NewsletterSignup() {
  return (
    <section className="bg-white text-black w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5">
        <div className="max-w-[1380px]">
          <StaggerReveal fadeClass="newsletter-fade">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <h2 className="newsletter-fade font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]">
                  Sign up to our newsletter
                </h2>

                <p className="newsletter-fade mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">
                  Concert announcements, stories and updates from across the AYO community, sent
                  straight to your inbox.
                </p>
              </div>

              <Button
                href={NEWSLETTER_SIGNUP_URL}
                external
                className="newsletter-fade self-start md:self-end shrink-0"
              >
                Subscribe to AYO updates
              </Button>
            </div>
          </StaggerReveal>
        </div>
      </div>
    </section>
  )
}
