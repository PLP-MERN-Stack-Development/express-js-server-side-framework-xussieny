// middleware/logger.js

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, url } = req;
  console.log(`[${timestamp}] ${method} ${url}`);
  next(); // Pass control to the next middleware or route handler
};

module.exports = logger;