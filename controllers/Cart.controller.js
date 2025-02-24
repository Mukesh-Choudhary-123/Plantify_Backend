import Product from "../models/Product.js";
import User from "../models/User.js";

//#region Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Check if product is already in the cart
    const existingCartItem = user.cart.find((item) => item.product.toString() === productId);

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully.",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error Adding to Cart: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//#region Remove from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Remove product from cart
    user.cart = user.cart.filter((item) => item.product.toString() !== productId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully.",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error Removing from Cart: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//#region Update Cart (Increase/Decrease Quantity)
export const updateCart = async (req, res) => {
  try {
    const { userId, productId, action } = req.body; // action: 'increase' or 'decrease'

    if (!userId || !productId || !action) {
      return res.status(400).json({
        success: false,
        message: "User ID, Product ID, and Action are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const cartItem = user.cart.find((item) => item.product.toString() === productId);

    if (!cartItem) {
      return res.status(400).json({
        success: false,
        message: "Product not found in cart.",
      });
    }

    if (action === "increase") {
      cartItem.quantity += 1;
    } else if (action === "decrease") {
      cartItem.quantity -= 1;
      if (cartItem.quantity <= 0) {
        user.cart = user.cart.filter((item) => item.product.toString() !== productId);
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Use 'increase' or 'decrease'.",
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully.",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error Updating Cart: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//#region Fetch Cart for User
export const fetchCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const user = await User.findById(userId).populate("cart.product");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully.",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error Fetching Cart: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
