import { useEffect, useRef, useState } from 'react'

function NavDropdown({ label, items, activeKey, onSelect }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const isActive = items.some((i) => i.key === activeKey)

  useEffect(() => {
    const handleClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
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

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-bold transition ${
          isActive ? 'bg-yellow text-ink' : 'text-ink-muted hover:bg-cream hover:text-ink'
        }`}
      >
        {label}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="animate-panel-in absolute top-[calc(100%+8px)] left-0 z-40 w-56 rounded-xl border-2 border-line bg-surface p-1.5 shadow-hard"
        >
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                onSelect(item.key)
                setOpen(false)
              }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-bold transition ${
                activeKey === item.key ? 'bg-yellow text-ink' : 'text-ink hover:bg-cream'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default NavDropdown
