const CODE_PREFIX = "SUGAR";

const toReferralCode = (userId) => `${CODE_PREFIX}${userId}`;

const fromReferralCode = (code) => {
  if (!code || !code.toUpperCase().startsWith(CODE_PREFIX)) return null;
  const id = parseInt(code.slice(CODE_PREFIX.length), 10);
  return Number.isInteger(id) ? id : null;
};

const REFERRAL_BASE_BONUS = 100;

const REFERRAL_TIER_MULTIPLIER = {
  Bronze: 1,
  Silver: 1.5,
  Gold: 2,
  Diamond: 3,
};

const referralBonusForTier = (tier) =>
  Math.round(REFERRAL_BASE_BONUS * (REFERRAL_TIER_MULTIPLIER[tier] || 1));

module.exports = {
  toReferralCode,
  fromReferralCode,
  REFERRAL_BASE_BONUS,
  REFERRAL_TIER_MULTIPLIER,
  referralBonusForTier,
};
