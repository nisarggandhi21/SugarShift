const DAY_MS = 24 * 60 * 60 * 1000
const TODAY = new Date('2026-07-18T00:00:00Z')

const buildSparkline = (length, seed) =>
  Array.from({ length }, (_, i) =>
    Math.round(seed + Math.sin((i + seed) / 2.1) * seed * 0.18 + i * (seed * 0.01))
  )

const generateRevenueSeries = (days) => {
  const series = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(TODAY.getTime() - i * DAY_MS)
    const weekday = date.getUTCDay()
    const weekendDip = weekday === 0 || weekday === 6 ? 0.83 : 1
    const wave = Math.sin(i / 6) * 340 + Math.sin(i / 17) * 220
    const trend = (days - i) * 8.4
    const value = Math.round((3900 + trend + wave) * weekendDip)
    series.push({ date, value })
  }
  return series
}

export const revenueSeries = {
  7: generateRevenueSeries(7),
  30: generateRevenueSeries(30),
  90: generateRevenueSeries(90),
}

export const stats = [
  {
    label: 'Total revenue',
    value: '$214,980',
    delta: 12.4,
    good: true,
    sparkline: buildSparkline(12, 420),
  },
  {
    label: 'Orders',
    value: '3,842',
    delta: 6.1,
    good: true,
    sparkline: buildSparkline(12, 330),
  },
  {
    label: 'New customers',
    value: '918',
    delta: -3.2,
    good: false,
    sparkline: buildSparkline(12, 260),
  },
  {
    label: 'Avg. order value',
    value: '$55.95',
    delta: 2.8,
    good: true,
    sparkline: buildSparkline(12, 180),
  },
]

export const recentOrders = [
  { id: '#8841', customer: 'Marisol Ibarra', product: 'Weighted blanket, 15lb', amount: 89.0, status: 'Delivered', date: '2026-07-17' },
  { id: '#8840', customer: 'Deshawn Price', product: 'Ceramic pour-over set', amount: 42.5, status: 'Processing', date: '2026-07-17' },
  { id: '#8839', customer: 'Yuki Tanaka', product: 'Linen sheet set, queen', amount: 134.0, status: 'Delivered', date: '2026-07-16' },
  { id: '#8838', customer: 'Owen Fitzgerald', product: 'Cast iron skillet, 12"', amount: 58.0, status: 'Refunded', date: '2026-07-16' },
  { id: '#8837', customer: 'Priya Nair', product: 'Desk lamp, walnut base', amount: 76.2, status: 'Delivered', date: '2026-07-15' },
  { id: '#8836', customer: 'Camille Leroux', product: 'Wool throw, charcoal', amount: 112.0, status: 'Cancelled', date: '2026-07-15' },
  { id: '#8835', customer: 'Bode Adeyemi', product: 'Enamel mug set (4)', amount: 34.0, status: 'Processing', date: '2026-07-14' },
  { id: '#8834', customer: 'Freya Solberg', product: 'Standing candle holder', amount: 47.5, status: 'Delivered', date: '2026-07-14' },
]

export const topProducts = [
  { name: 'Weighted blanket, 15lb', units: 412, revenue: 36668, share: 0.86 },
  { name: 'Linen sheet set, queen', units: 298, revenue: 39932, share: 0.94 },
  { name: 'Cast iron skillet, 12"', units: 265, revenue: 15370, share: 0.36 },
  { name: 'Ceramic pour-over set', units: 201, revenue: 8542, share: 0.2 },
  { name: 'Desk lamp, walnut base', units: 154, revenue: 11734, share: 0.28 },
]
