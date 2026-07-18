const InvoiceClaim = require("../models/InvoiceClaim");
const PointsLedger = require("../models/PointsLedger");
const { pointsForAmount, loyaltyStatus } = require("../utils/loyalty");

const create = async (req, res) => {
  const { retailer, invoiceNumber, amount } = req.body;

  if (!retailer || !retailer.trim()) {
    return res.status(400).json({ error: "Retailer is required" });
  }
  const numericAmount = Number(amount);
  if (!numericAmount || numericAmount <= 0) {
    return res.status(400).json({ error: "Enter a valid invoice amount" });
  }
  if (!req.file) {
    return res.status(400).json({ error: "Upload your invoice image or PDF" });
  }

  const pointsClaimed = pointsForAmount(numericAmount);

  const claim = await InvoiceClaim.create({
    userId: req.user.id,
    retailer: retailer.trim(),
    invoiceNumber: invoiceNumber?.trim() || null,
    amount: numericAmount,
    pointsClaimed,
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    fileData: req.file.buffer,
  });

  await PointsLedger.earn(req.user.id, {
    points: pointsClaimed,
    source: "invoice",
    note: `Invoice claim — ${claim.retailer}`,
  });

  const balance = await PointsLedger.getBalance(req.user.id);
  const nextExpiry = await PointsLedger.getNextExpiry(req.user.id);

  res.status(201).json({
    claim: {
      id: claim.id,
      retailer: claim.retailer,
      invoiceNumber: claim.invoice_number,
      amount: Number(claim.amount),
      pointsClaimed: claim.points_claimed,
      status: claim.status,
      fileName: claim.file_name,
      createdAt: claim.created_at,
    },
    loyalty: loyaltyStatus(balance, nextExpiry),
  });
};

const listMine = async (req, res) => {
  const claims = await InvoiceClaim.findByUser(req.user.id);
  res.json(
    claims.map((c) => ({
      id: c.id,
      retailer: c.retailer,
      invoiceNumber: c.invoice_number,
      amount: Number(c.amount),
      pointsClaimed: c.points_claimed,
      status: c.status,
      fileName: c.file_name,
      createdAt: c.created_at,
    }))
  );
};

const getFile = async (req, res) => {
  const file = await InvoiceClaim.findFileById(req.params.id, req.user.id);
  if (!file) return res.status(404).json({ error: "File not found" });

  res.set("Content-Type", file.file_type);
  res.set("Content-Disposition", `inline; filename="${file.file_name}"`);
  res.send(file.file_data);
};

module.exports = { create, listMine, getFile };
