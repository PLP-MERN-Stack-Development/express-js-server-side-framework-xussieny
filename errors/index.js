// errors/index.js

/**
 * Base custom error class for operational errors.
 * Operational errors are predictable errors that occur during normal API operation (e.g., bad input, not found).
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // 'fail' for 4xx errors (client-side), 'error' for 5xx errors (server-side)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Mark as an error we expect and handle gracefully

    // Capture stack trace to easily locate the origin of the error
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for when a resource is not found (HTTP 404).
 */
class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

/**
 * Error for invalid input data (HTTP 400).
 */
class ValidationError extends AppError {
  constructor(message = 'Invalid input data provided') {
    super(message, 400);
  }
}

/**
 * Error for authentication failures (HTTP 401).
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required or invalid API key') {
    super(message, 401);
  }
}

/**
 * General bad request error (HTTP 400), for issues not covered by validation.
 */
class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  BadRequestError
};