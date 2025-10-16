

// Import required modules
const express = require('express');
const { connectDB } = require('./config/db'); 
require('dotenv').config(); 
const authenticate = require('./middleware/auth'); 
const bodyParser = require('body-parser');

const { v4: uuidv4 } = require('uuid'); 
const { AppError, NotFoundError, ValidationError, UnauthorizedError, BadRequestError } = require('./errors'); // Task 4: Custom Error Classes
const logger = require('./middleware/logger'); 
const productsRouter = require('./routes/products'); 

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000; 
connectDB();



app.use(express.json()); // This replaces bodyParser.json() for modern Express
app.use(logger);
app.use(authenticate);

app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

app.use('/products', productsRouter);



// / Use  custom NotFoundError for better error structure
app.all('/', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

app.use((err, req, res, next) => {
  console.error('ERROR :', err.message);
  console.error('Stack:', err.stack);

  // Set default status code and message for unexpected errors
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let status = err.status || 'error'; // Default status for 5xx errors

  // Task 4: Add proper error responses with appropriate HTTP status codes

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    status = err.status;
  }


  // Send the JSON error response
  res.status(statusCode).json({
    status: status,
    message: message,
    
  });
});


// Start the server (Task 1)
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1); // Exit with a failure code
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log(' Process terminated!');
  });
});