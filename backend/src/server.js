require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { connectDB } = require("./config/db");
const passport = require("./config/passport");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const PointsLedger = require("./models/PointsLedger");
const Referral = require("./models/Referral");
const InvoiceClaim = require("./models/InvoiceClaim");
const Subscription = require("./models/Subscription");
const CommunityPost = require("./models/CommunityPost");
const CommunityComment = require("./models/CommunityComment");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const referralRoutes = require("./routes/referralRoutes");
const invoiceClaimRoutes = require("./routes/invoiceClaimRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const communityRoutes = require("./routes/communityRoutes");

const app = express();

app.set("trust proxy", 1);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/invoice-claims", invoiceClaimRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/community", communityRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => User.ensureTable())
  .then(() => Product.ensureTable())
  .then(() => Order.ensureTable())
  .then(() => PointsLedger.ensureTable())
  .then(() => Referral.ensureTable())
  .then(() => InvoiceClaim.ensureTable())
  .then(() => Subscription.ensureTable())
  .then(() => CommunityPost.ensureTable())
  .then(() => CommunityComment.ensureTable())
  .then(() => Product.seedIfEmpty())
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
    process.exit(1);
  });
