const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`

function ProductCard({ product, onBuy, busy }) {
  const price = Number(product.price)
  const compareAt = product.compare_at_price ? Number(product.compare_at_price) : null
  const discount = compareAt ? Math.round(((compareAt - price) / compareAt) * 100) : null

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-line bg-surface shadow-hard transition hover:-translate-x-0.5 hover:-translate-y-0.5">
      {discount && (
        <span className="absolute top-2.5 left-2.5 z-10 rounded-full border-2 border-line bg-yellow px-2.5 py-0.5 text-[11px] font-extrabold">
          -{discount}%
        </span>
      )}
      <div className="aspect-square overflow-hidden border-b-2 border-line bg-cream">
        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <span className="text-[10.5px] font-extrabold tracking-wide text-ink-muted uppercase">
          {product.brand}
        </span>
        <h3 className="min-h-[2.6em] font-sans text-sm leading-tight font-bold normal-case">
          {product.name}
        </h3>
        <div className="my-1 mb-2.5 flex items-baseline gap-2">
          <span className="text-base font-extrabold">{money(price)}</span>
          {compareAt && (
            <span className="text-[12.5px] text-ink-muted line-through">{money(compareAt)}</span>
          )}
        </div>
        <button
          type="button"
          className="btn btn-accent mt-auto w-full"
          onClick={() => onBuy(product)}
          disabled={busy}
        >
          {busy ? 'Adding…' : 'Buy now'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
