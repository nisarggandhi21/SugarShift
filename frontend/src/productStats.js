// Deterministic dummy social-proof stats per product (not real data).
export const getDummyStats = (productId) => {
  const bought = 50 + ((productId * 37) % 450)
  const subscriberPercent = 1 + ((productId * 13) % 9)
  const remaining = 2 + ((productId * 7) % 13)
  return { bought, subscriberPercent, remaining }
}

// Deterministic dummy regional split of buyers (not real data). Weights are
// seeded per product so the split varies but always sums to 100%.
export const getRegionStats = (productId) => {
  const weights = {
    north: 10 + ((productId * 17) % 40),
    south: 10 + ((productId * 23) % 40),
    east: 10 + ((productId * 31) % 40),
    west: 10 + ((productId * 41) % 40),
  }
  const total = weights.north + weights.south + weights.east + weights.west

  const percents = {
    north: Math.round((weights.north / total) * 100),
    south: Math.round((weights.south / total) * 100),
    east: Math.round((weights.east / total) * 100),
  }
  // West absorbs any rounding remainder so the four always sum to exactly 100.
  percents.west = 100 - percents.north - percents.south - percents.east

  return percents
}
