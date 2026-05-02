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
    <div>
      <p>Year</p>
      <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
        <option value="2025">2025</option>
        <option value="2024">2024</option>
      </select>

      <p>Month</p>
      <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
        <option value="">All</option>
        <option value="November">November</option>
        <option value="June">June</option>
      </select>
    </div>
  )
}
