// utils/apiKeyAuth.js
require('dotenv').config();

const API_KEY = process.env.API_KEY;

// Basic check to ensure API_KEY is set during development
if (!API_KEY) {
  console.error("FATAL ERROR: API_KEY is not defined in .env file! Please set it.");
  
}

const isValidApiKey = (apiKey) => {
  return apiKey === API_KEY;
};

module.exports = {
  isValidApiKey,
  API_KEY
};