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
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const rewardRoutes = require("./routes/rewardRoutes");

const app = express();

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

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => User.ensureTable())
  .then(() => Product.ensureTable())
  .then(() => Order.ensureTable())
  .then(() => PointsLedger.ensureTable())
  .then(() => Product.seedIfEmpty())
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
    process.exit(1);
  });
