const Referral = require("../models/Referral");
const PointsLedger = require("../models/PointsLedger");
const { toReferralCode, REFERRAL_TIER_MULTIPLIER } = require("../utils/referral");
const { tierForPoints } = require("../utils/loyalty");

const getMine = async (req, res) => {
  const balance = await PointsLedger.getBalance(req.user.id);
  const tier = tierForPoints(balance);
  const referrals = await Referral.findByReferrer(req.user.id);

  res.json({
    code: toReferralCode(req.user.id),
    tier,
    currentMultiplier: REFERRAL_TIER_MULTIPLIER[tier],
    tierMultipliers: REFERRAL_TIER_MULTIPLIER,
    totalReferrals: referrals.length,
    totalBonusEarned: referrals.reduce((sum, r) => sum + r.bonus_points, 0),
    referrals: referrals.map((r) => ({
      id: r.id,
      referredName: r.referred_name,
      referredEmail: r.referred_email,
      bonusPoints: r.bonus_points,
      createdAt: r.created_at,
    })),
  });
};

module.exports = { getMine };
