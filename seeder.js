import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "@node-rs/bcrypt";
import Admin from "./models/Admin.js";
import User from "./models/User.js";
import Seller from "./models/Seller.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB(); // Connect to MongoDB

const seedData = async () => {
  try {
    console.log("🌱 Seeding Data...");

    // Clear Existing Data
    await Admin.deleteMany();
    await User.deleteMany();
    await Seller.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    // Hash passwords
    const hashedPassword = await bcrypt.hash("password123", 10);

    // ✅ Insert Admin
    const admin = await Admin.create({
      email: "admin@example.com",
      password: hashedPassword,
      username: "AdminUser",
    });

    // ✅ Insert Users
    const users = await User.insertMany([
      {
        email: "user1@example.com",
        password: hashedPassword,
        username: "User1",
        cart: [],
        wishlist: [],
      },
      {
        email: "user2@example.com",
        password: hashedPassword,
        username: "User2",
        cart: [],
        wishlist: [],
      },
    ]);

    // ✅ Insert Sellers
    const sellers = await Seller.insertMany([
      {
        email: "seller1@example.com",
        password: hashedPassword,
        username: "Seller1",
        isApproved: true,
      },
      {
        email: "seller2@example.com",
        password: hashedPassword,
        username: "Seller2",
        isApproved: true,
      },
    ]);

    // ✅ Insert Products
    const products = await Product.insertMany([
      {
        seller: sellers[0]._id,
        title: "Aloe Vera Plant",
        description: "A healthy Aloe Vera plant.",
        details: "Water weekly, keep in indirect sunlight.",
        price: 15,
        stock: 50,
        category: "Plants",
        thumbnail: "aloe_vera.jpg",
        images: ["aloe_vera_1.jpg", "aloe_vera_2.jpg"],
      },
      {
        seller: sellers[1]._id,
        title: "Bamboo Plant",
        description: "A lucky Bamboo plant.",
        details: "Grows well in water and soil.",
        price: 20,
        stock: 30,
        category: "Plants",
        thumbnail: "bamboo.jpg",
        images: ["bamboo_1.jpg", "bamboo_2.jpg"],
      },
    ]);

    // ✅ Insert Orders
    await Order.insertMany([
      {
        user: users[0]._id,
        seller: sellers[0]._id,
        items: [
          {
            product: products[0]._id,
            quantity: 2,
            price: 15,
          },
        ],
        totalAmount: 30,
        totalItems: 2,
        status: "pending",
        shippingAddress: {
          street: "123 Green Lane",
          city: "Plantville",
          zip: "12345",
        },
      },
      {
        user: users[1]._id,
        seller: sellers[1]._id,
        items: [
          {
            product: products[1]._id,
            quantity: 1,
            price: 20,
          },
        ],
        totalAmount: 20,
        totalItems: 1,
        status: "shipped",
        shippingAddress: {
          street: "456 Leaf Street",
          city: "TreeTown",
          zip: "67890",
        },
      },
    ]);

    console.log("✅ Database Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error Seeding Data:", error);
    process.exit(1);
  }
};

// Run Seeder
seedData();
