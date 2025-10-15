// server.js - Completed Express server for Week 2 assignment

// Import required modules
const express = require('express');
const { connectDB } = require('./config/db'); // Task 6: Database connection
require('dotenv').config(); // load .env early

const MONGODBATLAS_URI = process.env.MONGODBATLAS_URI;
if (!MONGODBATLAS_URI) {
  console.error('MONGODBATLAS_URI is missing in .env');
  process.exit(1);
}

// bodyParser.json() is now integrated into express.json() for Express v4.16.0+
// const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // Still useful for generating IDs in our in-memory store
// require('dotenv').config(); // Task 1: Initialize for .env variables

// Import custom modules
const { AppError, NotFoundError, ValidationError, UnauthorizedError, BadRequestError } = require('./errors'); // Task 4: Custom Error Classes
const logger = require('./middleware/logger'); // Task 3: Custom logger middleware
const productsRouter = require('./routes/products'); // Task 2: Products routes

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000; // Task 1: Server listens on PORT

// --- Middleware setup (Task 3) ---

// Task 3: Implement a middleware to parse JSON request bodies
app.use(express.json()); // This replaces bodyParser.json() for modern Express

// Task 3: Create a custom logger middleware
app.use(logger);

// --- Root route (Task 1) ---
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});
connectDB();

// Task 6: Connect to MongoDB
// const { MONGODBATLAS_URI } = process.env;
// if (MONGODBATLAS_URI) {
//   console.error('MONGODBATLAS_URI is missing in .env');
//   process.exit(1);
// }
// --- RESTful API Routes (Task 2 & Task 5) ---
// Mount the products router. All routes in productsRouter will be prefixed with /api/products
app.use('/products', productsRouter);

// --- Error Handling (Task 4) ---

// Task 4: Handle routes that do not exist (404 Not Found)
// // This middleware must be placed after all defined routes.
// app.all('/*', (req, res, next) => {
//   // Use our custom NotFoundError for better error structure
//   next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
// });

// Task 4: Implement global error handling middleware
// This middleware is recognized as an error handler because it takes 4 arguments.
app.use((err, req, res, next) => {
  // Log the error for debugging. err.stack provides crucial info.
  console.error('ERROR 💥:', err.message);
  console.error('Stack:', err.stack);

  // Set default status code and message for unexpected errors
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let status = err.status || 'error'; // Default status for 5xx errors

  // Task 4: Add proper error responses with appropriate HTTP status codes
  // If the error is an instance of our custom AppError (or its subclasses),
  // use its predefined status code and message.
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    status = err.status;
  }
  // For other unhandled non-AppError errors, keep the 500 status and generic message

  // Send the JSON error response
  res.status(statusCode).json({
    status: status,
    message: message,
    // Include stack trace in development for debugging
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});


// Start the server (Task 1)
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;

// --- Graceful Shutdown (Optional but good practice) ---
// Handle unhandled promise rejections (e.g., database connection failures)
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1); // Exit with a failure code
  });
});

// Handle SIGTERM signal (e.g., from Docker or process managers)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});