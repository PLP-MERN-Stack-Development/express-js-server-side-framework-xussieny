// middleware/auth.js

const { UnauthorizedError } = require('../errors');
const { isValidApiKey } = require('../utils/apiKeyAuth');

const authenticate = (req, res, next) => {
  // The API key is expected in the 'x-api-key' custom header
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || !isValidApiKey(apiKey)) {
    // If the API key is missing or invalid, throw an UnauthorizedError
    return next(new UnauthorizedError('Invalid or missing API key. Please provide a valid X-API-Key header.'));
  }

  // If the API key is valid, proceed to the next middleware or route handler
  next();
};

module.exports = authenticate;