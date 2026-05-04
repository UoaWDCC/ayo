import React from 'react'

export type Report = {
  id: string | number
  filename: string
  year?: number
  type?: string
  url?: string
}

const PLACEHOLDER_REPORTS: Report[] = [
  { id: 1, filename: 'AYO_Annual_Report_2024.pdf', year: 2024, type: 'Annual Report' },
  { id: 2, filename: 'Auckland_Youth_Orchestra_Annual_Report_2023.pdf', year: 2023, type: 'Annual Report' },
  { id: 3, filename: 'AYO_Financial_Statements_2022.pdf', year: 2022, type: 'Financial' },
  { id: 4, filename: 'Auckland_Youth_Orchestra_Annual_Return_2021.pdf', year: 2021, type: 'Annual Report' },
  { id: 5, filename: 'AYO_Charity_Report_2020.pdf', year: 2020, type: 'Charity' },
  { id: 6, filename: 'Auckland_Youth_Orchestra_Financial_Report_2019.pdf', year: 2019, type: 'Financial' },
  { id: 7, filename: 'AYO_Annual_Performance_and_Financial_Report_2018.pdf', year: 2018, type: 'Annual Report' },
  { id: 8, filename: 'Auckland_Youth_Orchestra_Annual_Report_and_Audited_Accounts_2017.pdf', year: 2017, type: 'Annual Report' },
]

type AnnualReportsProps = {
  reports?: Report[]
}

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const AnnualReports = ({ reports = PLACEHOLDER_REPORTS }: AnnualReportsProps) => {
  return (
    <section className="w-full py-12 px-10">
      <h1 className="text-4xl font-bold leading-none m-0 mb-6">Annual Reports</h1>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-6 text-sm text-black/40">
          <span>
            Year <span className="font-bold text-black">All</span>
          </span>
          <span>
            Type <span className="font-bold text-black">All</span>
          </span>
        </div>
        <span className="text-sm text-black/40 italic">Showing {reports.length} reports</span>
      </div>

      <div className="border-t border-black/10">
        {reports.map((report) => (
          <div key={report.id} className="flex items-center gap-3 py-5 border-b border-black/10">
            <a
              href={report.url ?? '#'}
              className="text-sm underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              {report.filename}
            </a>
            <a
              href={report.url ?? '#'}
              download
              aria-label={`Download ${report.filename}`}
              className="hover:opacity-70 transition-opacity"
            >
              <DownloadIcon />
            </a>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 text-sm">
        <div className="flex gap-6">
          <button className="underline underline-offset-2 hover:opacity-70 transition-opacity">Previous</button>
          <button className="underline underline-offset-2 hover:opacity-70 transition-opacity">Next</button>
        </div>
        <span className="text-black/40">1 of 1</span>
      </div>
    </section>
  )
}

export default AnnualReports
