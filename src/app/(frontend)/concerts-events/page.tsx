import Hero from '../components/Hero'
export default function ConcertsEventsPage() {
  return (
    <div className="w-full h-[400px] relative">
      <div className="w-full h-[vh] relative">
        <Hero title="Concert & Events" backgroundImage="/hero-placeholder.jpg" />
      </div>
      <main>This is the concerts & events page</main>
    </div>
  )
}
