import mongoose, { Schema } from "mongoose";

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
];

const productSchema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    required: true,
    enum: validCategories,
    default: "Plants",
  },
  thumbnail: { type: String, required: true },
  scientificName: { type: String, required: true },
  origin: { type: String, required: true },
  subtitle: { type: String, default: "General Plant" },
  overview: {
    water: { type: Number, default: 250 }, // e.g., 250 ml water per week
    light: { type: Number, default: 8 }, // e.g., 8 hours of indirect sunlight
    fertilizer: { type: Number, default: 120 }, // e.g., 1 unit (or measure) of fertilizer per month
  },
  careInstructions: {
    watering: {
      type: String,
      default: "Water once a week or when the top inch of soil feels dry.",
      // Example: "Water every 3 weeks, allowing the soil to dry out completely between waterings."
    },
    sunlight: {
      type: String,
      default: "Place in bright, indirect sunlight.",
      // Example: "Bright, indirect sunlight is ideal."
    },
    fertilizer: {
      type: String,
      default: "Fertilize once a month during the growing season.",
      // Example: "Feed with a balanced fertilizer diluted to half strength during the growing season."
    },
    soil: {
      type: String,
      default:
        "Use a well-draining potting mix suitable for most indoor plants.",
      // Example: "Well-draining cactus or succulent mix."
    },
  },
  idealTemperature: { type: Number, default: 22 }, // e.g., 22°C as a comfortable room temperature
  humidity: { type: String, default: "Moderate" }, // e.g., "Low to moderate humidity"
  toxicity: { type: String, default: "Non-toxic to pets" },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
