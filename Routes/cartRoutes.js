import express from "express";
import {
    addToCart,
    getCart,
    removeFromCart,
    
  } from "../../controllers/cartController.js";
  import { isAuthenticated } from "../../middleware/authMiddleware.js";

  
const router = express.Router();

// Add Product to Cart
router.post("/", isAuthenticated, addToCart);

// Remove Product from Cart
router.delete("/:id", isAuthenticated, removeFromCart);

// Add Product to Cart
router.put("/decrease-quantity/:id", isAuthenticated, decreaseQuantity);

// Get User's Cart
router.get("/", isAuthenticated, getCart);

export default router;