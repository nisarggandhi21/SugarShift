const Product = require("../models/Product");
const Order = require("../models/Order");
const PointsLedger = require("../models/PointsLedger");
const { pointsForAmount, loyaltyStatus } = require("../utils/loyalty");

const create = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const amount = Number(product.price) * qty;
  const pointsEarned = pointsForAmount(amount);

  const order = await Order.create(req.user.id, product.id, qty, amount, pointsEarned);
  await PointsLedger.earn(req.user.id, order.id, pointsEarned);

  const balance = await PointsLedger.getBalance(req.user.id);
  const nextExpiry = await PointsLedger.getNextExpiry(req.user.id);

  res.status(201).json({
    order: {
      id: order.id,
      productId: product.id,
      productName: product.name,
      productImage: product.image_url,
      quantity: order.quantity,
      amount: Number(order.amount),
      pointsEarned: order.points_earned,
      createdAt: order.created_at,
    },
    loyalty: loyaltyStatus(balance, nextExpiry),
  });
};

const listMine = async (req, res) => {
  const orders = await Order.findByUser(req.user.id);
  res.json(
    orders.map((o) => ({
      id: o.id,
      productId: o.product_id,
      productName: o.product_name,
      productImage: o.product_image,
      quantity: o.quantity,
      amount: Number(o.amount),
      pointsEarned: o.points_earned,
      createdAt: o.created_at,
    }))
  );
};

module.exports = { create, listMine };
