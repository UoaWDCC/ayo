import React from 'react'
import './styles.css'
import Grid from './components/Grid'
import AnnualReports from './components/AnnualReports'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Grid title="People" placeholderSubtitle="Name" />
      <Grid title="Alunmi" placeholderSubtitle="Role" />
      <Grid title="Partners" placeholderSubtitle="Company" />
      <AnnualReports />
    </div>
  )
}
