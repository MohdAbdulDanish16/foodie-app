const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({origin: true,}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
  })
  .catch((error) => {
    console.log("❌ MongoDB connection failed:");
    console.log(error.message);
  });

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Foodie Backend is running! 🍔",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Foodie server running on port ${PORT}`);
});