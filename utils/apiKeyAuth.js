// utils/apiKeyAuth.js

// Load environment variables
require('dotenv').config();

const API_KEY = process.env.API_KEY;

// Basic check to ensure API_KEY is set during development
if (!API_KEY) {
  console.error("FATAL ERROR: API_KEY is not defined in .env file! Please set it.");
  // In a robust production environment, you might want to exit the process:
  // process.exit(1);
}

const isValidApiKey = (apiKey) => {
  return apiKey === API_KEY;
};

module.exports = {
  isValidApiKey,
  API_KEY // Exporting the key can be useful for README generation or configuration display
};