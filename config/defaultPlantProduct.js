// defaultPlantProduct.js
const defaultPlantProduct = {
    category: "Plants",
    subtitle: "General Plant",
    origin:"North Africa",
    overview: {
      water: 250,      // e.g., 250 ml water per week
      light: 8,        // e.g., 8 hours of indirect sunlight
      fertilizer: 120, // e.g., fertilizer quantity (adjust as needed)
    },
    careInstructions: {
      watering: "Water once a week or when the top inch of soil feels dry.",
      sunlight: "Place in bright, indirect sunlight.",
      fertilizer: "Fertilize once a month during the growing season.",
      soil: "Use a well-draining potting mix suitable for most indoor plants.",
    },
    idealTemperature: 22, // e.g., 22°C as a comfortable room temperature
    humidity: "Moderate",
    toxicity: "Non-toxic to pets",
  };
  
  export default defaultPlantProduct;
  