'use client'
import MyAYOLink from '../components/MyAYOLink'
import { useState } from 'react'
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <main>
      <form className="ml-20">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Log In</button>
      </form>
    </main>
  )
}
