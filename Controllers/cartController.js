import Cart from "../Model/cartModel.js";
import Product from "../Model/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { successResponse } from "../utils/successResponse.js";


// add product to cart
export const addToCart = async (req, res, next) => {
    try {
      const userId = req.user;
      const { productId, quantity } = req.body;
  
      // Validate inputs
      if (!productId || !quantity || quantity <= 0) {
        return next(new ErrorHandler("Missing or invalid fields", 404));
      }
  
      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }
  
      // Find cart
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        // Initialize new cart
        cart = new Cart({
          userId,
          products: [{ product: productId, quantity }],
          savedForLater: [],
        });
  
        // Save the new cart first
        await cart.save();
      } else {
        // Check if product already present in cart
        const itemIndex = cart.products.findIndex(
          (item) => item.product.toString() === productId
        );
        if (itemIndex >= 0) {
          // Update quantity if product already in cart
          cart.products[itemIndex].quantity += quantity;
        } else {
          // Add new item to cart
          cart.products.unshift({ product: productId, quantity });
        }
      }
  
      // Populate products in cart before calculating totals
      cart = await cart.populate([
        {
          path: "products.product",
          select: "_id title thumbnail price discountPercentage category",
        },
      ]);
  
      // Recalculate totals using populated products
      const { totalAmount, totalItems, totalOriginalPrice } = calculateTotals(
        cart.products
      );
  
      cart.totalAmount = totalAmount;
      cart.totalItems = totalItems;
      cart.totalOriginalPrice = totalOriginalPrice;
  
      // Save the updated cart
      await cart.save();
  
      res
        .status(200)
        .json(successResponse("Product added to cart", "cart", cart));
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  };

  // remove product from cart
export const removeFromCart = async (req, res, next) => {
    try {
      const userId = req.user;
      const productId = req.params.id;
  
      // Validate input
      if (!productId) {
        return next(new ErrorHandler("Product id is not provided", 404));
      }
  
      const cart = await Cart.findOne({ userId }).populate([
        {
          path: "products.product",
          select: "_id title thumbnail price discountPercentage category",
        },
      ]);
  
      // Find the index of the product in the cart
      const itemIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === productId
      );
  
      // If the product is not in the cart, return an error
      if (itemIndex === -1) {
        return next(new ErrorHandler("Product not found in cart", 404));
      }
  
      // Remove the product from the cart
      cart.products.splice(itemIndex, 1);
  
      // recalculate totals whenever items list is updated
      const { totalAmount, totalItems, totalOriginalPrice } = calculateTotals(
        cart.products
      );
  
      cart.totalAmount = totalAmount;
      cart.totalItems = totalItems;
      cart.totalOriginalPrice = totalOriginalPrice;
  
      // Save the updated cart
      await cart.save();
  
      res
        .status(200)
        .json(successResponse("Product removed from cart", "cart", cart));
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  };
  
 // Get user's cart
export const getCart = async (req, res, next) => {
    try {
      const userId = req.user;
  
      // find cart
      let cart = await Cart.findOne({ userId }).populate([
        {
          path: "products.product",
          select: "_id title thumbnail price discountPercentage category",
        },
      ]);
  
      if (!cart) {
        cart = new Cart({ userId, products: [] });
        await cart.save();
      }
  
      res
        .status(200)
        .json(successResponse("Cart fetched successfully", "cart", cart));
    } catch (err) {
      return next(new Error(err.message));
    }
  };
   