const SUBSCRIPTION_PLANS = [
  { months: 3, discountPercent: 10 },
  { months: 6, discountPercent: 15 },
];

const findPlan = (months) =>
  SUBSCRIPTION_PLANS.find((p) => p.months === Number(months));

const priceForPlan = (price, plan) =>
  Math.round(price * (1 - plan.discountPercent / 100) * 100) / 100;

module.exports = { SUBSCRIPTION_PLANS, findPlan, priceForPlan };
