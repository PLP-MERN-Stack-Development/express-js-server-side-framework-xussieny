// ...existing code...
const { ValidationError } = require('../errors');

function authenticate(req, res, next) {
  const envKey = process.env.API_KEY;
  // accept: "Authorization: Bearer <token>" or "x-api-key: <token>" or raw "Authorization: <token>"
  const authHeader = req.headers.authorization || req.headers['x-api-key'];

  if (!envKey) {
    // helpful during dev if env misconfigured
    return res.status(500).json({ message: 'Server misconfiguration: API_KEY missing' });
  }

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (token !== envKey) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // attach stub user if needed
  req.user = { id: 'api-client' };
  next();
}

function validateProduct(req, res, next) {
  const { name, price, category } = req.body || {};
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('name is required and must be a non-empty string');
  }
  if (price === undefined || price === null || isNaN(Number(price))) {
    errors.push('price is required and must be a number');
  }
  if (!category || typeof category !== 'string' || !category.trim()) {
    errors.push('category is required and must be a non-empty string');
  }

  if (errors.length) {
    return next(new ValidationError(errors.join('; ')));
  }
  next();
}

module.exports = { authenticate, validateProduct };
// ...existing code...