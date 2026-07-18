import { useEffect, useRef, useState } from 'react'

const initials = (user) => {
  const source = user.name || user.email || '?'
  return source
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function AccountMenu({ user, onAuthSuccess, onLogout, open, onOpenChange }) {
  const setOpen = onOpenChange
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
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-line text-ink transition hover:-translate-x-px hover:-translate-y-px hover:shadow-hard-sm ${
          user ? 'bg-yellow' : 'bg-surface'
        }`}
      >
        {user ? (
          <span className="flex h-full w-full items-center justify-center rounded-full text-[13px] font-extrabold tracking-wide">
            {initials(user)}
          </span>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
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
        <div
          role="menu"
          className="animate-panel-in absolute top-[calc(100%+12px)] right-0 z-40 w-[300px] rounded-2xl border-2 border-line bg-surface p-[18px] shadow-hard"
        >
          {user ? (
            <div className="flex flex-col items-center gap-2.5 text-center">
              <div className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-full border-2 border-line bg-yellow text-[17px] font-extrabold tracking-wide">
                {initials(user)}
              </div>
              <div className="flex flex-col gap-0.5">
                <strong className="text-[14.5px] font-bold">{user.name || 'Account'}</strong>
                <span className="text-[12.5px] text-ink-muted">{user.email}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg border-2 border-line px-4 py-2 text-[13px] font-bold transition hover:bg-accent/10 hover:text-accent-deep"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-3.5 flex rounded-lg border-2 border-line p-0.5">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 rounded-md py-1.5 text-[13px] font-bold transition ${
                    mode === 'login' ? 'bg-yellow text-ink' : 'text-ink-muted'
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`flex-1 rounded-md py-1.5 text-[13px] font-bold transition ${
                    mode === 'register' ? 'bg-yellow text-ink' : 'text-ink-muted'
                  }`}
                >
                  Sign up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                {mode === 'register' && (
                  <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    className="rounded-lg border-2 border-line bg-cream px-2.5 py-2 text-[13.5px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
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
                  className="rounded-lg border-2 border-line bg-cream px-2.5 py-2 text-[13.5px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  className="rounded-lg border-2 border-line bg-cream px-2.5 py-2 text-[13.5px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
                />
                {error && <p className="m-0 text-[12.5px] font-semibold text-status-critical">{error}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  className="btn btn-accent mt-0.5 w-full py-2.5 disabled:cursor-default disabled:opacity-60"
                >
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                </button>
              </form>

              <div className="my-3.5 flex items-center gap-2.5 text-[11.5px] uppercase tracking-wide text-ink-muted">
                <span className="h-px flex-1 bg-line opacity-25" />
                <span>or</span>
                <span className="h-px flex-1 bg-line opacity-25" />
              </div>

              <a
                href="/api/auth/google"
                className="flex items-center justify-center gap-2.5 rounded-lg border-2 border-line py-2.5 text-[13px] font-bold text-ink no-underline transition hover:bg-cream"
              >
                <svg viewBox="0 0 18 18" className="h-4 w-4" aria-hidden="true">
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
