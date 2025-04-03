import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Seller from "../models/Seller.js";
import mongoose, { Schema } from "mongoose";

//#region Create Order
export const createOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = id;
    const { items, shippingAddress } = req.body;

    // Validate request
    if (!userId || !items || items.length === 0 || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "All fields (userId, items, shippingAddress) are required.",
      });
    }

    console.log("📌 Items Received:", JSON.stringify(items, null, 2));

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Group items by sellerId
    const itemsBySeller = {};
    items.forEach((item) => {
      const sellerId = item.sellerId._id.toString(); // Extract seller's ObjectId as a string

      if (!itemsBySeller[sellerId]) {
        itemsBySeller[sellerId] = [];
      }
      itemsBySeller[sellerId].push(item);
    });

    console.log("📌 Grouped Items by Seller:", JSON.stringify(itemsBySeller, null, 2));

    const orders = [];

    // Create an order for each seller
    for (const sellerId in itemsBySeller) {
      let totalAmount = 0;
      let totalItems = 0;
      const orderItems = [];
      const sellerItems = itemsBySeller[sellerId];

      console.log("✅ Processing Seller ID:", sellerId);

      // Validate if sellerId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(sellerId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid seller ID: ${sellerId}`,
        });
      }

      // Process each item for the seller
      for (const item of sellerItems) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product ${item.productId} not found.`,
          });
        }

        const price = product.price * item.quantity;
        totalAmount += price;
        totalItems += item.quantity;

        orderItems.push({
          product: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Create and save the order for the seller
      const order = new Order({
        user: userId,
        seller: new mongoose.Types.ObjectId(sellerId), // Ensure it's an ObjectId
        items: orderItems,
        totalAmount,
        totalItems,
        shippingAddress,
      });

      await order.save();
      orders.push(order);
    }

    // Clear the user's cart after placing the orders
    user.cart = [];
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Orders placed successfully.",
      orders,
    });

  } catch (error) {
    console.error("❌ Error Creating Order:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//#region Update Order
export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // console.log("orderId: ", orderId)
    // console.log("status: ",status)

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required.",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (!["pending", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Error Updating Order:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//#region Filter Orders by Date
export const filterOrder = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required.",
      });
    }

    const orders = await Order.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Orders filtered successfully.",
      orders,
    });
  } catch (error) {
    console.error("Error Filtering Orders:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//#region Fetch Orders by UserID
export const fetchOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Helper function to format the product details
    const formatProduct = (product) => ({
      id: product._id.toString(), // convert _id to string
      title: product.title,
      prices: product.price,
      subtitle: product.subtitle,
      image: product.thumbnail,
    });

    // Fetch orders and populate the product details from the items array
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product")
      .lean();

    // Format orders so that each order groups its items together
    const clientOrders = orders.map((order) => {
      // Map over each item to include product info and item quantity
      const items = order.items.map((item) => ({
        id: order._id.toString(),
        ...formatProduct(item.product),
        status: order.status,
        quantity: item.quantity,
      }));
      
      return {
        orderId: order._id.toString(),
        items,
        totalAmount: order.totalAmount,
        totalItems: order.totalItems,
      };
    });

    /*
      Depending on your client’s needs you can send:
      - A flat array of items across all orders, or
      - An array grouped by order
      For example, a flat mapping would look like:
      
      const flatClientOrders = orders.flatMap((order) =>
        order.items.map((item) => ({
          id: order._id.toString(),
          ...formatProduct(item.product),
          status: order.status,
          totalAmount: order.totalAmount,
          totalItems: order.totalItems,
          quantity: item.quantity,
        }))
      );
      
      In this update, we’re grouping by order.
    */

    console.log("Grouped Client Orders: ", clientOrders);
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      orders: clientOrders,
    });
  } catch (error) {
    console.error("Error Fetch Orders for User :", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


//#region  by SellerID
export const fetchOrderBySellerId = async (req, res) => {
  // Get pagination params from query
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  // Get filter option from query (e.g. "Newest", "Oldest", "Update", "Pending", "Cancelled", "Delivered", "Shipped")
  const filterOption = req.query.filter || "";

  try {
    const { sellerId } = req.params;
    console.log("Seller Id:", sellerId);
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required.",
      });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found.",
      });
    }

    // Build the query condition based on filter option
    let queryCondition = { seller: sellerId };
    const lowerOption = filterOption.toLowerCase();
    if (
      ["pending", "cancelled", "delivered", "shipped"].includes(lowerOption)
    ) {
      queryCondition.status = lowerOption;
    }

    // Determine sort order
    let sortOrder = { createdAt: -1 }; // default "Newest"
    if (filterOption) {
      if (lowerOption === "oldest") {
        sortOrder = { createdAt: 1 };
      } else if (lowerOption === "update") {
        sortOrder = { updatedAt: -1 };
      }
      // For status filters ("pending", "cancelled", "delivered", "shipped"),
      // we can continue to sort by "Newest" (createdAt descending).
    }

    // Count total orders matching the query condition
    const totalOrders = await Order.countDocuments(queryCondition);

    // Helper function to format product details
    const formatProduct = (product) => {
      if (!product) {
        return {
          id: null,
          title: "Unknown Product",
          price: 0,
          thumbnail: "",
          subtitle: "",
        };
      }
      return {
        id: product._id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        subtitle: product.subtitle,
      };
    };
    

    // Helper function to format an order and include full product details
    const formatOrder = (order) => ({
      id: order._id,
      items: order.items
        .filter((item) => item.product)  // Only include items with valid products
        .map((item) => ({
          product: formatProduct(item.product),
          quantity: item.quantity,
          price: item.price,
        })),
      seller: order.seller,
      user: order.user,
      status: order.status,
      totalAmount: order.totalAmount,
      totalItems: order.totalItems,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
    

    // Fetch orders with pagination, sorting, and populate product details
    const orders = await Order.find(queryCondition)
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .populate("items.product")
      .lean();

    // Format each order
    const formattedOrders = orders.map(formatOrder);

    // Optionally create a simplified client order format (if needed)
    const clientOrders = formattedOrders.map((order) => {
      const product = order.items[0]?.product || {};
      return {
        id: order.id.toString(),
        title: product.title,
        price: product.price,
        subtitle: product.subtitle,
        image: product.thumbnail,
        status: order.status,
        totalAmount: order.totalAmount,
        totalItems: order.totalItems,
        shippingAddress: order.shippingAddress,
      };
    });

    console.log("clientOrders:", JSON.stringify(clientOrders, null, 2));

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      orders: clientOrders,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
    });
  } catch (error) {
    console.error("Error Fetch Orders for Seller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
