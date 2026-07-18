import { useEffect, useState } from 'react'
import { getProduct } from '../api'
import { getDummyStats, getRegionStats } from '../productStats'

const REGIONS = [
  { key: 'north', label: 'North', barClass: 'bg-accent' },
  { key: 'south', label: 'South', barClass: 'bg-yellow' },
  { key: 'east', label: 'East', barClass: 'bg-tier-diamond' },
  { key: 'west', label: 'West', barClass: 'bg-tier-bronze' },
]

const money = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

const PLANS = [
  { key: 'one-time', label: 'One-time purchase', discountPercent: 0 },
  { key: 3, label: 'Subscribe & Save — 3 months', discountPercent: 10 },
  { key: 6, label: 'Subscribe & Save — 6 months', discountPercent: 15 },
]

function ProductDetail({ productId, user, onAddToCart, onDirectCheckout, onSubscribe, onRequireAuth, onNotify }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState('one-time')
  const [quantity, setQuantity] = useState(1)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setLoading(true)
    setPlan('one-time')
    setQuantity(1)
    getProduct(productId)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [productId])

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-[1280px] flex-1 p-8">
        <p className="py-10 text-center font-semibold text-ink-muted">Loading…</p>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="mx-auto w-full max-w-[1280px] flex-1 p-8">
        <p className="py-10 text-center font-semibold text-ink-muted">Product not found.</p>
      </main>
    )
  }

  const price = Number(product.price)
  const compareAt = product.compare_at_price ? Number(product.compare_at_price) : null
  const stats = getDummyStats(product.id)
  const regionStats = getRegionStats(product.id)
  const activePlan = PLANS.find((p) => p.key === plan)
  const unitPrice = plan === 'one-time' ? price : Math.round(price * (1 - activePlan.discountPercent / 100) * 100) / 100

  const requireAuth = () => {
    if (!user) {
      onRequireAuth()
      return false
    }
    return true
  }

  const handleAddToCart = () => {
    if (plan !== 'one-time') return
    for (let i = 0; i < quantity; i++) onAddToCart(product)
  }

  const handleBuyNow = async () => {
    if (!requireAuth()) return
    setBusy(true)
    try {
      await onDirectCheckout(product, quantity)
    } finally {
      setBusy(false)
    }
  }

  const handleSubscribe = async () => {
    if (!requireAuth()) return
    setBusy(true)
    try {
      await onSubscribe(product, plan)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 p-8">
      <div className="grid grid-cols-1 gap-8 text-left md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border-2 border-line bg-cream">
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div>
          <span className="text-[11px] font-extrabold tracking-wide text-ink-muted uppercase">
            {product.brand}
          </span>
          <h1 className="mt-1 font-sans text-3xl font-extrabold normal-case">{product.name}</h1>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-display text-3xl">{money(unitPrice)}</span>
            {plan === 'one-time' && compareAt && (
              <span className="text-base text-ink-muted line-through">{money(compareAt)}</span>
            )}
            {plan !== 'one-time' && (
              <span className="rounded-full border-2 border-line bg-yellow px-2.5 py-0.5 text-[11px] font-extrabold uppercase">
                {activePlan.discountPercent}% off
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-muted">{product.description}</p>

          <p className="mt-4 text-[13px] font-bold text-status-critical">
            Only {stats.remaining} left in stock — order soon!
          </p>
          <p className="mt-1.5 text-[12.5px] font-bold text-ink-muted">
            {stats.bought}+ bought in the past month · {stats.subscriberPercent}% of buyers are
            subscribers
          </p>

          <div className="mt-3">
            <div className="flex h-2.5 overflow-hidden rounded-full border-2 border-line">
              {REGIONS.map((r) => (
                <div
                  key={r.key}
                  className={r.barClass}
                  style={{ width: `${regionStats[r.key]}%` }}
                  title={`${r.label}: ${regionStats[r.key]}%`}
                />
              ))}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
              {REGIONS.map((r) => (
                <span key={r.key} className="flex items-center gap-1.5 text-[11px] font-bold text-ink-muted">
                  <span className={`h-2 w-2 rounded-full ${r.barClass}`} />
                  {r.label} {regionStats[r.key]}%
                </span>
              ))}
            </div>
          </div>

          <div className="card mt-6 bg-cream">
            <span className="mb-3 block text-[11px] font-extrabold tracking-wide text-ink-muted uppercase">
              Purchase option
            </span>
            <div className="flex flex-col gap-2.5">
              {PLANS.map((p) => {
                const planPrice =
                  p.key === 'one-time'
                    ? price
                    : Math.round(price * (1 - p.discountPercent / 100) * 100) / 100
                return (
                  <label
                    key={p.key}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border-2 px-3 py-2.5 transition ${
                      plan === p.key ? 'border-accent bg-accent/10' : 'border-line bg-surface'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="plan"
                        checked={plan === p.key}
                        onChange={() => setPlan(p.key)}
                        className="h-4 w-4 accent-current"
                      />
                      <span className="text-sm font-bold">{p.label}</span>
                    </span>
                    <span className="flex flex-col items-end whitespace-nowrap">
                      <span className="text-sm font-extrabold">
                        {money(planPrice)}
                        {p.key !== 'one-time' && (
                          <span className="ml-1 text-[11px] font-bold text-accent-deep">
                            ({p.discountPercent}% off)
                          </span>
                        )}
                      </span>
                      {p.key !== 'one-time' && (
                        <span className="text-[11px] text-ink-muted">
                          {money(planPrice * p.key)} total for {p.key} months
                        </span>
                      )}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {plan === 'one-time' ? (
            <>
              <div className="mt-5 flex items-center gap-3">
                <span className="text-[12.5px] font-bold">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-line font-bold"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-line font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <button type="button" className="btn flex-1" onClick={handleAddToCart}>
                  Add to cart
                </button>
                <button
                  type="button"
                  className="btn btn-accent flex-1 disabled:cursor-default disabled:opacity-60"
                  onClick={handleBuyNow}
                  disabled={busy}
                >
                  {busy ? 'Placing order…' : 'Buy now'}
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-accent mt-5 w-full disabled:cursor-default disabled:opacity-60"
              onClick={handleSubscribe}
              disabled={busy}
            >
              {busy ? 'Starting subscription…' : `Start ${plan}-month subscription`}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

export default ProductDetail
