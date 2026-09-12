const express = require("express");
const Restaurant = require("../models/Restaurant");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// CREATE RESTAURANT
// POST /api/restaurants
// ADMIN ONLY
// ==========================================

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        description,
        image,
        cuisine,
        deliveryTime,
        rating,
      } = req.body;

      if (!name || !cuisine) {
        return res.status(400).json({
          message: "Restaurant name and cuisine are required",
        });
      }

      const restaurant = await Restaurant.create({
        name,
        description,
        image,
        cuisine,
        deliveryTime,
        rating,
        ownerId: req.user.userId,
      });

      res.status(201).json({
        message: "Restaurant created successfully",
        restaurant,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to create restaurant",
      });
    }
  }
);

// ==========================================
// GET ALL RESTAURANTS
// GET /api/restaurants
// PUBLIC
// ==========================================

router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      isActive: true,
    })
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      restaurants,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch restaurants",
    });
  }
});

// ==========================================
// GET SINGLE RESTAURANT
// GET /api/restaurants/:id
// PUBLIC
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("ownerId", "name email");

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    res.json({
      restaurant,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch restaurant",
    });
  }
});

// ==========================================
// UPDATE RESTAURANT
// PATCH /api/restaurants/:id
// ADMIN ONLY
// ==========================================

router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        description,
        image,
        cuisine,
        deliveryTime,
        rating,
        isActive,
      } = req.body;

      const restaurant = await Restaurant.findById(
        req.params.id
      );

      if (!restaurant) {
        return res.status(404).json({
          message: "Restaurant not found",
        });
      }

      if (name !== undefined) {
        restaurant.name = name;
      }

      if (description !== undefined) {
        restaurant.description = description;
      }

      if (image !== undefined) {
        restaurant.image = image;
      }

      if (cuisine !== undefined) {
        restaurant.cuisine = cuisine;
      }

      if (deliveryTime !== undefined) {
        restaurant.deliveryTime = deliveryTime;
      }

      if (rating !== undefined) {
        restaurant.rating = rating;
      }

      if (isActive !== undefined) {
        restaurant.isActive = isActive;
      }

      await restaurant.save();

      res.json({
        message: "Restaurant updated successfully",
        restaurant,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to update restaurant",
      });
    }
  }
);

// ==========================================
// DELETE RESTAURANT
// DELETE /api/restaurants/:id
// ADMIN ONLY
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const restaurant = await Restaurant.findByIdAndDelete(
        req.params.id
      );

      if (!restaurant) {
        return res.status(404).json({
          message: "Restaurant not found",
        });
      }

      res.json({
        message: "Restaurant deleted successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to delete restaurant",
      });
    }
  }
);

module.exports = router;