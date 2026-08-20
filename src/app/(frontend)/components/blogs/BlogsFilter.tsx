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

export default function BlogsFilter() {
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedMonth, setSelectedMonth] = useState('All')
  return (
    <div className="flex gap-6 mb-6">
      <p className="mr-6 text-muted font-medium">Year</p>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="font-semibold underline appearance-none"
      >
        <option value="2025">2025</option>
        <option value="2024">2024</option>
      </select>
      <p className="ml-15 mr-6 text-muted font-medium">Month</p>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="font-semibold underline appearance-none"
      >
        <option value="">All</option>
        <option value="November">November</option>
        <option value="June">June</option>
      </select>
    </div>
  )
}
