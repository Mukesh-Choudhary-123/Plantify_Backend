import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

//#region Create Order
export const createOrder = async (req, res) => {
  try {
    const { userId, sellerId, items, shippingAddress } = req.body;

    if (
      !userId ||
      !sellerId ||
      !items ||
      items.length === 0 ||
      !shippingAddress
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (userId, sellerId, items, shippingAddress) are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    let totalAmount = 0;
    let totalItems = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({
            success: false,
            message: `Product ${item.product} not found.`,
          });
      }

      const price = product.price * item.quantity;
      totalAmount += price;
      totalItems += item.quantity;

      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = new Order({
      user: userId,
      seller: sellerId,
      items: orderItems,
      totalAmount,
      totalItems,
      shippingAddress,
    });

    await order.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Error Creating Order:", error);
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
    const { orderId, status } = req.body;

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
    const { userId } = req.body;

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

    const orders = await Order.find({ user: userId }).populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      orders: orders,
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

//#region Fetch Orders by SellerID
export const fetchOrderBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.body;

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

    const orders = await Order.find({ seller: sellerId }).populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      orders: orders,
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
