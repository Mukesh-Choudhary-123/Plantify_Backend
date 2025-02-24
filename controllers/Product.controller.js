import mongoose from "mongoose";
import Seller from "../models/Seller.js";
import Product from "../models/Product.js";

const validCategories = ["Plants", "Flowers", "Herbs", "Seeds"]; // Example categories

//#region Create Product

export const createProduct = async (req, res) => {
  try {
    const {
      seller,
      title,
      description,
      details,
      price,
      stock,
      category,
      thumbnail,
      images = [],
    } = req.body;

    // ✅ Check if required fields are provided
    if (
      !seller ||
      !title ||
      !description ||
      !details ||
      price === undefined ||
      stock === undefined ||
      !category ||
      !thumbnail ||
      !Array.isArray(images)
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required and must be in correct format.",
      });
    }

    // ✅ Validate `price` and `stock`
    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number.",
      });
    }
    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a positive number.",
      });
    }

    // ✅ Validate `category`
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Allowed categories: ${validCategories.join(", ")}`,
      });
    }

    // ✅ Validate `seller`
    if (!mongoose.Types.ObjectId.isValid(seller)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller ID format.",
      });
    }

    // ✅ Check if seller exists
    const checkSeller = await Seller.findById(seller);
    if (!checkSeller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found.",
      });
    }

    // ✅ Check if seller is approved
    if (!checkSeller.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Seller is not approved.",
      });
    }

    // ✅ Create product
    const product = new Product({
      seller,
      title,
      description,
      details,
      price,
      stock,
      category,
      thumbnail,
      images,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });

  } catch (error) {
    console.error("🔥 Error Creating Product:", error);

    // ✅ Handle MongoDB Validation Errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + Object.values(error.errors).map(err => err.message).join(", "),
      });
    }

    // ✅ Handle MongoDB Cast Errors (e.g., invalid ObjectId)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid value for field '${error.path}': ${error.value}`,
      });
    }

    // ✅ Catch Any Other Internal Errors
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


//#region Edit Product
export const editProduct = async (req, res) => {
    try {
        const { productId } = req.params;
    const {
      seller,
      title,
      description,
      details,
      price,
      stock,
      category,
      thumbnail,
      images = [],
    } = req.body;

    if (
      !seller ||
      !productId ||
      !title ||
      !description ||
      !details ||
      price === undefined ||
      stock === undefined ||
      !category ||
      !thumbnail ||
      !images.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const checkSeller = await Seller.findById(seller);
    if (!checkSeller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    if (!checkSeller.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Seller is not authenticated",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        description,
        details,
        price,
        stock,
        category,
        thumbnail,
        images,
      },
      { new: true } // Return updated product
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error("Error Editing Product: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//#region Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { sellerId, productId } = req.body;

    if (!sellerId || !productId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const checkSeller = await Seller.findById(sellerId);
    if (!checkSeller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    if (!checkSeller.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Seller is not authenticated",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error Deleting Product: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//#region Fetch Product By Seller_ID
export const fetchProductBySellerID = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required.",
      });
    }

    const products = await Product.find({ seller: sellerId });

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error Fetching Product: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//#region Fetch product by ID

export const fetchProductByID = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully.",
      product,
    });
  } catch (error) {
    console.error("Error Fetching Product: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//#region Fetch All Products
export const fetchAllProduct = async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      success: true,
      message: "All products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error Fetching Products: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
