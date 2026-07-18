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

export const getProduct = (id) => request(`/api/products/${id}`)

export const getMyOrders = () => request('/api/orders/me')

export const checkoutCart = (items) =>
  request('/api/orders/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })

export const getRewards = () => request('/api/rewards')

export const redeemReward = (id) =>
  request(`/api/rewards/${id}/redeem`, { method: 'POST' })

export const getRedemptions = () => request('/api/rewards/redemptions')

export const getMyReferrals = () => request('/api/referrals/me')

export const submitInvoiceClaim = (formData) =>
  request('/api/invoice-claims', { method: 'POST', body: formData })

export const getMyInvoiceClaims = () => request('/api/invoice-claims/me')

export const subscribeToProduct = (productId, months) =>
  request('/api/subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, months }),
  })

export const getMySubscriptions = () => request('/api/subscriptions/me')

export const getCommunityCategories = () => request('/api/community/categories')

export const getCommunityPosts = (category) =>
  request(`/api/community/posts${category ? `?category=${encodeURIComponent(category)}` : ''}`)

export const createCommunityPost = (post) =>
  request('/api/community/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  })

export const toggleCommunityLike = (postId) =>
  request(`/api/community/posts/${postId}/like`, { method: 'POST' })

export const getCommunityComments = (postId) =>
  request(`/api/community/posts/${postId}/comments`)

export const createCommunityComment = (postId, body) =>
  request(`/api/community/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  })
