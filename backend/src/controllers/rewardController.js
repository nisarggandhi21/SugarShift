const { REWARDS, findReward } = require("../utils/rewards");
const PointsLedger = require("../models/PointsLedger");
const { loyaltyStatus } = require("../utils/loyalty");

const list = (req, res) => {
  res.json(REWARDS);
};

const redeem = async (req, res) => {
  const reward = findReward(req.params.id);
  if (!reward) return res.status(404).json({ error: "Reward not found" });

  const balance = await PointsLedger.getBalance(req.user.id);
  if (balance < reward.cost) {
    return res.status(400).json({ error: "Not enough points for this reward" });
  }

  await PointsLedger.redeem(req.user.id, reward.id, reward.name, reward.cost);

  const newBalance = await PointsLedger.getBalance(req.user.id);
  const nextExpiry = await PointsLedger.getNextExpiry(req.user.id);

  res.status(201).json({
    reward,
    loyalty: loyaltyStatus(newBalance, nextExpiry),
  });
};

const listRedemptions = async (req, res) => {
  const redemptions = await PointsLedger.getRedemptions(req.user.id);
  res.json(
    redemptions.map((r) => ({
      id: r.id,
      rewardId: r.reward_id,
      rewardName: r.reward_name,
      points: r.points,
      createdAt: r.created_at,
    }))
  );
};

module.exports = { list, redeem, listRedemptions };
