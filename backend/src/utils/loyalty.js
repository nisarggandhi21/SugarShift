const TIERS = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 200 },
  { name: "Gold", min: 600 },
  { name: "Diamond", min: 1500 },
];

const POINTS_RATE = 0.1; // 10% of purchase value, earned as points
const EXPIRY_MONTHS = 6;

const pointsForAmount = (amount) => Math.round(amount * POINTS_RATE);

const tierForPoints = (points) => {
  let current = TIERS[0];
  for (const tier of TIERS) {
    if (points >= tier.min) current = tier;
  }
  return current.name;
};

const loyaltyStatus = (points, nextExpiry) => {
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
    nextExpiry: nextExpiry || null,
  };
};

module.exports = {
  TIERS,
  POINTS_RATE,
  EXPIRY_MONTHS,
  pointsForAmount,
  tierForPoints,
  loyaltyStatus,
};
