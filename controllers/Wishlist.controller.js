import Product from "../models/Product.js";
import User from "../models/User.js";

//#region add to Wishlist

export const addToWishlist = async (req, res) => {
  try {
    
    const { id} = req.params;
    const userId = id;
    const { productId } = req.body;
    // console.log("U",userId, " ", "P",productId)
  
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

    // Check if the product is already in the wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product is already in the wishlist.",
      });
    }

    // Add product to wishlist
    user.wishlist.push(productId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist successfully.",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error Adding to Wishlist: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//#region remove from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { id} = req.params;
    const userId = id;
    const { productId } = req.body;
    // console.log("U",userId, " ", "P",productId)

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

    // Check if the product is in the wishlist
    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product is not in the wishlist.",
      });
    }

    // Remove product from wishlist
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully.",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error Removing from Wishlist: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//#region Fetch Wishlist for User
export const fetchWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = id;
 
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const user = await User.findById(userId).populate({
      path: "wishlist",
      populate: {
        path: "seller",
        match: { isApproved: true },  // only include if seller is approved
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const approvedWishlist = user.wishlist.filter((product) => product.seller);

    return res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully.",
      wishlist: approvedWishlist,
    });
  } catch (error) {
    console.error("Error Fetching Wishlist: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
