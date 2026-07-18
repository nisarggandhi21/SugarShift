import { POINTS_RATE } from '../cart'

const money = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

function CartDrawer({ open, onClose, cart, onUpdateQty, onRemove, onCheckout, checkingOut, user }) {
  if (!open) return null

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const previewPoints = Math.round(subtotal * POINTS_RATE)

  let tierMessage = 'Sign in to track your tier progress.'
  if (user) {
    const { points, nextTier, nextTierMin } = user.loyalty
    const projected = points + previewPoints
    if (!nextTier) {
      tierMessage = "You're already at our top tier!"
    } else if (projected >= nextTierMin) {
      tierMessage = `This order unlocks ${nextTier} tier! 🎉`
    } else {
      const pointsShort = nextTierMin - projected
      const amountShort = Math.ceil(pointsShort / POINTS_RATE)
      tierMessage = `Add ${money(amountShort)} more to unlock ${nextTier} tier`
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="animate-panel-in fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[80vh] w-full max-w-[640px] flex-col rounded-t-2xl border-2 border-b-0 border-line bg-surface shadow-hard">
        <div className="flex items-center justify-between border-b-2 border-line p-5">
          <h2 className="text-2xl">Your cart</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-line text-sm font-bold"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <p className="py-10 text-center font-semibold text-ink-muted">Your cart is empty.</p>
          ) : (
            <div className="flex flex-col gap-3.5">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 flex-shrink-0 rounded-lg border-2 border-line object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{item.name}</p>
                    <p className="card-subtitle">{money(item.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-line font-bold"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-line font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="w-16 shrink-0 text-right text-sm font-extrabold">
                    {money(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(item.productId)}
                    className="text-ink-muted transition hover:text-status-critical"
                    aria-label={`Remove ${item.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t-2 border-line p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-bold">Subtotal</span>
              <span className="font-display text-xl">{money(subtotal)}</span>
            </div>
            <p className="mb-4 rounded-lg border-2 border-line bg-cream px-3 py-2 text-[12.5px] font-semibold text-accent-deep">
              {tierMessage}
            </p>
            <button
              type="button"
              className="btn btn-accent w-full py-3 disabled:cursor-default disabled:opacity-60"
              disabled={checkingOut}
              onClick={onCheckout}
            >
              {checkingOut ? 'Placing order…' : 'Checkout'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer
