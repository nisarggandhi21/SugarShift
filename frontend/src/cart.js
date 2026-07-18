const STORAGE_KEY = 'sugarshift-cart'

// Mirrors the backend's POINTS_RATE (10% of purchase value) for the
// tier-progress preview shown in the cart — actual points are always
// computed and awarded server-side at checkout.
export const POINTS_RATE = 0.1

export const getInitialCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const saveCart = (cart) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
}
