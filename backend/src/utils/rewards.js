const REWARDS = [
  {
    id: "r1",
    name: "₹50 Off Voucher",
    description: "Flat ₹50 off your next order",
    cost: 50,
  },
  {
    id: "r2",
    name: "₹150 Off Voucher",
    description: "Flat ₹150 off your next order",
    cost: 150,
  },
  {
    id: "r3",
    name: "₹400 Off Voucher",
    description: "Flat ₹400 off your next order",
    cost: 400,
  },
  {
    id: "r4",
    name: "Free Full-Size Lipstick",
    description: "Redeem for any SUGAR lipstick, on us",
    cost: 300,
  },
  {
    id: "r5",
    name: "SUGAR PLAY SLAY KIT",
    description: "Our bestselling makeup kit, free",
    cost: 1200,
  },
  {
    id: "r6",
    name: "Dinner with the Founders",
    description: "An exclusive evening with Vineeta Singh & Kaushik Mukherjee, SUGAR's founders",
    cost: 5000,
    grand: true,
  },
];

const findReward = (id) => REWARDS.find((r) => r.id === id);

module.exports = { REWARDS, findReward };
