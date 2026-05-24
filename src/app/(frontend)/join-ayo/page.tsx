import FAQSection from '../components/FAQSection'
import OpportunitySection from '../components/OpportunitySection'
import OpportunityModal from '../components/OpportunityModal'
import Hero from '../components/Hero'

export default function JoinAyoPage() {
  return (
    <main>
      <Hero title="Join AYO" backgroundImage="/hero-placeholder.jpg" />
      <OpportunitySection />
      <FAQSection />
    </main>
  )
}
