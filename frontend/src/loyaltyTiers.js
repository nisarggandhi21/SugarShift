// Mirrors the backend's TIERS (backend/src/utils/loyalty.js) and
// REFERRAL_TIER_MULTIPLIER (backend/src/utils/referral.js) for display.
export const TIER_ORDER = ['Bronze', 'Silver', 'Gold', 'Diamond']

export const TIER_THRESHOLDS = {
  Bronze: { min: 0, max: 199 },
  Silver: { min: 200, max: 599 },
  Gold: { min: 600, max: 1499 },
  Diamond: { min: 1500, max: null },
}

export const TIER_REFERRAL_MULTIPLIER = {
  Bronze: 1,
  Silver: 1.5,
  Gold: 2,
  Diamond: 3,
}

export const TIER_PERKS = {
  Bronze: ['Welcome gift on signup', 'Birthday surprise'],
  Silver: ['Free shipping', 'Early access to new drops'],
  Gold: ['Free shipping', 'Early access to drops', 'Exclusive gift with orders'],
  Diamond: [
    'All Gold perks',
    'Dedicated beauty concierge',
    'First access to launches',
    'Exclusive beauty masterclass every 6 months',
  ],
}
