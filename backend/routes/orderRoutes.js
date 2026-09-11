const express = require("express");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// USER: Create a new order
// ==========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      customerName,
      items,
      phone,
      address,
      paymentMethod,
    } = req.body;

    if (
  !customerName ||
  !items ||
  items.length === 0 ||
  !phone ||
  !address ||
  !paymentMethod
) {
  return res.status(400).json({
    message: "All order details are required",
  });
}

if (customerName.trim().length < 2) {
  return res.status(400).json({
    message: "Customer name must be at least 2 characters",
  });
}

if (!/^[0-9]{10}$/.test(phone)) {
  return res.status(400).json({
    message: "Phone number must contain exactly 10 digits",
  });
}

if (address.trim().length < 10) {
  return res.status(400).json({
    message: "Please enter a complete delivery address",
  });
}

const allowedPaymentMethods = [
  "Cash on Delivery",
  "UPI",
  "Credit / Debit Card",
];

if (!allowedPaymentMethods.includes(paymentMethod)) {
  return res.status(400).json({
    message: "Invalid payment method",
  });
}

    const subtotal = items.reduce(
  (sum, item) =>
    sum +
    Number(item.price) * (Number(item.quantity) || 1),
  0
);

const deliveryFee = 40;
const totalAmount = subtotal + deliveryFee;

    const order = new Order({
      userId: req.user.userId,
      customerName,
      items,
      totalAmount,
      phone,
      address,
      paymentMethod,
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
});

// ==========================================
// USER: Get my orders
// ==========================================
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({
      orders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});

// ==========================================
// ADMIN: Get all orders
// ==========================================
router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      res.json({
        orders,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to fetch all orders",
      });
    }
  }
);

// ==========================================
// ADMIN: Update order status
// ==========================================
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json({
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to update order status",
      });
    }
  }
);

module.exports = router;