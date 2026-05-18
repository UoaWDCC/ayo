import FAQSection from '../components/FAQSection'
import JoinAyoSection from '../components/join-ayo/JoinAyoBlock'
import ScrollAnimation from '../components/join-ayo/ScrollAnimation'
import OpportunitySection from '../components/OpportunitySection'

export default function JoinAyoPage() {
  return (
    <div className="items-center justify-center flex flex-col">
      <JoinAyoSection />
      <ScrollAnimation />
      <OpportunitySection />
      <FAQSection />
    </div>
  )
}
