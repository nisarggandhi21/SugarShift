import { useEffect, useState } from 'react'
import { getRewards, redeemReward, getRedemptions } from '../api'
import LoyaltyPanel from './LoyaltyPanel'
import InvoiceClaim from './InvoiceClaim'

const dateLabel = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

function Redeem({ user, onLoyaltyUpdate, onNotify }) {
  const [rewards, setRewards] = useState([])
  const [redemptions, setRedemptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [redeemingId, setRedeemingId] = useState(null)

  useEffect(() => {
    Promise.all([getRewards(), user ? getRedemptions() : Promise.resolve([])])
      .then(([r, h]) => {
        setRewards(r)
        setRedemptions(h)
      })
      .finally(() => setLoading(false))
  }, [user])

  const handleRedeem = async (reward) => {
    if (!user) {
      onNotify('Sign in to redeem rewards')
      return
    }

    setRedeemingId(reward.id)
    try {
      const { loyalty } = await redeemReward(reward.id)
      onLoyaltyUpdate(loyalty)
      setRedemptions((r) => [
        { id: Date.now(), rewardId: reward.id, rewardName: reward.name, points: reward.cost, createdAt: new Date() },
        ...r,
      ])
      onNotify(`Redeemed: ${reward.name}`, 'success')
    } catch (err) {
      onNotify(err.message, 'error')
    } finally {
      setRedeemingId(null)
    }
  }

  const balance = user?.loyalty.points ?? 0

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 p-8">
      <div className="mb-6 text-left">
        <h1 className="text-[44px] leading-none">Redeem points</h1>
        <p className="card-subtitle">Turn your points into vouchers and free products.</p>
      </div>

      {user && (
        <div className="mb-7">
          <LoyaltyPanel loyalty={user.loyalty} />
        </div>
      )}

      {loading ? (
        <p className="py-10 text-center font-semibold text-ink-muted">Loading rewards…</p>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 text-left">
            {rewards.map((r) => {
              const affordable = balance >= r.cost
              return (
                <div key={r.id} className="card flex flex-col gap-3">
                  <div>
                    <h3 className="font-sans text-sm font-bold normal-case">{r.name}</h3>
                    <p className="mt-1 text-[12.5px] text-ink-muted">{r.description}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="font-display text-xl">{r.cost.toLocaleString('en-IN')} pts</span>
                    <button
                      type="button"
                      className="btn btn-accent"
                      disabled={!user || !affordable || redeemingId === r.id}
                      onClick={() => handleRedeem(r)}
                    >
                      {redeemingId === r.id
                        ? 'Redeeming…'
                        : !user
                          ? 'Sign in'
                          : affordable
                            ? 'Redeem'
                            : 'Not enough pts'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {user && (
            <div className="mt-10">
              <h2 className="mb-4 text-2xl">Redemption history</h2>
              {redemptions.length === 0 ? (
                <div className="card p-10 text-center text-ink-muted">
                  <p>No redemptions yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {redemptions.map((r) => (
                    <div className="card flex items-center justify-between p-3.5 px-[18px]" key={r.id}>
                      <span className="text-sm font-bold">{r.rewardName}</span>
                      <div className="flex items-center gap-4">
                        <span className="card-subtitle">{dateLabel(r.createdAt)}</span>
                        <span className="text-xs font-bold text-accent-deep">-{r.points} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <InvoiceClaim user={user} onLoyaltyUpdate={onLoyaltyUpdate} onNotify={onNotify} />
        </>
      )}
    </main>
  )
}

export default Redeem
