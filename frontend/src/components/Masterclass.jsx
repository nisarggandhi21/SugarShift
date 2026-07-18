import { useState } from 'react'

const SESSIONS = [
  {
    id: 1,
    title: 'Flawless Base 101',
    instructor: 'Led by SUGAR’s Global Makeup Artist',
    date: '2026-08-02',
    time: '6:00 PM IST',
  },
  {
    id: 2,
    title: 'Bold Lips, Zero Fear',
    instructor: 'Led by SUGAR’s Creative Director',
    date: '2026-08-16',
    time: '6:00 PM IST',
  },
  {
    id: 3,
    title: 'Editorial Eyes at Home',
    instructor: 'Led by SUGAR’s Global Makeup Artist',
    date: '2026-09-06',
    time: '6:00 PM IST',
  },
]

const dateLabel = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

function Masterclass({ user, onNotify }) {
  const [reserved, setReserved] = useState([])
  const isDiamond = user?.loyalty.tier === 'Diamond'

  const handleReserve = (session) => {
    setReserved((r) => [...r, session.id])
    onNotify(`Seat reserved: ${session.title}`, 'success')
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 p-8">
      <div className="mb-6 text-left">
        <h1 className="text-[44px] leading-none">Beauty masterclass</h1>
        <p className="card-subtitle">Live sessions with SUGAR's artists — Diamond exclusive.</p>
      </div>

      {!isDiamond ? (
        <div className="card flex flex-col items-center gap-4 bg-cream p-12 text-center">
          <span className="rounded-full border-2 border-line bg-tier-diamond/20 px-4 py-1.5 text-xs font-extrabold tracking-wide text-tier-diamond-ink uppercase">
            Diamond exclusive
          </span>
          <h2 className="text-2xl">Locked</h2>
          <p className="max-w-md text-sm text-ink-muted">
            Live masterclasses with our artists are reserved for Diamond members. Keep shopping and
            referring friends to unlock — your points page shows exactly how close you are.
          </p>
          {user ? (
            <p className="text-[12.5px] font-semibold text-accent-deep">
              You're currently {user.loyalty.tier} — {user.loyalty.pointsToNextTier > 0
                ? `${user.loyalty.pointsToNextTier.toLocaleString('en-IN')} points from ${user.loyalty.nextTier}`
                : 'almost there!'}
            </p>
          ) : (
            <p className="text-[12.5px] font-semibold text-ink-muted">Sign in to check your tier progress.</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {SESSIONS.map((s) => {
            const isReserved = reserved.includes(s.id)
            return (
              <div key={s.id} className="card flex items-center justify-between gap-4 p-5">
                <div>
                  <h3 className="font-sans text-base font-bold normal-case">{s.title}</h3>
                  <p className="mt-1 text-[12.5px] text-ink-muted">{s.instructor}</p>
                  <p className="mt-1 text-[12.5px] font-semibold">
                    {dateLabel(s.date)} · {s.time}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-accent whitespace-nowrap disabled:opacity-60"
                  disabled={isReserved}
                  onClick={() => handleReserve(s)}
                >
                  {isReserved ? 'Reserved' : 'Reserve seat'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default Masterclass
