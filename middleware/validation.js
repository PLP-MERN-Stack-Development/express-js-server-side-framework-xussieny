// middleware/validation.js
const mongoose = require('mongoose');
const { ValidationError } = require('../errors');

// Define the validation schema for product properties
const productSchema = new mongoose.Schema({
  id:{unique: true, type: 'string', required: true}, // id is required and must be unique
  name: { type: 'string', required: true, minLength: 2 },
  description: { type: 'string', required: false }, // Description is optional
  price: { type: 'number', required: true, min: 0 },
  category: { type: 'string', required: true, minLength: 2 },
  inStock: { type: 'boolean', required: true },
});
const validateProduct = (req, res, next) => {
  const productData = req.body;
  const errors = [];

  // Iterate over each field defined in the schema to apply validation rules
  for (const field in productSchema) {
    const rules = productSchema[field];
    const value = productData[field];

    // 1. Check for required fields
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`'${field}' is required.`);
      continue; // Move to the next field if a required one is missing
    }

    // 2. If the field is not required and not present, skip further validation for this field
    if (!rules.required && (value === undefined || value === null || value === '')) {
      continue;
    }

    // 3. Check data type
    // Note: typeof null is 'object', so `value !== null` is important if rules.type is not 'object'
    if (value !== null && typeof value !== rules.type) {
      errors.push(`'${field}' must be of type ${rules.type}.`);
    }

    // 4. Check minimum length for strings (if defined)
    if (rules.type === 'string' && rules.minLength !== undefined && value.length < rules.minLength) {
      errors.push(`'${field}' must be at least ${rules.minLength} characters long.`);
    }

    // 5. Check minimum value for numbers (if defined)
    if (rules.type === 'number' && rules.min !== undefined && value < rules.min) {
      errors.push(`'${field}' must be at least ${rules.min}.`);
    }
  }

  // If any validation errors were found, create and pass a ValidationError
  if (errors.length > 0) {
    return next(new ValidationError(`Validation failed: ${errors.join(' ')}`));
  }

  // If validation passes, proceed to the next middleware or route handler
  next();
};

module.exports = {
  validateProduct,
   mongoose
};
