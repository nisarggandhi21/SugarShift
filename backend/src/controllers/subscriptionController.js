const Product = require("../models/Product");
const Order = require("../models/Order");
const Subscription = require("../models/Subscription");
const PointsLedger = require("../models/PointsLedger");
const { findPlan, priceForPlan } = require("../utils/subscriptions");
const { pointsForAmount, loyaltyStatus } = require("../utils/loyalty");

const create = async (req, res) => {
  const { productId, months } = req.body;

  const plan = findPlan(months);
  if (!plan) return res.status(400).json({ error: "Choose a 3 or 6 month plan" });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const price = priceForPlan(Number(product.price), plan);
  const pointsEarned = pointsForAmount(price);

  const order = await Order.create(req.user.id, product.id, 1, price, pointsEarned);
  await PointsLedger.earn(req.user.id, {
    orderId: order.id,
    points: pointsEarned,
    source: "subscription",
    note: `${plan.months}-month subscription — ${product.name}`,
  });

  const subscription = await Subscription.create({
    userId: req.user.id,
    productId: product.id,
    orderId: order.id,
    durationMonths: plan.months,
    discountPercent: plan.discountPercent,
    pricePerDelivery: price,
  });

  const balance = await PointsLedger.getBalance(req.user.id);
  const nextExpiry = await PointsLedger.getNextExpiry(req.user.id);

  res.status(201).json({
    subscription: {
      id: subscription.id,
      productId: product.id,
      productName: product.name,
      productImage: product.image_url,
      durationMonths: subscription.duration_months,
      discountPercent: subscription.discount_percent,
      pricePerDelivery: Number(subscription.price_per_delivery),
      startedAt: subscription.started_at,
      endsAt: subscription.ends_at,
    },
    order: {
      id: order.id,
      amount: Number(order.amount),
      pointsEarned: order.points_earned,
    },
    loyalty: loyaltyStatus(balance, nextExpiry),
  });
};

const listMine = async (req, res) => {
  const subs = await Subscription.findByUser(req.user.id);
  res.json(
    subs.map((s) => ({
      id: s.id,
      productId: s.product_id,
      productName: s.product_name,
      productImage: s.product_image,
      durationMonths: s.duration_months,
      discountPercent: s.discount_percent,
      pricePerDelivery: Number(s.price_per_delivery),
      status: s.status,
      startedAt: s.started_at,
      endsAt: s.ends_at,
    }))
  );
};

module.exports = { create, listMine };
