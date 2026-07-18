const TIERS = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 2000 },
  { name: "Gold", min: 6000 },
  { name: "Diamond", min: 15000 },
];

const POINTS_PER_RUPEE = 1;

const pointsForAmount = (amount) => Math.round(amount * POINTS_PER_RUPEE);

const tierForPoints = (points) => {
  let current = TIERS[0];
  for (const tier of TIERS) {
    if (points >= tier.min) current = tier;
  }
  return current.name;
};

const loyaltyStatus = (points) => {
  const idx = TIERS.findIndex((t) => t.name === tierForPoints(points));
  const current = TIERS[idx];
  const next = TIERS[idx + 1] || null;

  return {
    points,
    tier: current.name,
    nextTier: next?.name || null,
    pointsToNextTier: next ? next.min - points : 0,
    currentTierMin: current.min,
    nextTierMin: next?.min || null,
  };
};

module.exports = { TIERS, pointsForAmount, tierForPoints, loyaltyStatus };
