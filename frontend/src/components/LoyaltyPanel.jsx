const TIER_PERKS = {
  Bronze: ['Welcome gift on signup', 'Birthday surprise'],
  Silver: ['Free shipping', 'Early access to new drops'],
  Gold: ['Free shipping', 'Early access to drops', 'Exclusive gift with orders'],
  Diamond: ['All Gold perks', 'Dedicated beauty concierge', 'First access to launches'],
}

const TIER_ORDER = ['Bronze', 'Silver', 'Gold', 'Diamond']

const TEXT_CLASSES = {
  bronze: 'text-tier-bronze-ink',
  silver: 'text-tier-silver-ink',
  gold: 'text-tier-gold-ink',
  diamond: 'text-tier-diamond-ink',
}

const FILL_CLASSES = {
  bronze: 'bg-tier-bronze',
  silver: 'bg-tier-silver',
  gold: 'bg-tier-gold',
  diamond: 'bg-tier-diamond',
}

const dateLabel = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

function LoyaltyPanel({ loyalty }) {
  const { points, tier, nextTier, pointsToNextTier, currentTierMin, nextTierMin, nextExpiry } = loyalty
  const key = tier.toLowerCase()

  const progress = nextTierMin
    ? Math.min(100, Math.round(((points - currentTierMin) / (nextTierMin - currentTierMin)) * 100))
    : 100

  return (
    <div className="card bg-cream">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <span className="card-subtitle">Your status</span>
          <h2 className={`mt-0.5 text-[28px] ${TEXT_CLASSES[key]}`}>{tier} member</h2>
        </div>
        <div className="flex flex-col text-right">
          <span className="font-display text-[30px] leading-none">
            {points.toLocaleString('en-IN')}
          </span>
          <span className="card-subtitle">points</span>
        </div>
      </div>

      <div className="mb-2 flex justify-between">
        {TIER_ORDER.map((t) => {
          const reached = TIER_ORDER.indexOf(t) <= TIER_ORDER.indexOf(tier)
          return (
            <span
              key={t}
              className={`text-[10.5px] font-extrabold tracking-wide uppercase transition-opacity ${
                reached ? `opacity-100 ${TEXT_CLASSES[t.toLowerCase()]}` : 'text-ink-muted opacity-45'
              }`}
            >
              {t}
            </span>
          )
        })}
      </div>
      <div className="h-2.5 overflow-hidden rounded-full border-2 border-line bg-surface">
        <div className={`h-full ${FILL_CLASSES[key]}`} style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-[12.5px] font-semibold text-ink-muted">
        {nextTier
          ? `${pointsToNextTier.toLocaleString('en-IN')} points to ${nextTier}`
          : "You've reached our top tier!"}
      </p>

      {nextExpiry && (
        <p className="mt-1 text-[12px] font-semibold text-accent-deep">
          {nextExpiry.points.toLocaleString('en-IN')} pts expire on {dateLabel(nextExpiry.date)}
        </p>
      )}

      <ul className="mt-4 flex flex-wrap gap-2 border-t-2 border-dashed border-line pt-3.5 pl-0">
        {TIER_PERKS[tier].map((perk) => (
          <li
            key={perk}
            className="list-none rounded-full border-2 border-line bg-surface px-2.5 py-1 text-xs font-bold"
          >
            {perk}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LoyaltyPanel
