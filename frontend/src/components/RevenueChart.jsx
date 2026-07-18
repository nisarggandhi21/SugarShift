import { useMemo, useRef, useState } from 'react'
import { revenueSeries } from '../mockData'
import './RevenueChart.css'

const RANGES = [
  { key: 7, label: '7D' },
  { key: 30, label: '30D' },
  { key: 90, label: '90D' },
]

const W = 760
const H = 280
const PAD = { top: 24, right: 16, bottom: 34, left: 56 }

const money = (n) =>
  `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`

const niceStep = (max) => {
  if (max <= 1000) return 250
  if (max <= 4000) return 1000
  if (max <= 10000) return 2000
  return 5000
}

function RevenueChart() {
  const [range, setRange] = useState(30)
  const [view, setView] = useState('chart')
  const [hoverIdx, setHoverIdx] = useState(null)
  const svgRef = useRef(null)

  const data = revenueSeries[range]

  const { linePath, areaPath, points, yTicks, plotW, plotH } = useMemo(() => {
    const values = data.map((d) => d.value)
    const max = Math.max(...values)
    const step = niceStep(max)
    const niceMax = Math.ceil(max / step) * step
    const niceMin = 0

    const plotW = W - PAD.left - PAD.right
    const plotH = H - PAD.top - PAD.bottom

    const xScale = (i) => PAD.left + (i / (data.length - 1)) * plotW
    const yScale = (v) =>
      PAD.top + (1 - (v - niceMin) / (niceMax - niceMin)) * plotH

    const points = data.map((d, i) => ({
      x: xScale(i),
      y: yScale(d.value),
      ...d,
    }))

    const linePath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ')

    const baseline = PAD.top + plotH
    const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${baseline} L${points[0].x.toFixed(1)},${baseline} Z`

    const tickCount = 4
    const yTicks = Array.from({ length: tickCount }, (_, i) => {
      const v = (niceMax / (tickCount - 1)) * i
      return { v, y: yScale(v) }
    })

    return { linePath, areaPath, points, yTicks, plotW, plotH }
  }, [data])

  const handleMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect()
    const ratio = W / rect.width
    const localX = (e.clientX - rect.left) * ratio
    const step = plotW / (points.length - 1)
    const idx = Math.round((localX - PAD.left) / step)
    setHoverIdx(Math.min(Math.max(idx, 0), points.length - 1))
  }

  const hovered = hoverIdx !== null ? points[hoverIdx] : null
  const last = points[points.length - 1]
  const tooltipFlip = hovered && hovered.x > W - 150

  const dateLabel = (d, opts) =>
    new Date(d).toLocaleDateString('en-US', opts || { month: 'short', day: 'numeric' })

  return (
    <div className="card revenue-card">
      <div className="revenue-header">
        <div>
          <h3>Revenue</h3>
          <p className="card-subtitle">Gross revenue, all channels</p>
        </div>

        <div className="revenue-controls">
          <div className="range-switch" role="group" aria-label="Date range">
            {RANGES.map((r) => (
              <button
                key={r.key}
                type="button"
                className={range === r.key ? 'is-active' : ''}
                onClick={() => setRange(r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="link-toggle"
            onClick={() => setView(view === 'chart' ? 'table' : 'chart')}
          >
            {view === 'chart' ? 'View as table' : 'View as chart'}
          </button>
        </div>
      </div>

      {view === 'chart' ? (
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="revenue-svg"
          role="img"
          aria-label={`Revenue trend over the last ${range} days, ending at ${money(last.value)}`}
          onPointerMove={handleMove}
          onPointerLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="revenue-wash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((t) => (
            <g key={t.v}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={t.y}
                y2={t.y}
                stroke="var(--grid-line)"
                strokeWidth="1"
              />
              <text x={PAD.left - 10} y={t.y + 4} textAnchor="end" className="axis-label">
                {money(t.v)}
              </text>
            </g>
          ))}

          <text x={PAD.left} y={H - 8} className="axis-label" textAnchor="start">
            {dateLabel(data[0].date)}
          </text>
          <text x={W - PAD.right} y={H - 8} className="axis-label" textAnchor="end">
            {dateLabel(data[data.length - 1].date)}
          </text>

          <path d={areaPath} fill="url(#revenue-wash)" />
          <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          <circle cx={last.x} cy={last.y} r="4" fill="var(--accent)" stroke="var(--bg-surface)" strokeWidth="2" />
          <text x={last.x - 8} y={last.y - 14} textAnchor="end" className="endpoint-label">
            {money(last.value)}
          </text>

          {hovered && (
            <g>
              <line
                x1={hovered.x}
                x2={hovered.x}
                y1={PAD.top}
                y2={PAD.top + plotH}
                stroke="var(--border-hairline-strong)"
                strokeWidth="1"
              />
              <circle cx={hovered.x} cy={hovered.y} r="4" fill="var(--accent)" stroke="var(--bg-surface)" strokeWidth="2" />

              <g transform={`translate(${tooltipFlip ? hovered.x - 142 : hovered.x + 12}, ${Math.max(hovered.y - 40, PAD.top)})`}>
                <rect width="130" height="46" rx="8" fill="var(--bg-surface-raised)" stroke="var(--border-hairline-strong)" />
                <text x="12" y="19" className="tooltip-value">
                  {money(hovered.value)}
                </text>
                <text x="12" y="35" className="tooltip-date">
                  {dateLabel(hovered.date, { month: 'short', day: 'numeric', year: 'numeric' })}
                </text>
              </g>
            </g>
          )}
        </svg>
      ) : (
        <div className="revenue-table-wrap">
          <table className="revenue-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((d) => (
                <tr key={d.date.toISOString()}>
                  <td>{dateLabel(d.date, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="num">{money(d.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RevenueChart
