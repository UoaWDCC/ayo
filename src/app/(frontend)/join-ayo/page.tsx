import FAQSection from '../components/FAQSection'
import JoinAyoSection from '../components/join-ayo/JoinAyoBlock'
import ScrollAnimation from '../components/join-ayo/ScrollAnimation'

export default function JoinAyoPage() {
  return (
    <main className="items-center justify-center flex flex-col">
      <div className="aspect-square w-10 h-10 bg-amber-400"></div>
      <ScrollAnimation />
      <JoinAyoSection />
      <FAQSection />
    </main>
  )
}
