import { useEffect, useState } from 'react'
import { getMyOrders, getMySubscriptions } from '../api'

const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`
const dateLabel = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

function OrdersHistory({ user }) {
  const [orders, setOrders] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    Promise.all([getMyOrders(), getMySubscriptions()])
      .then(([o, s]) => {
        setOrders(o)
        setSubscriptions(s)
      })
      .catch(() => {
        setOrders([])
        setSubscriptions([])
      })
      .finally(() => setLoading(false))
  }, [user])

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 p-8">
      <div className="mb-6 text-left">
        <h1 className="text-[44px] leading-none">My orders</h1>
        <p className="card-subtitle">Everything you've bought, and the points you earned.</p>
      </div>

      {!user ? (
        <div className="card p-10 text-center text-ink-muted">
          <p>Sign in to see your order history.</p>
        </div>
      ) : loading ? (
        <p className="py-10 text-center font-semibold text-ink-muted">Loading orders…</p>
      ) : (
        <>
          {subscriptions.length > 0 && (
            <div className="mb-10">
              <h2 className="mb-3 text-2xl">My subscriptions</h2>
              <div className="flex flex-col gap-3.5">
                {subscriptions.map((s) => (
                  <div className="card flex items-center gap-4 p-3.5 px-[18px]" key={s.id}>
                    <img
                      src={s.productImage}
                      alt={s.productName}
                      className="h-14 w-14 flex-shrink-0 rounded-[10px] border-2 border-line object-cover"
                    />
                    <div className="flex flex-1 flex-col gap-0.5">
                      <span className="text-sm font-bold">{s.productName}</span>
                      <span className="card-subtitle">
                        {s.discountPercent}% off · delivered on {dateLabel(s.startedAt)}, monthly
                        for the next {s.durationMonths} months
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[15px] font-extrabold">{money(s.pricePerDelivery)}</span>
                      <span className="rounded-full border-2 border-line bg-status-good/15 px-2 py-0.5 text-[10.5px] font-extrabold tracking-wide text-status-good uppercase">
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="mb-3 text-2xl">Orders</h2>
          {orders.length === 0 ? (
            <div className="card p-10 text-center text-ink-muted">
              <p>No orders yet — head to the shop and treat yourself.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {orders.map((o) => (
                <div className="card flex items-center gap-4 p-3.5 px-[18px]" key={o.id}>
                  <img
                    src={o.productImage}
                    alt={o.productName}
                    className="h-14 w-14 flex-shrink-0 rounded-[10px] border-2 border-line object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-sm font-bold">{o.productName}</span>
                    <span className="card-subtitle">
                      Qty {o.quantity} · {dateLabel(o.createdAt)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[15px] font-extrabold">{money(o.amount)}</span>
                    <span className="text-xs font-bold text-accent-deep">+{o.pointsEarned} pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default OrdersHistory
