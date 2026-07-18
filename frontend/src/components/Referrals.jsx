import { useEffect, useState } from 'react'
import { getMyReferrals } from '../api'

const dateLabel = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const TIER_ORDER = ['Bronze', 'Silver', 'Gold', 'Diamond']

function Referrals({ user, onNotify }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    getMyReferrals()
      .then(setData)
      .finally(() => setLoading(false))
  }, [user])

  const link = data ? `${window.location.origin}/?ref=${data.code}` : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      onNotify('Could not copy — copy the link manually', 'error')
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 p-8">
      <div className="mb-6 text-left">
        <h1 className="text-[44px] leading-none">Refer & earn</h1>
        <p className="card-subtitle">
          Share your code — the bonus you earn scales with your tier.
        </p>
      </div>

      {!user ? (
        <div className="card p-10 text-center text-ink-muted">
          <p>Sign in to get your referral code.</p>
        </div>
      ) : loading ? (
        <p className="py-10 text-center font-semibold text-ink-muted">Loading…</p>
      ) : (
        <>
          <div className="card mb-7 bg-cream">
            <span className="card-subtitle">Your referral link</span>
            <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
              <input
                readOnly
                value={link}
                onFocus={(e) => e.target.select()}
                className="flex-1 rounded-lg border-2 border-line bg-surface px-3 py-2.5 font-mono text-[13px] text-ink"
              />
              <button type="button" className="btn btn-accent whitespace-nowrap" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t-2 border-dashed border-line pt-5 sm:grid-cols-4">
              {TIER_ORDER.map((t) => (
                <div
                  key={t}
                  className={`rounded-xl border-2 px-3 py-2.5 text-center ${
                    t === data.tier ? 'border-accent bg-accent/10' : 'border-line'
                  }`}
                >
                  <div className="text-[10.5px] font-extrabold tracking-wide text-ink-muted uppercase">
                    {t}
                  </div>
                  <div className="font-display text-xl">{data.tierMultipliers[t]}×</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12.5px] font-semibold text-ink-muted">
              As a {data.tier} member, each friend you refer earns you{' '}
              <span className="text-accent-deep">{data.currentMultiplier}× the base bonus</span>.
            </p>
          </div>

          <div className="mb-7 grid grid-cols-2 gap-5">
            <div className="card text-center">
              <span className="card-subtitle">Friends referred</span>
              <div className="font-display mt-1 text-3xl">{data.totalReferrals}</div>
            </div>
            <div className="card text-center">
              <span className="card-subtitle">Bonus points earned</span>
              <div className="font-display mt-1 text-3xl">
                {data.totalBonusEarned.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <h2 className="mb-4 text-2xl">Your referrals</h2>
          {data.referrals.length === 0 ? (
            <div className="card p-10 text-center text-ink-muted">
              <p>No referrals yet — share your link above.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {data.referrals.map((r) => (
                <div className="card flex items-center justify-between p-3.5 px-[18px]" key={r.id}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold">{r.referredName || r.referredEmail}</span>
                    <span className="card-subtitle">{dateLabel(r.createdAt)}</span>
                  </div>
                  <span className="text-xs font-bold text-accent-deep">+{r.bonusPoints} pts</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default Referrals
