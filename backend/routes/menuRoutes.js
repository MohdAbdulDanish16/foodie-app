const express = require("express");
const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// ADD MENU ITEM
// POST /api/menu
// ==========================================

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        restaurantId,
        name,
        description,
        price,
        category,
        image,
        isAvailable,
      } = req.body;

      if (!restaurantId || !name || price === undefined || !category) {
        return res.status(400).json({
          message:
            "Restaurant, name, price and category are required",
        });
      }

      const restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
        return res.status(404).json({
          message: "Restaurant not found",
        });
      }

      const menuItem = await MenuItem.create({
        restaurantId,
        name,
        description,
        price,
        category,
        image,
        isAvailable:
          isAvailable !== undefined ? isAvailable : true,
      });

      res.status(201).json({
        message: "Menu item added successfully",
        menuItem,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to add menu item",
      });
    }
  }
);

// ==========================================
// GET ALL MENU ITEMS
// GET /api/menu
// ==========================================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const menuItems = await MenuItem.find()
        .populate("restaurantId", "name cuisine")
        .sort({ createdAt: -1 });

      res.json({
        menuItems,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to fetch menu items",
      });
    }
  }
);

// ==========================================
// GET MENU ITEMS FOR ONE RESTAURANT
// GET /api/menu/restaurant/:restaurantId
// ==========================================

router.get(
  "/restaurant/:restaurantId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const menuItems = await MenuItem.find({
        restaurantId: req.params.restaurantId,
      }).sort({ createdAt: -1 });

      res.json({
        menuItems,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to fetch restaurant menu",
      });
    }
  }
);

// ==========================================
// GET SINGLE MENU ITEM
// GET /api/menu/:id
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const menuItem = await MenuItem.findById(
        req.params.id
      ).populate("restaurantId", "name cuisine");

      if (!menuItem) {
        return res.status(404).json({
          message: "Menu item not found",
        });
      }

      res.json({
        menuItem,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to fetch menu item",
      });
    }
  }
);

// ==========================================
// UPDATE MENU ITEM
// PATCH /api/menu/:id
// ==========================================

router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        restaurantId,
        name,
        description,
        price,
        category,
        image,
        isAvailable,
      } = req.body;

      const menuItem = await MenuItem.findById(
        req.params.id
      );

      if (!menuItem) {
        return res.status(404).json({
          message: "Menu item not found",
        });
      }

      if (restaurantId !== undefined) {
        const restaurant = await Restaurant.findById(
          restaurantId
        );

        if (!restaurant) {
          return res.status(404).json({
            message: "Restaurant not found",
          });
        }

        menuItem.restaurantId = restaurantId;
      }

      if (name !== undefined) {
        menuItem.name = name;
      }

      if (description !== undefined) {
        menuItem.description = description;
      }

      if (price !== undefined) {
        menuItem.price = price;
      }

      if (category !== undefined) {
        menuItem.category = category;
      }

      if (image !== undefined) {
        menuItem.image = image;
      }

      if (isAvailable !== undefined) {
        menuItem.isAvailable = isAvailable;
      }

      await menuItem.save();

      res.json({
        message: "Menu item updated successfully",
        menuItem,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to update menu item",
      });
    }
  }
);

// ==========================================
// DELETE MENU ITEM
// DELETE /api/menu/:id
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const menuItem = await MenuItem.findByIdAndDelete(
        req.params.id
      );

      if (!menuItem) {
        return res.status(404).json({
          message: "Menu item not found",
        });
      }

      res.json({
        message: "Menu item deleted successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to delete menu item",
      });
    }
  }
);

module.exports = router;