'use client'
import { useState } from 'react'

const Years = ['2025', '2024', '2023', '2022', '2021']
const Months = [
  'All',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

{
  /*type FilterOption = {
  onYearChange: (year: string) => void
  onMonthChange: (month: string) => void
}*/
}

export default function BlogsFilter() {
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedMonth, setSelectedMonth] = useState('All')
  return (
    <div className="flex gap-6 mb-6 lg:pl-12">
      <p className="text-muted">Year</p>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="appearance-none font-semibold hover:text-muted transition-colors"
      >
        <option value="2025">2025</option>
        <option value="2024">2024</option>
      </select>
      <p className="text-muted">Month</p>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="appearance-none font-semibold hover:text-muted transition-colors"
      >
        <option value="">All</option>
        <option value="November">November</option>
        <option value="June">June</option>
      </select>
    </div>
  )
}
