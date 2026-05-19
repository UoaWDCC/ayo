import AboutIntro from '../components/AboutIntro'
import Grid from '../components/Grid'
import Hero from '../components/Hero'

export default function AboutUsPage() {
  return (
    <div>
      <Hero title="About Us" backgroundImage="/hero-placeholder.jpg" />
      <main className="min-h-screen bg-white text-black">
        <AboutIntro />
        <Grid title="People" placeholderSubtitle="Name" />
        <Grid title="Alumni" placeholderSubtitle="Role" />
        <Grid title="Partners" placeholderSubtitle="Company" />
      </main>
    </div>
  )
}
