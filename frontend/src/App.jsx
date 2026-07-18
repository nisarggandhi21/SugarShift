import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null

  return (
    <>
      <Navbar user={user} onAuthSuccess={setUser} onLogout={() => setUser(null)} />
      <Dashboard user={user} />
    </>
  )
}

export default App
