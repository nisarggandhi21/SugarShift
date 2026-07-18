const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");
const PointsLedger = require("../models/PointsLedger");
const { issueToken, COOKIE_NAME } = require("../middleware/auth");
const { loyaltyStatus } = require("../utils/loyalty");

const toPublicUser = async (user) => {
  const balance = await PointsLedger.getBalance(user.id);
  const nextExpiry = await PointsLedger.getNextExpiry(user.id);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatar_url,
    loyalty: loyaltyStatus(balance, nextExpiry),
  };
};

const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const existing = await User.findByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.createLocal(email, passwordHash, name);

  issueToken(res, user);
  res.status(201).json({ user: await toPublicUser(user) });
};

const login = (req, res, next) => {
  passport.authenticate("local", { session: false }, async (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info?.message || "Invalid credentials" });
    }

    issueToken(res, user);
    res.json({ user: await toPublicUser(user) });
  })(req, res, next);
};

const googleCallback = (req, res) => {
  issueToken(res, req.user);
  res.redirect(process.env.CLIENT_URL);
};

const me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: await toPublicUser(user) });
};

const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ ok: true });
};

module.exports = { register, login, googleCallback, me, logout };
