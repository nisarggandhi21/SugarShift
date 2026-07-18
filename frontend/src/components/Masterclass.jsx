import { useState } from 'react'
import { getCurrentSession } from '../masterclassHosts'

const dateLabel = (d) =>
  d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
const timeLabel = (d) =>
  d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) + ' IST'
const monthLabel = (d) => d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

const avatarUrl = (name) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`

function Masterclass({ user, onNotify }) {
  const [reserved, setReserved] = useState(false)
  const isDiamond = user?.loyalty.tier === 'Diamond'
  const session = getCurrentSession()

  const handleReserve = () => {
    if (!isDiamond) {
      onNotify('Reserving a seat is a Diamond-tier perk', 'error')
      return
    }
    setReserved(true)
    onNotify(`Seat reserved with ${session.host.instructor}`, 'success')
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 p-8">
      <div className="mb-6 text-left">
        <h1 className="text-[44px] leading-none">Beauty masterclass</h1>
        <p className="card-subtitle">
          One exclusive live session every 6 months — open to everyone, joining is Diamond-only.
        </p>
      </div>

      <div className="card bg-cream p-8">
        <span className="card-subtitle">This period's featured host</span>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={avatarUrl(session.host.instructor)}
              alt={session.host.instructor}
              className="h-16 w-16 flex-shrink-0 rounded-full border-2 border-line bg-surface"
            />
            <div>
              <span className="mb-2 inline-block rounded-full border-2 border-line bg-yellow px-3 py-1 text-[11px] font-extrabold tracking-wide uppercase">
                Top {session.host.rank} beauty seller
              </span>
              <h2 className="font-sans text-2xl font-extrabold normal-case">{session.host.instructor}</h2>
              <p className="mt-1 text-sm text-ink-muted">{session.host.specialty}</p>
              <p className="mt-3 text-sm font-semibold">
                {dateLabel(session.date)} · {timeLabel(session.date)}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <button
              type="button"
              className={`btn whitespace-nowrap ${isDiamond ? 'btn-accent' : ''} disabled:opacity-60`}
              disabled={!isDiamond || reserved}
              onClick={handleReserve}
            >
              {isDiamond ? (reserved ? 'Reserved' : 'Reserve seat') : 'Diamond members only'}
            </button>
            {!isDiamond && (
              <span className="rounded-full border-2 border-line bg-tier-diamond/20 px-2.5 py-1 text-[10.5px] font-extrabold tracking-wide text-tier-diamond-ink uppercase">
                Diamond exclusive
              </span>
            )}
          </div>
        </div>

        {!isDiamond && (
          <p className="mt-6 border-t-2 border-dashed border-line pt-4 text-[12.5px] font-semibold text-accent-deep">
            {user
              ? `You're currently ${user.loyalty.tier} — ${
                  user.loyalty.pointsToNextTier > 0
                    ? `${user.loyalty.pointsToNextTier.toLocaleString('en-IN')} points from ${user.loyalty.nextTier}`
                    : 'almost there!'
                }. Reach Diamond to join live.`
              : 'Sign in and reach Diamond tier to join live.'}
          </p>
        )}

        <p className="mt-6 border-t-2 border-dashed border-line pt-4 text-[12.5px] font-semibold text-ink-muted">
          A new top seller hosts every 6 months — check back in {monthLabel(session.nextDate)} for
          the next exclusive session.
        </p>
      </div>
    </main>
  )
}

export default Masterclass
