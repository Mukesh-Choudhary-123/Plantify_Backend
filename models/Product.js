import mongoose, { Schema } from "mongoose";

const validCategories = ["Plants", "Flowers", "Herbs", "Seeds", "Fruits", "Vegetables"]; 

const productSchema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }, 
  stock: { type: Number, required: true, min: 0 }, 
  category: { type: String, required: true, enum: validCategories }, 
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
