import React from 'react'
import '../styles.css'
import VolunteersBlock from '../components/VolunteersBlock'
export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div>
        <div className="w-full min-h-screen flex justify-center">
          <VolunteersBlock />
        </div>
      </div>
    </div>
  )
}
