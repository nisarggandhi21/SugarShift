import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Shop from './components/Shop'
import OrdersHistory from './components/OrdersHistory'
import Toast from './components/Toast'
import { getMe } from './api'
import { getInitialTheme, applyTheme } from './theme'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('shop')
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [theme, setTheme] = useState(getInitialTheme)
  const toastTimer = useRef(null)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    getMe()
      .then((data) => setUser(data?.user ?? null))
      .finally(() => setLoading(false))
  }, [])

  const notify = (message, tone = 'default') => {
    clearTimeout(toastTimer.current)
    setToast({ message, tone })
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }

  const handleLoyaltyUpdate = (loyalty) => {
    setUser((u) => (u ? { ...u, loyalty } : u))
  }

  if (loading) return null

  return (
    <>
      <Navbar
        user={user}
        view={view}
        onNavigate={setView}
        onAuthSuccess={setUser}
        onLogout={() => setUser(null)}
        menuOpen={menuOpen}
        onMenuOpenChange={setMenuOpen}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      {view === 'shop' ? (
        <Shop
          user={user}
          onLoyaltyUpdate={handleLoyaltyUpdate}
          onNotify={notify}
          onRequireAuth={() => {
            setMenuOpen(true)
            notify('Sign in to complete your purchase')
          }}
        />
      ) : (
        <OrdersHistory user={user} />
      )}

      <Toast message={toast?.message} tone={toast?.tone} />
    </>
  )
}

export default App
