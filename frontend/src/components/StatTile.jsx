function Sparkline({ values }) {
  const w = 88
  const h = 28
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return { x, y }
  })

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ')

  const last = points[points.length - 1]

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="sparkline" aria-hidden="true">
      <path d={path} fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r="2.5" fill="var(--accent)" />
    </svg>
  )
}

function StatTile({ label, value, delta, good, sparkline }) {
  const up = delta >= 0
  const color = up === good ? 'var(--status-good)' : 'var(--status-critical)'

  return (
    <div className="card stat-tile">
      <span className="stat-label">{label}</span>
      <div className="stat-body">
        <span className="stat-value">{value}</span>
        <Sparkline values={sparkline} />
      </div>
      <span className="stat-delta" style={{ color }}>
        {up ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%{' '}
        <span className="stat-delta-label">vs last period</span>
      </span>
    </div>
  )
}

export default StatTile
