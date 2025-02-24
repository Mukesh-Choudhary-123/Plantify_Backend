import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";
import User from "./models/User.js";
import Seller from "./models/Seller.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";

dotenv.config();
connectDB(); // Connect to MongoDB

const cleanData = async () => {
  try {
    console.log("🚀 Cleaning Database...");

    // Delete all records from collections
    await Promise.all([
      Admin.deleteMany(),
      User.deleteMany(),
      Seller.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
    ]);

    console.log("✅ Database cleaned successfully!");
    process.exit(); // Ensure script exits after execution
  } catch (error) {
    console.error("❌ Error Cleaning Database:", error);
    process.exit(1);
  }
};

// Run Cleaner
cleanData();
