import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB(); // Connect to MongoDB

// Define seller IDs using mongoose.Types.ObjectId
const seller1 = new mongoose.Types.ObjectId("67d512d22193a8bc58f62844");
const seller2 = new mongoose.Types.ObjectId("67bc50a8c3d4119ffccd3461");
const seller3 = new mongoose.Types.ObjectId("67bc50a8c3d4119ffccd3462");

// Array of 15 products: 5 for each seller
const products = [
  // --- Seller 1 Products ---
  {
    seller: seller1,
    title: "Aloe Vera",
    description:
      "No green thumb required to keep our artificial watermelon peperomia plant looking lively and lush anywhere you place it.",
    price: 200,
    stock: 50,
    category: "Indoor",
    thumbnail:
      "https://res.cloudinary.com/dyws4bybf/image/upload/c_thumb,w_200,g_face/v1740810277/sfqzlryj35d3qirkrmd9.png",
    scientificName: "Aloe barbadensis miller",
    origin: "North Africa",
    subtitle: "Air Purifier",
    overview: { water: 250, light: 34, fertilizer: 250 },
    careInstructions: {
      watering:
        "Water every 3 weeks, allowing the soil to dry out completely between waterings.",
      sunlight: "Bright, indirect sunlight is ideal.",
      fertilizer:
        "Feed with a balanced fertilizer diluted to half strength during the growing season.",
      soil: "Well-draining cactus or succulent mix.",
    },
    idealTemperature: 32, // Average of "28°C - 35°C"
    humidity: "Low to moderate humidity",
    toxicity: "Non-toxic to pets",
  },
  {
    seller: seller1,
    title: "Peace Lily",
    description:
      "Elegant indoor plant with air-purifying properties that add beauty to your space.",
    price: 300,
    stock: 50,
    category: "Indoor",
    thumbnail:
      "https://res.cloudinary.com/dyws4bybf/image/upload/c_thumb,w_200,g_face/v1740810275/vf6t8uxpsieqvmlk6vau.png",
    scientificName: "Spathiphyllum wallisii",
    origin: "Colombia",
    subtitle: "Air Purifier",
    overview: { water: 250, light: 8, fertilizer: 120 },
    careInstructions: {
      watering: "Keep the soil consistently moist but not waterlogged.",
      sunlight: "Place in bright, indirect sunlight.",
      fertilizer: "Fertilize monthly during the growing season.",
      soil: "Use well-draining potting soil.",
    },
    idealTemperature: 22,
    humidity: "Moderate",
    toxicity: "Toxic to pets",
  },
  {
    seller: seller1,
    title: "Spider Plant",
    description:
      "Easy to care for and perfect for indoor spaces, naturally purifying the air.",
    price: 220,
    stock: 50,
    category: "Indoor",
    thumbnail:
      "https://res.cloudinary.com/dyws4bybf/image/upload/c_thumb,w_200,g_face/v1740810278/zcwyruubsttbphlcfwhr.png",
    scientificName: "Chlorophytum comosum",
    origin: "South Africa",
    subtitle: "Air Purifier",
    overview: { water: 250, light: 8, fertilizer: 120 },
    careInstructions: {
      watering: "Water once a week and allow excess water to drain.",
      sunlight: "Place in bright, indirect sunlight.",
      fertilizer: "Feed with a balanced liquid fertilizer monthly.",
      soil: "Use a well-draining potting mix.",
    },
    idealTemperature: 22,
    humidity: "Moderate",
    toxicity: "Non-toxic to pets",
  },
  {
    seller: seller1,
    title: "Money Plant",
    description:
      "A charming plant believed to bring prosperity and positive energy to your home.",
    price: 180,
    stock: 50,
    category: "Indoor",
    thumbnail:
      "https://res.cloudinary.com/dyws4bybf/image/upload/c_thumb,w_200,g_face/v1740810278/y5ne7fz3zcucplxjjblu.png",
    scientificName: "Epipremnum aureum",
    origin: "Southeast Asia",
    subtitle: "Indoor Plant",
    overview: { water: 250, light: 8, fertilizer: 120 },
    careInstructions: {
      watering: "Allow the soil to dry between waterings.",
      sunlight: "Thrives in bright, indirect light.",
      fertilizer: "Use a balanced fertilizer during the growing season.",
      soil: "Well-draining potting mix is recommended.",
    },
    idealTemperature: 22,
    humidity: "Moderate",
    toxicity: "Toxic to pets",
  },
  {
    seller: seller1,
    title: "Jade Plant",
    description:
      "A stunning succulent with thick, glossy leaves, perfect for indoor decoration.",
    price: 270,
    stock: 50,
    category: "Plants",
    thumbnail:
      "https://res.cloudinary.com/dyws4bybf/image/upload/c_thumb,w_200,g_face/v1740810279/c1fuea1c20gw3p7z5jir.png",
    scientificName: "Crassula ovata",
    origin: "South Africa",
    subtitle: "Succulent",
    overview: { water: 250, light: 8, fertilizer: 120 },
    careInstructions: {
      watering:
        "Water sparingly, allowing the soil to dry between waterings.",
      sunlight: "Needs bright, indirect sunlight.",
      fertilizer: "Feed lightly during the growing season.",
      soil: "Use a well-draining cactus or succulent mix.",
    },
    idealTemperature: 22,
    humidity: "Moderate",
    toxicity: "Toxic to pets",
  },

  // --- Seller 2 Products ---
  {
    seller: seller2,
    title: "Snake Plant",
    description:
      "Resilient plant known for its air-purifying qualities and low maintenance.",
    price: 250,
    stock: 50,
    category: "Indoor",
    thumbnail:
      "https://res.cloudinary.com/dyws4bybf/image/upload/c_thumb,w_200,g_face/v1740810277/snake_plant.png",
    scientificName: "Sansevieria trifasciata",
    origin: "West Africa",
    subtitle: "Air Purifier",
    overview: { water: 200, light: 10, fertilizer: 100 },
    careInstructions: {
      watering: "Water moderately and allow soil to dry between waterings.",
      sunlight: "Thrives in bright, indirect sunlight.",
      fertilizer: "Feed with a balanced fertilizer during the growing season.",
      soil: "Well-draining potting mix.",
    },
    idealTemperature: 24,
    humidity: "Low to moderate",
    toxicity: "Non-toxic to pets",
  },
  {
    seller: seller2,
    title: "Basil",
    description:
      "Aromatic herb ideal for culinary delights and natural remedies.",
    price: 100,
    stock: 100,
    category: "Herbs",
    thumbnail:
      "https://res.cloudinary.com/dyws4bybf/image/upload/c_thumb,w_200,g_face/v1740810277/basil.png",
    scientificName: "Ocimum basilicum",
    origin: "Asia",
    subtitle: "Herbal Delight",
    overview: { water: 150, light: 8, fertilizer: 50 },
    careInstructions: {
      watering:
        "Water moderately, keeping the soil moist but not waterlogged.",
      sunlight: "Needs full sun.",
      fertilizer: "Light feeding during the growth season.",
      soil: "Well-draining potting soil.",
    },
    idealTemperature: 25,
    humidity: "High",
    toxicity: "Non-toxic to pets",
  },
  {
    seller: seller2,
    title: "Rose",
    description:
      "Elegant flowering plant with a delightful fragrance and vibrant colors.",
    price: 350,
    stock: 30,
    category: "Flowers",
    thumbnail:
      "https://res.cloudinary.com/dyws4bybf/image/upload/c_thumb,w_200,g_face/v1740810277/rose.png",
    scientificName: "Rosa spp.",
    origin: "Asia",
    subtitle: "Fragrant Bloom",
    overview: { water: 300, light: 12, fertilizer: 150 },
    careInstructions: {
      watering: "Water regularly to keep the soil moist.",
      sunlight: "Requires full sun.",
      fertilizer: "Feed with a balanced fertilizer during blooming.",
      soil: "Well-draining, rich soil.",
    },
    idealTemperature: 22,
    humidity: "Moderate",
    toxicity: "Non-toxic to pets",
  },
  {
    seller: seller2,
    title: "Cactus",
    description:
      "Low-maintenance succulent perfect for outdoor decor and drought-prone areas.",
    price: 180,
    stock: 50,
    category: "Outdoor",
    thumbnail:
      "https://res.cloudinary.com/dyws4bybf/image/upload/c_thumb,w_200,g_face/v1740810277/cactus.png",
    scientificName: "Cactaceae",
    origin: "South America",
    subtitle: "Drought Resistant",
    overview: { water: 100, light: 14, fertilizer: 50 },
    careInstructions: {
      watering:
        "Water sparingly, ensuring the soil is completely dry between waterings.",
      sunlight: "Needs full sun.",
      fertilizer:
        "Use a cactus-specific fertilizer during the growing season.",
      soil: "Sandy, well-draining soil.",
    },
    idealTemperature: 30,
    humidity: "Low",
    toxicity: "Non-toxic to pets",
  },
  {
    seller: seller2,
    title: "Mint",
    description:
      "Refreshing herb perfect for drinks, salads, and natural remedies.",
    price: 120,
    stock: 100,
    category: "Herbs",
    thumbnail:
      "https://res.cloudinary.com/dyws4bybf/image/upload/c_thumb,w_200,g_face/v1740810277/mint.png",
    scientificName: "Mentha",
    origin: "Europe",
    subtitle: "Cooling Herb",
    overview: { water: 180, light: 10, fertilizer: 60 },
    careInstructions: {
      watering:
        "Keep the soil consistently moist while avoiding overwatering.",
      sunlight: "Thrives in partial shade to full sun.",
      fertilizer: "Fertilize lightly during the growing season.",
      soil: "Moist, well-draining soil.",
    },
    idealTemperature: 20,
    humidity: "Moderate",
    toxicity: "Non-toxic to pets",
  },

  // --- Seller 3 Products ---
  {
    seller: seller3,
    title: "Orchid",
    description:
      "Exquisite flowering plant with elegant blooms that add a touch of luxury.",
    price: 400,
    stock: 40,
    category: "Flowers",
    thumbnail:
      "https://res.cloudinary.com/dyws4bybf/image/upload/c_thumb,w_200,g_face/v1740810277/orchid.png",
    scientificName: "Orchidaceae",
    origin: "Asia",
    subtitle: "Elegant Bloom",
    overview: { water: 220, light: 12, fertilizer: 80 },
    careInstructions: {
      watering: "Water sparingly, ensuring good drainage.",
      sunlight: "Best suited for indirect sunlight.",
      fertilizer: "Use orchid-specific fertilizer during growth.",
      soil: "Orchid mix or bark-based medium.",
    },
    idealTemperature: 24,
    humidity: "High",
    toxicity: "Non-toxic to pets",
  },
  {
    seller: seller3,
    title: "Fern",
    description:
      "Lush green plant that thrives in humid environments and adds a natural touch.",
    price: 150,
    stock: 60,
    category: "Indoor",
    thumbnail:
      "https://res.cloudinary.com/dyws4bybf/image/upload/c_thumb,w_200,g_face/v1740810277/fern.png",
    scientificName: "Polypodiopsida",
    origin: "Tropical regions",
    subtitle: "Lush Foliage",
    overview: { water: 250, light: 6, fertilizer: 70 },
    careInstructions: {
      watering:
        "Keep soil consistently moist but ensure it is not waterlogged.",
      sunlight: "Prefers indirect light.",
      fertilizer: "Feed lightly during the growing season.",
      soil: "Rich, organic potting mix.",
    },
    idealTemperature: 20,
    humidity: "High",
    toxicity: "Non-toxic to pets",
  },
  {
    seller: seller3,
    title: "Bamboo",
    description:
      "Fast-growing, sustainable plant that brings a Zen ambiance to your space.",
    price: 320,
    stock: 50,
    category: "Indoor",
    thumbnail:
      "https://res.cloudinary.com/dyws4bybf/image/upload/c_thumb,w_200,g_face/v1740810277/bamboo.png",
    scientificName: "Bambusoideae",
    origin: "Asia",
    subtitle: "Zen Greenery",
    overview: { water: 300, light: 10, fertilizer: 90 },
    careInstructions: {
      watering: "Water frequently to keep the soil moist.",
      sunlight: "Thrives in bright, indirect sunlight.",
      fertilizer: "Feed with a balanced fertilizer monthly.",
      soil: "Well-draining potting mix.",
    },
    idealTemperature: 26,
    humidity: "High",
    toxicity: "Non-toxic to pets",
  },
  {
    seller: seller3,
    title: "Tulip",
    description:
      "Bright and cheerful flowering plant, perfect for adding a splash of color to any setting.",
    price: 280,
    stock: 45,
    category: "Flowers",
    thumbnail:
      "https://res.cloudinary.com/dyws4bybf/image/upload/c_thumb,w_200,g_face/v1740810277/tulip.png",
    scientificName: "Tulipa",
    origin: "Central Asia",
    subtitle: "Colorful Bloom",
    overview: { water: 200, light: 10, fertilizer: 100 },
    careInstructions: {
      watering: "Water regularly to maintain even soil moisture.",
      sunlight: "Requires full sun.",
      fertilizer: "Use a balanced fertilizer during the growing season.",
      soil: "Well-draining soil enriched with organic matter.",
    },
    idealTemperature: 18,
    humidity: "Moderate",
    toxicity: "Non-toxic to pets",
  },
  {
    seller: seller3,
    title: "Lavender",
    description:
      "Aromatic herb with a calming scent, ideal for gardens and indoor arrangements.",
    price: 260,
    stock: 50,
    category: "Herbs",
    thumbnail:
      "https://res.cloudinary.com/dyws4bybf/image/upload/c_thumb,w_200,g_face/v1740810277/lavender.png",
    scientificName: "Lavandula",
    origin: "Mediterranean",
    subtitle: "Fragrant Herb",
    overview: { water: 180, light: 12, fertilizer: 80 },
    careInstructions: {
      watering:
        "Water moderately, allowing the soil to dry out between waterings.",
      sunlight: "Needs full sun.",
      fertilizer:
        "Feed with a low-nitrogen fertilizer during the blooming period.",
      soil: "Sandy, well-draining soil.",
    },
    idealTemperature: 22,
    humidity: "Low",
    toxicity: "Non-toxic to pets",
  },
];

const seedProducts = async () => {
  try {
    console.log("Seeding products...");

    // Optionally clear existing products
    await Product.deleteMany({});
    console.log("Existing products cleared");

    // Insert new products
    await Product.insertMany(products);
    console.log("Products seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
