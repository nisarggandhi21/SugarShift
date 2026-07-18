import { useEffect, useState } from 'react'
import { getMyOrders } from '../api'

const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`
const dateLabel = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

function OrdersHistory({ user }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
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
      ) : orders.length === 0 ? (
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
    </main>
  )
}

export default OrdersHistory
