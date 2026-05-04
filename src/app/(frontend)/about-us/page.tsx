import AboutIntro from '../components/AboutIntro'
import Grid from '../components/Grid'

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <AboutIntro />
      <Grid title="People" placeholderSubtitle="Name" />
      <Grid title="Alumni" placeholderSubtitle="Role" />
      <Grid title="Partners" placeholderSubtitle="Company" />
    </main>
  )
}
