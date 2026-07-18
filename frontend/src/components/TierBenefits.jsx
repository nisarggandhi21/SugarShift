import { TIER_ORDER, TIER_THRESHOLDS, TIER_REFERRAL_MULTIPLIER, TIER_PERKS } from '../loyaltyTiers'

const TEXT_CLASSES = {
  bronze: 'text-tier-bronze-ink',
  silver: 'text-tier-silver-ink',
  gold: 'text-tier-gold-ink',
  diamond: 'text-tier-diamond-ink',
}

const rangeLabel = (tier) => {
  const { min, max } = TIER_THRESHOLDS[tier]
  return max ? `${min.toLocaleString('en-IN')} – ${max.toLocaleString('en-IN')} pts` : `${min.toLocaleString('en-IN')}+ pts`
}

function TierBenefits({ user }) {
  const currentTier = user?.loyalty.tier

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 p-8">
      <div className="mb-6 text-left">
        <h1 className="text-[44px] leading-none">Tier benefits</h1>
        <p className="card-subtitle">
          Every point you earn moves you up — here's what unlocks at each tier.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
        {TIER_ORDER.map((tier) => {
          const key = tier.toLowerCase()
          const isCurrent = tier === currentTier
          return (
            <div
              key={tier}
              className={`card flex flex-col gap-3 ${isCurrent ? 'bg-cream ring-2 ring-accent' : ''}`}
            >
              <div>
                {isCurrent && (
                  <span className="mb-2 inline-block rounded-full border-2 border-line bg-accent px-2.5 py-0.5 text-[10.5px] font-extrabold tracking-wide text-accent-ink uppercase">
                    Your tier
                  </span>
                )}
                <h2 className={`text-2xl ${TEXT_CLASSES[key]}`}>{tier}</h2>
                <p className="card-subtitle mt-0.5">{rangeLabel(tier)}</p>
              </div>

              <div className="rounded-lg border-2 border-line bg-surface px-3 py-2 text-center">
                <span className="font-display text-xl">{TIER_REFERRAL_MULTIPLIER[tier]}×</span>
                <p className="text-[10.5px] font-bold tracking-wide text-ink-muted uppercase">
                  referral bonus
                </p>
              </div>

              <ul className="flex flex-col gap-2 pl-0">
                {TIER_PERKS[tier].map((perk) => (
                  <li
                    key={perk}
                    className="list-none rounded-lg border-2 border-line bg-surface px-3 py-2 text-[12.5px] font-semibold"
                  >
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </main>
  )
}

export default TierBenefits
