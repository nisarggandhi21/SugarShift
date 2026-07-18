import { useEffect, useState } from 'react'
import { getProducts, buyProduct } from '../api'
import ProductCard from './ProductCard'
import LoyaltyPanel from './LoyaltyPanel'

const CATEGORIES = ['All', 'Lips', 'Eyes', 'Face', 'Skincare', 'Nails', 'Fragrance & Body', 'Kits & Sets']

function Shop({ user, onLoyaltyUpdate, onNotify, onRequireAuth }) {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [buyingId, setBuyingId] = useState(null)

  useEffect(() => {
    setLoading(true)
    getProducts(category === 'All' ? undefined : category)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [category])

  const handleBuy = async (product) => {
    if (!user) {
      onRequireAuth()
      return
    }

    setBuyingId(product.id)
    try {
      const { order, loyalty } = await buyProduct(product.id, 1)
      onLoyaltyUpdate(loyalty)
      onNotify(`Added to your order — +${order.pointsEarned} pts earned`, 'success')
    } catch (err) {
      onNotify(err.message, 'error')
    } finally {
      setBuyingId(null)
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 p-8">
      <div className="mb-6 text-left">
        <h1 className="text-[44px] leading-none">Shop SUGAR</h1>
        <p className="card-subtitle">
          Bold makeup, real prices, real points — every order moves you up a tier.
        </p>
      </div>

      {user && (
        <div className="mb-7">
          <LoyaltyPanel loyalty={user.loyalty} />
        </div>
      )}

      <div className="mb-[26px] flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full border-2 border-line px-4 py-2 text-[13px] font-bold transition hover:-translate-x-px hover:-translate-y-px hover:shadow-hard-sm ${
              c === category ? 'bg-accent text-accent-ink' : 'bg-surface text-ink'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-10 text-center font-semibold text-ink-muted">Loading products…</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 text-left">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onBuy={handleBuy} busy={buyingId === p.id} />
          ))}
        </div>
      )}
    </main>
  )
}

export default Shop
