import { useEffect, useRef, useState } from 'react'
import './AccountMenu.css'

const initials = (user) => {
  const source = user.name || user.email || '?'
  return source
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function AccountMenu({ user, onAuthSuccess, onLogout }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)

    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }
      onAuthSuccess(data.user)
      setOpen(false)
      setForm({ email: '', password: '', name: '' })
    } finally {
      setBusy(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    onLogout()
    setOpen(false)
  }

  return (
    <div className="account-menu" ref={rootRef}>
      <button
        type="button"
        className={`account-trigger${user ? ' is-authed' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {user ? (
          <span className="avatar-initials">{initials(user)}</span>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M4.5 19.2c1.4-3.2 4.2-4.9 7.5-4.9s6.1 1.7 7.5 4.9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <div className="account-panel" role="menu">
          {user ? (
            <div className="account-summary">
              <div className="avatar-initials avatar-large">{initials(user)}</div>
              <div className="account-identity">
                <strong>{user.name || 'Account'}</strong>
                <span>{user.email}</span>
              </div>
              <button type="button" className="btn-ghost" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          ) : (
            <div className="account-auth">
              <div className="mode-switch">
                <button
                  type="button"
                  className={mode === 'login' ? 'is-active' : ''}
                  onClick={() => setMode('login')}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className={mode === 'register' ? 'is-active' : ''}
                  onClick={() => setMode('register')}
                >
                  Sign up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="account-form">
                {mode === 'register' && (
                  <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                )}
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                />
                {error && <p className="account-error">{error}</p>}
                <button type="submit" className="btn-primary" disabled={busy}>
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                </button>
              </form>

              <div className="account-divider">
                <span>or</span>
              </div>

              <a href="/api/auth/google" className="btn-google">
                <svg viewBox="0 0 18 18" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z"
                  />
                </svg>
                Continue with Google
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AccountMenu
