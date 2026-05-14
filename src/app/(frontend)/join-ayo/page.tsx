import FAQSection from '../components/FAQSection'
import JoinAyoSection from '../components/join-ayo/JoinAyoBlock'
import ScrollAnimation from '../components/join-ayo/ScrollAnimation'

export default function JoinAyoPage() {
  return (
    <main>
      <ScrollAnimation />
      <JoinAyoSection />
      <FAQSection />
    </main>
  )
}
