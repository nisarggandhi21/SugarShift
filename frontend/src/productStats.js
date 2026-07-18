// Deterministic dummy social-proof stats per product (not real data).
export const getDummyStats = (productId) => {
  const bought = 50 + ((productId * 37) % 450)
  const subscriberPercent = 1 + ((productId * 13) % 9)
  const remaining = 2 + ((productId * 7) % 13)
  return { bought, subscriberPercent, remaining }
}
