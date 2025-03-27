import mongoose from "mongoose";
import Seller from "../models/Seller.js";
import Product from "../models/Product.js";
import defaultPlantProduct from "../config/defaultPlantProduct.js";

const validCategories = [
  "Top Pick",
  "Indoor",
  "Outdoor",
  "Fertilizer",
  "Plants",
  "Flowers",
  "Herbs",
  "Seeds",
  "Fruits",
  "Vegetables",
]; // Example categories

//#region Create Product

export const createProduct = async (req, res) => {
  try {
    const {
      seller,
      title,
      description,
      price,
      stock,
      category,
      thumbnail,
      scientificName,
      origin,
      subtitle,
      overview,
      careInstructions,
      idealTemperature,
      humidity,
      toxicity,
    } = req.body;

    // ✅ Check if required fields are provided
    if (
      !seller ||
      !title ||
      !description ||
      price === undefined ||
      stock === undefined ||
      !category ||
      !thumbnail
    ) {
      console.error(
        "Validation Error: Missing or incorrectly formatted fields.",
        {
          seller,
          title,
          description,
          price,
          stock,
          category,
          thumbnail,
        }
      );

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
        message: `Invalid category. Allowed categories: ${validCategories.join(
          ", "
        )}`,
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

    // ✅ Build product data by merging defaults with provided values
    const productData = {
      seller,
      title,
      description,
      price,
      stock,
      category: category || defaultPlantProduct.category,
      thumbnail,
      scientificName: scientificName || "",
      origin: origin || defaultPlantProduct.origin,
      subtitle: subtitle || defaultPlantProduct.subtitle,
      overview: {
        water:
          overview && overview.water !== undefined
            ? overview.water
            : defaultPlantProduct.overview.water,
        light:
          overview && overview.light !== undefined
            ? overview.light
            : defaultPlantProduct.overview.light,
        fertilizer:
          overview && overview.fertilizer !== undefined
            ? overview.fertilizer
            : defaultPlantProduct.overview.fertilizer,
      },
      careInstructions: {
        watering:
          careInstructions && careInstructions.watering
            ? careInstructions.watering
            : defaultPlantProduct.careInstructions.watering,
        sunlight:
          careInstructions && careInstructions.sunlight
            ? careInstructions.sunlight
            : defaultPlantProduct.careInstructions.sunlight,
        fertilizer:
          careInstructions && careInstructions.fertilizer
            ? careInstructions.fertilizer
            : defaultPlantProduct.careInstructions.fertilizer,
        soil:
          careInstructions && careInstructions.soil
            ? careInstructions.soil
            : defaultPlantProduct.careInstructions.soil,
      },
      idealTemperature:
        idealTemperature !== undefined
          ? idealTemperature
          : defaultPlantProduct.idealTemperature,
      humidity: humidity || defaultPlantProduct.humidity,
      toxicity: toxicity || defaultPlantProduct.toxicity,
    };

    // ✅ Create product
    const product = new Product(productData);
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
        message:
          "Validation error: " +
          Object.values(error.errors)
            .map((err) => err.message)
            .join(", "),
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
    const { id } = req.params;
    const productId = id;
    const {
      seller,
      title,
      description,
      price,
      stock,
      category,
      thumbnail,
      scientificName,
      origin,
      subtitle,
      overview,
      careInstructions,
      idealTemperature,
      humidity,
      toxicity,
    } = req.body;

    // Check if required fields are provided
    if (
      !seller ||
      !productId ||
      !title ||
      !description ||
      price === undefined ||
      stock === undefined ||
      !category ||
      !thumbnail
    ) {
      console.error("Validation Error: Missing required fields.", {
        seller,
        productId,
        title,
        description,
        price,
        stock,
        category,
        thumbnail,
      });
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Validate seller existence and approval
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

    // Validate category
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Allowed categories: ${validCategories.join(
          ", "
        )}`,
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Build update data including additional plant fields
    const updateData = {
      title,
      description,
      price,
      stock,
      category,
      thumbnail,
      scientificName,
      origin,
      subtitle,
      overview,
      careInstructions,
      idealTemperature,
      humidity,
      toxicity,
    };

    // Update the product and return the new document
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    // console.log("Product updated successfully:", updatedProduct);
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error("Error Editing Product: ", error);

    // Handle MongoDB Validation Errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message:
          "Validation error: " +
          Object.values(error.errors)
            .map((err) => err.message)
            .join(", "),
      });
    }

    // Handle MongoDB Cast Errors (e.g., invalid ObjectId)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid value for field '${error.path}': ${error.value}`,
      });
    }

    // Catch Any Other Internal Errors
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
    const { sellerId } = req.body;
    const { id } = req.params;
    const productId = id;
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

//#region By Seller_ID
export const fetchProductBySellerID = async (req, res) => {
  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 5;
  const search = (req.query.search || "").trim();
  const category = (req.query.category || "").trim();

  // Validate page and limit as positive integers
  page = page > 0 ? page : 1;
  limit = limit > 0 ? limit : 5;
  const skip = (page - 1) * limit;

  const { sellerId } = req.params;
  
  // Check if sellerId is a valid MongoDB ObjectId
  if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
    return res.status(400).json({
      success: false,
      message: "Valid Seller ID is required.",
    });
  }

  let filter = { seller: sellerId };

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  if (category) {
    // For partial match (remove ^ and $ if needed)
    filter.category = { $regex: category, $options: "i" };
  }

  try {
    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit);
      
    // console.log("Filter:",filter)
    //   console.log("Total products:", totalProducts);
    //   console.log("Returned products count:", products.length);
    
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      totalProducts,
    });
  } catch (error) {
    console.error("Error Fetching Products:", error);
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
    const { id } = req.params;
    // console.log("Product-ID ", id);
    const productId = id;
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
    //  console.log(product)
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

//#region fetchAllProductByCategory
export const fetchAllProductByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    console.log("category :------------------>", category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required.",
      });
    }

    // Fetch products matching the provided category and populate seller data.
    const products = await Product.find({ category })
      .populate({ path: "seller", select: "isApproved" })
      .lean();

    // Filter products: include only those where seller is approved.
    const matchedProducts = products.filter(
      (product) => product.seller && product.seller.isApproved
    );

    let productsToReturn = [];

    if (matchedProducts.length >= 5) {
      // If we have 5 or more approved products in this category, return the first 5.
      productsToReturn = matchedProducts.slice(0, 5);
    } else {
      // Calculate how many additional approved products are needed.
      const additionalNeeded = 5 - matchedProducts.length;

      // Fetch additional random products (regardless of category)
      // that are not already in matchedProducts and have an approved seller.
      const additionalProducts = await Product.aggregate([
        {
          $match: {
            _id: { $nin: matchedProducts.map((p) => p._id) },
          },
        },
        {
          $lookup: {
            from: "sellers", // ensure this matches your actual sellers collection name
            localField: "seller",
            foreignField: "_id",
            as: "sellerData",
          },
        },
        { $unwind: "$sellerData" },
        { $match: { "sellerData.isApproved": true } },
        { $sample: { size: additionalNeeded } },
      ]);

      productsToReturn = [...matchedProducts, ...additionalProducts];

      // In case there still aren't enough products (e.g. overall limited products),
      // do a fallback to fetch any additional random approved products.
      if (productsToReturn.length < 5) {
        const stillNeeded = 5 - productsToReturn.length;
        const extraProducts = await Product.aggregate([
          {
            $match: {
              _id: { $nin: productsToReturn.map((p) => p._id) },
            },
          },
          {
            $lookup: {
              from: "sellers",
              localField: "seller",
              foreignField: "_id",
              as: "sellerData",
            },
          },
          { $unwind: "$sellerData" },
          { $match: { "sellerData.isApproved": true } },
          { $sample: { size: stillNeeded } },
        ]);

        // Merge and remove any duplicates
        const mergedProducts = [
          ...productsToReturn,
          ...extraProducts.filter(
            (p) =>
              !productsToReturn.some(
                (mp) => mp._id.toString() === p._id.toString()
              )
          ),
        ];
        productsToReturn = mergedProducts.slice(0, 5);
      }
    }

    console.log("productsToReturn : ", productsToReturn);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      data: productsToReturn,
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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  const category = req.query.category || "";
  const skip = (page - 1) * limit;

  // Build the basic filter for products
  let filter = {};
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }
  // console.log("filter :",category)
  if (category) {
    filter.category = category;
  }


  try {
    // Build an aggregation pipeline to join with Seller and filter on isApproved
    const aggregatePipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "sellers", // note: this should match the collection name in your DB
          localField: "seller",
          foreignField: "_id",
          as: "sellerData",
        },
      },
      { $unwind: "$sellerData" },
      { $match: { "sellerData.isApproved": true } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
      {
        $unwind: "$metadata"
      },
      {
        $project: {
          total: "$metadata.total",
          data: 1,
        },
      },
    ];

    const result = await Product.aggregate(aggregatePipeline);
    const total = result[0] ? result[0].total : 0;
    const products = result[0] ? result[0].data : [];

    // Format the product data as needed
    const formattedProducts = products.map((product) => ({
      id: product._id,
      sellerId: product.seller,
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      price: product.price,
      category: product.category,
      thumbnail: product.thumbnail,
    }));

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      products: formattedProducts,
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


// export const fetchAllProduct = async (req, res) => {
//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 10;
//   const search = req.query.search || "";
//   const category = req.query.category || "";
//   const skip = (page - 1) * limit;
  
//   console.log("category :", category)
//   console.log("search :",search)
//   let filter = {};
//   if (search) {
//     filter.title = { $regex: search, $options: "i" };
//   }
//   if (category) {
//     filter.category = category;
//   }

//   function formatProductData(products) {
//     return products.map((product) => ({
//       id: product._id,
//       sellerId: product.seller,
//       title: product.title,
//       subtitle: product.subtitle,
//       description: product.description,
//       price: product.price,
//       category: product.category,
//       thumbnail: product.thumbnail,
//     }));
//   }

//   try {
//     const total = await Product.countDocuments(filter);

//     const products = await Product.find(filter).skip(skip).limit(limit);
//     const formattedProducts = formatProductData(products);

//     return res.status(200).json({
//       success: true,
//       message: "Products fetched successfully",
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//       products: formattedProducts,
//     });
//   } catch (error) {
//     console.error("Error Fetching Products: ", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

