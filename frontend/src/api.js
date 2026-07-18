const request = async (url, options = {}) => {
  const res = await fetch(url, { credentials: 'include', ...options })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.error || 'Something went wrong')
  }
  return data
}

export const getMe = () =>
  fetch('/api/auth/me', { credentials: 'include' }).then((res) =>
    res.ok ? res.json() : null
  )

export const getProducts = (category) =>
  request(`/api/products${category ? `?category=${encodeURIComponent(category)}` : ''}`)

export const getCategories = () => request('/api/products/categories')

export const buyProduct = (productId, quantity = 1) =>
  request('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  })

export const getMyOrders = () => request('/api/orders/me')

export const getRewards = () => request('/api/rewards')

export const redeemReward = (id) =>
  request(`/api/rewards/${id}/redeem`, { method: 'POST' })

export const getRedemptions = () => request('/api/rewards/redemptions')
